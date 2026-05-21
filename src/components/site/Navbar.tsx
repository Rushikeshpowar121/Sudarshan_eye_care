import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, Menu, X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HOSPITAL, NAV_LINKS } from "@/lib/hospital";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-smooth",
        scrolled ? "glass shadow-soft" : "bg-background/80 backdrop-blur-sm"
      )}
    >
      <div className="container mx-auto px-6 h-18 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="h-11 w-11 rounded-2xl bg-primary-gradient flex items-center justify-center shadow-elegant group-hover:scale-105 transition-smooth">
              <Eye className="h-6 w-6 text-primary-foreground" strokeWidth={2.2} />
            </div>
            <div className="absolute -inset-1 rounded-2xl bg-primary-glow/30 blur-md opacity-0 group-hover:opacity-100 transition-smooth -z-10" />
          </div>
          <div className="leading-tight">
            <div className="font-display font-bold text-base text-foreground">{HOSPITAL.name}</div>
            <div className="text-[10.5px] text-muted-foreground font-medium tracking-wide uppercase">Retina & Eye Care</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((l) => {
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "px-3.5 py-2 rounded-full text-sm font-medium transition-smooth",
                  active
                    ? "bg-accent text-primary"
                    : "text-foreground/75 hover:text-primary hover:bg-accent/60"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="hero" size="lg" className="hidden sm:inline-flex">
            <Link to="/appointment">
              <Calendar className="h-4 w-4" /> Book Appointment
            </Link>
          </Button>
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-accent text-foreground/80"
              >
                {l.label}
              </Link>
            ))}
            <Button asChild variant="hero" className="mt-2 sm:hidden">
              <Link to="/appointment"><Calendar className="h-4 w-4" /> Book Appointment</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
