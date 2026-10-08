import { MessageCircle } from "lucide-react"
import { studio } from "@/content"

export function WhatsAppButton() {
  const number = studio.phoneHref.replace("+", "")
  const message = encodeURIComponent("Hi AstroVexus, I want to talk about a project.")

  return (
    <a
      href={`https://wa.me/${number}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-black/25 hover:scale-105 active:scale-95 transition-transform"
    >
      <MessageCircle size={26} />
    </a>
  )
}
