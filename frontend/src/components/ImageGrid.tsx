import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { sizedImage, type InsightImage } from "@/lib/insights"

function Lightbox({ images, start, alt, onClose }: { images: InsightImage[]; start: number; alt: string; onClose: () => void }) {
  const [index, setIndex] = useState(start)
  const many = images.length > 1

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") setIndex((i) => Math.min(i + 1, images.length - 1))
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0))
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [images.length, onClose])

  return (
    <div role="dialog" aria-modal="true" aria-label="Image viewer" className="theme-fixed fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={onClose}>
      <button type="button" onClick={onClose} aria-label="Close" autoFocus className="absolute top-4 right-4 size-10 grid place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
        <X size={20} />
      </button>
      {many && index > 0 && (
        <button type="button" aria-label="Previous image" onClick={(e) => { e.stopPropagation(); setIndex(index - 1) }} className="absolute left-3 size-10 grid place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
          <ChevronLeft size={22} />
        </button>
      )}
      <img src={sizedImage(images[index].url, 1600)} alt={alt} className="max-h-full max-w-full object-contain" onClick={(e) => e.stopPropagation()} />
      {many && index < images.length - 1 && (
        <button type="button" aria-label="Next image" onClick={(e) => { e.stopPropagation(); setIndex(index + 1) }} className="absolute right-3 size-10 grid place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
          <ChevronRight size={22} />
        </button>
      )}
    </div>
  )
}

/** Up to four images in a social-style grid. Tap one to view it larger. */
export function ImageGrid({ images, author }: { images: InsightImage[]; author: string }) {
  const [open, setOpen] = useState<number | null>(null)
  const alt = `Image posted by ${author}`

  const cell = (img: InsightImage, i: number, extra = "") => (
    <button key={img.id} type="button" onClick={() => setOpen(i)} aria-label={`View image ${i + 1} of ${images.length}`} className={`block overflow-hidden bg-black/5 ${extra}`}>
      <img src={sizedImage(img.url, 900)} width={img.width} height={img.height} alt={alt} loading="lazy" decoding="async" className="size-full object-cover" />
    </button>
  )

  let grid
  if (images.length === 1) {
    const ratio = Math.min(2, Math.max(0.8, images[0].width / images[0].height))
    grid = (
      <div className="max-h-[560px]" style={{ aspectRatio: ratio }}>
        {cell(images[0], 0, "size-full")}
      </div>
    )
  } else {
    grid = (
      <div className={`grid grid-cols-2 gap-0.5 aspect-[16/10] ${images.length > 2 ? "grid-rows-2" : ""}`}>
        {images.map((img, i) => cell(img, i, images.length === 3 && i === 0 ? "row-span-2" : ""))}
      </div>
    )
  }

  return (
    <>
      <div className="mt-3 overflow-hidden rounded-2xl border border-black/10">{grid}</div>
      {open !== null && <Lightbox images={images} start={open} alt={alt} onClose={() => setOpen(null)} />}
    </>
  )
}
