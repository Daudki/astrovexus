import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { lazy, Suspense, useEffect } from "react"
import { Nav } from "@/components/Nav"
import { Footer } from "@/components/Footer"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { Loader } from "@/components/Loader"
import { WhatsAppButton } from "@/components/WhatsAppButton"

const Home     = lazy(() => import("@/pages/Home"))
const Services = lazy(() => import("@/pages/Services"))
const Pricing  = lazy(() => import("@/pages/Pricing"))
const About    = lazy(() => import("@/pages/About"))
const Contact  = lazy(() => import("@/pages/Contact"))
const NotFound = lazy(() => import("@/pages/NotFound"))

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollTop />
      <Nav />
      <main>
        <ErrorBoundary>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <WhatsAppButton />
    </BrowserRouter>
  )
}
