import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import receptionImg from "@/assets/hospital-reception.jpg";
import retinaImg from "@/assets/retina-scan.jpg";
import opticalImg from "@/assets/optical-store.jpg";
import surgeryImg from "@/assets/eye-surgery.jpg";
import checkupImg from "@/assets/eye-checkup.jpg";
import heroImg from "@/assets/hero-eye.jpg";
import { useState, useEffect } from "react";
import { getGalleryItems } from "@/lib/api.ts";

export const fallbackGalleryItems = [
  { src: receptionImg, alt: "Hospital reception", span: "row-span-2" },
  { src: retinaImg, alt: "Retina scan room", span: "" },
  { src: opticalImg, alt: "Optical store", span: "" },
  { src: surgeryImg, alt: "Operation theater", span: "row-span-2" },
  { src: checkupImg, alt: "Eye examination", span: "" },
  { src: heroImg, alt: "Retina imaging", span: "" },
];

export function GalleryPreview() {
  const [dbItems, setDbItems] = useState<any[]>([]);

  useEffect(() => {
    let active = true;
    getGalleryItems().then((data) => {
      if (active && data && data.length > 0) {
        setDbItems(data);
      }
    }).catch(console.error);
    return () => {
      active = false;
    };
  }, []);

  const activeItems = dbItems.length > 0 ? dbItems : fallbackGalleryItems;

  return (
    <section className="py-20 container mx-auto px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-xl">
          <div className="inline-block px-3 py-1 rounded-full bg-accent text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            Gallery
          </div>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-foreground leading-tight">
            Inside <span className="text-gradient">Our Hospital</span>
          </h2>
        </div>
        <Link to="/gallery" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-smooth">
          View full gallery <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[220px] gap-3">
        {activeItems.slice(0, 6).map((item, i) => (
          <motion.div
            key={item._id || i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className={`relative overflow-hidden rounded-3xl group shadow-card ${item.span || ""}`}
          >
            <img src={item.src} alt={item.alt} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-smooth duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/0 to-transparent opacity-0 group-hover:opacity-100 transition-smooth flex items-end p-4">
              <span className="text-primary-foreground text-sm font-semibold">{item.alt}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
