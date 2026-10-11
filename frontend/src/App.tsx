import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { lazy, Suspense, useEffect } from "react"
import { Nav } from "@/components/Nav"
import { Footer } from "@/components/Footer"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { Loader } from "@/components/Loader"
import { WhatsAppButton } from "@/components/WhatsAppButton"
import { AuthProvider } from "@/components/AuthProvider"

const Home     = lazy(() => import("@/pages/Home"))
const Services = lazy(() => import("@/pages/Services"))
const Pricing  = lazy(() => import("@/pages/Pricing"))
const About    = lazy(() => import("@/pages/About"))
const Contact  = lazy(() => import("@/pages/Contact"))
const Insights = lazy(() => import("@/pages/Insights"))
const InsightPost = lazy(() => import("@/pages/InsightPost"))
const AdminLogin = lazy(() => import("@/admin/Login"))
const AdminLayout = lazy(() => import("@/admin/AdminLayout"))
const AdminPosts = lazy(() => import("@/admin/Posts"))
const AdminUsers = lazy(() => import("@/admin/Users"))
const AdminAccount = lazy(() => import("@/admin/Account"))
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
      <AuthProvider>
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
                <Route path="/insights" element={<Insights />} />
                <Route path="/insights/:id" element={<InsightPost />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminPosts />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="account" element={<AdminAccount />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
        <Footer />
        <WhatsAppButton />
      </AuthProvider>
    </BrowserRouter>
  )
}
