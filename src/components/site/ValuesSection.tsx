import { motion } from "framer-motion";
import { Heart, ShieldCheck, Lightbulb, Users, Sparkles, BadgeCheck } from "lucide-react";

const values = [
  { Icon: Heart, title: "Compassion", desc: "Every patient is treated like family." },
  { Icon: ShieldCheck, title: "Integrity", desc: "Honest diagnosis. Only the surgery you actually need." },
  { Icon: Lightbulb, title: "Innovation", desc: "Continuous training on the latest techniques." },
  { Icon: Users, title: "Accessibility", desc: "Affordable care for every section of society." },
  { Icon: Sparkles, title: "Excellence", desc: "Uncompromising clinical standards at every step." },
  { Icon: BadgeCheck, title: "Transparency", desc: "Clear pricing, clear outcomes, clear communication." },
];

export function ValuesSection() {
  return (
    <section className="py-20 container mx-auto px-6">
      <div className="max-w-2xl mx-auto text-center mb-14">
        <div className="inline-block px-3 py-1 rounded-full bg-accent text-primary text-xs font-semibold uppercase tracking-wider mb-4">Our Values</div>
        <h2 className="font-display font-bold text-3xl md:text-5xl text-foreground leading-tight">
          What We <span className="text-gradient">Stand For</span>
        </h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {values.map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="flex items-start gap-4 p-6 rounded-3xl bg-card-gradient border border-border shadow-card"
          >
            <div className="h-12 w-12 rounded-2xl bg-accent flex items-center justify-center shrink-0">
              <v.Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-foreground mb-1">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
