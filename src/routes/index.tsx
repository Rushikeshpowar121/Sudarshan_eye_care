import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Hero } from "@/components/site/Hero";
import { DoctorProfile } from "@/components/site/DoctorProfile";
import { AboutSection } from "@/components/site/AboutSection";
import { ServicesSection } from "@/components/site/ServicesSection";
import { WhyChooseUs } from "@/components/site/WhyChooseUs";
import { ProductsSection } from "@/components/site/ProductsSection";
import { TestimonialsSection } from "@/components/site/TestimonialsSection";
import { GalleryPreview } from "@/components/site/GalleryPreview";
import { AppointmentCTA } from "@/components/site/AppointmentCTA";
import { makeMeta } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    makeMeta({
      title: "Sudharshan Eye Hospital — Best Retina Eye Care in Kolhapur",
      description:
        "Premium retina & comprehensive eye care in Kolhapur by Dr. Amit Pawar. Cataract, LASIK, glaucoma, pediatric eye care. Book your appointment today.",
      path: "/",
    }),
  component: Index,
});

function Index() {
  return (
    <SiteLayout>
      <Hero />
      <DoctorProfile />
      <AboutSection />
      <ServicesSection limit={8} />
      <WhyChooseUs />
      <ProductsSection limit={6} />
      <TestimonialsSection limit={3} />
      <GalleryPreview />
      <AppointmentCTA />
    </SiteLayout>
  );
}
