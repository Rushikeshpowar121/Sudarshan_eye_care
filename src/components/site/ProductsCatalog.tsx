import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Star } from "lucide-react";
import { products } from "./ProductsSection";

const categories = ["All", "Frames", "Sunglasses", "Lenses"] as const;
const brands = ["Ray-Ban", "Oakley", "Vogue", "Titan Eye+", "Carrera", "Fastrack", "Bausch + Lomb", "Johnson & Johnson"];

export function ProductsCatalog() {
  const [filter, setFilter] = useState<(typeof categories)[number]>("All");
  const list = useMemo(() => filter === "All" ? products : products.filter((p) => p.category === filter), [filter]);

  return (
    <>
      <section className="py-16 container mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-smooth ${
                filter === c
                  ? "bg-primary-gradient text-primary-foreground shadow-elegant"
                  : "bg-accent text-primary hover:bg-primary/10"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {list.map((p, i) => (
              <motion.div
                key={p.name}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                className="group bg-card rounded-3xl overflow-hidden border border-border shadow-card hover:shadow-elegant transition-smooth"
              >
                <div className="aspect-[4/3] overflow-hidden bg-accent relative">
                  <img src={p.img} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-smooth" />
                  <div className="absolute top-3 left-3 flex items-center gap-1 bg-card/95 backdrop-blur px-2.5 py-1 rounded-full text-xs font-semibold shadow-soft">
                    <Star className="h-3 w-3 fill-primary-glow text-primary-glow" />
                    4.{8 - (i % 3)}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-primary uppercase tracking-wider bg-accent px-2 py-0.5 rounded-full">{p.category}</span>
                    <span className="font-display font-bold text-primary">{p.price}</span>
                  </div>
                  <h3 className="font-display font-bold text-base text-foreground mb-1.5">{p.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">{p.desc}</p>
                  <button className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-primary-gradient text-primary-foreground text-sm font-semibold hover:opacity-90 transition-smooth shadow-soft">
                    <ShoppingBag className="h-4 w-4" /> Enquire In-store
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      <section className="py-16 bg-soft">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-block px-3 py-1 rounded-full bg-accent text-primary text-xs font-semibold uppercase tracking-wider mb-4">Trusted Brands</div>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-8">We stock only authentic international and premium Indian brands</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {brands.map((b) => (
              <span key={b} className="px-5 py-2.5 bg-card rounded-full border border-border shadow-card text-sm font-display font-semibold text-foreground">{b}</span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
