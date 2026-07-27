import {
  FaBolt,
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaArrowRight,
} from "react-icons/fa";

const platformLinks = [
  "Dashboard",
  "Grid Monitoring",
  "Load Forecast",
  "Analytics",
  "Reports",
];

const resourceLinks = [
  "Documentation",
  "API Reference",
  "Developer Guide",
  "Support",
  "GitHub",
];

const companyLinks = [
  "About",
  "Careers",
  "Privacy Policy",
  "Terms & Conditions",
  "Contact",
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#050816]">

      <div className="section py-20">

        <div className="grid lg:grid-cols-5 md:grid-cols-2 gap-14">

          {/* Company */}

          <div className="lg:col-span-2">

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-2xl bg-teal-700 flex items-center justify-center">

                <FaBolt className="text-white text-xl" />

              </div>

              <div>

                <h2 className="text-2xl font-bold">
                  SmartGrid AI
                </h2>

                <p className="text-sm text-slate-500">
                  Load Forecasting Platform
                </p>

              </div>

            </div>

            <p className="mt-8 text-slate-400 leading-8 max-w-md">

              AI-powered Smart Grid Load Forecasting &
              Load Balancing platform for modern energy
              infrastructure with real-time monitoring,
              predictive analytics and intelligent
              decision making.

            </p>

            {/* Social */}

            <div className="flex gap-4 mt-8">

              {[FaGithub, FaLinkedin, FaEnvelope].map((Icon, i) => (

                <a
                  key={i}
                  href="#"
                  className="
                  w-12
                  h-12
                  rounded-xl
                  bg-[#0B1220]
                  border
                  border-slate-700
                  flex
                  items-center
                  justify-center
                  text-slate-300
                  hover:bg-teal-700
                  hover:text-white
                  hover:border-teal-700
                  transition-all
                  "
                >

                  <Icon />

                </a>

              ))}

            </div>

          </div>

          {/* Platform */}

          <div>

            <h3 className="font-semibold text-xl mb-7">
              Platform
            </h3>

            <ul className="space-y-4">

              {platformLinks.map((item) => (

                <li key={item}>

                  <a
                    href="#"
                    className="text-slate-400 hover:text-teal-400 transition"
                  >
                    {item}
                  </a>

                </li>

              ))}

            </ul>

          </div>

          {/* Resources */}

          <div>

            <h3 className="font-semibold text-xl mb-7">
              Resources
            </h3>

            <ul className="space-y-4">

              {resourceLinks.map((item) => (

                <li key={item}>

                  <a
                    href="#"
                    className="text-slate-400 hover:text-teal-400 transition"
                  >
                    {item}
                  </a>

                </li>

              ))}

            </ul>

          </div>

          {/* Newsletter */}

          <div>

            <h3 className="font-semibold text-xl mb-7">
              Stay Updated
            </h3>

            <p className="text-slate-400 mb-6">

              Subscribe for product updates,
              AI insights and latest releases.

            </p>

            <div className="relative">

              <input
                type="email"
                placeholder="Enter email..."
                className="
                w-full
                h-14
                rounded-xl
                bg-[#0B1220]
                border
                border-slate-700
                px-5
                pr-16
                outline-none
                focus:border-teal-600
                "
              />

              <button
                className="
                absolute
                right-2
                top-2
                w-10
                h-10
                rounded-lg
                bg-teal-700
                hover:bg-teal-600
                transition
                flex
                items-center
                justify-center
                "
              >

                <FaArrowRight />

              </button>

            </div>

          </div>

        </div>

      </div>

      {/* Bottom */}

      <div className="border-t border-slate-800">

        <div className="section py-6 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-slate-500 text-sm">

            © 2026 SmartGrid AI. All Rights Reserved.

          </p>

          <div className="flex gap-8 text-sm text-slate-500">

            {companyLinks.map((item) => (

              <a
                key={item}
                href="#"
                className="hover:text-teal-400 transition"
              >
                {item}
              </a>

            ))}

          </div>

        </div>

      </div>

    </footer>
  );
}