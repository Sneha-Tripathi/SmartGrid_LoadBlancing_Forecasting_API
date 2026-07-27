import {
  FaPlay,
  FaCheckCircle,
} from "react-icons/fa";

import Button from "../common/Button";
import HeroImage from "../../assets/images/hero-grid.png";
import { useNavigate } from "react-router-dom";
export default function Hero() {

  const navigate = useNavigate();
  return (
    
    <section className="relative overflow-hidden">

      {/* Background Glow */}

      <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-teal-700/10 blur-[180px]" />

      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-teal-800/10 blur-[150px]" />

      <div className="section pt-16 lg:pt-12 pb-10">

        <div className="grid lg:grid-cols-2 items-center gap-10">

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
              mt-4
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

            {/* Buttons */}

<div className="flex flex-wrap items-center gap-5 mt-6 relative z-20">

  <button
    onClick={() => navigate("/dashboard")}
    className="
      px-8
      py-4
      rounded-xl
      bg-gradient-to-r
      from-cyan-500
      to-teal-500
      text-white
      font-semibold
      shadow-lg
      shadow-cyan-500/20
      hover:scale-105
      hover:shadow-cyan-500/40
      transition-all
      duration-300
    "
  >
    Get Started →
  </button>

  <button
    onClick={() => navigate("/monitoring")}
    className="
      px-8
      py-4
      rounded-xl
      border
      border-cyan-500/60
      bg-[#101827]/80
      backdrop-blur-md
      text-white
      font-semibold
      hover:border-cyan-400
      hover:bg-cyan-500/10
      hover:scale-105
      transition-all
      duration-300
    "
  >
    ▶ Live Demo
  </button>

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

<div
  className="
    relative
    flex
    items-start
    justify-center
    pt-16
    w-full
    h-full
    overflow-visible
    lg:-mt-24
    xl:-mt-32
  "
>
  <img
    src={HeroImage}
    alt="Smart Grid"

    className="
      w-full
      max-w-[900px]
      xl:max-w-[980px]
      object-contain
      object-top
      drop-shadow-[0_45px_90px_rgba(6,182,212,0.30)]
      transition-all
      duration-500
      hover:scale-[1.03]
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