import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { AppointmentCTA } from "@/components/site/AppointmentCTA";
import { makeMeta } from "@/lib/seo";

export const Route = createFileRoute("/gallery")({
  head: () => makeMeta({ title: "Gallery — Sudharshan Eye Hospital", description: "Inside our modern eye hospital — reception, diagnostic equipment, operation theater and optical store.", path: "/gallery" }),
  component: () => (
    <SiteLayout>
      <div className="bg-soft py-16">
        <div className="container mx-auto px-6 text-center max-w-2xl">
          <div className="inline-block px-3 py-1 rounded-full bg-accent text-primary text-xs font-semibold uppercase tracking-wider mb-4">Gallery</div>
          <h1 className="font-display font-bold text-4xl md:text-6xl text-foreground leading-tight">A Look <span className="text-gradient">Inside</span></h1>
          <p className="mt-5 text-muted-foreground">Take a virtual tour of our hospital, advanced equipment and patient-friendly spaces.</p>
        </div>
      </div>
      <GalleryGrid />
      <AppointmentCTA />
    </SiteLayout>
  ),
});
