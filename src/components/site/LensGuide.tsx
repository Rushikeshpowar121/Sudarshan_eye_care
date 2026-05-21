import { motion } from "framer-motion";
import { Sun, Monitor, Shield, Sparkles } from "lucide-react";

const lenses = [
  { Icon: Monitor, name: "Blue-Cut Lenses", best: "Best for desk workers & students", desc: "Filter harmful blue light from screens to reduce digital eye strain and improve sleep quality." },
  { Icon: Sun, name: "Photochromic Lenses", best: "Best for outdoor lifestyles", desc: "Auto-darken in sunlight and clear indoors — one pair for all lighting conditions." },
  { Icon: Shield, name: "Polarised Sunglasses", best: "Best for driving & water sports", desc: "Eliminate glare from reflective surfaces while preserving true colour perception." },
  { Icon: Sparkles, name: "High-Index Lenses", best: "Best for high prescriptions", desc: "Up to 50% thinner and lighter than standard plastic lenses for unmatched comfort." },
];

export function LensGuide() {
  return (
    <section className="py-20 container mx-auto px-6">
      <div className="max-w-2xl mx-auto text-center mb-14">
        <div className="inline-block px-3 py-1 rounded-full bg-accent text-primary text-xs font-semibold uppercase tracking-wider mb-4">Lens Guide</div>
        <h2 className="font-display font-bold text-3xl md:text-5xl text-foreground leading-tight">
          Choosing the <span className="text-gradient">Right Lens</span>
        </h2>
        <p className="mt-4 text-muted-foreground">Our opticians help you pick lenses that match your prescription, lifestyle and budget.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {lenses.map((l, i) => (
          <motion.div
            key={l.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="bg-card-gradient rounded-3xl p-6 border border-border shadow-card hover:shadow-elegant hover:-translate-y-1 transition-smooth"
          >
            <div className="h-12 w-12 rounded-2xl bg-primary-gradient flex items-center justify-center shadow-soft mb-4">
              <l.Icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="font-display font-bold text-lg text-foreground">{l.name}</h3>
            <div className="text-[11px] font-semibold text-primary uppercase tracking-wider mt-1">{l.best}</div>
            <p className="text-sm text-muted-foreground leading-relaxed mt-3">{l.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
