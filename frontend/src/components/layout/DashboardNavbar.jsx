import { FaBell, FaSearch } from "react-icons/fa";

export default function DashboardNavbar() {
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
            "
          >
            <FaBell />
          </button>

          {/* User */}

          <div className="flex items-center gap-3">

           

            <div className="flex items-center gap-3">
              
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
    S
  </div>

  <div>

    <h4 className="text-white font-semibold">
      Sneha
    </h4>

    <p className="text-slate-400 text-sm">
      Frontend Developer
    </p>

  </div>

</div>

          </div>

        </div>

      </div>
    </header>
  );
}