import { memo } from "react";
import { Link } from "react-router-dom";
import {
  FaExclamationTriangle,
  FaRedo,
  FaHome,
  FaEnvelope,
  FaBug,
  FaTrash,
  FaWifi,
  FaClock,
} from "react-icons/fa";

const ErrorFallback = memo(function ErrorFallback({
  error,
  errorInfo,
  retryCount = 0,
  canRetry = true,
  offline = false,
  onRetry,
  onReload,
  onReset,
  onHardReset,
}) {
  const errorTime = new Date().toLocaleTimeString();
  const errorMsg = error?.message || "Unknown error";
  const mailtoHref = `mailto:support@smartgrid.com?subject=Error%20Report&body=Error: ${encodeURIComponent(errorMsg)}`;

  return (
    <div
      className="min-h-screen bg-[#0B1120] flex items-center justify-center px-6 animate-fadeIn"
      role="alert"
      aria-live="assertive"
    >
      <div className="relative max-w-lg w-full">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-red-500/10 rounded-full blur-[120px] animate-pulseSoft" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-[120px] animate-pulseSoft" style={{ animationDelay: "1s" }} />

        <div className="relative bg-[#101827] border border-red-500/20 rounded-3xl p-10 text-center shadow-2xl shadow-red-500/5 animate-fadeInScale">
          {offline ? (
            <>
              <FaWifi className="text-yellow-500 text-5xl mx-auto mb-6 animate-float" />
              <h1 className="text-3xl font-bold text-white mb-4">No Internet Connection</h1>
              <p className="text-slate-400 mb-8">You appear to be offline. Please check your connection and try again.</p>
            </>
          ) : (
            <>
              <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-6 animate-pulseSoft" />
              <h1 className="text-3xl font-bold text-white mb-4">Something went wrong</h1>
              <p className="text-slate-400 mb-2">An unexpected error occurred while rendering this page.</p>
              <p className="text-slate-500 text-xs mb-6">
                Occurred at: <span className="text-cyan-400">{errorTime}</span>
                {retryCount > 0 && (
                  <span className="ml-3">Retries: <span className="text-yellow-400">{retryCount}</span></span>
                )}
              </p>
            </>
          )}

          {error && !offline && (
            <div className="bg-slate-900 rounded-xl p-4 mb-6 overflow-auto text-left max-h-32 shimmer">
              <code className="text-red-400 text-sm block whitespace-pre-wrap break-all">{errorMsg}</code>
              {errorInfo?.componentStack && (
                <details className="mt-2">
                  <summary className="text-slate-500 text-xs cursor-pointer hover:text-slate-400 transition-colors">Component Stack</summary>
                  <code className="text-slate-500 text-xs block mt-1 whitespace-pre-wrap">{errorInfo.componentStack}</code>
                </details>
              )}
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {!offline && (
              <button
                onClick={onRetry}
                disabled={!canRetry}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-95 ${
                  canRetry
                    ? "bg-cyan-600 hover:bg-cyan-500 text-white hover:shadow-lg hover:shadow-cyan-500/25"
                    : "bg-slate-700 text-slate-500 cursor-not-allowed"
                }`}
                aria-label="Try again to load the page"
              >
                <FaRedo className={`text-sm ${!canRetry ? "animate-spin" : ""}`} />
                {canRetry ? "Try Again" : "Wait..."}
              </button>
            )}
            <button onClick={onReload} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-95" aria-label="Reload page">
              <FaClock /> Reload Page
            </button>
            <Link to="/" onClick={onReset} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-95" aria-label="Go to home page">
              <FaHome /> Home
            </Link>
          </div>

          <div className="border-t border-slate-800 pt-6 space-y-4">
            <p className="text-slate-500 text-sm">Need help? Contact support or try resetting your session.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href={mailtoHref} className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors text-sm px-4 py-2 rounded-lg border border-slate-700 hover:border-cyan-500/30 hover:bg-cyan-500/5" aria-label="Contact support via email">
                <FaEnvelope /> Contact Support
              </a>
              <button onClick={onHardReset} className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors text-sm px-4 py-2 rounded-lg border border-slate-700 hover:border-red-500/30 hover:bg-red-500/5" aria-label="Reset session and clear data">
                <FaTrash /> Reset Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ErrorFallback;
