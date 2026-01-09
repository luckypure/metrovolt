export default function Button({ children, variant = "primary", className = "", ...props }) {
  const base =
    "px-8 py-4 rounded-2xl font-black tracking-wide flex items-center justify-center gap-2 active:scale-[.97] transition-all duration-300 ease-out shadow-lg";

  const variants = {
    primary: "bg-gradient-to-br from-indigo-600 to-purple-600 text-white hover:shadow-indigo-200 hover:-translate-y-[2px]",
    outline: "border-2 border-slate-300 hover:border-indigo-500 hover:bg-indigo-50",
    dark: "bg-slate-900 text-white hover:bg-indigo-700 hover:shadow-indigo-300",
  };

  return (
    <button {...props} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}
