import { Suspense, lazy } from "react";

const AppRoutes = lazy(() => import(/* webpackChunkName: "routes" */ "./routes/AppRoutes"));

function AppLoader() {
  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
        <div className="space-y-2 text-center">
          <p className="text-white font-semibold">Smart Grid Platform</p>
          <p className="text-slate-500 text-sm animate-pulse">Loading application...</p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<AppLoader />}>
      <AppRoutes />
    </Suspense>
  );
}
