import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

export const products = [
  { name: "Designer Spectacle Frames", price: "₹1,499", category: "Frames", desc: "Premium acetate and titanium designer frames.", img: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80" },
  { name: "UV-Protected Sunglasses", price: "₹2,299", category: "Sunglasses", desc: "100% UV-A & UV-B protection. Polarised options.", img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80" },
  { name: "Soft Contact Lenses", price: "₹899", category: "Lenses", desc: "Daily, monthly and toric options. Expert fitting.", img: "https://images.unsplash.com/photo-1587400416143-fd03c1f56f08?auto=format&fit=crop&w=800&q=80" },
  { name: "Computer / Blue Cut Glasses", price: "₹1,199", category: "Lenses", desc: "Reduces eye strain from screens. Anti-glare coating.", img: "https://images.unsplash.com/photo-1633621641966-23836fcafd7b?auto=format&fit=crop&w=800&q=80" },
  { name: "Photochromic Lenses", price: "₹2,799", category: "Lenses", desc: "Auto-darkening lenses that adapt to sunlight.", img: "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&w=800&q=80" },
  { name: "Kids' Eyewear", price: "₹999", category: "Frames", desc: "Durable, flexible frames designed for active kids.", img: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80" },
];

export function ProductsSection({ limit }: { limit?: number }) {
  const list = limit ? products.slice(0, limit) : products;
  return (
    <section className="py-20 container mx-auto px-6">
      <div className="max-w-2xl mx-auto text-center mb-14">
        <div className="inline-block px-3 py-1 rounded-full bg-accent text-primary text-xs font-semibold uppercase tracking-wider mb-4">
          Optical Store
        </div>
        <h2 className="font-display font-bold text-3xl md:text-5xl text-foreground leading-tight">
          Premium Eyewear, <span className="text-gradient">Curated In-House</span>
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.05 }}
            className="group bg-card rounded-3xl overflow-hidden border border-border shadow-card hover:shadow-elegant transition-smooth"
          >
            <div className="aspect-[4/3] overflow-hidden bg-accent">
              <img src={p.img} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-smooth" />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-primary uppercase tracking-wider bg-accent px-2 py-0.5 rounded-full">{p.category}</span>
                <span className="font-display font-bold text-primary">{p.price}</span>
              </div>
              <h3 className="font-display font-bold text-base text-foreground mb-1.5">{p.name}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">{p.desc}</p>
              <button className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-accent text-primary text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-smooth">
                <ShoppingBag className="h-4 w-4" /> Enquire
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
