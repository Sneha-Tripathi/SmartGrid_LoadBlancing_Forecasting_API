import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Check for expired session query param
  useEffect(() => {
    if (searchParams.get("expired") === "1") {
      toast.error("Session expired - please login again");
    }
  }, [searchParams]);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Load remembered email
  useEffect(() => {
    const savedEmail = localStorage.getItem("sg-remember-email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!password.trim()) {
      toast.error("Password is required");
      return;
    }

    setSubmitting(true);

    try {
      if (remember) {
        localStorage.setItem("sg-remember-email", email.trim().toLowerCase());
      } else {
        localStorage.removeItem("sg-remember-email");
      }

      const userData = await login(email.trim(), password, remember);

      toast.success(`Welcome back, ${userData.name}!`);

      navigate("/dashboard");
    } catch (error) {
      const msg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Invalid email or password";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Demo credentials helper
  const fillDemoCredentials = (role) => {
    if (role === "admin") {
      setEmail("admin@smartgrid.com");
      setPassword("admin123");
    } else {
      setEmail("operator@smartgrid.com");
      setPassword("operator123");
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-[#101827] border border-slate-800 rounded-2xl shadow-xl shadow-cyan-500/5 p-8">

        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">
            Welcome Back
          </h1>
          <p className="text-slate-400 mt-2">
            Login to Smart Grid Dashboard
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-3 bg-cyan-900/20 border border-cyan-500/20 rounded-xl">
          <p className="text-xs text-cyan-400 font-semibold mb-2">DEMO CREDENTIALS</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fillDemoCredentials("admin")}
              className="flex-1 text-xs bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 py-1.5 rounded-lg transition"
            >
              Admin Login
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials("operator")}
              className="flex-1 text-xs bg-teal-600/20 hover:bg-teal-600/40 text-teal-300 py-1.5 rounded-lg transition"
            >
              Operator Login
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="mt-6 space-y-5">

          <div>
            <label className="block text-slate-300 mb-2 text-sm">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-[#0B1220] border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-cyan-500 transition placeholder:text-slate-600"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2 text-sm">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-[#0B1220] border border-slate-700 rounded-lg px-4 py-3 pr-10 text-white outline-none focus:border-cyan-500 transition placeholder:text-slate-600"
                autoComplete="current-password"
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

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-slate-300 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="accent-cyan-500 w-4 h-4"
              />
              Remember Me
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 py-3 rounded-lg text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting && <FaSpinner className="animate-spin" />}
            {submitting ? "Logging in..." : "Login"}
          </button>

        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Sign Up
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
