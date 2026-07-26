import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";
import { FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Signup() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Full name is required");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!formData.password.trim()) {
      toast.error("Password is required");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setSubmitting(true);

    try {
      const userData = await register(
        formData.name.trim(),
        formData.email.trim().toLowerCase(),
        formData.password,
        formData.phone.trim()
      );

      toast.success(`Welcome, ${userData.name}! Account created successfully.`);

      navigate("/dashboard");
    } catch (error) {
      const msg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-[#101827] border border-slate-800 rounded-2xl shadow-xl shadow-cyan-500/5 p-8">

        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">
            Create Account
          </h1>
          <p className="text-slate-400 mt-2">
            Join Smart Grid Dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="mt-8 space-y-5">

          <div>
            <label className="block text-slate-300 mb-2 text-sm">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full bg-[#0B1220] border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-cyan-500 transition placeholder:text-slate-600"
              autoComplete="name"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2 text-sm">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full bg-[#0B1220] border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-cyan-500 transition placeholder:text-slate-600"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2 text-sm">
              Phone (optional)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1-555-0000"
              className="w-full bg-[#0B1220] border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-cyan-500 transition placeholder:text-slate-600"
              autoComplete="tel"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2 text-sm">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password (min 6 characters)"
                className="w-full bg-[#0B1220] border border-slate-700 rounded-lg px-4 py-3 pr-10 text-white outline-none focus:border-cyan-500 transition placeholder:text-slate-600"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 py-3 rounded-lg text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting && <FaSpinner className="animate-spin" />}
            {submitting ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Login
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
