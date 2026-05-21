import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { HOSPITAL } from "@/lib/hospital";
import { makeMeta } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => makeMeta({ title: "Contact — Sudharshan Eye Hospital", description: "Visit, call or message us. Located opposite Shalini Palace, Kolhapur.", path: "/contact" }),
  component: ContactPage,
});

function ContactPage() {
  const items = [
    { Icon: Phone, label: "Phone", value: HOSPITAL.phone, href: `tel:${HOSPITAL.phoneRaw}` },
    { Icon: Mail, label: "Email", value: HOSPITAL.email, href: `mailto:${HOSPITAL.email}` },
    { Icon: MapPin, label: "Address", value: HOSPITAL.address.full },
    { Icon: Clock, label: "Hours", value: `${HOSPITAL.hours.weekdays} · ${HOSPITAL.hours.sunday}` },
  ];
  return (
    <SiteLayout>
      <div className="bg-soft py-16">
        <div className="container mx-auto px-6 text-center max-w-2xl">
          <div className="inline-block px-3 py-1 rounded-full bg-accent text-primary text-xs font-semibold uppercase tracking-wider mb-4">Contact</div>
          <h1 className="font-display font-bold text-4xl md:text-6xl text-foreground leading-tight">Get in <span className="text-gradient">Touch</span></h1>
        </div>
      </div>
      <section className="container mx-auto px-6 py-16 grid lg:grid-cols-2 gap-10 items-start">
        <div className="space-y-4">
          {items.map(({ Icon, label, value, href }) => (
            <a key={label} href={href} className="flex gap-4 p-5 rounded-3xl bg-card border border-border shadow-card hover:shadow-elegant transition-smooth">
              <div className="h-12 w-12 rounded-2xl bg-primary-gradient flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <div className="text-xs uppercase font-semibold text-primary tracking-wider">{label}</div>
                <div className="text-sm text-foreground mt-1">{value}</div>
              </div>
            </a>
          ))}
        </div>
        <div className="rounded-3xl overflow-hidden shadow-elegant border border-border aspect-square lg:aspect-auto lg:h-full min-h-[420px]">
          <iframe src={HOSPITAL.mapEmbed} className="w-full h-full" title="Hospital location" loading="lazy" />
        </div>
      </section>
    </SiteLayout>
  );
}
