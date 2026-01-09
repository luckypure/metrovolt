import { Instagram, Twitter, Facebook, Youtube } from "lucide-react";

export const CONFIG = {
  BRAND: "MetroVolt",
  NAV_LINKS: [
    { label: "Models", href: "#models" },
    { label: "Technology", href: "#technology" },
    { label: "Specs", href: "#comparison" },
    { label: "Support", href: "#faq" },
  ],
  COLORS: {
    indigo: { hex: "#4f46e5", class: "bg-indigo-600" },
    slate: { hex: "#1e293b", class: "bg-slate-800" },
    emerald: { hex: "#10b981", class: "bg-emerald-500" },
    rose: { hex: "#f43f5e", class: "bg-rose-500" },
    blue: { hex: "#3b82f6", class: "bg-blue-500" },
    amber: { hex: "#f59e0b", class: "bg-amber-500" },
    orange: { hex: "#f97316", class: "bg-orange-500" },
  },
  SOCIALS: [
    { icon: Instagram, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Facebook, href: "#" },
    { icon: Youtube, href: "#" },
  ],
};
