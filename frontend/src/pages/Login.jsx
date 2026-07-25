import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("remember-email");

    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, []);

  const handleLogin = () => {
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!password.trim()) {
      toast.error("Password is required");
      return;
    }

    if (remember) {
      localStorage.setItem(
        "remember-email",
        email.trim().toLowerCase()
      );
    } else {
      localStorage.removeItem("remember-email");
    }

    const registeredUser = JSON.parse(
      localStorage.getItem("registered-user")
    );

    if (!registeredUser) {
      toast.error("Please Signup First");
      navigate("/signup");
      return;
    }

    if (
      registeredUser.email !== email.trim().toLowerCase() ||
      registeredUser.password !== password
    ) {
      toast.error("Invalid Email or Password");
      return;
    }

    login({
      name: registeredUser.name,
      email: registeredUser.email,
    });

    toast.success(`Welcome ${registeredUser.name}`);

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-[#101827] border border-slate-800 rounded-2xl shadow-xl p-8">

        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">
            Welcome Back
          </h1>

          <p className="text-slate-400 mt-2">
            Login to Smart Grid Dashboard
          </p>
        </div>

        <div className="mt-8 space-y-5">

          <div>
            <label className="block text-slate-300 mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
              className="w-full bg-[#0B1220] border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full bg-[#0B1220] border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex items-center justify-between">

            <label className="flex items-center gap-2 text-slate-300 text-sm">

              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="accent-teal-500"
              />

              Remember Me

            </label>

          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-teal-600 hover:bg-teal-500 py-3 rounded-lg text-white font-semibold"
          >
            Login
          </button>

        </div>

        <div className="mt-6 text-center">

          <p className="text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-teal-400 hover:text-teal-300"
            >
              Sign Up
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}