import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { AboutSection } from "@/components/site/AboutSection";
import { Timeline } from "@/components/site/Timeline";
import { ValuesSection } from "@/components/site/ValuesSection";
import { TechSection } from "@/components/site/TechSection";
import { DoctorProfile } from "@/components/site/DoctorProfile";
import { WhyChooseUs } from "@/components/site/WhyChooseUs";
import { AppointmentCTA } from "@/components/site/AppointmentCTA";
import { makeMeta } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => makeMeta({ title: "About — Sudharshan Eye Hospital", description: "Our story, mission, advanced technology and infrastructure powering Kolhapur's trusted retina hospital.", path: "/about" }),
  component: () => (
    <SiteLayout>
      <div className="bg-soft py-16">
        <div className="container mx-auto px-6 text-center max-w-2xl">
          <div className="inline-block px-3 py-1 rounded-full bg-accent text-primary text-xs font-semibold uppercase tracking-wider mb-4">About Us</div>
          <h1 className="font-display font-bold text-4xl md:text-6xl text-foreground leading-tight">Caring for <span className="text-gradient">Kolhapur's Vision</span></h1>
          <p className="mt-5 text-muted-foreground">A trusted name in retina and comprehensive eye care for over 15 years — built on precision, ethics and compassion.</p>
        </div>
      </div>
      <AboutSection />
      <Timeline />
      <ValuesSection />
      <TechSection />
      <DoctorProfile />
      <WhyChooseUs />
      <AppointmentCTA />
    </SiteLayout>
  ),
});
