import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { loginUser, registerUser } from "../services/authService";
import { sendOTP, verifyOTP } from "../services/otpService";
import { Zap, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { CONFIG } from "../data/config";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1); // 1 email → 2 otp → 3 password
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    otp: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo || "/";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
    setSuccess("");
  };

  // ================= SEND OTP =================
  const handleSendOTP = async () => {
    if (!formData.email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await sendOTP(formData.email);

      if (response.otp) {
        setSuccess(`OTP sent! (Dev Mode) Your OTP: ${response.otp}`);
        console.log("OTP:", response.otp);
      } else {
        setSuccess("OTP sent to your email! Please check your inbox.");
      }

      setStep(2);   // ⭐ GO TO OTP SCREEN ⭐

      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ================= VERIFY OTP =================
  const handleVerifyOTP = async () => {
    if (!formData.otp || formData.otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await verifyOTP(formData.email, formData.otp);

      setOtpVerified(true);
      setSuccess("Email verified successfully!");

      setStep(3);   // ⭐ GO TO PASSWORD STEP ⭐

    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ================= SUBMIT LOGIN / REGISTER =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // LOGIN
        const response = await loginUser(formData.email, formData.password);
        login(response.user, response.token);
        navigate(returnTo);

      } else {
        // REGISTER (OTP REQUIRED)
        if (!otpVerified) {
          setError("Please verify your email with OTP first");
          setLoading(false);
          return;
        }

        if (!formData.name) {
          setError("Name is required");
          setLoading(false);
          return;
        }

        const response = await registerUser(formData);
        login(response.user, response.token);
        navigate(returnTo);
      }

    } catch (err) {
      let msg = "Something went wrong";

      if (err.code === "ECONNREFUSED" || err.code === "ERR_NETWORK") {
        msg = "Cannot connect to server. Please ensure backend is running.";
      } else if (err.response?.data?.message) {
        msg = err.response.data.message;
      }

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setOtpVerified(false);
    setFormData({ name: "", email: "", password: "", otp: "" });
    setError("");
    setSuccess("");
    setCountdown(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">

        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg">
              <Zap className="text-white w-6 h-6" />
            </div>
            <span className="text-3xl font-black italic text-indigo-900">
              {CONFIG.BRAND}
            </span>
          </div>

          <h2 className="text-2xl font-black text-slate-900">
            {isLogin
              ? "Welcome Back"
              : step === 1
                ? "Create Account"
                : step === 2
                  ? "Verify Email"
                  : "Complete Registration"}
          </h2>

          <p className="text-slate-600 mt-2">
            {isLogin
              ? "Sign in to your account"
              : step === 1
                ? "Start by verifying your email"
                : step === 2
                  ? "Enter the OTP sent to your email"
                  : "Set your password and name"}
          </p>
        </div>

        {/* FORM CARD */}
        <div className="bg-white rounded-2xl shadow-xl p-8">

          {error && (
            <div className="mb-4 p-3 bg-rose-100 border border-rose-300 text-rose-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-emerald-100 border border-emerald-300 text-emerald-700 rounded-xl text-sm">
              {success}
            </div>
          )}

          {/* LOGIN MODE */}
          {isLogin ? (
            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border rounded-xl"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          ) : (

            <>
              {/* STEP 1 — EMAIL */}
              {step === 1 && (
                <div className="space-y-4">

                  <div>
                    <label className="block text-sm font-bold mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border rounded-xl"
                    />
                  </div>

                  <button
                    onClick={handleSendOTP}
                    disabled={loading || countdown > 0}
                    className="w-full bg-indigo-600 text-white py-3 rounded-xl"
                  >
                    {loading
                      ? "Sending..."
                      : countdown > 0
                        ? `Resend OTP (${countdown}s)`
                        : "Send Verification Code"}
                  </button>
                </div>
              )}

              {/* STEP 2 — OTP */}
              {step === 2 && (
                <div className="space-y-4">

                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    maxLength={6}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl text-center text-2xl font-mono"
                    placeholder="000000"
                  />

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 bg-slate-200 py-3 rounded-xl"
                    >
                      Back
                    </button>

                    <button
                      onClick={handleVerifyOTP}
                      disabled={loading || formData.otp.length !== 6}
                      className="flex-1 bg-indigo-600 text-white py-3 rounded-xl"
                    >
                      {loading ? "Verifying..." : "Verify"}
                    </button>
                  </div>

                  <button
                    onClick={handleSendOTP}
                    disabled={countdown > 0}
                    className="w-full text-indigo-600"
                  >
                    {countdown > 0
                      ? `Resend OTP in ${countdown}s`
                      : "Resend OTP"}
                  </button>
                </div>
              )}

              {/* STEP 3 — NAME + PASSWORD */}
              {step === 3 && (
                <form onSubmit={handleSubmit} className="space-y-4">

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl"
                    placeholder="Full Name"
                    required
                  />

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    minLength={6}
                    className="w-full px-4 py-3 border rounded-xl"
                    placeholder="Password"
                    required
                  />

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 bg-slate-200 py-3 rounded-xl"
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-indigo-600 text-white py-3 rounded-xl"
                    >
                      {loading ? "Creating..." : "Create Account"}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* SWITCH MODE */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                resetForm();
              }}
              className="text-indigo-600 font-bold"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
