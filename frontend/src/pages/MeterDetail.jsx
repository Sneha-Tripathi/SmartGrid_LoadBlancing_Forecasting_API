import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBolt, FaMapMarkerAlt, FaChartLine, FaMicrochip, FaExclamationTriangle, FaHistory, FaClock, FaCheckCircle, FaTimesCircle, FaExclamationCircle, FaInfoCircle, FaCalendarAlt, FaWrench } from "react-icons/fa";
import DashboardLayout from "../components/layout/DashboardLayout";
import SkeletonLoader from "../components/common/SkeletonLoader";
import meterService from "../services/meterService";

const STATUS_STYLES = {
  Normal: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  Warning: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
  High: "bg-orange-500/15 text-orange-400 border border-orange-500/20",
  Critical: "bg-red-500/15 text-red-400 border border-red-500/20",
};

const SEVERITY_STYLES = {
  Critical: "text-red-400 bg-red-500/10",
  Warning: "text-amber-400 bg-amber-500/10",
  Info: "text-cyan-400 bg-cyan-500/10",
};

const EVENT_TYPE_STYLES = {
  error: { icon: FaTimesCircle, color: "text-red-400", bg: "bg-red-500/10" },
  warning: { icon: FaExclamationCircle, color: "text-amber-400", bg: "bg-amber-500/10" },
  success: { icon: FaCheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  info: { icon: FaInfoCircle, color: "text-cyan-400", bg: "bg-cyan-500/10" },
};

const TABS = [
  { id: "overview", label: "Overview", icon: FaBolt },
  { id: "history", label: "History", icon: FaHistory },
  { id: "alerts", label: "Alerts", icon: FaExclamationTriangle },
  { id: "timeline", label: "Timeline", icon: FaClock },
];

export default function MeterDetail() {
  const { meterId } = useParams();
  const navigate = useNavigate();
  const [meter, setMeter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await meterService.getMeter(meterId);
        setMeter(result);
      } catch (err) {
        console.error("Failed to fetch meter:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [meterId]);

  if (loading) {
    return (
      <DashboardLayout>
        <button onClick={() => navigate("/meters")}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition group">
          <FaArrowLeft className="group-hover:-translate-x-1 transition" />
          Back to Meters
        </button>
        <SkeletonLoader variant="detail" />
      </DashboardLayout>
    );
  }

  if (!meter) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <FaExclamationTriangle className="text-5xl text-slate-600 mx-auto mb-4" />
            <h2 className="text-2xl text-white font-bold">Meter Not Found</h2>
            <p className="text-slate-400 mt-2">The meter {meterId} could not be found.</p>
            <button onClick={() => navigate("/meters")} className="mt-6 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition">Back to Meters</button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Back button */}
      <button
        onClick={() => navigate("/meters")}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition group"
      >
        <FaArrowLeft className="group-hover:-translate-x-1 transition" />
        Back to Meters
      </button>

      {/* Meter Header Card */}
      <section className="bg-[#101827] border border-slate-800 rounded-2xl p-6 mb-6 hover:border-cyan-500/30 transition-all duration-300">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-600 to-teal-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <FaBolt className="text-white text-2xl" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-white">{meter.meter_id}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[meter.status] || STATUS_STYLES.Normal}`}>
                  <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${
                    meter.status === "Normal" ? "bg-emerald-400" :
                    meter.status === "Warning" ? "bg-amber-400" :
                    meter.status === "High" ? "bg-orange-400" :
                    "bg-red-400"
                  }`} />
                  {meter.status}
                </span>
              </div>
              <p className="text-slate-400 mt-1">{meter.zone} — {meter.location || "Location not set"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-500 text-sm">Consumer:</span>
            <span className="text-white font-medium">{meter.consumer || "N/A"}</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800">
          <QuickStat label="Load" value={meter.load} icon={FaChartLine} color="text-cyan-400" />
          <QuickStat label="Voltage" value={meter.voltage || "--"} icon={FaBolt} color="text-teal-400" />
          <QuickStat label="Frequency" value={meter.frequency || "--"} icon={FaMicrochip} color="text-emerald-400" />
          <QuickStat label="Current" value={meter.current || "--"} icon={FaChartLine} color="text-amber-400" />
          <QuickStat label="Power Factor" value={meter.power_factor || "--"} icon={FaMicrochip} color="text-purple-400" />
          <QuickStat label="Type" value={meter.type || "--"} icon={FaMicrochip} color="text-sky-400" />
          <QuickStat label="Install Date" value={meter.install_date || "--"} icon={FaCalendarAlt} color="text-slate-400" />
          <QuickStat label="Last Maintenance" value={meter.last_maintenance || "--"} icon={FaWrench} color="text-slate-400" />
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-[#101827] border border-slate-800 rounded-2xl overflow-hidden">
        <div className="flex border-b border-slate-800 overflow-x-auto">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/5"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/30"
                }`}
              >
                <Icon /> {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {activeTab === "overview" && <MeterOverview meter={meter} />}
          {activeTab === "history" && <MeterHistory history={meter.history} />}
          {activeTab === "alerts" && <MeterAlerts alerts={meter.alerts} />}
          {activeTab === "timeline" && <MeterTimeline timeline={meter.timeline} />}
        </div>
      </section>
    </DashboardLayout>
  );
}

function QuickStat({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-[#0B1220] rounded-xl p-4 border border-slate-800/50">
      <div className="flex items-center gap-2 mb-1">
        <Icon className={color} />
        <span className="text-slate-500 text-xs">{label}</span>
      </div>
      <p className="text-white font-semibold text-lg">{value}</p>
    </div>
  );
}

function MeterOverview({ meter }) {
  const totalAlerts = (meter.alerts && meter.alerts.length) || 0;
  const unresolvedAlerts = (meter.alerts && meter.alerts.filter(a => !a.resolved).length) || 0;
  const totalEvents = (meter.timeline && meter.timeline.length) || 0;
  const historyCount = (meter.history && meter.history.length) || 0;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-[#0B1220] rounded-xl p-6 border border-slate-800/50 text-center">
        <FaHistory className="text-3xl text-cyan-400 mx-auto mb-3" />
        <p className="text-3xl font-bold text-white">{historyCount}</p>
        <p className="text-slate-400 text-sm mt-1">History Records</p>
      </div>
      <div className="bg-[#0B1220] rounded-xl p-6 border border-slate-800/50 text-center">
        <FaExclamationTriangle className="text-3xl text-amber-400 mx-auto mb-3" />
        <p className="text-3xl font-bold text-white">{unresolvedAlerts}</p>
        <p className="text-slate-400 text-sm mt-1">Active Alerts / {totalAlerts} Total</p>
      </div>
      <div className="bg-[#0B1220] rounded-xl p-6 border border-slate-800/50 text-center">
        <FaClock className="text-3xl text-teal-400 mx-auto mb-3" />
        <p className="text-3xl font-bold text-white">{totalEvents}</p>
        <p className="text-slate-400 text-sm mt-1">Timeline Events</p>
      </div>
    </div>
  );
}

function MeterHistory({ history }) {
  if (!history || history.length === 0) {
    return <EmptyTab message="No history records available for this meter." />;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="text-left py-3 px-3 text-slate-400 text-sm">Date</th>
            <th className="text-left py-3 px-3 text-slate-400 text-sm">Load</th>
            <th className="text-left py-3 px-3 text-slate-400 text-sm">Voltage</th>
            <th className="text-left py-3 px-3 text-slate-400 text-sm">Frequency</th>
            <th className="text-left py-3 px-3 text-slate-400 text-sm">Status</th>
          </tr>
        </thead>
        <tbody>
          {history.map((record, i) => (
            <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/40 transition">
              <td className="py-3 px-3 text-white text-sm">{record.date}</td>
              <td className="py-3 px-3 text-slate-300 text-sm">{record.load}</td>
              <td className="py-3 px-3 text-slate-300 text-sm">{record.voltage}</td>
              <td className="py-3 px-3 text-slate-300 text-sm">{record.frequency}</td>
              <td className="py-3 px-3">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[record.status] || STATUS_STYLES.Normal}`}>
                  {record.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MeterAlerts({ alerts }) {
  if (!alerts || alerts.length === 0) {
    return <EmptyTab message="No alerts for this meter." />;
  }
  return (
    <div className="space-y-3">
      {alerts.map((alert, i) => {
        const severityStyle = SEVERITY_STYLES[alert.severity] || SEVERITY_STYLES.Info;
        return (
          <div key={i} className={`flex items-start gap-4 p-4 rounded-xl border border-slate-800 ${!alert.resolved ? "bg-[#0B1220]" : "bg-[#0B1220]/50 opacity-60"}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${severityStyle}`}>
              <FaExclamationTriangle />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-white font-semibold">{alert.type}</h4>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${severityStyle}`}>
                  {alert.severity}
                </span>
                {alert.resolved && (
                  <span className="text-emerald-400 text-xs flex items-center gap-1 ml-auto">
                    <FaCheckCircle /> Resolved
                  </span>
                )}
              </div>
              <p className="text-slate-300 text-sm mt-1">{alert.message}</p>
              <p className="text-slate-500 text-xs mt-1.5">{alert.time}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MeterTimeline({ timeline }) {
  if (!timeline || timeline.length === 0) {
    return <EmptyTab message="No timeline events for this meter." />;
  }
  return (
    <div className="relative">
      <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-800" />
      <div className="space-y-6">
        {timeline.map((event, i) => {
          const eventStyle = EVENT_TYPE_STYLES[event.type] || EVENT_TYPE_STYLES.info;
          const Icon = eventStyle.icon;
          return (
            <div key={i} className="relative flex items-start gap-5 pl-0">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 z-10 ${eventStyle.bg}`}>
                <Icon className={eventStyle.color} />
              </div>
              <div className="flex-1 pt-2">
                <p className="text-white font-medium">{event.event}</p>
                <p className="text-slate-500 text-xs mt-1">{event.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EmptyTab({ message }) {
  return (
    <div className="text-center py-12">
      <FaInfoCircle className="text-4xl text-slate-600 mx-auto mb-3" />
      <p className="text-slate-500">{message}</p>
    </div>
  );
}
