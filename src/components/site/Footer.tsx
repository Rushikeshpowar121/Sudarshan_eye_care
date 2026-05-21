import { Link } from "@tanstack/react-router";
import { Eye, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { HOSPITAL, NAV_LINKS } from "@/lib/hospital";

const services = [
  "Retina Treatment", "Cataract Surgery", "LASIK Consultation",
  "Glaucoma Treatment", "Pediatric Eye Care", "Diabetic Retina Care",
];

export function Footer() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground mt-20">
      <div className="container mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-11 w-11 rounded-2xl bg-primary-glow/20 border border-primary-glow/30 flex items-center justify-center">
              <Eye className="h-6 w-6 text-primary-glow" />
            </div>
            <div className="font-display font-bold text-lg">{HOSPITAL.name}</div>
          </div>
          <p className="text-sm text-sidebar-foreground/70 leading-relaxed">
            Premium retina & comprehensive eye care in Kolhapur. Trusted by thousands of patients across Maharashtra.
          </p>
          <div className="flex gap-3 mt-5">
            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="h-9 w-9 rounded-full bg-sidebar-accent flex items-center justify-center hover:bg-primary-glow hover:text-sidebar-primary-foreground transition-smooth">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold text-base mb-4 text-primary-glow">Quick Links</h4>
          <ul className="space-y-2.5 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-sidebar-foreground/75 hover:text-primary-glow transition-smooth">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-base mb-4 text-primary-glow">Services</h4>
          <ul className="space-y-2.5 text-sm">
            {services.map((s) => (
              <li key={s}>
                <Link to="/services" className="text-sidebar-foreground/75 hover:text-primary-glow transition-smooth">{s}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-base mb-4 text-primary-glow">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2.5"><MapPin className="h-4 w-4 text-primary-glow shrink-0 mt-0.5" /><span className="text-sidebar-foreground/75">{HOSPITAL.address.full}</span></li>
            <li><a href={`tel:${HOSPITAL.phoneRaw}`} className="flex gap-2.5 text-sidebar-foreground/75 hover:text-primary-glow transition-smooth"><Phone className="h-4 w-4 text-primary-glow shrink-0 mt-0.5" /> {HOSPITAL.phone}</a></li>
            <li><a href={`mailto:${HOSPITAL.email}`} className="flex gap-2.5 text-sidebar-foreground/75 hover:text-primary-glow transition-smooth"><Mail className="h-4 w-4 text-primary-glow shrink-0 mt-0.5" /> {HOSPITAL.email}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-sidebar-border/40">
        <div className="container mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between text-xs text-sidebar-foreground/60 gap-2">
          <p>© {new Date().getFullYear()} {HOSPITAL.name}. All rights reserved.</p>
          <p>Designed for excellence in eye care.</p>
        </div>
      </div>
    </footer>
  );
}
