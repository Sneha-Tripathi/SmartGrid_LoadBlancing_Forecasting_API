export default function TableLoader({ rows = 5 }) {
  return (
    <div
      className="bg-[#101827] border border-slate-800 rounded-2xl p-6"
      role="status"
      aria-label="Loading table data"
    >
      <div className="h-6 w-52 bg-slate-700 rounded mb-6 animate-pulse" />

      <div className="space-y-4">
        {/* Header skeleton */}
        <div className="grid grid-cols-5 gap-4 animate-pulse">
          {[1,2,3,4,5].map((col) => (
            <div key={`h-${col}`} className="h-4 rounded bg-slate-600" />
          ))}
        </div>

        {Array.from({ length: rows }).map((_, row) => (
          <div
            key={row}
            className="grid grid-cols-5 gap-4 animate-pulse"
            style={{ animationDelay: `${row * 80}ms` }}
          >
            <div className="h-5 rounded bg-slate-700"></div>
            <div className="h-5 rounded bg-slate-700"></div>
            <div className="h-5 rounded bg-slate-700"></div>
            <div className="h-5 rounded bg-slate-700"></div>
            <div className="h-5 rounded bg-slate-700"></div>
          </div>
        ))}
      </div>
    </div>
  );
}