import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050816] text-white">

      <h1 className="text-8xl font-bold text-teal-400">
        404
      </h1>

      <h2 className="text-3xl font-semibold mt-4">
        Page Not Found
      </h2>

      <p className="text-slate-400 mt-3">
        The page you're looking for doesn't exist.
      </p>

      <Link
        to="/"
        className="mt-8 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 transition"
      >
        Back to Home
      </Link>

    </div>
  );
}