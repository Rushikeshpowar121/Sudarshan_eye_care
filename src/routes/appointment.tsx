import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Phone, MessageCircle, CheckCircle2 } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { HOSPITAL } from "@/lib/hospital";
import { services } from "@/components/site/ServicesSection";
import { makeMeta } from "@/lib/seo";

import { saveAppointment } from "@/lib/api.ts";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z.string().trim().regex(/^[+\d][\d\s-]{7,15}$/, "Enter a valid phone"),
  email: z.string().trim().email("Enter a valid email").max(200).optional().or(z.literal("")),
  date: z.string().min(1, "Choose a preferred date"),
  service: z.string().min(1, "Choose a service"),
  message: z.string().max(500).optional().or(z.literal("")),
});
type FormData = z.infer<typeof schema>;

export const Route = createFileRoute("/appointment")({
  head: () => makeMeta({ title: "Book Appointment — Sudharshan Eye Hospital", description: "Book a consultation with Dr. Amit Pawar. Online booking, WhatsApp or call.", path: "/appointment" }),
  component: AppointmentPage,
});

function AppointmentPage() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const waLink = `https://wa.me/${HOSPITAL.phoneRaw.replace("+", "")}?text=Hi%2C%20I%20would%20like%20to%20book%20an%20appointment.`;

  const onSubmit = async (data: FormData) => {
    try {
      const res = await saveAppointment({ data });
      if (res.success) {
        setSent(true);
      } else {
        alert(res.error || "Failed to request appointment. Please try again.");
      }
    } catch (e: any) {
      alert("Failed to submit request: " + (e.message || e));
    }
  };

  return (
    <SiteLayout>
      <div className="bg-soft py-16">
        <div className="container mx-auto px-6 text-center max-w-2xl">
          <div className="inline-block px-3 py-1 rounded-full bg-accent text-primary text-xs font-semibold uppercase tracking-wider mb-4">Appointment</div>
          <h1 className="font-display font-bold text-4xl md:text-6xl text-foreground leading-tight">Book Your <span className="text-gradient">Consultation</span></h1>
          <p className="mt-5 text-muted-foreground">Same-day appointments often available. Choose your preferred date below.</p>
        </div>
      </div>

      <section className="container mx-auto px-6 py-16 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card rounded-3xl p-8 shadow-card border border-border">
          {sent ? (
            <div className="text-center py-12">
              <div className="mx-auto h-16 w-16 rounded-full bg-accent flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display font-bold text-2xl text-foreground">Request received</h3>
              <p className="text-muted-foreground mt-2">Our team will call you shortly to confirm your appointment.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2"><Label>Full Name *</Label><Input className="mt-1.5" {...register("name")} />{errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}</div>
              <div><Label>Phone *</Label><Input className="mt-1.5" {...register("phone")} />{errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}</div>
              <div><Label>Email</Label><Input className="mt-1.5" type="email" {...register("email")} />{errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}</div>
              <div><Label>Preferred Date *</Label><Input className="mt-1.5" type="date" {...register("date")} />{errors.date && <p className="text-xs text-destructive mt-1">{errors.date.message}</p>}</div>
              <div>
                <Label>Service *</Label>
                <select className="mt-1.5 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm" {...register("service")}>
                  <option value="">Select a service</option>
                  {services.map((s) => <option key={s.slug} value={s.title}>{s.title}</option>)}
                </select>
                {errors.service && <p className="text-xs text-destructive mt-1">{errors.service.message}</p>}
              </div>
              <div className="sm:col-span-2"><Label>Message</Label><Textarea rows={4} className="mt-1.5" {...register("message")} /></div>
              <div className="sm:col-span-2">
                <Button type="submit" variant="hero" size="xl" disabled={isSubmitting} className="w-full sm:w-auto">
                  {isSubmitting ? "Submitting..." : "Request Appointment"}
                </Button>
              </div>
            </form>
          )}
        </div>

        <div className="space-y-4">
          <a href={`tel:${HOSPITAL.phoneRaw}`} className="block p-6 rounded-3xl bg-primary-gradient text-primary-foreground shadow-elegant hover:-translate-y-0.5 transition-smooth">
            <Phone className="h-7 w-7 mb-3" />
            <div className="font-display font-bold text-lg">Instant Call</div>
            <div className="text-primary-foreground/80 text-sm mt-1">{HOSPITAL.phone}</div>
          </a>
          <a href={waLink} target="_blank" rel="noreferrer" className="block p-6 rounded-3xl bg-card border border-border shadow-card hover:shadow-elegant transition-smooth">
            <MessageCircle className="h-7 w-7 text-primary mb-3" />
            <div className="font-display font-bold text-lg text-foreground">WhatsApp Booking</div>
            <div className="text-muted-foreground text-sm mt-1">Chat with us on WhatsApp</div>
          </a>
          <div className="p-6 rounded-3xl bg-accent">
            <div className="font-display font-bold text-primary">Working Hours</div>
            <p className="text-sm text-foreground mt-2">{HOSPITAL.hours.weekdays}</p>
            <p className="text-sm text-foreground">{HOSPITAL.hours.sunday}</p>
            <p className="text-xs text-primary mt-3 font-semibold">{HOSPITAL.hours.emergency}</p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
