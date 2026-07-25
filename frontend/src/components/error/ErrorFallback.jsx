import { FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function ErrorFallback({
  error,
  resetErrorBoundary,
}) {
  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center px-6">

      <div className="bg-[#101827] border border-red-500 rounded-2xl p-10 max-w-xl w-full text-center">

        <FaExclamationTriangle
          className="text-red-500 text-6xl mx-auto mb-6"
        />

        <h1 className="text-3xl font-bold text-white mb-4">
          Something went wrong
        </h1>

        <p className="text-slate-400 mb-6">
          An unexpected error occurred while rendering this page.
        </p>

        {error && (
          <div className="bg-slate-900 rounded-xl p-4 mb-6 overflow-auto">
            <code className="text-red-400 text-sm">
              {error.message}
            </code>
          </div>
        )}

        <div className="flex justify-center gap-4">

          <button
            onClick={resetErrorBoundary}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-xl"
          >
            Try Again
          </button>

          <Link
            to="/"
            className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl"
          >
            Home
          </Link>

        </div>

      </div>

    </div>
  );
}