import { memo } from "react";
import { Link } from "react-router-dom";
import { FaWifi, FaRedo, FaHome, FaArrowLeft } from "react-icons/fa";

const OfflinePage = memo(function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center px-6 animate-fadeIn" role="alert" aria-labelledby="offline-title">
      <div className="relative max-w-2xl w-full">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-yellow-500/10 rounded-full blur-[120px] animate-pulseSoft" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-amber-500/10 rounded-full blur-[120px] animate-pulseSoft" style={{ animationDelay: "1s" }} />
        <div className="relative bg-[#101827] border border-slate-800 rounded-3xl p-12 text-center shadow-2xl animate-fadeInScale">
          <div className="relative inline-block">
            <FaWifi className="text-yellow-500 text-6xl mx-auto mb-6 animate-float" />
            <div className="absolute top-2 right-4 w-8 h-1 bg-red-500 rotate-45" />
          </div>
          <h1 id="offline-title" className="text-4xl font-bold text-white mb-4">You're Offline</h1>
          <p className="text-slate-400 max-w-md mx-auto mb-2">No internet connection detected. Please check your network and try again.</p>
          <p className="text-slate-500 text-sm mb-8">Some features may be unavailable while offline.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => window.location.reload()} className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/25 hover:scale-[1.03] active:scale-95">
              <FaRedo /> Retry
            </button>
            <Link to="/" className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-95">
              <FaHome /> Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
});

export default OfflinePage;
