import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getContent, updateContent } from "../services/contentService";
import { Save, X, Plus, Image as ImageIcon, Home, ArrowLeft } from "lucide-react";

export default function ContentManagement() {
  const [activeSection, setActiveSection] = useState("hero");
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadContent = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getContent(activeSection);
      setContent(data);
    } catch (err) {
      setError("Failed to load content");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeSection]);
  
  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const formData = new FormData(e.target);
      const submitData = {};

      // Process form data
      for (let [key, value] of formData.entries()) {
        if (key.includes("[")) {
          // Handle nested arrays/objects
          const match = key.match(/(\w+)\[(\d+)\]\[(\w+)\]/);
          if (match) {
            const [, arrayName, index, subKey] = match;
            if (!submitData[arrayName]) submitData[arrayName] = [];
            if (!submitData[arrayName][index]) submitData[arrayName][index] = {};
            submitData[arrayName][index][subKey] = value;
          } else {
            const match2 = key.match(/(\w+)\[(\d+)\]/);
            if (match2) {
              const [, arrayName, index] = match2;
              if (!submitData[arrayName]) submitData[arrayName] = [];
              submitData[arrayName][index] = value;
            }
          }
        } else {
          // Skip empty values for optional fields
          if (typeof value === "string" && value.trim() !== "") {
            submitData[key] = value;
          }
        }
      }

      // Clean up empty array items for technology section
      if (submitData.technologyFeatures) {
        submitData.technologyFeatures = submitData.technologyFeatures.filter(
          f => f && (f.title || f.description || f.icon)
        );
      }
      if (submitData.technologyStats) {
        submitData.technologyStats = submitData.technologyStats.filter(
          s => s && (s.value || s.label)
        );
      }

      // Handle file uploads
      const heroImageInput = e.target.querySelector('input[name="heroImage"]');
      if (heroImageInput?.files[0]) {
        submitData.heroImage = heroImageInput.files[0];
      }

      const engineeringImageInput = e.target.querySelector('input[name="engineeringImage"]');
      if (engineeringImageInput?.files[0]) {
        submitData.engineeringImage = engineeringImageInput.files[0];
      }

      const supportImageInput = e.target.querySelector('input[name="supportImage"]');
      if (supportImageInput?.files[0]) {
        submitData.supportImage = supportImageInput.files[0];
      }

      const carouselImagesInput = e.target.querySelector('input[name="carouselImages"]');
      if (carouselImagesInput?.files.length > 0) {
        submitData.carouselImages = Array.from(carouselImagesInput.files);
      }

      await updateContent(activeSection, submitData);
      setSuccess("Content updated successfully!");
      await loadContent();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update content");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-700 font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black mb-2">Content Management</h1>
            <p className="text-slate-600">Manage website content and images</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/admin"
              className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300"
            >
              <ArrowLeft size={18} />
              Back to Admin
            </Link>
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700"
            >
              <Home size={18} />
              Home
            </Link>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {["hero", "metrics", "technology", "engineering", "support"].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                activeSection === section
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-rose-100 border border-rose-300 text-rose-700 rounded-xl">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-emerald-100 border border-emerald-300 text-emerald-700 rounded-xl">
            {success}
          </div>
        )}

        {/* Hero Section Form */}
        {activeSection === "hero" && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
            <h2 className="text-2xl font-black mb-4">Hero Section</h2>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Hero Image
              </label>
              <input
                type="file"
                name="heroImage"
                accept="image/*"
                className="w-full px-4 py-2 border border-slate-300 rounded-xl"
              />
              {content.heroImage && (
                <img
                  src={`http://localhost:5000${content.heroImage}`}
                  alt="Hero"
                  className="mt-2 w-full max-w-md h-48 object-cover rounded-lg"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Tagline
              </label>
              <input
                type="text"
                name="heroTagline"
                defaultValue={content.heroTagline || ""}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                placeholder="Future Mobility"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Title
              </label>
              <input
                type="text"
                name="heroTitle"
                defaultValue={content.heroTitle || ""}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                placeholder="MetroVolt"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Subtitle
              </label>
              <input
                type="text"
                name="heroSubtitle"
                defaultValue={content.heroSubtitle || ""}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                placeholder="Redefining Energy."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Description
              </label>
              <textarea
                name="heroDescription"
                defaultValue={content.heroDescription || ""}
                rows="3"
                className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                placeholder="The next generation of electric performance..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Button 1 Text
                </label>
                <input
                  type="text"
                  name="heroButton1Text"
                  defaultValue={content.heroButton1Text || ""}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                  placeholder="Explore Models"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Button 2 Text
                </label>
                <input
                  type="text"
                  name="heroButton2Text"
                  defaultValue={content.heroButton2Text || ""}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                  placeholder="Technology"
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700"
            >
              <Save size={20} />
              Save Changes
            </button>
          </form>
        )}

        {/* Metrics Section Form */}
        {activeSection === "metrics" && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
            <h2 className="text-2xl font-black mb-4">Metrics Section</h2>
            <p className="text-slate-600 mb-4">Add up to 6 metrics</p>

            {[0, 1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="grid md:grid-cols-3 gap-4 p-4 border rounded-xl">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Label
                  </label>
                  <input
                    type="text"
                    name={`metrics[${index}][label]`}
                    defaultValue={content.metrics?.[index]?.label || ""}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                    placeholder="Top Speed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Value
                  </label>
                  <input
                    type="text"
                    name={`metrics[${index}][value]`}
                    defaultValue={content.metrics?.[index]?.value || ""}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                    placeholder="25 mph"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Icon
                  </label>
                  <input
                    type="text"
                    name={`metrics[${index}][icon]`}
                    defaultValue={content.metrics?.[index]?.icon || ""}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                    placeholder="⚡"
                  />
                </div>
              </div>
            ))}

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700"
            >
              <Save size={20} />
              Save Changes
            </button>
          </form>
        )}

        {/* Technology Section Form */}
        {activeSection === "technology" && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
            <h2 className="text-2xl font-black mb-4">Technology Section</h2>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Technology Image
              </label>
              <input
                type="file"
                name="technologyImage"
                accept="image/*"
                className="w-full px-4 py-2 border border-slate-300 rounded-xl"
              />
              {content.technologyImage && (
                <img
                  src={`http://localhost:5000${content.technologyImage}`}
                  alt="Technology"
                  className="mt-2 w-full max-w-md h-48 object-cover rounded-lg"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Title
              </label>
              <input
                type="text"
                name="technologyTitle"
                defaultValue={content.technologyTitle || ""}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                placeholder="Technology & Innovation"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Subtitle
              </label>
              <input
                type="text"
                name="technologySubtitle"
                defaultValue={content.technologySubtitle || ""}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                placeholder="Cutting-edge engineering meets sustainable mobility"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Description
              </label>
              <textarea
                name="technologyDescription"
                defaultValue={content.technologyDescription || ""}
                rows="3"
                className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                placeholder="Discover the technology that powers MetroVolt."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-4">
                Technology Features (up to 6)
              </label>
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <div key={index} className="grid md:grid-cols-3 gap-4 p-4 border rounded-xl mb-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Icon Name
                    </label>
                    <input
                      type="text"
                      name={`technologyFeatures[${index}][icon]`}
                      defaultValue={content.technologyFeatures?.[index]?.icon || ""}
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                      placeholder="battery, gauge, shield, cpu, settings, zap"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      name={`technologyFeatures[${index}][title]`}
                      defaultValue={content.technologyFeatures?.[index]?.title || ""}
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                      placeholder="Advanced Battery Technology"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      name={`technologyFeatures[${index}][description]`}
                      defaultValue={content.technologyFeatures?.[index]?.description || ""}
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                      placeholder="Lithium-ion battery with smart power management..."
                    />
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-4">
                Statistics (Engineering Excellence section - up to 3)
              </label>
              {[0, 1, 2].map((index) => (
                <div key={index} className="grid md:grid-cols-2 gap-4 p-4 border rounded-xl mb-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Value
                    </label>
                    <input
                      type="text"
                      name={`technologyStats[${index}][value]`}
                      defaultValue={content.technologyStats?.[index]?.value || ""}
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                      placeholder="99%"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Label
                    </label>
                    <input
                      type="text"
                      name={`technologyStats[${index}][label]`}
                      defaultValue={content.technologyStats?.[index]?.label || ""}
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                      placeholder="Customer Satisfaction"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700"
            >
              <Save size={20} />
              Save Changes
            </button>
          </form>
        )}

        {/* Engineering Section Form */}
        {activeSection === "engineering" && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
            <h2 className="text-2xl font-black mb-4">Engineering Section</h2>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Engineering Image
              </label>
              <input
                type="file"
                name="engineeringImage"
                accept="image/*"
                className="w-full px-4 py-2 border border-slate-300 rounded-xl"
              />
              {content.engineeringImage && (
                <img
                  src={`http://localhost:5000${content.engineeringImage}`}
                  alt="Engineering"
                  className="mt-2 w-full max-w-md h-48 object-cover rounded-lg"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Title
              </label>
              <input
                type="text"
                name="engineeringTitle"
                defaultValue={content.engineeringTitle || ""}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                placeholder="Engineering Excellence"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Description
              </label>
              <textarea
                name="engineeringDescription"
                defaultValue={content.engineeringDescription || ""}
                rows="4"
                className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                placeholder="Built with precision and innovation..."
              />
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700"
            >
              <Save size={20} />
              Save Changes
            </button>
          </form>
        )}

        {/* Support Section Form */}
        {activeSection === "support" && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
            <h2 className="text-2xl font-black mb-4">Support Section</h2>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Support Image
              </label>
              <input
                type="file"
                name="supportImage"
                accept="image/*"
                className="w-full px-4 py-2 border border-slate-300 rounded-xl"
              />
              {content.supportImage && (
                <img
                  src={`http://localhost:5000${content.supportImage}`}
                  alt="Support"
                  className="mt-2 w-full max-w-md h-48 object-cover rounded-lg"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Title
              </label>
              <input
                type="text"
                name="supportTitle"
                defaultValue={content.supportTitle || ""}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                placeholder="24/7 Support"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Description
              </label>
              <textarea
                name="supportDescription"
                defaultValue={content.supportDescription || ""}
                rows="4"
                className="w-full px-4 py-2 border border-slate-300 rounded-xl"
                placeholder="We're here to help you every step of the way..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Carousel Images (for home page slider)
              </label>
              <input
                type="file"
                name="carouselImages"
                accept="image/*"
                multiple
                className="w-full px-4 py-2 border border-slate-300 rounded-xl"
              />
              {content.carouselImages && content.carouselImages.length > 0 && (
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {content.carouselImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={`http://localhost:5000${img}`}
                      alt={`Carousel ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700"
            >
              <Save size={20} />
              Save Changes
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
