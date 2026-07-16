import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050816] text-white flex flex-col items-center justify-center">

      <h1 className="text-8xl font-bold text-teal-500">
        404
      </h1>

      <p className="mt-5 text-slate-400">
        Page Not Found
      </p>

      <Link
        to="/"
        className="
        mt-8
        px-6
        py-3
        rounded-xl
        bg-teal-700
        hover:bg-teal-600
        transition
        "
      >
        Back to Home
      </Link>

    </div>
  );
}