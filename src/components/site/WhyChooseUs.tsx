import { motion } from "framer-motion";
import { ShieldCheck, Microscope, HeartHandshake, Award, Wallet, UsersRound } from "lucide-react";

const reasons = [
  { Icon: Microscope, title: "Advanced Retina Technology", desc: "OCT, fundus fluorescein angiography and modern vitrectomy systems." },
  { Icon: ShieldCheck, title: "Experienced Specialists", desc: "Led by senior retina surgeon Dr. Amit Pawar with 15+ years of practice." },
  { Icon: Award, title: "Modern Equipment", desc: "Imported phaco machines, lasers and diagnostic tools." },
  { Icon: HeartHandshake, title: "Personalized Care", desc: "Treatment plans tailored to every patient, with continuous follow-up." },
  { Icon: Wallet, title: "Affordable Treatment", desc: "Transparent pricing and insurance support for major plans." },
  { Icon: UsersRound, title: "Trusted by Thousands", desc: "25,000+ patients across Maharashtra trust us with their vision." },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-soft">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <div className="inline-block px-3 py-1 rounded-full bg-accent text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            Why Choose Us
          </div>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-foreground leading-tight">
            The <span className="text-gradient">Sudharshan Difference</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="bg-card-gradient rounded-3xl p-7 border border-border shadow-card hover:shadow-elegant transition-smooth"
            >
              <div className="h-12 w-12 rounded-2xl bg-primary-gradient flex items-center justify-center shadow-soft mb-4">
                <r.Icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-display font-bold text-lg text-foreground mb-2">{r.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
