import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductsCatalog } from "@/components/site/ProductsCatalog";
import { LensGuide } from "@/components/site/LensGuide";
import { AppointmentCTA } from "@/components/site/AppointmentCTA";
import { makeMeta } from "@/lib/seo";

export const Route = createFileRoute("/products")({
  head: () => makeMeta({ title: "Optical Store — Premium Eyewear | Sudharshan Eye Hospital", description: "Designer frames, sunglasses, contact lenses and blue-cut lenses from top brands — fitted by our experts in Kolhapur.", path: "/products" }),
  component: () => (
    <SiteLayout>
      <div className="bg-soft py-16">
        <div className="container mx-auto px-6 text-center max-w-2xl">
          <div className="inline-block px-3 py-1 rounded-full bg-accent text-primary text-xs font-semibold uppercase tracking-wider mb-4">Optical Store</div>
          <h1 className="font-display font-bold text-4xl md:text-6xl text-foreground leading-tight">Premium <span className="text-gradient">Eyewear</span></h1>
          <p className="mt-5 text-muted-foreground">Curated frames and lenses from the world's most-loved brands — paired with expert fitting and aftercare.</p>
        </div>
      </div>
      <ProductsCatalog />
      <LensGuide />
      <AppointmentCTA />
    </SiteLayout>
  ),
});
