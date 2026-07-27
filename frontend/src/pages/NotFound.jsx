import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaSearch,
  FaArrowLeft,
  FaBolt,
  FaChartLine,
  FaBell,
  FaCog,
} from "react-icons/fa";

const quickLinks = [
  { name: "Dashboard", path: "/dashboard", icon: FaBolt, description: "Monitor grid in real-time" },
  { name: "Analytics", path: "/analytics", icon: FaChartLine, description: "AI-powered forecasts" },
  { name: "Alerts", path: "/alerts", icon: FaBell, description: "View active alerts" },
  { name: "Settings", path: "/settings", icon: FaCog, description: "Configure preferences" },
];

const NotFound = memo(function NotFound() {
  const errorTime = useMemo(() => new Date().toLocaleString(), []);

  return (
    <div
      className="min-h-screen bg-[#050816] flex items-center justify-center px-6 animate-fadeIn"
      role="alert"
      aria-labelledby="not-found-title"
    >
      <div className="relative max-w-2xl w-full">
        {/* Background Glow */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-[120px] animate-pulseSoft" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-teal-500/10 rounded-full blur-[120px] animate-pulseSoft" style={{ animationDelay: "1s" }} />

        <div className="relative bg-[#101827] border border-slate-800 rounded-3xl p-12 text-center shadow-2xl animate-fadeInScale">
          {/* 404 Code with Glitch Effect */}
          <div className="relative mb-8">
            <h1 className="text-[150px] font-extrabold leading-none text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-500 select-none animate-pulseSoft" style={{ animationDuration: "3s" }}>
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            </div>
          </div>

          <h2 id="not-found-title" className="text-3xl font-bold text-white mb-3">
            Page Not Found
          </h2>

          <p className="text-slate-400 max-w-md mx-auto mb-2">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <p className="text-slate-600 text-xs mb-8">
            Error 404 — <span className="text-cyan-500">{errorTime}</span>
          </p>

          {/* Search Suggestion */}
          <div className="bg-[#0B1220] border border-slate-700 rounded-2xl p-4 mb-8 max-w-lg mx-auto">
            <div className="flex items-center gap-3">
              <FaSearch className="text-slate-500 shrink-0" />
              <input
                type="text"
                placeholder="Search for a page..."
                className="w-full bg-transparent text-white text-sm outline-none placeholder:text-slate-600"
                readOnly
                aria-label="Search placeholder"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <Link
              to="/"
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-[1.03] active:scale-95"
              aria-label="Go to home page"
            >
              <FaHome />
              Go Home
            </Link>

            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-95"
              aria-label="Go back to previous page"
            >
              <FaArrowLeft />
              Go Back
            </button>
          </div>

          {/* Quick Links */}
          <div className="border-t border-slate-800 pt-8">
            <p className="text-slate-500 text-sm mb-5">
              Try these popular pages:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickLinks.map((link, idx) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`group bg-[#0B1220] border border-slate-700 hover:border-cyan-500/30 rounded-xl p-4 text-left transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/5 hover:-translate-y-1 animate-fadeInUp`}
                    style={{ animationDelay: `${(idx + 1) * 80}ms` }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-2 group-hover:bg-cyan-500/20 transition-colors group-hover:scale-110">
                      <Icon className="text-cyan-400 text-sm" />
                    </div>
                    <h3 className="text-white text-sm font-medium group-hover:text-cyan-300 transition-colors">
                      {link.name}
                    </h3>
                    <p className="text-slate-500 text-xs mt-1">
                      {link.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default NotFound;
