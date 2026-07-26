import { memo } from "react";
import { FaInbox } from "react-icons/fa";

const EmptyState = memo(function EmptyState({
  title = "No Data Available",
  description = "No records found.",
  icon: Icon = FaInbox,
  action,
}) {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 animate-fadeIn"
      role="status"
      aria-label={title}
    >
      <div className="glass-card rounded-2xl p-8 flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
          <Icon className="text-3xl text-slate-500" />
        </div>
        <h2 className="text-xl font-semibold text-white">
          {title}
        </h2>
        <p className="text-slate-400 mt-2 text-center max-w-sm">
          {description}
        </p>
        {action && (
          <div className="mt-6">
            {action}
          </div>
        )}
      </div>
    </div>
  );
});

export default EmptyState;
