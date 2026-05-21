import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { DoctorProfile } from "@/components/site/DoctorProfile";
import { DoctorExpertise } from "@/components/site/DoctorExpertise";
import { TestimonialsSection } from "@/components/site/TestimonialsSection";
import { AppointmentCTA } from "@/components/site/AppointmentCTA";
import { makeMeta } from "@/lib/seo";

export const Route = createFileRoute("/doctors")({
  head: () => makeMeta({ title: "Dr. Amit Pawar — Retina Specialist | Sudharshan Eye Hospital", description: "Meet Dr. Amit Pawar — senior vitreo-retinal surgeon in Kolhapur with 15+ years of experience and 8,500+ surgeries.", path: "/doctors" }),
  component: () => (
    <SiteLayout>
      <div className="bg-soft py-16">
        <div className="container mx-auto px-6 text-center max-w-2xl">
          <div className="inline-block px-3 py-1 rounded-full bg-accent text-primary text-xs font-semibold uppercase tracking-wider mb-4">Our Team</div>
          <h1 className="font-display font-bold text-4xl md:text-6xl text-foreground leading-tight">Meet Our <span className="text-gradient">Specialists</span></h1>
          <p className="mt-5 text-muted-foreground">Expertise you can trust, care you can feel — from one of Maharashtra's most experienced retina surgeons.</p>
        </div>
      </div>
      <DoctorProfile />
      <DoctorExpertise />
      <TestimonialsSection />
      <AppointmentCTA />
    </SiteLayout>
  ),
});
