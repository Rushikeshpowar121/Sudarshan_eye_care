import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Calendar, Phone, Star, Award, Users, Eye, ShieldCheck, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HOSPITAL } from "@/lib/hospital";
import heroEye from "@/assets/hero-eye.jpg";
import drImg from "@/assets/dr-amit-pawar.jpg";
import { useState, useEffect } from "react";
import { getClinicInfo, getDoctorInfo } from "@/lib/api.ts";

export function Hero() {
  const [clinic, setClinic] = useState<any>(null);
  const [doctor, setDoctor] = useState<any>(null);

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      try {
        const [cData, dData] = await Promise.all([getClinicInfo(), getDoctorInfo()]);
        if (active) {
          setClinic(cData);
          setDoctor(dData);
        }
      } catch (err) {
        console.error("Hero offline fetch sandbox mapping:", err);
      }
    };
    loadData();
    return () => {
      active = false;
    };
  }, []);

  const docName = doctor?.name || HOSPITAL.doctor;
  const ratingVal = clinic?.rating || HOSPITAL.rating;
  const expVal = doctor?.experience || HOSPITAL.experience;
  const patsVal = clinic?.patients || HOSPITAL.patients;
  const surgVal = clinic?.surgeries || HOSPITAL.surgeries;
  const docImg = doctor?.image || drImg;
  const taglineText = clinic?.tagline || HOSPITAL.tagline;
  return (
    <section className="relative overflow-hidden bg-soft">
      {/* Background image with overlay */}
      <div className="absolute inset-0 -z-10">
        <img src={heroEye} alt="" className="w-full h-full object-cover opacity-20" width={1600} height={1200} />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/85 to-accent/40" />
      </div>

      {/* Floating glow orbs */}
      <div className="absolute top-20 -left-20 w-72 h-72 rounded-full bg-primary-glow/20 blur-3xl animate-float" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-primary/15 blur-3xl animate-float" style={{ animationDelay: "2s" }} />

      <div className="container mx-auto px-6 pt-12 pb-20 lg:py-24 grid lg:grid-cols-2 gap-12 items-center relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass border-primary/20 text-xs font-medium text-primary mb-6">
            <Star className="h-3.5 w-3.5 fill-primary-glow text-primary-glow" />
            {ratingVal} Star Rated Hospital in Kolhapur
          </div>

          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-foreground">
            {taglineText || "Advanced Retina & Comprehensive Eye Care"}
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
            Trusted retina specialists providing world-class eye treatments with the latest technology and compassionate care — by{" "}
            <span className="font-semibold text-foreground">{docName}</span>.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="xl">
              <Link to="/appointment"><Calendar className="h-5 w-5" /> Book Appointment</Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="rounded-full">
              <a href={`tel:${HOSPITAL.phoneRaw}`}><Phone className="h-5 w-5" /> Call Now</a>
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-4 max-w-md">
            {[
              { value: `${expVal}+`, label: "Years Experience", Icon: Award },
              { value: patsVal, label: "Happy Patients", Icon: Users },
              { value: surgVal, label: "Surgeries", Icon: Activity },
            ].map(({ value, label, Icon }) => (
              <div key={label} className="text-center">
                <div className="mx-auto h-10 w-10 rounded-xl bg-accent flex items-center justify-center mb-2">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="font-display font-bold text-xl text-foreground">{value}</div>
                <div className="text-[11px] text-muted-foreground uppercase tracking-wide">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative aspect-[4/5] max-w-lg mx-auto">
            <div className="absolute -inset-6 bg-primary-gradient rounded-[3rem] blur-2xl opacity-30 animate-pulse-glow" />
            <div className="relative h-full rounded-[2.5rem] overflow-hidden shadow-elegant bg-card border border-border">
              <img src={docImg} alt={docName} className="w-full h-full object-cover" width={900} height={1200} />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
            </div>

            {/* Floating cards */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -left-4 lg:-left-12 top-12 glass rounded-2xl p-4 shadow-card max-w-[180px]"
            >
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-xl bg-primary-gradient flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <div className="font-display font-bold text-sm text-foreground">Certified</div>
                  <div className="text-[11px] text-muted-foreground">Retina Specialist</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -right-4 lg:-right-8 bottom-16 glass rounded-2xl p-4 shadow-card max-w-[200px]"
            >
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center">
                  <Eye className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-display font-bold text-sm text-foreground">{patsVal}</div>
                  <div className="text-[11px] text-muted-foreground">Patients Treated</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-4 left-8 glass rounded-2xl p-3.5 shadow-card"
            >
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-primary-glow text-primary-glow" />
                ))}
                <div className="font-display font-bold text-sm text-foreground ml-1">{ratingVal}/5</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
