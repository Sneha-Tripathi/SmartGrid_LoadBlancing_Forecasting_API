import { memo, useCallback } from "react";
import { FaWifi, FaRedo } from "react-icons/fa";

const NetworkError = memo(function NetworkError({ onRetry }) {
  const handleRetry = useCallback(() => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  }, [onRetry]);

  return (
    <div
      className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 text-center animate-fadeInScale"
      role="alert"
      aria-live="assertive"
    >
      <div className="relative inline-block">
        <FaWifi className="mx-auto text-4xl text-yellow-400 mb-4 animate-float" />
        <div className="absolute top-2 right-0 w-4 h-0.5 bg-red-500 rotate-45" />
      </div>
      <h2 className="text-yellow-300 text-xl font-semibold">
        Network Error
      </h2>
      <p className="text-slate-300 mt-3">
        Unable to connect to backend server.
      </p>
      <p className="text-slate-500 mt-2 text-sm">
        Please make sure FastAPI is running.
      </p>
      <button
        onClick={handleRetry}
        className="mt-4 flex items-center gap-2 mx-auto px-4 py-2 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-white transition-all duration-300 hover:scale-[1.03] active:scale-95"
      >
        <FaRedo className="text-sm" />
        Retry Connection
      </button>
    </div>
  );
});

export default NetworkError;
