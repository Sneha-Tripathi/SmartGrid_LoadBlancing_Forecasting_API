import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Login() {

  const navigate = useNavigate();

  const { login } = useAuth();

  const handleLogin = () => {

    // Temporary Login
    login({

      name: "Sneha",

      email: "sneha@gmail.com",

    });

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
              placeholder="Enter your email"
              className="w-full bg-[#0B1220] border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-teal-500 transition"
            />

          </div>

          <div>

            <label className="block text-slate-300 mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              className="w-full bg-[#0B1220] border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-teal-500 transition"
            />

          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-teal-600 hover:bg-teal-500 transition rounded-lg py-3 font-semibold text-white"
          >
            Login
          </button>

        </div>

        <div className="mt-6 text-center">

          <p className="text-slate-400">

            Don't have an account?{" "}

            <Link
              to="/signup"
              className="text-teal-400 hover:text-teal-300 font-medium"
            >
              Sign Up
            </Link>

          </p>

        </div>

      </div>

    </div>

  );

}