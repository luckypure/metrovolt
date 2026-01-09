import { useEffect, useState } from "react";
import Reveal from "./Reveal";
import { getContent } from "../services/contentService";
import { Zap, Battery, Gauge, Shield, Cpu, Settings } from "lucide-react";

const iconMap = {
  battery: Battery,
  gauge: Gauge,
  shield: Shield,
  cpu: Cpu,
  settings: Settings,
  zap: Zap
};

export default function Technology() {
  const [content, setContent] = useState({
    technologyTitle: "Technology & Innovation",
    technologySubtitle: "Cutting-edge engineering meets sustainable mobility",
    technologyDescription: "Discover the technology that powers MetroVolt.",
    technologyFeatures: [],
    technologyStats: [],
    metrics: []
  });

  useEffect(() => {
    async function loadContent() {
      try {
        const [techData, metricsData] = await Promise.all([
          getContent("technology"),
          getContent("metrics")
        ]);

        if (techData) {
          setContent(prev => ({ ...prev, ...techData }));
        }
        if (metricsData && metricsData.metrics) {
          setContent(prev => ({ ...prev, metrics: metricsData.metrics }));
        }
      } catch (err) {
        console.error("Failed to load technology content:", err);
      }
    }
    loadContent();
  }, []);

  // Default features if none in CMS
  const defaultFeatures = [
    {
      icon: "battery",
      title: "Advanced Battery Technology",
      description: "Lithium-ion battery with smart power management system for optimal performance and longevity."
    },
    {
      icon: "gauge",
      title: "Precision Motor Control",
      description: "High-torque brushless motor with intelligent speed control and regenerative braking."
    },
    {
      icon: "shield",
      title: "Safety First",
      description: "Advanced safety features including anti-lock braking, LED lighting, and impact-resistant frame."
    },
    {
      icon: "cpu",
      title: "Smart Connectivity",
      description: "Integrated app connectivity for GPS tracking, ride analytics, and remote diagnostics."
    },
    {
      icon: "settings",
      title: "Adaptive Performance",
      description: "AI-powered performance optimization that adapts to your riding style and terrain."
    },
    {
      icon: "zap",
      title: "Rapid Charging",
      description: "Fast-charge technology that gets you back on the road in under 4 hours."
    }
  ];

  const techFeatures = content.technologyFeatures && content.technologyFeatures.length > 0
    ? content.technologyFeatures
    : defaultFeatures;

  const defaultStats = [
    { value: "99%", label: "Customer Satisfaction" },
    { value: "5 Years", label: "Warranty Coverage" },
    { value: "24/7", label: "Technical Support" }
  ];

  const stats = content.technologyStats && content.technologyStats.length > 0
    ? content.technologyStats
    : defaultStats;

  return (
    <section id="technology" className="py-32 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4">
              {content.technologyTitle || "Technology & Innovation"}
            </h2>
            {content.technologySubtitle && (
              <p className="text-slate-600 text-lg max-w-2xl mx-auto mb-4">
                {content.technologySubtitle}
              </p>
            )}
            {content.technologyDescription && (
              <p className="text-slate-500 text-base max-w-2xl mx-auto">
                {content.technologyDescription}
              </p>
            )}
            {content.technologyImage && (
              <div className="mt-8">
                <img
                  src={`http://localhost:5000${content.technologyImage}`}
                  alt="Technology"
                  className="w-full max-w-4xl mx-auto rounded-2xl shadow-2xl"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>
        </Reveal>

        {/* Key Metrics */}
        {content.metrics && content.metrics.length > 0 && (
          <Reveal delay={100}>
            <div className="grid md:grid-cols-3 gap-6 mb-20">
              {content.metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="bg-white p-8 rounded-2xl shadow-xl text-center border border-slate-100"
                >
                  <div className="text-4xl mb-4">{metric.icon}</div>
                  <div className="text-3xl font-black text-indigo-600 mb-2">
                    {metric.value}
                  </div>
                  <div className="text-slate-600 font-bold">{metric.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {/* Technology Features */}
        <Reveal delay={200}>
          <h3 className="text-3xl font-black text-center mb-12">Core Technologies</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {techFeatures.map((feature, idx) => {
              const IconComponent = iconMap[feature.icon?.toLowerCase()] || Zap;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100"
                >
                  <div className="text-indigo-600 mb-4">
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-black mb-3">{feature.title}</h4>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* Engineering Excellence */}
        {stats.length > 0 && (
          <Reveal delay={300}>
            <div className="mt-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-white">
              <div className="max-w-4xl mx-auto text-center">
                <h3 className="text-4xl font-black mb-6">Engineering Excellence</h3>
                <p className="text-lg text-indigo-100 mb-8">
                  Every MetroVolt scooter is engineered with precision, tested for reliability, 
                  and designed for the future of urban mobility. Our commitment to innovation 
                  drives us to push the boundaries of electric vehicle technology.
                </p>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  {stats.map((stat, idx) => (
                    <div key={idx}>
                      <div className="text-3xl font-black mb-2">{stat.value}</div>
                      <div className="text-indigo-100">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
