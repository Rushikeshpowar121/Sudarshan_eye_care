import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import receptionImg from "@/assets/hospital-reception.jpg";
import retinaImg from "@/assets/retina-scan.jpg";
import opticalImg from "@/assets/optical-store.jpg";
import surgeryImg from "@/assets/eye-surgery.jpg";
import checkupImg from "@/assets/eye-checkup.jpg";
import heroImg from "@/assets/hero-eye.jpg";
import { getGalleryItems } from "@/lib/api.ts";

type Item = { src: string; alt: string; category: "Hospital" | "Equipment" | "Surgery" | "Optical" };

const items: Item[] = [
  { src: receptionImg, alt: "Hospital reception", category: "Hospital" },
  { src: retinaImg, alt: "Retina scan room", category: "Equipment" },
  { src: opticalImg, alt: "Optical store interior", category: "Optical" },
  { src: surgeryImg, alt: "Operation theater", category: "Surgery" },
  { src: checkupImg, alt: "Eye examination", category: "Equipment" },
  { src: heroImg, alt: "Retina imaging", category: "Equipment" },
  { src: receptionImg, alt: "Waiting area", category: "Hospital" },
  { src: surgeryImg, alt: "Microsurgery in progress", category: "Surgery" },
  { src: opticalImg, alt: "Designer eyewear display", category: "Optical" },
  { src: checkupImg, alt: "Pre-op consultation", category: "Hospital" },
  { src: retinaImg, alt: "OCT scanner", category: "Equipment" },
  { src: heroImg, alt: "Patient discharge", category: "Hospital" },
];

const categories = ["All", "Hospital", "Equipment", "Surgery", "Optical"] as const;

export function GalleryGrid() {
  const [dbItems, setDbItems] = useState<any[]>([]);
  const [filter, setFilter] = useState<(typeof categories)[number]>("All");
  const [lightbox, setLightbox] = useState<Item | null>(null);

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

  const activeItems = dbItems.length > 0 ? dbItems : items;
  const list = filter === "All" ? activeItems : activeItems.filter((i) => i.category === filter);

  return (
    <section className="py-16 container mx-auto px-6">
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-smooth ${filter === c
                ? "bg-primary-gradient text-primary-foreground shadow-elegant"
                : "bg-accent text-primary hover:bg-primary/10"
              }`}
          >
            {c}
          </button>
        ))}
      </div>

      <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <AnimatePresence>
          {list.map((item, i) => (
            <motion.button
              key={`${item.alt}-${i}`}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onClick={() => setLightbox(item)}
              className="relative group overflow-hidden rounded-2xl aspect-square shadow-card"
            >
              <img src={item.src} alt={item.alt} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-smooth duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/0 to-transparent opacity-0 group-hover:opacity-100 transition-smooth flex items-end p-3">
                <div>
                  <div className="text-[10px] text-primary-foreground/80 uppercase tracking-wider">{item.category}</div>
                  <div className="text-primary-foreground text-sm font-semibold">{item.alt}</div>
                </div>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-50 bg-foreground/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <button onClick={() => setLightbox(null)} className="absolute top-6 right-6 h-10 w-10 rounded-full bg-card flex items-center justify-center shadow-elegant">
              <X className="h-5 w-5" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={lightbox.src}
              alt={lightbox.alt}
              className="max-h-[85vh] max-w-full rounded-3xl shadow-elegant"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
