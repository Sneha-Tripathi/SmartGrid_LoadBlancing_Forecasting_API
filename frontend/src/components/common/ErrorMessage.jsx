import { memo } from "react";
import { FaExclamationCircle } from "react-icons/fa";

const ErrorMessage = memo(function ErrorMessage({
  title = "Something went wrong",
  message = "Unable to load data.",
  onRetry,
}) {
  return (
    <div
      className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 animate-fadeInScale"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-4">
        <FaExclamationCircle className="text-red-400 text-xl mt-1 shrink-0 animate-pulseSoft" />
        <div className="flex-1 min-w-0">
          <h2 className="text-red-400 text-xl font-semibold">
            {title}
          </h2>
          <p className="text-slate-300 mt-2">
            {message}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 px-4 py-2 rounded-xl bg-red-600/30 hover:bg-red-600/50 text-red-300 text-sm transition-all duration-300 hover:scale-[1.03] active:scale-95"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default ErrorMessage;
