import { useState, useEffect, useCallback } from "react";
import {
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle,
  FaBell,
  FaFilter,
  FaTimes,
  FaRedo,
  FaExclamationCircle,
} from "react-icons/fa";
import DashboardLayout from "../components/layout/DashboardLayout";
import SkeletonLoader from "../components/common/SkeletonLoader";
import EmptyState from "../components/common/EmptyState";
import ErrorMessage from "../components/common/ErrorMessage";
import { useWebSocketContext } from "../context/WebSocketContext";

const SEVERITY_ORDER = { Critical: 0, Warning: 1, Info: 2 };

const SEVERITY_STYLES = {
  Critical: {
    icon: FaExclamationCircle,
    border: "border-red-500",
    bg: "bg-red-500/10",
    text: "text-red-400",
    badge: "bg-red-500/20 text-red-400",
  },
  Warning: {
    icon: FaExclamationTriangle,
    border: "border-amber-500",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    badge: "bg-amber-500/20 text-amber-400",
  },
  Info: {
    icon: FaInfoCircle,
    border: "border-cyan-500",
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    badge: "bg-cyan-500/20 text-cyan-400",
  },
};

const SEVERITIES = ["All", "Critical", "Warning", "Info"];

function getTimeAgo(dateStr) {
  if (!dateStr) return "";
  try {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  } catch {
    return dateStr;
  }
}

function AlertIcon({ severity }) {
  const style = SEVERITY_STYLES[severity] || SEVERITY_STYLES.Info;
  const Icon = style.icon;
  return (
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${style.bg}`}>
      <Icon className={style.text} />
    </div>
  );
}

export default function Alerts() {
  const { liveData, connected } = useWebSocketContext();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");
  const [showResolved, setShowResolved] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const initialAlerts = [
        { id: "alert-1", type: "Critical Overload", severity: "Critical", message: "MTR-1010 in Central Zone at 6.1 MW — near capacity. Immediate action required.", time: new Date(Date.now() - 60000).toISOString(), resolved: false, source: "MTR-1010" },
        { id: "alert-2", type: "Voltage Instability", severity: "Critical", message: "Voltage fluctuating 238-242V in Central Zone. Grid stability at risk.", time: new Date(Date.now() - 480000).toISOString(), resolved: false, source: "MTR-1010" },
        { id: "alert-3", type: "High Load", severity: "Warning", message: "MTR-1007 in South Zone load at 5.23 MW. Approaching critical threshold.", time: new Date(Date.now() - 600000).toISOString(), resolved: false, source: "MTR-1007" },
        { id: "alert-4", type: "Overload Warning", severity: "Warning", message: "MTR-1004 in West Zone exceeded 4.5 MW threshold. Monitoring required.", time: new Date(Date.now() - 1200000).toISOString(), resolved: true, source: "MTR-1004" },
        { id: "alert-5", type: "System Check", severity: "Info", message: "Routine grid diagnostics completed. All systems operational.", time: new Date(Date.now() - 3600000).toISOString(), resolved: true, source: "System" },
        { id: "alert-6", type: "Frequency Drift", severity: "Warning", message: "Frequency deviation detected in West Zone. Grid synchronization check needed.", time: new Date(Date.now() - 7200000).toISOString(), resolved: false, source: "MTR-1004" },
        { id: "alert-7", type: "Maintenance Reminder", severity: "Info", message: "Scheduled maintenance for MTR-1005 in Central Zone due tomorrow.", time: new Date(Date.now() - 14400000).toISOString(), resolved: false, source: "MTR-1005" },
      ];
      setAlerts(initialAlerts);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!liveData?.status || !liveData?.alert) return;
    const newAlert = {
      id: `live-${Date.now()}`,
      type: liveData.status === "Critical" ? "Critical Alert" : liveData.status === "Warning" ? "Warning" : "Status Update",
      severity: liveData.status === "Critical" ? "Critical" : liveData.status === "Warning" ? "Warning" : "Info",
      message: liveData.alert,
      time: new Date().toISOString(),
      resolved: liveData.status === "Normal",
      source: "Live Grid",
    };
    setAlerts((prev) => [newAlert, ...prev].slice(0, 50));
  }, [liveData]);

  const handleResolve = useCallback((alertId) => {
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, resolved: true } : a)));
  }, []);

  const handleDismiss = useCallback((alertId) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  }, []);

  const handleClearAll = useCallback(() => {
    setAlerts((prev) => prev.filter((a) => !a.resolved));
  }, []);

  let filteredAlerts = filter === "All" ? alerts : alerts.filter((a) => a.severity === filter);
  if (!showResolved) {
    filteredAlerts = filteredAlerts.filter((a) => !a.resolved);
  }

  filteredAlerts.sort((a, b) => {
    if (a.resolved !== b.resolved) return a.resolved ? 1 : -1;
    const severityDiff = (SEVERITY_ORDER[a.severity] ?? 2) - (SEVERITY_ORDER[b.severity] ?? 2);
    if (severityDiff !== 0) return severityDiff;
    return new Date(b.time) - new Date(a.time);
  });

  const activeCount = alerts.filter((a) => !a.resolved).length;
  const criticalCount = alerts.filter((a) => a.severity === "Critical" && !a.resolved).length;

  return (
    <DashboardLayout>
      <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-5">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <FaBell className="text-cyan-400" />
              Alerts & Notifications
            </h1>
            {activeCount > 0 && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">
                {activeCount} Active
              </span>
            )}
            {criticalCount > 0 && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/30 text-red-300 border border-red-500/50">
                {criticalCount} Critical
              </span>
            )}
          </div>
          <p className="text-slate-400 mt-2">Monitor and manage grid alerts in real-time.</p>
          <div className="flex items-center gap-4 mt-3 text-sm">
            <span className="flex items-center gap-1 text-slate-500">
              <FaExclamationTriangle className="text-red-400" />
              <span>Live: {connected ? "Connected" : "Disconnected"}</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500">{alerts.length} total alerts</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {activeCount > 0 && (
            <button onClick={handleClearAll} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-sm">
              <FaTimes /> Clear Resolved
            </button>
          )}
        </div>
      </section>

      {!loading && !error && (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Alerts", value: alerts.length, color: "text-white" },
            { label: "Active", value: activeCount, color: "text-amber-400" },
            { label: "Critical", value: criticalCount, color: "text-red-400" },
            { label: "Resolved", value: alerts.filter((a) => a.resolved).length, color: "text-emerald-400" },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#101827] border border-slate-800 rounded-2xl p-5">
              <p className="text-slate-400 text-sm">{stat.label}</p>
              <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </section>
      )}

      {!loading && !error && (
        <section className="bg-[#101827] border border-slate-800 rounded-2xl p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2 text-slate-400">
              <FaFilter className="text-xs" />
              <span className="text-sm">Severity:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SEVERITIES.map((s) => (
                <button key={s} onClick={() => setFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filter === s ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}>
                  {s}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button onClick={() => setShowResolved(!showResolved)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${showResolved ? "bg-slate-800 text-slate-400" : "bg-teal-600/20 text-teal-400"}`}>
                {showResolved ? "Showing All" : "Active Only"}
              </button>
            </div>
          </div>
        </section>
      )}

      {loading && (
        <section>
          <SkeletonLoader variant="alert" count={5} />
        </section>
      )}

      {error && !loading && (
        <section className="mb-8">
          <ErrorMessage title="Failed to Load Alerts" message={error.message || "Unable to fetch alerts data. Please try again."} />
          <div className="mt-4">
            <button onClick={() => { setError(null); setLoading(true); }} className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition text-sm">Retry</button>
          </div>
        </section>
      )}

      {!loading && !error && filteredAlerts.length === 0 && (
        <section>
          <EmptyState title="No Alerts" description={filter !== "All" || !showResolved ? "No alerts match your current filters." : "All clear! No alerts to display."} />
        </section>
      )}

      {!loading && !error && filteredAlerts.length > 0 && (
        <section className="space-y-3">
          {filteredAlerts.map((alert) => {
            const style = SEVERITY_STYLES[alert.severity] || SEVERITY_STYLES.Info;
            return (
              <div key={alert.id} className={`relative group bg-[#101827] border-l-4 ${style.border} border-t border-r border-b border-slate-800 rounded-r-2xl p-5 transition-all duration-300 hover:bg-[#151e30] ${alert.resolved ? "opacity-60" : ""}`}>
                <div className="flex items-start gap-4">
                  <AlertIcon severity={alert.severity} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`text-white font-semibold ${alert.resolved ? "line-through" : ""}`}>{alert.type}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${style.badge}`}>{alert.severity}</span>
                      {alert.resolved && <span className="flex items-center gap-1 text-emerald-400 text-xs"><FaCheckCircle /> Resolved</span>}
                      <span className="text-slate-600 text-xs ml-auto">{getTimeAgo(alert.time)}</span>
                    </div>
                    <p className="text-slate-300 text-sm mt-1.5 leading-relaxed">{alert.message}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-slate-500">Source: {alert.source}</span>
                      {!alert.resolved && (
                        <button onClick={() => handleResolve(alert.id)} className="text-xs text-emerald-400 hover:text-emerald-300 transition">Mark Resolved</button>
                      )}
                      <button onClick={() => handleDismiss(alert.id)} className="text-xs text-slate-500 hover:text-red-400 transition">Dismiss</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      )}
    </DashboardLayout>
  );
}
