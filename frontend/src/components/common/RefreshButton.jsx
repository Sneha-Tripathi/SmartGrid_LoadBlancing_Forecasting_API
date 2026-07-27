import { memo, useCallback, useState } from "react";
import { FaSyncAlt } from "react-icons/fa";

const RefreshButton = memo(function RefreshButton({ onRefresh, label = "Refresh" }) {
  const [spinning, setSpinning] = useState(false);

  const handleRefresh = useCallback(() => {
    if (spinning) return;
    setSpinning(true);
    if (onRefresh) {
      onRefresh();
    } else {
      window.location.reload();
    }
    setTimeout(() => setSpinning(false), 1200);
  }, [onRefresh, spinning]);

  return (
    <button
      onClick={handleRefresh}
      disabled={spinning}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/25 active:scale-95 disabled:opacity-70"
      title={label}
      aria-label={label}
    >
      <FaSyncAlt className={`${spinning ? "animate-spin" : ""} transition-transform duration-300`} />
      <span className={spinning ? "animate-pulse" : ""}>{spinning ? "Refreshing..." : label}</span>
    </button>
  );
});

export default RefreshButton;
