import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaExclamationTriangle, FaHome, FaRedo, FaArrowLeft } from "react-icons/fa";

const InternalServerError = memo(function InternalServerError() {
  const errorTime = useMemo(() => new Date().toLocaleString(), []);

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center px-6 animate-fadeIn" role="alert" aria-labelledby="server-error-title">
      <div className="relative max-w-2xl w-full">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-red-500/10 rounded-full blur-[120px] animate-pulseSoft" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-[120px] animate-pulseSoft" style={{ animationDelay: "1s" }} />
        <div className="relative bg-[#101827] border border-slate-800 rounded-3xl p-12 text-center shadow-2xl animate-fadeInScale">
          <FaExclamationTriangle className="text-red-500 text-6xl mx-auto mb-6 animate-pulseSoft" />
          <h1 id="server-error-title" className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500 mb-4">500</h1>
          <h2 className="text-3xl font-bold text-white mb-3">Internal Server Error</h2>
          <p className="text-slate-400 max-w-md mx-auto mb-2">Something went wrong on our end. Please try again later.</p>
          <p className="text-slate-600 text-xs mb-8">Error 500 — <span className="text-cyan-500">{errorTime}</span></p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => window.location.reload()} className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-[1.03] active:scale-95">
              <FaRedo /> Retry
            </button>
            <Link to="/" className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-95">
              <FaHome /> Go Home
            </Link>
            <button onClick={() => window.history.back()} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-95">
              <FaArrowLeft /> Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default InternalServerError;
