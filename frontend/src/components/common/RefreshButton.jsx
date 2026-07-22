import { FaSyncAlt } from "react-icons/fa";

export default function RefreshButton() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <button
      onClick={handleRefresh}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white transition"
    >
      <FaSyncAlt />
      Refresh Dashboard
    </button>
  );
}