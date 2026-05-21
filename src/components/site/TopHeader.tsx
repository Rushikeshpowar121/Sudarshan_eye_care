import { Mail, MapPin, Phone, Facebook, Instagram, Twitter, Youtube, Siren } from "lucide-react";
import { HOSPITAL } from "@/lib/hospital";

export function TopHeader() {
  return (
    <div className="hidden md:block bg-primary text-primary-foreground">
      <div className="container mx-auto px-6 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-5">
          <a href={`tel:${HOSPITAL.phoneRaw}`} className="flex items-center gap-1.5 hover:text-primary-glow transition-smooth">
            <Phone className="h-3.5 w-3.5" /> {HOSPITAL.phone}
          </a>
          <a href={`mailto:${HOSPITAL.email}`} className="hidden lg:flex items-center gap-1.5 hover:text-primary-glow transition-smooth">
            <Mail className="h-3.5 w-3.5" /> {HOSPITAL.email}
          </a>
          <span className="hidden lg:flex items-center gap-1.5 opacity-90">
            <MapPin className="h-3.5 w-3.5" /> Kolhapur, Maharashtra
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-primary-glow font-medium">
            <Siren className="h-3.5 w-3.5 animate-pulse" /> 24/7 Emergency
          </span>
          <div className="flex items-center gap-2 opacity-90">
            <a href={HOSPITAL.social.facebook} aria-label="Facebook" className="hover:text-primary-glow transition-smooth"><Facebook className="h-3.5 w-3.5" /></a>
            <a href={HOSPITAL.social.instagram} aria-label="Instagram" className="hover:text-primary-glow transition-smooth"><Instagram className="h-3.5 w-3.5" /></a>
            <a href={HOSPITAL.social.twitter} aria-label="Twitter" className="hover:text-primary-glow transition-smooth"><Twitter className="h-3.5 w-3.5" /></a>
            <a href={HOSPITAL.social.youtube} aria-label="YouTube" className="hover:text-primary-glow transition-smooth"><Youtube className="h-3.5 w-3.5" /></a>
          </div>
        </div>
      </div>
    </div>
  );
}
