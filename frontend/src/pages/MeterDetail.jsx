import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaMicrochip,
  FaArrowLeft,
  FaBolt,
  FaExclamationTriangle,
  FaHistory,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
} from "react-icons/fa";
import DashboardLayout from "../components/layout/DashboardLayout";
import PageLoader from "../components/common/PageLoader";
import ErrorMessage from "../components/common/ErrorMessage";
import api from "../services/api";

const getStatusStyle = (status) => {
  switch (status) {
    case "Normal": return "bg-green-500/20 text-green-400 border-green-500/30";
    case "Warning": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "High": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    case "Critical": return "bg-red-500/20 text-red-400 border-red-500/30";
    default: return "bg-slate-500/20 text-slate-300 border-slate-500/30";
  }
};

const getTimelineIcon = (type) => {
  switch (type) {
    case "error": return <FaTimesCircle className="text-red-400" />;
    case "warning": return <FaExclamationTriangle className="text-yellow-400" />;
    case "success": return <FaCheckCircle className="text-green-400" />;
    default: return <FaInfoCircle className="text-cyan-400" />;
  }
};

const getSeverityStyle = (severity) => {
  switch (severity) {
    case "Critical": return "bg-red-500/20 text-red-400 border-red-500/30";
    case "Warning": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "Info": return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
    default: return "bg-slate-500/20 text-slate-300 border-slate-500/30";
  }
};

export default function MeterDetail() {
  const { meterId } = useParams();
  const navigate = useNavigate();
  const [meter, setMeter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMeter = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/meters/${meterId}`);
      setMeter(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [meterId]);

  useEffect(() => { fetchMeter(); }, [fetchMeter]);

  if (loading) return <DashboardLayout><PageLoader /></DashboardLayout>;
  if (error) return (
    <DashboardLayout>
      <ErrorMessage title="Failed to Load Meter" message={error.response?.data?.detail || error.message} onRetry={fetchMeter} />
    </DashboardLayout>
  );
  if (!meter) return null;

  const infoCards = [
    { label: "Zone", value: meter.zone, icon: FaMicrochip, color: "text-cyan-400" },
    { label: "Load", value: meter.load, icon: FaBolt, color: "text-yellow-400" },
    { label: "Voltage", value: meter.voltage || "--", icon: FaBolt, color: "text-green-400" },
    { label: "Frequency", value: meter.frequency || "--", icon: FaClock, color: "text-purple-400" },
  ];

  return (
    <DashboardLayout>
      <section className="mb-8">
        <button onClick={() => navigate("/meters")} className="flex items-center gap-2 text-slate-400 hover:text-white transition mb-4">
          <FaArrowLeft /> Back to Meters
        </button>
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-white">{meter.meter_id}</h1>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(meter.status)}`}>{meter.status}</span>
        </div>
        <p className="text-slate-400 mt-1">{meter.location || meter.zone}</p>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {infoCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-[#101827] border border-slate-800 rounded-2xl p-5 hover:border-cyan-500/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <p className="text-slate-400 text-xs">{card.label}</p>
                <Icon className={card.color} />
              </div>
              <p className="text-xl font-bold text-white">{card.value}</p>
            </div>
          );
        })}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-[#101827] border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <FaExclamationTriangle className="text-red-400" /> Alerts
          </h2>
          {meter.alerts && meter.alerts.length > 0 ? (
            <div className="space-y-3">
              {meter.alerts.map((alert, idx) => (
                <div key={idx} className="bg-[#0B1220] border border-slate-700 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getSeverityStyle(alert.severity)}`}>{alert.severity}</span>
                    <span className="text-xs text-slate-500">{alert.time}</span>
                  </div>
                  <p className="text-sm text-slate-300 mt-2">{alert.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">No active alerts.</p>
          )}
        </section>

        <section className="bg-[#101827] border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <FaHistory className="text-cyan-400" /> History
          </h2>
          {meter.history && meter.history.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-2 text-slate-400 text-xs font-medium">Date</th>
                    <th className="text-left py-2 text-slate-400 text-xs font-medium">Load</th>
                    <th className="text-left py-2 text-slate-400 text-xs font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {meter.history.slice(0, 10).map((rec, idx) => (
                    <tr key={idx} className="border-b border-slate-800">
                      <td className="py-2 text-slate-300 text-sm">{rec.date}</td>
                      <td className="py-2 text-slate-300 text-sm">{rec.load}</td>
                      <td className="py-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(rec.status)}`}>{rec.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-slate-500 text-sm">No history available.</p>
          )}
        </section>

        <section className="lg:col-span-2 bg-[#101827] border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <FaClock className="text-teal-400" /> Timeline
          </h2>
          {meter.timeline && meter.timeline.length > 0 ? (
            <div className="relative">
              <div className="absolute left-[19px] top-2 bottom-2 w-px bg-slate-700" />
              <div className="space-y-5">
                {meter.timeline.map((event, idx) => (
                  <div key={idx} className="relative flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#0B1220] border border-slate-700 flex items-center justify-center z-10">
                      {getTimelineIcon(event.type)}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-sm text-slate-400">{event.time}</p>
                      <p className="text-white font-medium mt-0.5">{event.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-slate-500 text-sm">No timeline events.</p>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
