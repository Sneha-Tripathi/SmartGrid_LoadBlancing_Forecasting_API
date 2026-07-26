import { useEffect, useState } from "react";
import {
  FaBell,
  FaSearch,
  FaSignOutAlt,
  FaClock,
  FaUser,
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

export default function DashboardNavbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged Out Successfully");
    navigate("/login");
  };

  const username = user?.name || "Guest";
  const firstLetter = username.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 h-20 bg-[#050816]/90 backdrop-blur-xl border-b border-slate-800">
      <div className="h-full px-3 flex items-center justify-between">
        {/* Left */}
<div className="flex items-center gap-2">

  {/* Back to Home */}
  <button
    onClick={() => navigate("/")}
    className="
      flex
      items-center
      gap-2
      h-11
      px-5
      rounded-xl
      border
      border-cyan-500/40
      bg-[#0B1220]
      text-cyan-400
      hover:bg-cyan-500/10
      hover:border-cyan-400
      transition-all
      duration-300
    "
  >
    <FaArrowLeft className="text-sm" />
    <span className="hidden md:block font-medium">
      Back to Home
    </span>
  </button>

  {/* Date & Time */}
  <div className="hidden xl:flex items-center gap-2 bg-[#0B1220] border border-slate-700 rounded-xl px-3 py-2">
    <FaClock className="text-cyan-400" />
    <span className="text-sm text-slate-300">
      {currentTime}
    </span>
  </div>

</div>

        {/* Right */}
        <div className="flex items-center gap-5">
          {/* Search */}
          <div className="relative hidden lg:block">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
            <input type="text" placeholder="Search..."
              className="w-72 h-11 rounded-xl bg-[#0B1220] border border-slate-700 pl-11 pr-4 text-sm text-white outline-none focus:border-cyan-500" />
          </div>

          {/* Notification */}
          <button className="relative w-11 h-11 rounded-xl bg-[#0B1220] border border-slate-700 flex items-center justify-center hover:border-cyan-500 duration-300">
            <FaBell className="text-white" />
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">3</span>
          </button>

          {/* User - Link to Profile */}
          <Link to="/profile" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg group-hover:shadow-lg group-hover:shadow-cyan-500/30 transition-shadow">
              {firstLetter}
            </div>
            <div className="hidden md:block">
              <h4 className="text-white font-semibold group-hover:text-cyan-300 transition">{username}</h4>
              <p className="text-slate-400 text-sm capitalize">{user?.role || "Grid Administrator"}</p>
            </div>
          </Link>

          {/* Logout */}
          <button onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 px-2 py-2 rounded-xl text-white transition">
            <FaSignOutAlt />
            <span className="hidden lg:block">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
