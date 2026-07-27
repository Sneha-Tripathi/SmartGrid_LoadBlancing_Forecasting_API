import { memo } from "react";
import { Link } from "react-router-dom";
import { FaExclamationCircle, FaHome, FaRedo } from "react-icons/fa";

const ErrorPage = memo(function ErrorPage({ title = "Error", message = "An unexpected error occurred.", onRetry }) {
  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <FaExclamationCircle className="text-red-500 text-6xl mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-white mb-4">{title}</h1>
        <p className="text-slate-400 mb-8">{message}</p>
        <div className="flex items-center justify-center gap-4">
          {onRetry && (
            <button onClick={onRetry} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition">
              <FaRedo /> Try Again
            </button>
          )}
          <Link to="/" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition">
            <FaHome /> Go Home
          </Link>
        </div>
      </div>
    </div>
  );
});

export default ErrorPage;
