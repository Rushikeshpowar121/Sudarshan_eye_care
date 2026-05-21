import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Users, Activity, Award, Eye } from "lucide-react";
import receptionImg from "@/assets/hospital-reception.jpg";
import retinaImg from "@/assets/retina-scan.jpg";
import opticalImg from "@/assets/optical-store.jpg";

import { getClinicInfo } from "@/lib/api.ts";
import { HOSPITAL } from "@/lib/hospital";

function Counter({ end, suffix }: { end: number; suffix: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        const dur = 1600;
        const start = performance.now();
        const tick = (t: number) => {
          const p = Math.min((t - start) / dur, 1);
          setVal(Math.floor(end * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [end]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

export function AboutSection() {
  const [clinic, setClinic] = useState<any>(null);

  useEffect(() => {
    let active = true;
    getClinicInfo().then((data) => {
      if (active && data) {
        setClinic(data);
      }
    }).catch(console.error);
    return () => {
      active = false;
    };
  }, []);

  const clinicName = clinic?.name || "Sudharshan Eye Hospital";
  const patientsCount = parseInt((clinic?.patients || "25,000+").replace(/[^0-9]/g, "")) || 25000;
  const surgeriesCount = parseInt((clinic?.surgeries || "8,500+").replace(/[^0-9]/g, "")) || 8500;

  const stats = [
    { value: patientsCount, suffix: "+", label: "Happy Patients", Icon: Users },
    { value: surgeriesCount, suffix: "+", label: "Successful Surgeries", Icon: Activity },
    { value: 15, suffix: "+", label: "Years of Trust", Icon: Award },
    { value: 12000, suffix: "+", label: "Retina Treatments", Icon: Eye },
  ];
  return (
    <section className="py-20 bg-soft">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="space-y-4">
              <img src={receptionImg} alt="Hospital reception" loading="lazy" width={1400} height={900} className="rounded-3xl w-full h-56 object-cover shadow-card" />
              <img src={opticalImg} alt="Optical store" loading="lazy" width={1400} height={900} className="rounded-3xl w-full h-40 object-cover shadow-card" />
            </div>
            <div className="pt-10">
              <img src={retinaImg} alt="Retina scan room" loading="lazy" width={1400} height={900} className="rounded-3xl w-full h-80 object-cover shadow-elegant" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="inline-block px-3 py-1 rounded-full bg-accent text-primary text-xs font-semibold uppercase tracking-wider mb-4">
              About Our Hospital
            </div>
            <h2 className="font-display font-bold text-3xl md:text-5xl leading-tight text-foreground">
              Where Vision Meets <span className="text-gradient">Compassionate Care</span>
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              {clinicName} is Kolhapur's leading destination for advanced retina and comprehensive eye care.
              We combine cutting-edge diagnostic technology with the personalized attention every patient deserves —
              from your first consultation to post-surgery recovery.
            </p>

            <div className="mt-6 space-y-3">
              <div>
                <div className="text-sm font-semibold text-primary">Our Mission</div>
                <p className="text-sm text-muted-foreground mt-1">To restore and preserve vision for every patient through ethical, world-class eye care.</p>
              </div>
              <div>
                <div className="text-sm font-semibold text-primary">Our Vision</div>
                <p className="text-sm text-muted-foreground mt-1">A future where no one in Maharashtra loses sight to a preventable or treatable eye condition.</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ value, suffix, label, Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-card-gradient rounded-3xl p-6 shadow-card border border-border text-center"
            >
              <div className="h-12 w-12 rounded-2xl bg-primary-gradient mx-auto flex items-center justify-center mb-3 shadow-soft">
                <Icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="font-display font-bold text-3xl text-gradient">
                <Counter end={value} suffix={suffix} />
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">{label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
