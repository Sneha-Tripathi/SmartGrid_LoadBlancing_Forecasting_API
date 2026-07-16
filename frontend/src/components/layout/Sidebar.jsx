import { NavLink } from "react-router-dom";
import {
  FaBolt,
  FaHome,
  FaTachometerAlt,
  FaBroadcastTower,
  FaChartLine,
  FaBell,
  FaFileAlt,
  FaCog,
  FaChevronLeft,
} from "react-icons/fa";

const menuItems = [
  {
    name: "Home",
    path: "/",
    icon: <FaHome />,
  },
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <FaTachometerAlt />,
  },
  {
    name: "Monitoring",
    path: "/monitoring",
    icon: <FaBroadcastTower />,
  },
  {
    name: "Analytics",
    path: "/analytics",
    icon: <FaChartLine />,
  },
  {
    name: "Alerts",
    path: "/alerts",
    icon: <FaBell />,
  },
  {
    name: "Reports",
    path: "/reports",
    icon: <FaFileAlt />,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: <FaCog />,
  },
];

export default function Sidebar() {
  return (
    <aside
      className="
      hidden
      lg:flex
      w-72
      min-h-screen
      bg-[#08111f]
      border-r
      border-slate-800
      flex-col
      "
    >
      {/* Logo */}

      <div className="h-24 border-b border-slate-800 flex items-center px-7">

        <div className="w-12 h-12 rounded-xl bg-teal-700 flex items-center justify-center">

          <FaBolt className="text-white text-lg" />

        </div>

        <div className="ml-4">

          <h2 className="text-xl font-bold text-white">
            Smart Grid
          </h2>

          <p className="text-xs text-slate-400">
            AI Dashboard
          </p>

        </div>

      </div>

      {/* Navigation */}

      <nav className="flex-1 px-5 py-8">

        <p className="text-xs uppercase tracking-widest text-slate-500 mb-5">
          Navigation
        </p>

        <div className="space-y-2">

          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `
                flex
                items-center
                gap-4
                px-4
                py-3
                rounded-xl
                transition-all
                duration-300
                ${
                  isActive
                    ? "bg-teal-700 text-white"
                    : "text-slate-300 hover:bg-[#0B1220] hover:text-teal-400"
                }
                `
              }
            >
              <span className="text-lg">
                {item.icon}
              </span>

              <span className="font-medium">
                {item.name}
              </span>
            </NavLink>
          ))}

        </div>

      </nav>

      {/* Status Card */}

      <div className="p-5">

        <div
          className="
          rounded-2xl
          bg-[#0B1220]
          border
          border-slate-700
          p-5
          "
        >
          <div className="flex items-center justify-between">

            <h3 className="font-semibold">
              Grid Status
            </h3>

            <FaChevronLeft className="rotate-180 text-slate-500" />

          </div>

          <div className="mt-6 flex items-center gap-3">

            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>

            <span className="text-green-400 font-medium">
              Online
            </span>

          </div>

          <p className="text-sm text-slate-400 mt-3 leading-6">
            Smart Grid monitoring system is connected and receiving live data.
          </p>

          <button
            className="
            mt-6
            w-full
            h-11
            rounded-xl
            bg-teal-700
            hover:bg-teal-600
            transition
            "
          >
            View Status
          </button>

        </div>

      </div>

    </aside>
  );
}