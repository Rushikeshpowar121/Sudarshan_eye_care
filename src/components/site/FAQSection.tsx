import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Do I need a referral to see Dr. Amit Pawar?", a: "No referral is required. You can book directly through our website, by phone, or walk in during clinic hours." },
  { q: "How long does cataract surgery take?", a: "The procedure itself takes 15–20 minutes. You can typically return home the same day and resume light activities within 24 hours." },
  { q: "Is retina surgery painful?", a: "No. Modern vitreo-retinal surgery is done under local or topical anaesthesia. Most patients experience only mild discomfort during recovery." },
  { q: "Do you accept health insurance?", a: "Yes — we are empanelled with most major insurance providers and offer cashless treatment. Our team will guide you through the paperwork." },
  { q: "How often should I get my eyes checked?", a: "Adults: once every 2 years. Diabetics, people over 40, or those with a family history of eye disease: annually." },
  { q: "Can children get LASIK?", a: "LASIK is generally recommended only after 18 years of age, once the eye prescription has stabilised. We'll evaluate suitability during consultation." },
];

export function FAQSection() {
  return (
    <section className="py-20 container mx-auto px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 rounded-full bg-accent text-primary text-xs font-semibold uppercase tracking-wider mb-4">FAQ</div>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-foreground leading-tight">
            Common <span className="text-gradient">Questions</span>
          </h2>
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`f-${i}`} className="bg-card border border-border rounded-2xl px-5 shadow-card data-[state=open]:shadow-elegant transition-smooth">
              <AccordionTrigger className="text-left font-display font-semibold text-foreground hover:no-underline py-5">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-5">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
