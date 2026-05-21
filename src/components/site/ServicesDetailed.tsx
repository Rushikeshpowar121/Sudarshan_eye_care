import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getServices } from "@/lib/api.ts";
import { fallbackServices } from "./ServicesSection";
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
  Stethoscope
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

const details: Record<string, string[]> = {
  retina: ["Diabetic retinopathy screening & laser", "Anti-VEGF intra-vitreal injections", "Macular degeneration management", "Retinal detachment surgery (vitrectomy)"],
  cataract: ["Bladeless phaco-emulsification", "Premium monofocal, toric & multifocal IOLs", "Same-day discharge", "Quick visual recovery in 24 hrs"],
  lasik: ["Pre-LASIK suitability testing", "Bladeless blade-free options", "Topography-guided correction", "Lifelong post-op care"],
  pediatric: ["Squint evaluation & surgery", "Amblyopia (lazy eye) therapy", "Refractive correction for kids", "Pediatric-friendly clinical environment"],
  glaucoma: ["Tonometry & perimetry testing", "Medical management", "Laser trabeculoplasty", "Long-term monitoring program"],
  checkup: ["Visual acuity & refraction", "Slit-lamp examination", "Fundus & retina screening", "Intra-ocular pressure measurement"],
  "contact-lens": ["Soft, RGP, toric & multifocal", "Trial fitting & training", "Care kit & follow-ups", "Color contact lenses"],
  optical: ["Designer international brands", "Premium high-index lenses", "Photochromic & blue-cut options", "Expert frame selection"],
  "diabetic-retina": ["Annual diabetic eye screening", "Personalised treatment roadmap", "Coordination with your physician", "Lifestyle counselling"],
  "vision-testing": ["Auto-refraction & cycloplegic refraction", "Spectacle prescription", "Color vision testing", "Stereo acuity tests"],
};

export function ServicesDetailed() {
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

  return (
    <section className="py-20 container mx-auto px-6">
      <div className="max-w-2xl mx-auto text-center mb-14">
        <div className="inline-block px-3 py-1 rounded-full bg-accent text-primary text-xs font-semibold uppercase tracking-wider mb-4">In Detail</div>
        <h2 className="font-display font-bold text-3xl md:text-5xl text-foreground leading-tight">
          What's Included <span className="text-gradient">In Each Service</span>
        </h2>
      </div>

      <div className="space-y-5">
        {activeServices.map((s, i) => {
          const IconComponent = iconMap[s.iconName] || ScanEye;
          const bullets = details[s.slug] || [
            "Advanced diagnostic evaluation",
            "Comprehensive treatment roadmap",
            "Compassionate care by specialists",
            "Follow-up scheduling & counseling"
          ];
          return (
            <motion.div
              key={s.slug || s._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
              className="group grid md:grid-cols-[auto_1fr] gap-6 items-start bg-card rounded-3xl p-6 md:p-8 border border-border shadow-card hover:shadow-elegant transition-smooth"
            >
              <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${s.color || "from-blue-500 to-cyan-500"} flex items-center justify-center shadow-soft shrink-0`}>
                <IconComponent className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl md:text-2xl text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{s.desc}</p>
                <div className="mt-4 grid sm:grid-cols-2 gap-2">
                  {bullets.map((d) => (
                    <div key={d} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
