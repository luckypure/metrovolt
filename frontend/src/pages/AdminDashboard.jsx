import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getScooters, createScooter, updateScooter, deleteScooter } from "../services/scooterService";
import { X, Plus, Edit2, Trash2, Save, Home } from "lucide-react";
import { testBackendConnection } from "../utils/testConnection";

export default function AdminDashboard() {
  const [scooters, setScooters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState({ success: true, message: "" });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    specs: {
      speed: "",
      range: "",
      weight: "",
      motor: ""
    },
    colors: [],
    features: [],
    images: [],
    inStock: true
  });
  const [colorInput, setColorInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const navigate = useNavigate();

  const loadScooters = useCallback(async () => {
    try {
      setLoading(true);
      const data = await retry(async () => getScooters(), 3, 500);
      setScooters(data);
    } catch (err) {
      const msg =
        err.code === "ECONNREFUSED" || err.code === "ERR_NETWORK"
          ? "Cannot connect to backend. Ensure backend is running on port 5000."
          : err.response?.data?.message || "Failed to load scooters";
      setError(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const conn = await testBackendConnection();
      setConnectionStatus(conn);
      await loadScooters();
    })();
  }, [loadScooters]);

  async function retry(fn, attempts = 3, delayMs = 500) {
    let lastErr;
    for (let i = 0; i < attempts; i++) {
      try {
        return await fn();
      } catch (e) {
        lastErr = e;
        await new Promise(res => setTimeout(res, delayMs * (i + 1)));
      }
    }
    throw lastErr;
  }

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      description: "",
      specs: {
        speed: "",
        range: "",
        weight: "",
        motor: ""
      },
      colors: [],
      features: [],
      images: [],
      inStock: true
    });
    setColorInput("");
    setFeatureInput("");
    setImageFiles([]);
    setExistingImages([]);
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  const handleEdit = (scooter) => {
    setFormData({
      name: scooter.name || "",
      price: scooter.price || "",
      description: scooter.description || "",
      specs: {
        speed: scooter.specs?.speed || "",
        range: scooter.specs?.range || "",
        weight: scooter.specs?.weight || "",
        motor: scooter.specs?.motor || ""
      },
      colors: scooter.colors || [],
      features: scooter.features || [],
      images: [],
      inStock: scooter.inStock !== undefined ? scooter.inStock : true
    });
    setExistingImages(scooter.images || []);
    setImageFiles([]);
    setEditingId(scooter._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this scooter?")) {
      return;
    }

    try {
      await deleteScooter(id);
      await loadScooters();
    } catch (err) {
      const msg =
        err.response?.status === 401
          ? "Unauthorized. Please login as admin."
          : err.response?.data?.message || "Failed to delete scooter";
      setError(msg);
      if (err.response?.status === 401) navigate("/login");
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const submitData = {
        ...formData,
        price: Number(formData.price),
        images: imageFiles // Add image files
      };

      if (editingId) {
        await updateScooter(editingId, submitData);
      } else {
        await createScooter(submitData);
      }

      resetForm();
      await loadScooters();
    } catch (err) {
      const msg =
        err.response?.status === 401
          ? "Unauthorized. Please login as admin."
          : err.response?.data?.message || "Failed to save scooter";
      setError(msg);
      if (err.response?.status === 401) navigate("/login");
      console.error(err);
    }
  };

  const addColor = () => {
    if (colorInput.trim() && !formData.colors.includes(colorInput.trim())) {
      setFormData({
        ...formData,
        colors: [...formData.colors, colorInput.trim()]
      });
      setColorInput("");
    }
  };

  const removeColor = (colorToRemove) => {
    setFormData({
      ...formData,
      colors: formData.colors.filter(c => c !== colorToRemove)
    });
  };

  const addFeature = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()]
      });
      setFeatureInput("");
    }
  };

  const removeFeature = (featureToRemove) => {
    setFormData({
      ...formData,
      features: formData.features.filter(f => f !== featureToRemove)
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles([...imageFiles, ...files]);
  };

  const removeImage = (indexToRemove) => {
    setImageFiles(imageFiles.filter((_, index) => index !== indexToRemove));
  };

  const removeExistingImage = (imageToRemove) => {
    setExistingImages(existingImages.filter(img => img !== imageToRemove));
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
        {connectionStatus && !connectionStatus.success && (
          <div className="mb-6 p-4 bg-rose-100 border border-rose-300 text-rose-700 rounded-xl">
            {connectionStatus.message} Make sure backend is running on http://localhost:5000
          </div>
        )}
        {/* Header */}
        <div className="mb-8 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-black mb-2">Admin Dashboard</h1>
            <p className="text-slate-600">Manage your scooter inventory</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/admin/content"
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700"
            >
              Content Management
            </Link>
            <Link
              to="/"
              className="flex items-center gap-2 px-6 py-3 bg-slate-600 text-white rounded-xl font-bold hover:bg-slate-700"
            >
              <Home size={18} />
              Home
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-rose-100 border border-rose-300 text-rose-700 rounded-xl">
            {error}
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div className="mb-8 bg-white rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black">
                {editingId ? "Edit Scooter" : "Add New Scooter"}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="3"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Speed
                  </label>
                  <input
                    type="text"
                    value={formData.specs.speed}
                    onChange={(e) => setFormData({
                      ...formData,
                      specs: { ...formData.specs, speed: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., 25 mph"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Range
                  </label>
                  <input
                    type="text"
                    value={formData.specs.range}
                    onChange={(e) => setFormData({
                      ...formData,
                      specs: { ...formData.specs, range: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., 30 miles"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Weight
                  </label>
                  <input
                    type="text"
                    value={formData.specs.weight}
                    onChange={(e) => setFormData({
                      ...formData,
                      specs: { ...formData.specs, weight: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., 25 lbs"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Motor
                  </label>
                  <input
                    type="text"
                    value={formData.specs.motor}
                    onChange={(e) => setFormData({
                      ...formData,
                      specs: { ...formData.specs, motor: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., 500W"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {imageFiles.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {imageFiles.map((file, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${idx + 1}`}
                          className="w-20 h-20 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {existingImages.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-slate-600 mb-2">Existing Images:</p>
                    <div className="flex flex-wrap gap-2">
                      {existingImages.map((img, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={`http://localhost:5000${img}`}
                            alt={`Existing ${idx + 1}`}
                            className="w-20 h-20 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(img)}
                            className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Features
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter feature (e.g., GPS Tracking)"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-3 py-1 bg-indigo-100 rounded-lg"
                    >
                      <span className="text-sm">{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(feature)}
                        className="text-rose-500 hover:text-rose-700"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Colors
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addColor())}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter color (hex code or name)"
                  />
                  <button
                    type="button"
                    onClick={addColor}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg"
                    >
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ background: color }}
                      />
                      <span className="text-sm">{color}</span>
                      <button
                        type="button"
                        onClick={() => removeColor(color)}
                        className="text-rose-500 hover:text-rose-700"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="inStock" className="text-sm font-bold text-slate-700">
                  In Stock
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700"
                >
                  <Save size={20} />
                  {editingId ? "Update Scooter" : "Create Scooter"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Scooters Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Scooter Inventory</h2>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700"
              >
                <Plus size={20} />
                Add Scooter
              </button>
            )}
          </div>

          {scooters.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <p className="text-lg">No scooters found.</p>
              <p className="text-sm mt-2">Click "Add Scooter" to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900 text-white">
                  <tr>
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Price</th>
                    <th className="p-4 text-left">Specs</th>
                    <th className="p-4 text-left">Colors</th>
                    <th className="p-4 text-left">Stock</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {scooters.map((scooter) => (
                    <tr key={scooter._id} className="border-t hover:bg-slate-50">
                      <td className="p-4 font-bold">{scooter.name}</td>
                      <td className="p-4">${scooter.price}</td>
                      <td className="p-4 text-sm text-slate-600">
                        <div>Speed: {scooter.specs?.speed || "N/A"}</div>
                        <div>Range: {scooter.specs?.range || "N/A"}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          {scooter.colors?.slice(0, 3).map((color, idx) => (
                            <div
                              key={idx}
                              className="w-6 h-6 rounded-full border"
                              style={{ background: color }}
                              title={color}
                            />
                          ))}
                          {scooter.colors?.length > 3 && (
                            <span className="text-xs text-slate-500">+{scooter.colors.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            scooter.inStock
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {scooter.inStock ? "Available" : "Out of Stock"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(scooter)}
                            className="p-2 bg-slate-200 hover:bg-slate-300 rounded-lg"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(scooter._id)}
                            className="p-2 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
