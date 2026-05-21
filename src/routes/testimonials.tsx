import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { TestimonialsSection } from "@/components/site/TestimonialsSection";
import { makeMeta } from "@/lib/seo";

export const Route = createFileRoute("/testimonials")({
  head: () => makeMeta({ title: "Testimonials — Sudharshan Eye Hospital", description: "Real patient stories from our retina, cataract and LASIK patients.", path: "/testimonials" }),
  component: () => (
    <SiteLayout>
      <div className="bg-soft py-16">
        <div className="container mx-auto px-6 text-center max-w-2xl">
          <div className="inline-block px-3 py-1 rounded-full bg-accent text-primary text-xs font-semibold uppercase tracking-wider mb-4">Patient Stories</div>
          <h1 className="font-display font-bold text-4xl md:text-6xl text-foreground leading-tight">Words from <span className="text-gradient">Our Patients</span></h1>
        </div>
      </div>
      <TestimonialsSection />
    </SiteLayout>
  ),
});
