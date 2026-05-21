import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ServicesSection } from "@/components/site/ServicesSection";
import { ServicesDetailed } from "@/components/site/ServicesDetailed";
import { ServiceProcess } from "@/components/site/ServiceProcess";
import { FAQSection } from "@/components/site/FAQSection";
import { AppointmentCTA } from "@/components/site/AppointmentCTA";
import { makeMeta } from "@/lib/seo";

export const Route = createFileRoute("/services")({
  head: () => makeMeta({ title: "Services — Sudharshan Eye Hospital", description: "Retina, cataract, LASIK, glaucoma, pediatric and complete eye care services in Kolhapur.", path: "/services" }),
  component: () => (
    <SiteLayout>
      <div className="bg-soft py-16">
        <div className="container mx-auto px-6 text-center max-w-2xl">
          <div className="inline-block px-3 py-1 rounded-full bg-accent text-primary text-xs font-semibold uppercase tracking-wider mb-4">Services</div>
          <h1 className="font-display font-bold text-4xl md:text-6xl text-foreground leading-tight">Complete <span className="text-gradient">Eye Care Services</span></h1>
          <p className="mt-5 text-muted-foreground">Every treatment you need — from routine checkups to advanced retina surgery, delivered with world-class technology.</p>
        </div>
      </div>
      <ServicesSection />
      <ServicesDetailed />
      <ServiceProcess />
      <FAQSection />
      <AppointmentCTA />
    </SiteLayout>
  ),
});
