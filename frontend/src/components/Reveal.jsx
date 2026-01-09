import { useState, useRef, useEffect } from "react";

export default function Reveal({ children, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`
        transition-all duration-1000 ease-[cubic-bezier(.21,1,.22,1)]
        will-change-transform will-change-opacity
        ${visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-[.98]"}
      `}
    >
      {children}
    </div>
  );
}
