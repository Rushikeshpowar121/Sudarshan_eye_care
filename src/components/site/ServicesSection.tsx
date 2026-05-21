import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { getServices } from "@/lib/api.ts";
import {
  ScanEye,
  Scissors,
  Zap,
  Baby,
  Droplets,
  Eye,
  Contact as ContactIcon,
  Glasses,
  Activity,
  Stethoscope,
  ArrowRight
} from "lucide-react";

const iconMap: Record<string, any> = {
  ScanEye,
  Scissors,
  Zap,
  Baby,
  Droplets,
  Eye,
  ContactIcon,
  Glasses,
  Activity,
  Stethoscope
};

export const fallbackServices = [
  { slug: "retina", title: "Retina Treatment", desc: "Advanced care for diabetic retinopathy, macular degeneration, and retinal detachment.", iconName: "ScanEye", color: "from-blue-500 to-cyan-500" },
  { slug: "cataract", title: "Cataract Surgery", desc: "Bladeless phaco surgery with premium IOL lenses for crystal-clear vision.", iconName: "Scissors", color: "from-cyan-500 to-sky-500" },
  { slug: "lasik", title: "LASIK Consultation", desc: "Freedom from glasses with safe, precise laser vision correction.", iconName: "Zap", color: "from-indigo-500 to-blue-500" },
  { slug: "pediatric", title: "Pediatric Eye Care", desc: "Specialized eye care, vision development and squint treatment for children.", iconName: "Baby", color: "from-sky-500 to-blue-500" },
  { slug: "glaucoma", title: "Glaucoma Treatment", desc: "Early detection and lifelong management to protect your optic nerve.", iconName: "Droplets", color: "from-blue-600 to-indigo-500" },
  { slug: "checkup", title: "Comprehensive Eye Checkup", desc: "Full diagnostic eye examination using modern equipment.", iconName: "Eye", color: "from-cyan-600 to-blue-500" },
  { slug: "contact-lens", title: "Contact Lens Services", desc: "Soft, RGP, toric and multifocal lenses — fitted by experts.", iconName: "ContactIcon", color: "from-sky-600 to-cyan-500" },
  { slug: "optical", title: "Optical Store", desc: "Premium designer frames, lenses and sunglasses in-house.", iconName: "Glasses", color: "from-blue-500 to-indigo-600" },
  { slug: "diabetic-retina", title: "Diabetic Retina Care", desc: "Screening and treatment plans for diabetes-related vision changes.", iconName: "Activity", color: "from-cyan-500 to-blue-600" },
  { slug: "vision-testing", title: "Vision Testing", desc: "Computerised refraction and detailed vision assessments.", iconName: "Stethoscope", color: "from-indigo-600 to-blue-500" },
];

export const services = fallbackServices;

export function ServicesSection({ limit }: { limit?: number }) {
  const [dbServices, setDbServices] = useState<any[]>([]);

  useEffect(() => {
    let active = true;
    getServices().then((data) => {
      if (active && data && data.length > 0) {
        setDbServices(data);
      }
    }).catch(console.error);
    return () => {
      active = false;
    };
  }, []);

  const activeServices = dbServices.length > 0 ? dbServices : fallbackServices;
  const list = limit ? activeServices.slice(0, limit) : activeServices;

  return (
    <section className="py-20 container mx-auto px-6">
      <div className="max-w-2xl mx-auto text-center mb-14">
        <div className="inline-block px-3 py-1 rounded-full bg-accent text-primary text-xs font-semibold uppercase tracking-wider mb-4">
          Our Services
        </div>
        <h2 className="font-display font-bold text-3xl md:text-5xl text-foreground leading-tight">
          Complete Eye Care <span className="text-gradient">Under One Roof</span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          From routine checkups to advanced retina surgery — every service you need, delivered with precision.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {list.map((s, i) => {
          const IconComponent = iconMap[s.iconName] || ScanEye;
          return (
            <motion.div
              key={s.slug || s._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="group relative bg-card rounded-3xl p-6 border border-border shadow-card hover:shadow-elegant hover:-translate-y-1 transition-smooth overflow-hidden"
            >
              <div className={`absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${s.color} opacity-10 group-hover:opacity-20 group-hover:scale-125 transition-smooth`} />
              <div className={`relative h-14 w-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-soft mb-5`}>
                <IconComponent className="h-7 w-7 text-white" strokeWidth={2} />
              </div>
              <h3 className="font-display font-bold text-lg text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              <Link
                to="/services"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-smooth"
              >
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
