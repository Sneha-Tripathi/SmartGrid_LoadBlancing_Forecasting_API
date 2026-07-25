import {
  FaBell,
  FaSearch,
  FaSignOutAlt,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";

export default function DashboardNavbar() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();

    toast.success("Logged Out Successfully");

    navigate("/login");
  };

  return (
    <header
      className="
      sticky
      top-0
      z-40
      h-20
      bg-[#050816]/90
      backdrop-blur-xl
      border-b
      border-slate-800
      "
    >
      <div className="h-full px-8 flex items-center justify-between">

        {/* Left */}

        <div>
          <h1 className="text-3xl font-bold text-white">
            Dashboard
          </h1>

          <p className="text-sm text-slate-400 mt-1">
            Smart Grid Load Monitoring
          </p>
        </div>

        {/* Right */}

        <div className="flex items-center gap-5">

          {/* Search */}

          <div className="relative hidden md:block">

            <FaSearch
              className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-500
              text-sm
              "
            />

            <input
              type="text"
              placeholder="Search..."
              className="
              w-72
              h-11
              rounded-xl
              bg-[#0B1220]
              border
              border-slate-700
              pl-11
              pr-4
              text-sm
              text-white
              outline-none
              focus:border-teal-600
              "
            />

          </div>

          {/* Notification */}

          <button
            className="
            w-11
            h-11
            rounded-xl
            bg-[#0B1220]
            border
            border-slate-700
            flex
            items-center
            justify-center
            hover:border-teal-600
            duration-300
            text-white
            "
          >
            <FaBell />
          </button>

          {/* User */}

          <div className="flex items-center gap-3">

            {/* Avatar */}

            <div
              className="
              w-12
              h-12
              rounded-full
              bg-teal-600
              flex
              items-center
              justify-center
              text-white
              font-bold
              text-lg
              shadow-lg
              shadow-teal-700/20
              "
            >
              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : "G"}
            </div>

            {/* User Info */}

            <div>

              <h4 className="text-white font-semibold">
                {user?.name || "Guest"}
              </h4>

              <p className="text-slate-400 text-sm">
                {user?.email || "guest@example.com"}
              </p>

            </div>

            {/* Logout */}

            <button
              onClick={handleLogout}
              className="
              ml-3
              w-11
              h-11
              rounded-xl
              bg-red-500/10
              border
              border-red-500/30
              flex
              items-center
              justify-center
              text-red-400
              hover:bg-red-500
              hover:text-white
              duration-300
              "
              title="Logout"
            >
              <FaSignOutAlt />
            </button>

          </div>

        </div>

      </div>
    </header>
  );
}