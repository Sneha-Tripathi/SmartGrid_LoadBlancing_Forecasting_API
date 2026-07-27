import { FaBolt } from "react-icons/fa";
import Button from "../common/Button";

export default function CTA() {
  return (
    <section className="py-28">

      <div className="section">

        <div
          className="
          relative
          overflow-hidden
          rounded-[32px]
          border
          border-slate-800
          bg-[#0B1220]
          p-12
          lg:p-16
        "
        >

          {/* Background Glow */}

          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-teal-700/10 blur-[120px]" />

          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left */}

            <div>

              <div className="flex items-center gap-4">

                <div
                  className="
                  w-16
                  h-16
                  rounded-2xl
                  bg-teal-700
                  flex
                  items-center
                  justify-center
                  "
                >
                  <FaBolt className="text-2xl text-white" />
                </div>

                <div>

                  <span className="text-sm text-teal-400 uppercase tracking-widest">
                    Smart Grid Platform
                  </span>

                  <h2 className="text-4xl font-bold mt-2">
                    Ready to Modernize
                    <br />
                    Your Smart Grid?
                  </h2>

                </div>

              </div>

              <p className="mt-8 text-slate-400 text-lg leading-8 max-w-xl">
                Monitor real-time electricity demand, forecast future
                energy consumption and optimize load balancing with
                Artificial Intelligence.
              </p>

            </div>

            {/* Right */}

            <div className="flex lg:justify-end">

              <Button
                icon
                className="px-10 h-14 text-lg"
              >
                Launch Dashboard
              </Button>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}