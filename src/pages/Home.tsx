import { Hero } from "@/components/Hero"
import { ServiceMarquee } from "@/components/ServiceMarquee"
import { ServicesBento } from "@/components/ServicesBento"
import { StatusBlock } from "@/components/StatusBlock"
import { Founders } from "@/components/Founders"
import { CTA } from "@/components/CTA"

export default function Home() {
  return (
    <>
      <Hero />
      <ServiceMarquee />
      <ServicesBento />
      <StatusBlock />
      <Founders />
      <CTA />
    </>
  )
}
