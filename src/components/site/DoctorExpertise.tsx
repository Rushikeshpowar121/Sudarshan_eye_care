import { motion } from "framer-motion";
import { Award, BookOpen, Users, Calendar, GraduationCap, Trophy, Mic, FileText } from "lucide-react";

const expertise = [
  "Vitreo-Retinal Surgery",
  "Diabetic Retinopathy Management",
  "Macular Degeneration",
  "Retinal Detachment Repair",
  "Intra-vitreal Injections (Anti-VEGF)",
  "Complex Cataract Surgery",
  "Pediatric Retinal Disorders",
  "Uveitis Management",
];

const achievements = [
  { Icon: GraduationCap, label: "Education", value: "MBBS, MS Ophthalmology — Pune" },
  { Icon: Award, label: "Fellowship", value: "Vitreo-Retinal Surgery, LV Prasad Eye Institute" },
  { Icon: Trophy, label: "Recognition", value: "Best Retina Specialist — Kolhapur Medical Awards 2022" },
  { Icon: Users, label: "Memberships", value: "All India Ophthalmological Society, Vitreo-Retinal Society of India" },
  { Icon: BookOpen, label: "Publications", value: "12+ peer-reviewed papers on retinal disorders" },
  { Icon: Mic, label: "Speaker", value: "Invited speaker at 20+ national ophthalmology conferences" },
];

const schedule = [
  { day: "Monday – Friday", hours: "10:00 AM – 8:00 PM" },
  { day: "Saturday", hours: "10:00 AM – 8:00 PM" },
  { day: "Sunday", hours: "10:00 AM – 1:00 PM" },
  { day: "Emergency", hours: "24 / 7 on call" },
];

export function DoctorExpertise() {
  return (
    <section className="py-20 bg-soft">
      <div className="container mx-auto px-6 grid lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-card rounded-3xl p-7 border border-border shadow-card"
        >
          <div className="inline-block px-3 py-1 rounded-full bg-accent text-primary text-xs font-semibold uppercase tracking-wider mb-4">Areas of Expertise</div>
          <h3 className="font-display font-bold text-2xl text-foreground mb-5">Specialisations</h3>
          <ul className="space-y-2.5">
            {expertise.map((e) => (
              <li key={e} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span>{e}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2 grid sm:grid-cols-2 gap-4"
        >
          {achievements.map((a) => (
            <div key={a.label} className="bg-card-gradient rounded-3xl p-5 border border-border shadow-card flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary-gradient flex items-center justify-center shrink-0">
                <a.Icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">{a.label}</div>
                <div className="text-sm text-foreground mt-0.5 leading-snug">{a.value}</div>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="lg:col-span-3 bg-primary-gradient rounded-3xl p-8 text-primary-foreground shadow-elegant"
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5" />
            <h3 className="font-display font-bold text-xl">Consultation Schedule</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {schedule.map((s) => (
              <div key={s.day} className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/15">
                <div className="text-xs uppercase tracking-wider opacity-80">{s.day}</div>
                <div className="font-display font-bold mt-1">{s.hours}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-start gap-2 text-sm opacity-90">
            <FileText className="h-4 w-4 mt-0.5" />
            <p>Walk-ins welcome. Pre-booked appointments are prioritised to reduce waiting time.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
