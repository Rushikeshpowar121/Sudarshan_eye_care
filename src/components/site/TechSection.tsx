import { motion } from "framer-motion";
import { ScanEye, Microscope, Activity, Zap, Eye, Stethoscope } from "lucide-react";

const tech = [
  { Icon: ScanEye, name: "OCT Scanner", desc: "Optical Coherence Tomography for cross-sectional retina imaging." },
  { Icon: Microscope, name: "Operating Microscope", desc: "Zeiss-grade microscopes for precise micro-surgery." },
  { Icon: Activity, name: "Fundus Fluorescein Angiography", desc: "Detailed imaging of retinal blood vessels." },
  { Icon: Zap, name: "Green Laser System", desc: "For diabetic retinopathy and retinal tears." },
  { Icon: Eye, name: "Phaco-emulsification", desc: "Bladeless cataract removal with premium IOLs." },
  { Icon: Stethoscope, name: "Auto-refractometer", desc: "Computerised refraction for accurate prescriptions." },
];

export function TechSection() {
  return (
    <section className="py-20 bg-soft">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <div className="inline-block px-3 py-1 rounded-full bg-accent text-primary text-xs font-semibold uppercase tracking-wider mb-4">Infrastructure</div>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-foreground leading-tight">
            World-class <span className="text-gradient">Technology</span>
          </h2>
          <p className="mt-4 text-muted-foreground">Imported, regularly calibrated equipment — because precision is everything in eye care.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tech.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group bg-card rounded-3xl p-6 border border-border shadow-card hover:shadow-elegant hover:-translate-y-1 transition-smooth"
            >
              <div className="h-14 w-14 rounded-2xl bg-primary-gradient flex items-center justify-center shadow-soft mb-4 group-hover:scale-110 transition-smooth">
                <t.Icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="font-display font-bold text-base text-foreground mb-1.5">{t.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
