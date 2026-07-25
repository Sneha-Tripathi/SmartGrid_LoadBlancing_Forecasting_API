import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignup = (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      toast.error("Please fill all fields");
      return;
    }

    // Save user
    const newUser = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    };

    localStorage.setItem(
      "registered-user",
      JSON.stringify(newUser)
    );

    console.log("Saved User:", newUser);

    toast.success("Account Created Successfully");

    setFormData({
      name: "",
      email: "",
      password: "",
    });

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-[#101827] border border-slate-800 rounded-2xl shadow-xl p-8">

        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">
            Create Account
          </h1>

          <p className="text-slate-400 mt-2">
            Join Smart Grid Dashboard
          </p>
        </div>

        <form onSubmit={handleSignup} className="mt-8 space-y-5">

          <div>
            <label className="block text-slate-300 mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full bg-[#0B1220] border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full bg-[#0B1220] border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create Password"
              className="w-full bg-[#0B1220] border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-teal-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-500 py-3 rounded-lg text-white font-semibold"
          >
            Create Account
          </button>

        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-teal-400 hover:text-teal-300"
            >
              Login
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}