export default function PageLoader({ message = "Loading Smart Grid Dashboard..." }) {
  return (
    <div
      className="flex justify-center items-center min-h-[70vh] animate-fadeIn"
      role="status"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-teal-500/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-t-teal-500 rounded-full animate-spin" />
          <div className="absolute inset-2 border-4 border-teal-500/10 rounded-full" />
          <div className="absolute inset-2 border-4 border-r-cyan-400 rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.8s" }} />
        </div>
        <div className="space-y-2 text-center">
          <p className="text-slate-300 text-lg font-medium">{message}</p>
          <p className="text-slate-500 text-sm animate-pulse">Please wait while we connect to the grid</p>
        </div>
      </div>
    </div>
  );
}