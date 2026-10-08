// Base URL of the AstroVexus backend. Set VITE_API_URL in Vercel (and .env locally).
export const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:4000").replace(/\/$/, "")
