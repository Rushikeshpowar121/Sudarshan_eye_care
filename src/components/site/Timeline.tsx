import { motion } from "framer-motion";

const milestones = [
  { year: "2009", title: "Founded in Kolhapur", desc: "Dr. Amit Pawar opens Sudharshan Eye Hospital with a single consulting room and a vision to bring world-class retina care to western Maharashtra." },
  { year: "2012", title: "Advanced Diagnostics", desc: "Installed our first OCT and fundus camera, enabling early detection of diabetic retinopathy and macular conditions." },
  { year: "2015", title: "Modern OT Commissioned", desc: "Inaugurated a fully sterile operation theater with imported phaco and vitrectomy systems." },
  { year: "2018", title: "10,000+ Patients Treated", desc: "Crossed the 10,000-patient milestone, becoming one of Kolhapur's most trusted eye-care destinations." },
  { year: "2021", title: "In-house Optical Store", desc: "Launched our curated optical store offering designer frames, premium lenses and contact lens fitting." },
  { year: "2024", title: "Today", desc: "25,000+ patients, 8,500+ surgeries, and a team committed to preserving the gift of sight for every family in Kolhapur." },
];

export function Timeline() {
  return (
    <section className="py-20 container mx-auto px-6">
      <div className="max-w-2xl mx-auto text-center mb-14">
        <div className="inline-block px-3 py-1 rounded-full bg-accent text-primary text-xs font-semibold uppercase tracking-wider mb-4">Our Journey</div>
        <h2 className="font-display font-bold text-3xl md:text-5xl text-foreground leading-tight">
          15 Years of <span className="text-gradient">Preserving Vision</span>
        </h2>
      </div>

      <div className="relative max-w-4xl mx-auto">
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/10 via-primary/40 to-primary/10 md:-translate-x-1/2" />
        {milestones.map((m, i) => (
          <motion.div
            key={m.year}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className={`relative pl-12 md:pl-0 md:grid md:grid-cols-2 md:gap-10 mb-10 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}
          >
            <div className={`md:text-right ${i % 2 ? "md:text-left" : ""}`}>
              <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-primary-gradient ring-4 ring-background -translate-x-1/2 mt-2" />
              <div className="font-display font-bold text-3xl text-gradient">{m.year}</div>
              <h3 className="font-display font-bold text-lg text-foreground mt-1">{m.title}</h3>
            </div>
            <div>
              <p className="text-sm text-muted-foreground leading-relaxed bg-card rounded-2xl p-5 border border-border shadow-card">{m.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
