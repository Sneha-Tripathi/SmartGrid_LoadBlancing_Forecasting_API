/**
 * SkeletonLoader — supports variants: card, table, chart, alert, report, settings
 */
export default function SkeletonLoader({ variant = "card", count = 1, className = "" }) {
  if (variant === "card") {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 ${className}`}>
        {Array.from({ length: count || 4 }).map((_, i) => (
          <div key={i} className="bg-[#101827] border border-slate-800 rounded-2xl p-6 animate-pulse relative overflow-hidden">
            <div className="shimmer absolute inset-0" />
            <div className="flex justify-between items-center relative">
              <div className="space-y-3 flex-1">
                <div className="h-4 w-24 rounded bg-slate-700" />
                <div className="h-8 w-16 rounded bg-slate-600" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-700" />
            </div>
            <div className="mt-4 h-1 w-full rounded bg-slate-800" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "analytics-card") {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 ${className}`}>
        {Array.from({ length: count || 6 }).map((_, i) => (
          <div key={i} className="bg-[#101827] border border-slate-800 rounded-2xl p-5 animate-pulse">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-slate-700" />
              <div className="h-4 w-16 rounded bg-slate-700" />
            </div>
            <div className="mt-6 space-y-2">
              <div className="h-3 w-20 rounded bg-slate-700" />
              <div className="h-6 w-24 rounded bg-slate-600" />
            </div>
            <div className="mt-3 h-[2px] rounded-full bg-slate-800" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className={`bg-[#101827] border border-slate-800 rounded-2xl p-6 ${className}`}>
        <div className="h-6 w-48 bg-slate-700 rounded mb-6 animate-pulse" />
        <div className="space-y-4">
          {/* Header */}
          <div className="grid grid-cols-5 gap-4 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={`h-${i}`} className="h-4 rounded bg-slate-700" />
            ))}
          </div>
          {/* Rows */}
          {Array.from({ length: count || 5 }).map((_, row) => (
            <div key={row} className="grid grid-cols-5 gap-4 animate-pulse">
              {Array.from({ length: 5 }).map((_, col) => (
                <div key={`r${row}-c${col}`} className="h-5 rounded bg-slate-800" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "chart") {
    return (
      <div className={`bg-[#101827] border border-slate-800 rounded-2xl p-6 ${className}`}>
        <div className="flex items-center justify-between mb-5">
          <div className="h-5 w-40 bg-slate-700 rounded animate-pulse" />
          <div className="h-4 w-20 bg-slate-700 rounded animate-pulse" />
        </div>
        <div className="h-[280px] flex items-end justify-around gap-2 px-4 animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="w-full bg-slate-700/50 rounded-t-lg"
              style={{ height: `${40 + Math.random() * 60}%` }}
            />
          ))}
        </div>
        <div className="flex justify-center gap-4 mt-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-700" />
              <div className="h-3 w-16 bg-slate-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "alert") {
    return (
      <div className={`bg-[#101827] border border-slate-800 rounded-2xl p-6 ${className}`}>
        <div className="h-5 w-24 bg-slate-700 rounded mb-6 animate-pulse" />
        <div className="space-y-4">
          {Array.from({ length: count || 4 }).map((_, i) => (
            <div key={i} className="border-l-4 border-slate-700 bg-slate-900 rounded-xl p-4 animate-pulse">
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-slate-700 flex-shrink-0 mt-1" />
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between">
                    <div className="h-4 w-16 bg-slate-700 rounded" />
                    <div className="h-3 w-12 bg-slate-700 rounded" />
                  </div>
                  <div className="h-3 w-full bg-slate-800 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "report") {
    return (
      <div className={`space-y-8 ${className}`}>
        {/* Report header */}
        <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6 animate-pulse">
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <div className="h-6 w-48 bg-slate-700 rounded" />
              <div className="h-4 w-72 bg-slate-700 rounded" />
            </div>
            <div className="h-10 w-32 bg-slate-700 rounded-xl" />
          </div>
        </div>
        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-[#101827] border border-slate-800 rounded-2xl p-5 animate-pulse">
              <div className="space-y-2">
                <div className="h-3 w-20 bg-slate-700 rounded" />
                <div className="h-8 w-16 bg-slate-600 rounded" />
              </div>
            </div>
          ))}
        </div>
        {/* Table skeleton */}
        <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6 animate-pulse">
          <div className="h-5 w-36 bg-slate-700 rounded mb-6" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="grid grid-cols-6 gap-4 mb-4">
              {Array.from({ length: 6 }).map((_, j) => (
                <div key={j} className={`h-4 rounded ${i === 0 ? "bg-slate-700" : "bg-slate-800"}`} />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "settings") {
    return (
      <div className={`space-y-8 ${className}`}>
        {/* Settings sections */}
        {Array.from({ length: 3 }).map((_, section) => (
          <div key={section} className="bg-[#101827] border border-slate-800 rounded-2xl p-6 animate-pulse">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-slate-700" />
              <div className="h-5 w-36 bg-slate-700 rounded" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {Array.from({ length: 4 }).map((_, field) => (
                <div key={field} className="space-y-2">
                  <div className="h-3 w-24 bg-slate-700 rounded" />
                  <div className="h-10 w-full bg-slate-800 rounded-lg" />
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <div className="h-10 w-32 bg-slate-700 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "pie-chart") {
    return (
      <div className={`bg-[#101827] border border-slate-800 rounded-2xl p-6 ${className}`}>
        <div className="h-5 w-36 bg-slate-700 rounded mb-5 animate-pulse" />
        <div className="flex items-center justify-center h-[300px]">
          <div className="w-[200px] h-[200px] rounded-full bg-slate-800 animate-pulse" />
        </div>
        <div className="flex justify-center gap-5 mt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-700" />
              <div className="h-3 w-12 bg-slate-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "detail") {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6 animate-pulse">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-700" />
              <div className="space-y-2">
                <div className="h-8 w-36 bg-slate-600 rounded" />
                <div className="h-4 w-48 bg-slate-700 rounded" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-[#0B1220] rounded-xl p-4 space-y-2">
                <div className="h-3 w-16 bg-slate-700 rounded" />
                <div className="h-5 w-20 bg-slate-600 rounded" />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6 animate-pulse">
          <div className="flex gap-6 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-8 w-24 bg-slate-700 rounded-lg" />
            ))}
          </div>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="grid grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={j} className="h-4 bg-slate-800 rounded" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 ${className}`}>
      {Array.from({ length: count || 4 }).map((_, i) => (
        <div key={i} className="bg-[#101827] border border-slate-800 rounded-2xl p-6 animate-pulse">
          <div className="flex justify-between items-center">
            <div className="space-y-3">
              <div className="h-4 w-24 rounded bg-slate-700" />
              <div className="h-8 w-16 rounded bg-slate-600" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-700" />
          </div>
        </div>
      ))}
    </div>
  );
}
