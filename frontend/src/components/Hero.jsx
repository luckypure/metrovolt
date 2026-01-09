import { useEffect, useState } from "react";
import Button from "./Button";
import Reveal from "./Reveal";
import { getContent } from "../services/contentService";

export default function Hero() {
  const [content, setContent] = useState({
    heroTagline: "Future Mobility",
    heroTitle: "MetroVolt",
    heroSubtitle: "Redefining Energy.",
    heroDescription: "The next generation of electric performance. Built with precision. Engineered for the modern world.",
    heroButton1Text: "Explore Models",
    heroButton2Text: "Technology",
    heroImage: null
  });

  useEffect(() => {
    async function loadContent() {
      try {
        const data = await getContent("hero");
        if (data) {
          setContent(prev => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error("Failed to load hero content:", err);
      }
    }
    loadContent();
  }, []);

  return (
    <section className="relative pt-32 pb-24 min-h-screen overflow-hidden bg-gradient-to-b from-white via-indigo-50 to-white">

      {/* GLOW BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-96 h-96 bg-indigo-300 opacity-20 blur-[120px] top-10 left-10"></div>
        <div className="absolute w-[500px] h-[500px] bg-purple-300 opacity-20 blur-[150px] bottom-0 right-0"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">

        {/* TEXT */}
        <div className="space-y-10">
          <Reveal delay={100}>
            <span className="uppercase text-xs font-black px-4 py-2 bg-white/70 rounded-full shadow">
              {content.heroTagline}
            </span>
          </Reveal>

          <Reveal delay={200}>
            <h1 className="text-7xl font-black tracking-tight leading-tight">
              {content.heroTitle}
              <span className="text-indigo-600 block">
                {content.heroSubtitle}
              </span>
            </h1>
          </Reveal>

          <Reveal delay={300}>
            <p className="text-slate-500 text-lg max-w-lg">
              {content.heroDescription}
            </p>
          </Reveal>

          <Reveal delay={400}>
            <div className="flex gap-5">
              <Button
                onClick={() => {
                  const element = document.getElementById("models");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                {content.heroButton1Text}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const element = document.getElementById("technology");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                {content.heroButton2Text}
              </Button>
            </div>
          </Reveal>
        </div>

        {/* SCOOTER VISUAL */}
        <Reveal delay={300}>
          <div className="float bg-white rounded-3xl shadow-2xl p-10">
            {content.heroImage ? (
              <img
                src={`http://localhost:5000${content.heroImage}`}
                alt="Hero"
                className="w-full h-64 object-cover rounded-2xl"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "block";
                }}
              />
            ) : null}
            <div
              className={`w-full h-64 bg-indigo-200 rounded-2xl ${content.heroImage ? "hidden" : ""}`}
            ></div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
