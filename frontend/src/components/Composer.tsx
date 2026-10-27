import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from "react"
import { ImagePlus, Loader2, X } from "lucide-react"
import { api } from "@/lib/api"
import { initials, MAX_IMAGES, MAX_POST_LENGTH, type Insight } from "@/lib/insights"
import { ACCEPT_ATTR, prepareImage, uploadImage, type UploadedImage } from "@/lib/uploads"

interface Props {
  authorName: string
  onPosted: (item: Insight) => void
}

interface Attachment {
  key: string
  previewUrl: string
  status: "uploading" | "done" | "error"
  image?: UploadedImage
  error?: string
}

const newKey = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`

/** A social-style box: write, add up to four photos, see how many characters are left, post. */
export function Composer({ authorName, onPosted }: Props) {
  const [text, setText] = useState("")
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const ref = useRef<HTMLTextAreaElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const latest = useRef<Attachment[]>([])

  useEffect(() => {
    latest.current = attachments
  }, [attachments])

  // Free the preview pictures when the box goes away.
  useEffect(() => () => latest.current.forEach((a) => URL.revokeObjectURL(a.previewUrl)), [])

  const remaining = MAX_POST_LENGTH - text.length
  const uploading = attachments.some((a) => a.status === "uploading")
  const failed = attachments.some((a) => a.status === "error")
  const doneCount = attachments.filter((a) => a.status === "done").length
  const canPost = !busy && !uploading && !failed && remaining >= 0 && (text.trim().length > 0 || doneCount > 0)

  const grow = () => {
    const el = ref.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 420)}px`
  }

  const patch = (key: string, change: Partial<Attachment>) =>
    // Ignored if the person removed the picture while it was uploading.
    setAttachments((list) => list.map((a) => (a.key === key ? { ...a, ...change } : a)))

  const addFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    e.target.value = "" // lets the same photo be picked again later
    if (files.length === 0) return

    const room = MAX_IMAGES - attachments.length
    setError(files.length > room ? `You can add up to ${MAX_IMAGES} images.` : "")

    const added = files.slice(0, Math.max(room, 0)).map<Attachment>((file) => ({
      key: newKey(),
      previewUrl: URL.createObjectURL(file),
      status: "uploading",
    }))
    setAttachments((list) => [...list, ...added])

    added.forEach((att, i) => {
      prepareImage(files[i])
        .then(uploadImage)
        .then((image) => patch(att.key, { status: "done", image }))
        .catch((err: Error) => patch(att.key, { status: "error", error: err.message }))
    })
  }

  const removeAttachment = (key: string) => {
    const gone = attachments.find((a) => a.key === key)
    if (gone) URL.revokeObjectURL(gone.previewUrl)
    setAttachments((list) => list.filter((a) => a.key !== key))
  }

  const submit = async (e?: FormEvent) => {
    e?.preventDefault()
    if (!canPost) return
    setBusy(true)
    setError("")
    try {
      const images = attachments.flatMap((a) => (a.image ? [a.image] : []))
      const r = await api<{ item: Insight }>("/api/insights", { method: "POST", body: { body: text, images }, auth: true })
      onPosted(r.item)
      attachments.forEach((a) => URL.revokeObjectURL(a.previewUrl))
      setAttachments([])
      setText("")
      requestAnimationFrame(grow)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      void submit()
    }
  }

  return (
    <form onSubmit={submit} className="flex gap-3 sm:gap-4 rounded-2xl border border-black/10 bg-white p-4 sm:p-5">
      <div className="size-10 sm:size-11 shrink-0 rounded-full bg-ink text-white grid place-items-center text-sm font-medium" aria-hidden="true">
        {initials(authorName)}
      </div>
      <div className="min-w-0 flex-1">
        <label htmlFor="composer" className="sr-only">Write an insight</label>
        <textarea
          id="composer"
          ref={ref}
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            grow()
          }}
          onKeyDown={onKeyDown}
          rows={3}
          placeholder="What did you learn or notice today?"
          className="w-full resize-none bg-transparent text-[15px] sm:text-base text-ink placeholder:text-black/35 focus:outline-none leading-relaxed"
        />

        {attachments.length > 0 && (
          <ul className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2" aria-label="Attached images">
            {attachments.map((a) => (
              <li key={a.key} className="relative aspect-square overflow-hidden rounded-lg bg-black/5">
                <img src={a.previewUrl} alt="" className={`size-full object-cover ${a.status === "done" ? "" : "opacity-50"}`} />
                {a.status === "uploading" && (
                  <span className="absolute inset-0 grid place-items-center text-ink" role="status" aria-label="Uploading">
                    <Loader2 size={22} className="animate-spin" />
                  </span>
                )}
                {a.status === "error" && (
                  <span className="theme-fixed absolute inset-x-0 bottom-0 bg-red-700/90 px-2 py-1 text-[11px] leading-tight text-white">{a.error}</span>
                )}
                <button type="button" onClick={() => removeAttachment(a.key)} aria-label="Remove image" className="theme-fixed absolute top-1 right-1 size-6 grid place-items-center rounded-full bg-black/60 text-white hover:bg-black/80">
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}

        {error && <div role="alert" className="mt-2 text-sm text-red-700">{error}</div>}
        {failed && !error && <div className="mt-2 text-sm text-red-700">Remove the image that failed, then post.</div>}

        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-black/10 pt-3">
          <input ref={fileRef} type="file" accept={ACCEPT_ATTR} multiple onChange={addFiles} className="hidden" aria-label="Choose images" />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy || attachments.length >= MAX_IMAGES}
            aria-label={attachments.length > 0 ? `Add images, ${attachments.length} of ${MAX_IMAGES} attached` : "Add images"}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-royal/10 pl-3 pr-4 text-sm font-medium text-royal transition-colors hover:bg-royal/15 active:bg-royal/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal disabled:cursor-not-allowed disabled:bg-black/5 disabled:text-black/30"
          >
            <ImagePlus size={20} />
            <span>Photo</span>
            {attachments.length > 0 && <span className="font-mono text-xs opacity-70">{attachments.length}/{MAX_IMAGES}</span>}
          </button>

          <div className="ml-auto flex items-center gap-3">
            <span className={`font-mono text-xs ${remaining < 0 ? "text-red-700" : remaining < 100 ? "text-amber-700" : "text-black/40"}`}>
              {remaining}
            </span>
            <button
              type="submit"
              disabled={!canPost}
              className="h-11 px-6 rounded-full bg-ink text-white text-sm font-medium hover:bg-royal transition-colors disabled:opacity-40 disabled:hover:bg-ink"
            >
              {busy ? "Posting..." : uploading ? "Uploading..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
