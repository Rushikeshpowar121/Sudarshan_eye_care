import { motion } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { HOSPITAL } from "@/lib/hospital";

export function AppointmentCTA() {
  const waLink = `https://wa.me/${HOSPITAL.phoneRaw.replace("+", "")}?text=Hi%2C%20I%20would%20like%20to%20book%20an%20appointment%20at%20Sudharshan%20Eye%20Hospital.`;
  return (
    <section className="py-20 container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[2.5rem] bg-hero p-10 md:p-16 shadow-elegant"
      >
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary-glow/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

        <div className="relative grid lg:grid-cols-2 gap-8 items-center">
          <div className="text-primary-foreground">
            <h2 className="font-display font-bold text-3xl md:text-5xl leading-tight">
              Ready to protect your vision?
            </h2>
            <p className="mt-4 text-primary-foreground/85 text-lg max-w-md">
              Book your consultation with Dr. Amit Pawar today. Walk-ins welcome — same-day appointments often available.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:justify-end gap-3">
            <Button asChild variant="glow" size="xl">
              <Link to="/appointment">Book Appointment</Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="rounded-full border-white/40 bg-white/10 text-primary-foreground hover:bg-white hover:text-primary">
              <a href={`tel:${HOSPITAL.phoneRaw}`}><Phone className="h-4 w-4" /> Call Now</a>
            </Button>
            <Button asChild variant="outline" size="xl" className="rounded-full border-white/40 bg-white/10 text-primary-foreground hover:bg-white hover:text-primary">
              <a href={waLink} target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
