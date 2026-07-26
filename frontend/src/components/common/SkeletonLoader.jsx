import { memo } from "react";

const SkeletonLoader = memo(function SkeletonLoader({ variant = "default", rows = 3 }) {
  if (variant === "settings") {
    return (
      <div className="space-y-8 animate-pulse">
        {[1, 2, 3, 4].map((section) => (
          <div key={section} className="bg-[#101827] border border-slate-800 rounded-2xl p-6">
            <div className="h-6 w-48 bg-slate-700 rounded mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((field) => (
                <div key={field}>
                  <div className="h-4 w-24 bg-slate-700 rounded mb-2" />
                  <div className="h-10 w-full bg-slate-700 rounded-xl" />
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6 pt-4 border-t border-slate-800">
              <div className="h-10 w-36 bg-slate-700 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "report") {
    return (
      <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6 animate-pulse">
        <div className="h-6 w-40 bg-slate-700 rounded mb-6" />
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-4 border-b border-slate-800">
            <div className="h-5 w-5 bg-slate-700 rounded" />
            <div className="h-4 flex-1 bg-slate-700 rounded" />
            <div className="h-4 w-20 bg-slate-700 rounded" />
            <div className="h-4 w-24 bg-slate-700 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6 animate-pulse">
      <div className="h-6 w-40 bg-slate-700 rounded mb-6" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-800">
          <div className="h-4 flex-1 bg-slate-700 rounded" />
          <div className="h-4 w-16 bg-slate-700 rounded" />
        </div>
      ))}
    </div>
  );
});

export default SkeletonLoader;
