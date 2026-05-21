import { motion } from "framer-motion";
import { CalendarCheck, ScanEye, ClipboardList, Stethoscope, HeartPulse } from "lucide-react";

const steps = [
  { Icon: CalendarCheck, title: "Book Appointment", desc: "Call us or book online — same-day slots available." },
  { Icon: ScanEye, title: "Diagnostic Workup", desc: "Comprehensive eye exam with OCT, refraction and pressure check." },
  { Icon: ClipboardList, title: "Treatment Plan", desc: "Personalized plan with transparent pricing and timelines." },
  { Icon: Stethoscope, title: "Treatment / Surgery", desc: "Care delivered by Dr. Pawar and our specialist team." },
  { Icon: HeartPulse, title: "Recovery & Follow-up", desc: "Structured follow-ups to ensure the best long-term outcome." },
];

export function ServiceProcess() {
  return (
    <section className="py-20 bg-soft">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <div className="inline-block px-3 py-1 rounded-full bg-accent text-primary text-xs font-semibold uppercase tracking-wider mb-4">Our Process</div>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-foreground leading-tight">
            Your Journey, <span className="text-gradient">Step by Step</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-5 gap-5 relative">
          <div className="hidden md:block absolute top-7 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative text-center"
            >
              <div className="relative h-14 w-14 rounded-2xl bg-primary-gradient mx-auto flex items-center justify-center shadow-elegant">
                <s.Icon className="h-7 w-7 text-primary-foreground" />
                <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-card text-primary text-xs font-bold flex items-center justify-center border border-border shadow-soft">{i + 1}</div>
              </div>
              <h3 className="font-display font-bold text-base text-foreground mt-4">{s.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1.5 px-2">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
