import { Router } from "express"
import { z } from "zod"
import { pool } from "../db.js"
import { HttpError, isUuid } from "../lib/http.js"
import { requireAuth } from "../middleware/auth.js"

export const insightsRouter = Router()

interface InsightRow {
  id: string
  body: string
  created_at: Date
  updated_at: Date | null
  cursor_ts: string
  author_id: string
  author_name: string
}

const SELECT = `
  SELECT i.id, i.body, i.created_at, i.updated_at,
         to_char(i.created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"') AS cursor_ts,
         u.id AS author_id, u.name AS author_name
    FROM insights i
    JOIN users u ON u.id = i.author_id`

const toItem = (r: InsightRow) => ({
  id: r.id,
  body: r.body,
  createdAt: r.created_at.toISOString(),
  updatedAt: r.updated_at ? r.updated_at.toISOString() : null,
  author: { id: r.author_id, name: r.author_name },
})

/** Plain text, like a social post: normalise line breaks and keep at most one blank line in a row. */
const postBody = z.object({
  body: z
    .string()
    .transform((s) => s.replace(/\r\n?/g, "\n").replace(/\n{3,}/g, "\n\n").trim())
    .pipe(z.string().min(1, "Write something first.").max(2000, "Posts can be up to 2000 characters.")),
})

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
  const { body } = postBody.parse(req.body)
  const inserted = await pool.query<{ id: string }>(
    "INSERT INTO insights (author_id, body) VALUES ($1, $2) RETURNING id",
    [req.user!.id, body],
  )
  const { rows } = await pool.query<InsightRow>(`${SELECT} WHERE i.id = $1`, [inserted.rows[0].id])
  res.status(201).json({ ok: true, item: toItem(rows[0]) })
})

async function loadOwner(id: string) {
  if (!isUuid(id)) throw new HttpError(404, "Insight not found.")
  const { rows } = await pool.query<{ author_id: string }>("SELECT author_id FROM insights WHERE id = $1", [id])
  if (!rows[0]) throw new HttpError(404, "Insight not found.")
  return rows[0].author_id
}

// Only the author can edit their own words.
insightsRouter.patch("/insights/:id", requireAuth, async (req, res) => {
  const id = String(req.params.id)
  const authorId = await loadOwner(id)
  if (authorId !== req.user!.id) throw new HttpError(403, "You can only edit your own insights.", "FORBIDDEN")

  const { body } = postBody.parse(req.body)
  await pool.query("UPDATE insights SET body = $2, updated_at = now() WHERE id = $1", [id, body])
  const { rows } = await pool.query<InsightRow>(`${SELECT} WHERE i.id = $1`, [id])
  res.json({ ok: true, item: toItem(rows[0]) })
})

// The author or any admin can delete.
insightsRouter.delete("/insights/:id", requireAuth, async (req, res) => {
  const id = String(req.params.id)
  const authorId = await loadOwner(id)
  if (authorId !== req.user!.id && req.user!.role !== "admin") {
    throw new HttpError(403, "You can only delete your own insights.", "FORBIDDEN")
  }
  await pool.query("DELETE FROM insights WHERE id = $1", [id])
  res.json({ ok: true })
})
