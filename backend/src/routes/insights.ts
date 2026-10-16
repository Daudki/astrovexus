import { Router } from "express"
import { z } from "zod"
import { pool } from "../db.js"
import { HttpError, isUuid } from "../lib/http.js"
import { destroyImages, imagesEnabled, isOwnUpload, MAX_IMAGES_PER_POST } from "../lib/cloudinary.js"
import { requireAuth } from "../middleware/auth.js"

export const insightsRouter = Router()

interface ImageOut {
  id: string
  url: string
  width: number
  height: number
}

interface InsightRow {
  id: string
  body: string
  created_at: Date
  updated_at: Date | null
  cursor_ts: string
  author_id: string
  author_name: string
  images: ImageOut[]
}

const SELECT = `
  SELECT i.id, i.body, i.created_at, i.updated_at,
         to_char(i.created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"') AS cursor_ts,
         u.id AS author_id, u.name AS author_name,
         img.images
    FROM insights i
    JOIN users u ON u.id = i.author_id
    LEFT JOIN LATERAL (
      SELECT coalesce(
               json_agg(json_build_object('id', m.id, 'url', m.url, 'width', m.width, 'height', m.height) ORDER BY m.position),
               '[]'::json
             ) AS images
        FROM insight_images m
       WHERE m.insight_id = i.id
    ) img ON true`

const toItem = (r: InsightRow) => ({
  id: r.id,
  body: r.body,
  images: r.images,
  createdAt: r.created_at.toISOString(),
  updatedAt: r.updated_at ? r.updated_at.toISOString() : null,
  author: { id: r.author_id, name: r.author_name },
})

/** Plain text, like a social post: normalise line breaks and keep at most one blank line in a row. */
const bodyText = z
  .string()
  .transform((s) => s.replace(/\r\n?/g, "\n").replace(/\n{3,}/g, "\n\n").trim())
  .pipe(z.string().max(2000, "Posts can be up to 2000 characters."))

const imageRef = z.object({
  publicId: z.string().max(300),
  url: z.string().max(500),
  width: z.number().int().min(1).max(20000),
  height: z.number().int().min(1).max(20000),
})

const createBody = z
  .object({
    body: bodyText.default(""),
    images: z.array(imageRef).max(MAX_IMAGES_PER_POST, `You can add up to ${MAX_IMAGES_PER_POST} images.`).default([]),
  })
  .refine((v) => v.body.length > 0 || v.images.length > 0, "Write something or add an image first.")

const editBody = z.object({ body: bodyText })

const encodeCursor = (r: InsightRow) => Buffer.from(`${r.cursor_ts}|${r.id}`).toString("base64url")

function decodeCursor(raw: string): { ts: string; id: string } {
  const [ts, id] = Buffer.from(raw, "base64url").toString().split("|")
  if (!ts || !isUuid(id) || Number.isNaN(Date.parse(ts))) throw new HttpError(400, "Invalid cursor.")
  return { ts, id }
}

const listQuery = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(20),
  cursor: z.string().max(200).optional(),
  author: z.string().optional(),
})

// Public feed, newest first.
insightsRouter.get("/insights", async (req, res) => {
  const { limit, cursor, author } = listQuery.parse(req.query)
  if (author && !isUuid(author)) throw new HttpError(400, "Invalid author.")
  const c = cursor ? decodeCursor(cursor) : null

  const { rows } = await pool.query<InsightRow>(
    `${SELECT}
    WHERE ($1::uuid IS NULL OR i.author_id = $1::uuid)
      AND ($2::timestamptz IS NULL OR (i.created_at, i.id) < ($2::timestamptz, $3::uuid))
    ORDER BY i.created_at DESC, i.id DESC
    LIMIT $4`,
    [author ?? null, c?.ts ?? null, c?.id ?? null, limit + 1],
  )

  const page = rows.slice(0, limit)
  res.json({
    ok: true,
    items: page.map(toItem),
    nextCursor: rows.length > limit ? encodeCursor(page[page.length - 1]) : null,
  })
})

insightsRouter.get("/insights/:id", async (req, res) => {
  if (!isUuid(req.params.id)) throw new HttpError(404, "Insight not found.")
  const { rows } = await pool.query<InsightRow>(`${SELECT} WHERE i.id = $1`, [req.params.id])
  if (!rows[0]) throw new HttpError(404, "Insight not found.")
  res.json({ ok: true, item: toItem(rows[0]) })
})

insightsRouter.post("/insights", requireAuth, async (req, res) => {
  const { body, images } = createBody.parse(req.body)
  const me = req.user!

  if (images.length > 0) {
    if (!imagesEnabled) throw new HttpError(503, "Image uploads aren't set up yet.", "IMAGES_DISABLED")
    if (!images.every((img) => isOwnUpload(img, me.id))) {
      throw new HttpError(400, "One of the images wasn't uploaded properly. Please add it again.")
    }
  }

  const client = await pool.connect()
  let id: string
  try {
    await client.query("BEGIN")
    const inserted = await client.query<{ id: string }>(
      "INSERT INTO insights (author_id, body) VALUES ($1, $2) RETURNING id",
      [me.id, body],
    )
    id = inserted.rows[0].id
    for (const [position, img] of images.entries()) {
      await client.query(
        "INSERT INTO insight_images (insight_id, public_id, url, width, height, position) VALUES ($1, $2, $3, $4, $5, $6)",
        [id, img.publicId, img.url, img.width, img.height, position],
      )
    }
    await client.query("COMMIT")
  } catch (err) {
    await client.query("ROLLBACK").catch(() => undefined)
    if ((err as { code?: string }).code === "23505") {
      throw new HttpError(409, "One of those images is already used in another post.")
    }
    throw err
  } finally {
    client.release()
  }

  const { rows } = await pool.query<InsightRow>(`${SELECT} WHERE i.id = $1`, [id])
  res.status(201).json({ ok: true, item: toItem(rows[0]) })
})

async function loadOwner(id: string) {
  if (!isUuid(id)) throw new HttpError(404, "Insight not found.")
  const { rows } = await pool.query<{ author_id: string; image_count: number }>(
    "SELECT author_id, (SELECT count(*)::int FROM insight_images WHERE insight_id = $1) AS image_count FROM insights WHERE id = $1",
    [id],
  )
  if (!rows[0]) throw new HttpError(404, "Insight not found.")
  return rows[0]
}

// Only the author can edit their own words. Images stay as posted.
insightsRouter.patch("/insights/:id", requireAuth, async (req, res) => {
  const id = String(req.params.id)
  const owner = await loadOwner(id)
  if (owner.author_id !== req.user!.id) throw new HttpError(403, "You can only edit your own insights.", "FORBIDDEN")

  const { body } = editBody.parse(req.body)
  if (!body && owner.image_count === 0) throw new HttpError(400, "Write something first.")

  await pool.query("UPDATE insights SET body = $2, updated_at = now() WHERE id = $1", [id, body])
  const { rows } = await pool.query<InsightRow>(`${SELECT} WHERE i.id = $1`, [id])
  res.json({ ok: true, item: toItem(rows[0]) })
})

// The author or any admin can delete. Their images are removed from Cloudinary too.
insightsRouter.delete("/insights/:id", requireAuth, async (req, res) => {
  const id = String(req.params.id)
  const owner = await loadOwner(id)
  if (owner.author_id !== req.user!.id && req.user!.role !== "admin") {
    throw new HttpError(403, "You can only delete your own insights.", "FORBIDDEN")
  }

  const { rows } = await pool.query<{ public_id: string }>("SELECT public_id FROM insight_images WHERE insight_id = $1", [id])
  await pool.query("DELETE FROM insights WHERE id = $1", [id])
  void destroyImages(rows.map((r) => r.public_id))
  res.json({ ok: true })
})
