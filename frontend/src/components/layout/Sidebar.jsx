import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBroadcastTower,
  FaChartLine,
  FaExclamationTriangle,
  FaFileAlt,
  FaCog,
  FaBolt,
  FaMicrochip,
} from "react-icons/fa";

const menuItems = [
  {
    name: "Dashboard",
    icon: FaHome,
    path: "/dashboard",
  },
  {
    name: "Monitoring",
    icon: FaBroadcastTower,
    path: "/monitoring",
  },
  {
    name: "Analytics",
    icon: FaChartLine,
    path: "/analytics",
  },
  {
    name: "Meters",
    icon: FaMicrochip,
    path: "/meters",
  },
  {
    name: "Alerts",
    icon: FaExclamationTriangle,
    path: "/alerts",
  },
  {
    name: "Reports",
    icon: FaFileAlt,
    path: "/reports",
  },
  {
    name: "Settings",
    icon: FaCog,
    path: "/settings",
  },
];

export default function Sidebar() {
  return (
    <aside className="w-72 min-h-screen bg-[#08111F] border-r border-slate-800 flex flex-col">

      {/* Logo */}

      <div className="h-20 flex items-center px-7 border-b border-slate-800">

        <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center">

          <FaBolt className="text-white text-xl" />

        </div>

        <div className="ml-3">

          <h2 className="text-white font-bold text-lg">
            Smart Grid
          </h2>

          <p className="text-slate-400 text-xs">
            Monitoring System
          </p>

        </div>

      </div>

      {/* Navigation */}

      <nav className="flex-1 py-8">

        <ul className="space-y-2 px-4">

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.name}>

                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg"
                        : "text-slate-400 hover:bg-[#101827] hover:text-white"
                    }`
                  }
                >
                  <Icon className="text-lg" />

                  <span className="font-medium">
                    {item.name}
                  </span>

                </NavLink>

              </li>
            );
          })}

        </ul>

      </nav>

      {/* Footer */}

      <div className="border-t border-slate-800 p-5">

        <div className="bg-[#101827] rounded-xl p-4">

          <p className="text-white font-semibold">
            Smart Grid
          </p>

          <p className="text-slate-400 text-sm mt-1">
            Version 1.0.0
          </p>

        </div>

      </div>

    </aside>
  );
}