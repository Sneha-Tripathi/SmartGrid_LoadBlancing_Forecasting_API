import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaWifi, FaRedo, FaHome, FaCloud, FaServer } from "react-icons/fa";

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleRetry = useCallback(() => {
    setRetryCount((c) => c + 1);
    if (navigator.onLine) {
      window.location.reload();
    }
  }, []);

  const handleCheckConnection = useCallback(() => {
    if (navigator.onLine) {
      window.location.reload();
    }
    setRetryCount((c) => c + 1);
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <div
      className="min-h-screen bg-[#050816] flex items-center justify-center px-6 animate-fadeIn"
      role="status"
      aria-live="assertive"
    >
      <div className="relative max-w-xl w-full">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-yellow-500/10 rounded-full blur-[120px] animate-pulseSoft" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-amber-500/10 rounded-full blur-[120px] animate-pulseSoft" style={{ animationDelay: "1s" }} />

        <div className="relative bg-[#101827] border border-yellow-500/20 rounded-3xl p-12 text-center shadow-2xl shadow-yellow-500/5 animate-fadeInScale">
          {/* Icon */}
          <div className="relative inline-block mb-6">
            <FaWifi className="text-yellow-500/20 text-[120px] mx-auto animate-float" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-0.5 bg-red-500 rotate-45" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-3">
            You're Offline
          </h1>

          <p className="text-slate-400 mb-2 max-w-md mx-auto">
            Your internet connection appears to be offline. Some features may not be available.
          </p>

          <p className="text-slate-500 text-sm mb-8">
            Retry attempts: <span className="text-yellow-400 font-medium">{retryCount}</span>
          </p>

          {/* Retry Button */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-[1.03] active:scale-95"
              aria-label="Retry connection to server"
            >
              <FaRedo className="text-sm" />
              Retry Connection
            </button>

            <button
              onClick={handleCheckConnection}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-95"
              aria-label="Check network connection status"
            >
              <FaServer />
              Check Connection
            </button>

            <Link
              to="/"
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-95"
              aria-label="Go back to home page"
            >
              <FaHome />
              Back to Home
            </Link>
          </div>

          {/* Info */}
          <div className="border-t border-slate-800 pt-6">
            <div className="flex flex-wrap justify-center gap-4 text-slate-500 text-sm">
              <span className="flex items-center gap-2">
                <FaCloud className="text-yellow-400" />
                Cached data is still available
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
