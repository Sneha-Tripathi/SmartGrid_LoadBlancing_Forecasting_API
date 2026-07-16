import { useState } from "react";
import {
  FaBolt,
  FaBars,
  FaTimes,
  FaSearch,
} from "react-icons/fa";

import Button from "../common/Button";

const navItems = [
  "Home",
  "Features",
  "Solutions",
  "Dashboard",
  "Contact",
];

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#050816]/95 backdrop-blur-xl border-b border-slate-800">

      <div className="max-w-[1400px] mx-auto px-5">

        {/* ================= Desktop ================= */}

        <div className="hidden lg:flex items-center justify-between h-20">

          {/* LEFT */}

          <div className="flex items-center gap-10">

            {/* Logo */}

            <div className="flex items-center gap-3 shrink-0">

              <div className="w-11 h-11 rounded-xl bg-teal-700 flex items-center justify-center shadow-lg shadow-teal-700/30">

                <FaBolt className="text-white text-lg" />

              </div>

              <div>

                <h1 className="text-[30px] leading-none font-bold text-white">
                  Smart Grid
                </h1>

                <p className="text-[11px] text-slate-400 mt-1">
                  AI Platform
                </p>

              </div>

            </div>

            {/* Search */}

            <div className="relative w-[300px]">

              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />

              <input
                type="text"
                placeholder="Search..."
                className="
                  w-full
                  h-10
                  rounded-xl
                  bg-[#0B1220]
                  border
                  border-slate-700
                  pl-11
                  pr-4
                  text-sm
                  text-white
                  outline-none
                  focus:border-teal-500
                "
              />

            </div>

          </div>

          {/* CENTER */}

          <nav className="flex items-center gap-7">

            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                className="
                  text-[15px]
                  font-medium
                  text-slate-300
                  hover:text-teal-400
                  transition
                "
              >
                {item}
              </a>
            ))}

          </nav>

          {/* RIGHT */}

          <div className="flex items-center gap-3 shrink-0">

            <Button
              variant="outline"
              className="h-10 px-6 text-sm"
            >
              Login
            </Button>

            <Button
              className="h-10 px-6 text-sm"
            >
              Sign Up
            </Button>

          </div>

        </div>

        {/* ================= Mobile ================= */}

        <div className="lg:hidden flex justify-between items-center h-20">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-teal-700 flex items-center justify-center">

              <FaBolt className="text-white" />

            </div>

            <div>

              <h2 className="text-xl font-bold text-white">
                Smart Grid
              </h2>

              <p className="text-xs text-slate-400">
                AI Platform
              </p>

            </div>

          </div>

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="text-white text-2xl"
          >
            {mobileMenu ? <FaTimes /> : <FaBars />}
          </button>

        </div>

        {mobileMenu && (

          <div className="lg:hidden border-t border-slate-800 py-6 space-y-5">

            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                className="block text-slate-300"
              >
                {item}
              </a>
            ))}

            <Button
              variant="outline"
              className="w-full h-10"
            >
              Login
            </Button>

            <Button
              className="w-full h-10"
            >
              Sign Up
            </Button>

          </div>

        )}

      </div>

    </header>
  );
}