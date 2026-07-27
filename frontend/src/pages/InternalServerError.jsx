import { memo } from "react";
import { Link } from "react-router-dom";
import { FaExclamationTriangle, FaHome, FaRedo } from "react-icons/fa";

const InternalServerError = memo(function InternalServerError() {
  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
          <FaExclamationTriangle className="text-red-500 text-4xl" />
        </div>
        <h1 className="text-6xl font-bold text-white mb-4">500</h1>
        <h2 className="text-2xl font-semibold text-white mb-2">Internal Server Error</h2>
        <p className="text-slate-400 mb-8">Something went wrong on our end. Please try again later.</p>
        <div className="flex items-center justify-center gap-4">
          <button onClick={() => window.location.reload()} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition">
            <FaRedo /> Refresh
          </button>
          <Link to="/" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition">
            <FaHome /> Go Home
          </Link>
        </div>
      </div>
    </div>
  );
});

export default InternalServerError;
