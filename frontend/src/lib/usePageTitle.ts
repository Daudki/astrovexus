import { useEffect } from "react"

/** Sets the tab title; optionally asks search engines not to index the page. */
export function usePageTitle(title: string, opts: { noindex?: boolean } = {}) {
  const { noindex = false } = opts
  useEffect(() => {
    const previous = document.title
    document.title = title

    let meta: HTMLMetaElement | null = null
    if (noindex) {
      meta = document.createElement("meta")
      meta.name = "robots"
      meta.content = "noindex, nofollow"
      document.head.appendChild(meta)
    }
    return () => {
      document.title = previous
      meta?.remove()
    }
  }, [title, noindex])
}
