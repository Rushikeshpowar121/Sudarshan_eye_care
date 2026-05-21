export const HOSPITAL = {
  name: "Sudharshan Eye Hospital",
  tagline: "Best Retina Eye Care Hospital in Kolhapur",
  doctor: "Dr. Amit Pawar",
  doctorTitle: "MBBS, MS Ophthalmology — Retina Specialist",
  phone: "+91 83295 36910",
  phoneRaw: "+918329536910",
  email: "info@sudharshaneyehospital.com",
  rating: 4.8,
  reviews: 1240,
  experience: 15,
  patients: "25,000+",
  surgeries: "8,500+",
  address: {
    line1: "F8, Waterfront, Phulewadi Rd",
    line2: "Near Rankala D Mart, Opposite Shalini Palace",
    city: "Kolhapur, Maharashtra 416010",
    full: "F8, Waterfront, Phulewadi Rd, Near Rankala D Mart, Opposite Shalini Palace, Kolhapur, Maharashtra 416010",
  },
  hours: {
    weekdays: "Mon – Sat: 10:00 AM – 8:00 PM",
    sunday: "Sunday: 10:00 AM – 1:00 PM",
    emergency: "24/7 Emergency Support",
  },
  social: {
    facebook: "#",
    instagram: "#",
    twitter: "#",
    youtube: "#",
  },
  mapEmbed:
    "https://www.google.com/maps?q=Phulewadi+Rd+Kolhapur+416010&output=embed",
} as const;

export const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/doctors", label: "Doctors" },
  { to: "/gallery", label: "Gallery" },
  { to: "/products", label: "Products" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/contact", label: "Contact" },
] as const;
