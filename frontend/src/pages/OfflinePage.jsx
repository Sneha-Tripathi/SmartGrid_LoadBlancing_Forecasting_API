import { memo } from "react";
import { FaWifi, FaRedo } from "react-icons/fa";

const OfflinePage = memo(function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="relative inline-block mb-6">
          <FaWifi className="text-yellow-400 text-6xl" />
          <div className="absolute top-2 right-0 w-6 h-1 bg-red-500 rotate-45" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">No Internet Connection</h1>
        <p className="text-slate-400 mb-8">You appear to be offline. Please check your connection and try again.</p>
        <button onClick={() => window.location.reload()} className="flex items-center gap-2 mx-auto px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition">
          <FaRedo /> Retry
        </button>
      </div>
    </div>
  );
});

export default OfflinePage;
