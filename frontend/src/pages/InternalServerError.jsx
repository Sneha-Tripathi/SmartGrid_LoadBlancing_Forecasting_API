import { useCallback } from "react";
import { Link } from "react-router-dom";
import { FaExclamationCircle, FaRedo, FaHome, FaEnvelope, FaBug } from "react-icons/fa";

export default function InternalServerError() {
  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  const handleReportBug = useCallback(() => {
    window.open("mailto:support@smartgrid.com?subject=500%20Error%20Report&body=Please%20describe%20what%20you%20were%20doing%20when%20the%20error%20occurred:", "_blank");
  }, []);

  return (
    <div
      className="min-h-screen bg-[#050816] flex items-center justify-center px-6 animate-fadeIn"
      role="alert"
      aria-labelledby="server-error-title"
    >
      <div className="relative max-w-xl w-full">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-red-500/10 rounded-full blur-[120px] animate-pulseSoft" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-[120px] animate-pulseSoft" style={{ animationDelay: "1s" }} />
        <div className="relative bg-[#101827] border border-red-500/20 rounded-3xl p-12 text-center shadow-2xl shadow-red-500/5 animate-fadeInScale">
          <div className="relative inline-block mb-6">
            <FaExclamationCircle className="text-red-500/20 text-[120px] mx-auto animate-pulseSoft" />
            <span className="absolute inset-0 flex items-center justify-center text-6xl font-extrabold text-red-400">500</span>
          </div>
          <h1 id="server-error-title" className="text-3xl font-bold text-white mb-3">Internal Server Error</h1>
          <p className="text-slate-400 mb-2 max-w-md mx-auto">Something went wrong on our end. Our team has been notified.</p>
          <p className="text-slate-500 text-sm mb-8">
            Error Reference: <code className="text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">ERR-500-{Date.now().toString(36).toUpperCase()}</code>
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button onClick={handleRetry} className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-[1.03] active:scale-95" aria-label="Try reloading the page">
              <FaRedo className="text-sm" /> Try Again
            </button>
            <Link to="/" className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-95" aria-label="Go back to home page">
              <FaHome /> Back to Home
            </Link>
          </div>
          <div className="border-t border-slate-800 pt-6">
            <p className="text-slate-500 text-sm mb-4">Still having issues? Contact our support team.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={handleReportBug} className="flex items-center gap-2 text-slate-400 hover:text-orange-400 transition-colors text-sm px-4 py-2 rounded-lg border border-slate-700 hover:border-orange-500/30 hover:bg-orange-500/5" aria-label="Report a bug via email">
                <FaBug /> Report Bug
              </button>
              <a href="mailto:support@smartgrid.com" className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors text-sm px-4 py-2 rounded-lg border border-slate-700 hover:border-cyan-500/30 hover:bg-cyan-500/5" aria-label="Contact support via email">
                <FaEnvelope /> support@smartgrid.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
