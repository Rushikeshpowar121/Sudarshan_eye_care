import { motion } from "framer-motion";
import { Award, GraduationCap, Stethoscope, Star, Calendar, CheckCircle2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { HOSPITAL } from "@/lib/hospital";
import drImg from "@/assets/dr-amit-pawar.jpg";
import { useState, useEffect } from "react";
import { getDoctorInfo } from "@/lib/api.ts";

export function DoctorProfile() {
  const [doctor, setDoctor] = useState<any>(null);

  useEffect(() => {
    let active = true;
    getDoctorInfo().then((data) => {
      if (active && data) {
        setDoctor(data);
      }
    }).catch(console.error);
    return () => {
      active = false;
    };
  }, []);

  const docName = doctor?.name || HOSPITAL.doctor;
  const docTitle = doctor?.title || HOSPITAL.doctorTitle;
  const docExp = doctor?.experience || HOSPITAL.experience;
  const docBio = doctor?.bio || "Dr. Amit Pawar is an acclaimed Retina Specialist with over 15 years of surgical excellence in treating complex macular disorders, diabetic retinopathy, and retinal detachments. He is deeply committed to restoring and preserving vision using advanced surgical diagnostics.";
  const docImg = doctor?.image || drImg;
  const docSpecialization = doctor?.specialization || "Premium Retina Specialist";

  const credentials = [
    { Icon: GraduationCap, text: docTitle },
    { Icon: Stethoscope, text: docSpecialization },
    { Icon: Award, text: `${docExp}+ Years of Clinical Experience` },
    { Icon: CheckCircle2, text: "8,500+ Successful Eye Surgeries" },
  ];

  return (
    <section className="py-20 container mx-auto px-6">
      <div className="grid lg:grid-cols-5 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2 relative"
        >
          <div className="relative aspect-[4/5] max-w-md mx-auto">
            <div className="absolute -bottom-6 -right-6 w-48 h-48 rounded-3xl bg-primary-glow/30 blur-2xl" />
            <div className="absolute inset-0 bg-primary-gradient rounded-[2.5rem] rotate-3 opacity-90" />
            <img
              src={docImg}
              alt={docName}
              loading="lazy"
              width={900}
              height={1200}
              className="relative rounded-[2.5rem] w-full h-full object-cover shadow-elegant -rotate-2"
            />
            <div className="absolute -top-4 -right-4 glass rounded-2xl px-4 py-3 shadow-card">
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-primary-glow text-primary-glow" />
                <span className="font-display font-bold text-sm">{HOSPITAL.rating}</span>
                <span className="text-xs text-muted-foreground">/ 5</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-3"
        >
          <div className="inline-block px-3 py-1 rounded-full bg-accent text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            Meet Your Specialist
          </div>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-foreground leading-tight">
            {docName}
          </h2>
          <p className="text-primary font-semibold mt-2">{docTitle}</p>

          <p className="mt-6 text-muted-foreground leading-relaxed">
            {docBio}
          </p>

          <div className="mt-8 grid sm:grid-cols-2 gap-3">
            {credentials.map(({ Icon, text }) => (
              <div key={text} className="flex items-start gap-3 p-3.5 rounded-2xl bg-card border border-border shadow-card">
                <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center shrink-0">
                  <Icon className="h-4.5 w-4.5 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground pt-1.5">{text}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="lg">
              <Link to="/appointment"><Calendar className="h-4 w-4" /> Consult {docName}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link to="/doctors">View Full Profile</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
