import { Zap, Activity, Mountain } from "lucide-react";

export const PRODUCTS = [
  {
    id: 1,
    name: "Volt S1",
    tagline: "The Urban Specialist",
    price: 1299,
    specs: { speed: "25km/h", range: "35km", weight: "12kg", motor: "350W" },
    icon: Zap,
    availableColors: ["indigo", "slate", "emerald"],
  },
  {
    id: 2,
    name: "Volt Pro X",
    tagline: "Performance Reimagined",
    price: 1899,
    specs: { speed: "45km/h", range: "60km", weight: "16kg", motor: "750W" },
    icon: Activity,
    availableColors: ["indigo", "rose", "blue"],
  },
  {
    id: 3,
    name: "Terra Volt",
    tagline: "All-Terrain Beast",
    price: 2499,
    specs: { speed: "50km/h", range: "80km", weight: "22kg", motor: "1200W" },
    icon: Mountain,
    availableColors: ["amber", "orange", "slate"],
  },
];
