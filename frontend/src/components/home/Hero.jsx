import {
  FaArrowRight,
  FaPlay,
  FaCheckCircle,
} from "react-icons/fa";

import Button from "../common/Button";
import HeroImage from "../../assets/images/hero-grid.png";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">

      {/* Background Glow */}

      <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-teal-700/10 blur-[180px]" />

      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-teal-800/10 blur-[150px]" />

      <div className="section pt-16 lg:pt-12 pb-10">

        <div className="grid lg:grid-cols-2 items-center gap-16">

          {/* LEFT */}

          <div>

            {/* Badge */}

            <div className="inline-flex items-center gap-3 border border-teal-700/40 bg-[#0B1220] rounded-full px-5 py-2">

              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>

              <span className="text-sm text-slate-300">

                AI Powered Energy Intelligence

              </span>

            </div>

            {/* Heading */}

            <h1
              className="
              mt-8
              text-[46px]
              lg:text-[60px]
              font-extrabold
              leading-[1.08]
              tracking-tight
              "
            >
              Smart Grid

              <br />

              <span className="text-teal-400">
                Load Forecasting
              </span>

              <br />

              Platform
            </h1>

            {/* Paragraph */}

            <p
              className="
              mt-8
              max-w-xl
              text-lg
              leading-8
              text-slate-400
              "
            >
              Monitor electricity demand in real time, forecast
              future energy consumption using AI, balance grid
              load efficiently, and optimize smart energy
              distribution with advanced analytics.
            </p>

            {/* Buttons */}

            <div className="flex flex-wrap gap-5 mt-10">

              <Button icon>

                Get Started

              </Button>

              <Button variant="secondary">

                <FaPlay />

                Live Demo

              </Button>

            </div>

            {/* Features */}

            <div className="grid grid-cols-2 gap-5 mt-12">

              <div className="flex gap-3">

                <FaCheckCircle className="text-teal-400 mt-1" />

                <div>

                  <h4 className="font-semibold">

                    AI Forecasting

                  </h4>

                  <p className="text-sm text-slate-500 mt-1">

                    Predict future load demand accurately.

                  </p>

                </div>

              </div>

              <div className="flex gap-3">

                <FaCheckCircle className="text-teal-400 mt-1" />

                <div>

                  <h4 className="font-semibold">

                    Live Monitoring

                  </h4>

                  <p className="text-sm text-slate-500 mt-1">

                    Smart meter monitoring in real time.

                  </p>

                </div>

              </div>

              <div className="flex gap-3">

                <FaCheckCircle className="text-teal-400 mt-1" />

                <div>

                  <h4 className="font-semibold">

                    Load Balancing

                  </h4>

                  <p className="text-sm text-slate-500 mt-1">

                    Optimize energy distribution automatically.

                  </p>

                </div>

              </div>

              <div className="flex gap-3">

                <FaCheckCircle className="text-teal-400 mt-1" />

                <div>

                  <h4 className="font-semibold">

                    Secure Platform

                  </h4>

                  <p className="text-sm text-slate-500 mt-1">

                    Reliable & scalable infrastructure.

                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div className="relative flex justify-center">

            {/* Image */}

            <img
              src={HeroImage}
              alt="Smart Grid"
              className="
              w-full
              max-w-[650px]
              object-contain
              drop-shadow-[0_30px_70px_rgba(15,118,110,.25)]
              relative
              z-10
              "
            />

          </div>

        </div>

      </div>

    </section>
  );
}