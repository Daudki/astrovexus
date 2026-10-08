import { Component, type ErrorInfo, type ReactNode } from "react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("AstroVexus ErrorBoundary caught:", error, info)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="min-h-[60vh] wrap py-20 flex items-center justify-center">
          <div className="max-w-md text-center">
            <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-royal mb-4">
              Something broke
            </div>
            <h1 className="font-display font-extrabold text-2xl md:text-3xl text-ink mb-4 leading-tight">
              That wasn't supposed to happen.
            </h1>
            <p className="text-black/60 leading-relaxed mb-8">
              We hit an unexpected error while rendering this page. Try
              reloading — and if it persists, please tell us.
            </p>
            <a
              href="/"
              className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-ink text-white font-medium hover:bg-royal transition-colors"
            >
              Back to home
            </a>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
