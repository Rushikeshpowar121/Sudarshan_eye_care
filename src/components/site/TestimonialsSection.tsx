import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useState, useEffect } from "react";
import { getTestimonials } from "@/lib/api.ts";

export const fallbackTestimonials = [
  { name: "Priya Deshmukh", role: "Retina Treatment", rating: 5, img: "https://i.pravatar.cc/120?img=47", text: "Dr. Amit Pawar saved my vision. His diabetic retinopathy treatment was world-class and the staff made me feel completely at ease." },
  { name: "Ramesh Patil", role: "Cataract Surgery", rating: 5, img: "https://i.pravatar.cc/120?img=12", text: "The cataract surgery was painless and my vision is sharper than it's been in 20 years. Truly the best eye hospital in Kolhapur." },
  { name: "Sneha Kulkarni", role: "LASIK Consultation", rating: 5, img: "https://i.pravatar.cc/120?img=32", text: "Modern equipment, professional doctor, and very friendly nurses. I finally got rid of my glasses thanks to Sudharshan." },
  { name: "Arjun Mali", role: "Pediatric Care", rating: 5, img: "https://i.pravatar.cc/120?img=58", text: "Took my 6-year-old daughter for a squint evaluation. The team was patient, kind, and explained everything clearly." },
  { name: "Lata Joshi", role: "Glaucoma Treatment", rating: 4.8, img: "https://i.pravatar.cc/120?img=49", text: "Regular follow-ups have kept my glaucoma under perfect control. Highly recommend this hospital to anyone in Maharashtra." },
  { name: "Vikram Shinde", role: "Routine Checkup", rating: 5, img: "https://i.pravatar.cc/120?img=15", text: "From booking to consultation everything was smooth. Premium experience without premium pricing." },
];

export function TestimonialsSection({ limit }: { limit?: number }) {
  const [dbTestimonials, setDbTestimonials] = useState<any[]>([]);

  useEffect(() => {
    let active = true;
    getTestimonials().then((data) => {
      if (active && data && data.length > 0) {
        setDbTestimonials(data);
      }
    }).catch(console.error);
    return () => {
      active = false;
    };
  }, []);

  const activeTestimonials = dbTestimonials.length > 0 ? dbTestimonials : fallbackTestimonials;
  const list = limit ? activeTestimonials.slice(0, limit) : activeTestimonials;

  return (
    <section className="py-20 bg-soft">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <div className="inline-block px-3 py-1 rounded-full bg-accent text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            Patient Stories
          </div>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-foreground leading-tight">
            Loved by <span className="text-gradient">Thousands of Patients</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((t, i) => (
            <motion.div
              key={t._id || t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="bg-card rounded-3xl p-7 border border-border shadow-card relative flex flex-col justify-between"
            >
              <div>
                <Quote className="absolute top-5 right-5 h-8 w-8 text-accent" />
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating || 5 }).map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-primary-glow text-primary-glow" />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-5">"{t.review || t.text}"</p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-border mt-auto">
                <img src={t.img || `https://i.pravatar.cc/120?img=${i + 15}`} alt={t.name} className="h-11 w-11 rounded-full object-cover" loading="lazy" />
                <div>
                  <div className="font-display font-semibold text-sm text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role || "Verified Patient"}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
