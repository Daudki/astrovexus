// Runs before the page paints, so the chosen theme shows from the very first frame (no white flash).
// It is a separate file, not an inline script, so it also works under a strict Content-Security-Policy.
(function () {
  try {
    var t = localStorage.getItem("astro_theme")
    if (t !== "light" && t !== "dark" && t !== "night") {
      t = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }
    var root = document.documentElement
    root.setAttribute("data-theme", t)
    root.style.colorScheme = t === "light" ? "light" : "dark"
    var meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute("content", { light: "#322CDE", dark: "#11131b", night: "#000000" }[t])
  } catch (e) {
    /* storage blocked: the page just uses the light theme */
  }
})()
