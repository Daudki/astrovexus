import { api } from "@/lib/api"

export interface UploadedImage {
  publicId: string
  url: string
  width: number
  height: number
}

interface Ticket {
  uploadUrl: string
  apiKey: string
  signature: string
  folder: string
  timestamp: number
  allowed_formats: string
}

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif"]
export const ACCEPT_ATTR = ACCEPTED.join(",")
const MAX_INPUT_BYTES = 25 * 1024 * 1024
const MAX_GIF_BYTES = 8 * 1024 * 1024
const MAX_SIDE = 1600

/**
 * Shrinks a photo before it leaves the phone: at most 1600px on the long side, saved as JPEG.
 * A typical camera photo drops from several MB to a few hundred KB, which saves mobile data.
 * GIFs are sent as they are, so animations survive.
 */
export async function prepareImage(file: File): Promise<Blob> {
  if (!ACCEPTED.includes(file.type)) throw new Error("Use a JPG, PNG, WebP or GIF image.")
  if (file.size > MAX_INPUT_BYTES) throw new Error("That image is too large. Choose one under 25 MB.")

  if (file.type === "image/gif") {
    if (file.size > MAX_GIF_BYTES) throw new Error("That GIF is too large. Choose one under 8 MB.")
    return file
  }

  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" })
  } catch {
    throw new Error("Couldn't read that image. Try a different one.")
  }

  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement("canvas")
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Couldn't process that image.")
  ctx.fillStyle = "#fff" // transparent areas become white in a JPEG
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85))
  if (!blob) throw new Error("Couldn't process that image.")
  return blob
}

/** Gets a signed ticket from our API, then sends the file straight to Cloudinary. */
export async function uploadImage(blob: Blob): Promise<UploadedImage> {
  const ticket = await api<Ticket>("/api/uploads/sign", { method: "POST", auth: true })

  const form = new FormData()
  form.append("file", blob)
  form.append("api_key", ticket.apiKey)
  form.append("timestamp", String(ticket.timestamp))
  form.append("signature", ticket.signature)
  form.append("folder", ticket.folder)
  form.append("allowed_formats", ticket.allowed_formats)

  let res: Response
  try {
    res = await fetch(ticket.uploadUrl, { method: "POST", body: form })
  } catch {
    throw new Error("Upload failed. Check your connection and try again.")
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.public_id || !data.secure_url) {
    throw new Error(data?.error?.message || "Upload failed. Please try again.")
  }
  return { publicId: data.public_id, url: data.secure_url, width: data.width, height: data.height }
}
