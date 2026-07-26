import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell,
} from "recharts";
import {
  FaBrain,
  FaCalendarDay,
  FaCalendarWeek,
  FaBolt,
  FaChartLine,
  FaBullseye,
  FaDatabase,
  FaLightbulb,
  FaCheckCircle,
  FaBalanceScale,
  FaTools,
  FaArrowRight,
  FaClock,
  FaServer,
  FaLayerGroup,
  FaChartBar,
} from "react-icons/fa";

import DashboardLayout from "../components/layout/DashboardLayout";
import useApi from "../hooks/useApi";
import analyticsService from "../services/analyticsService";
import { useWebSocketContext } from "../context/WebSocketContext";
import PageLoader from "../components/common/PageLoader";
import RefreshButton from "../components/common/RefreshButton";
import ApiStatus from "../components/common/ApiStatus";

const recommendationIcons = {
  reduce_load: FaBolt,
  switch_backup: FaServer,
  balance_zones: FaBalanceScale,
  maintenance: FaTools,
};

const recommendationColors = {
  reduce_load: "from-amber-500 to-orange-600",
  switch_backup: "from-red-500 to-rose-600",
  balance_zones: "from-cyan-500 to-teal-600",
  maintenance: "from-violet-500 to-purple-600",
};

const impactBadge = {
  Critical: "bg-red-500/20 text-red-400 border-red-500/30",
  High: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Medium: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  Low: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

// -----------------------------------------------------------------------
// Tooltips
// -----------------------------------------------------------------------

function ForecastTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-[#0B1220] border border-cyan-500/30 rounded-xl px-4 py-3 shadow-xl shadow-cyan-500/10">
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      {payload.map((entry, idx) => (
        <p key={idx} className="text-white font-bold text-sm">
          {entry.name}: {entry.value}{" "}
          <span className="text-cyan-400 text-xs font-normal">MW</span>
        </p>
      ))}
    </div>
  );
}

// -----------------------------------------------------------------------
// SectionTitle
// -----------------------------------------------------------------------

function SectionTitle({ icon: Icon, title, subtitle, color = "from-cyan-500 to-teal-500" }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
        <Icon className="text-white text-lg" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
        {subtitle && <p className="text-slate-400 text-sm">{subtitle}</p>}
      </div>
      <div className="h-[2px] flex-1 ml-4 bg-gradient-to-r from-cyan-500/30 to-transparent" />
    </div>
  );
}

// -----------------------------------------------------------------------
// PeakLoadCard
// -----------------------------------------------------------------------

function PeakLoadCard({ data }) {
  if (!data) return null;
  const pct = data.current_load && data.predicted_peak
    ? Math.min(100, Math.round((data.current_load / data.predicted_peak) * 100))
    : 0;

  return (
    <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6 hover:border-amber-500/30 transition-all duration-300">
      <SectionTitle icon={FaChartLine} title="Peak Load Prediction" subtitle="Today's forecast" color="from-amber-500 to-orange-600" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0B1220] border border-slate-700 rounded-xl p-4">
          <p className="text-slate-400 text-xs">Predicted Peak</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">{data.predicted_peak} <span className="text-sm text-slate-500">{data.unit}</span></p>
        </div>
        <div className="bg-[#0B1220] border border-slate-700 rounded-xl p-4">
          <p className="text-slate-400 text-xs">Expected Time</p>
          <p className="text-2xl font-bold text-white mt-1">{data.expected_time}</p>
        </div>
        <div className="bg-[#0B1220] border border-slate-700 rounded-xl p-4">
          <p className="text-slate-400 text-xs">Current Load</p>
          <p className="text-2xl font-bold text-cyan-400 mt-1">{data.current_load} <span className="text-sm text-slate-500">{data.unit}</span></p>
        </div>
        <div className="bg-[#0B1220] border border-slate-700 rounded-xl p-4">
          <p className="text-slate-400 text-xs">Confidence</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{data.confidence}%</p>
        </div>
      </div>
      <div className="mt-5">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Current vs Peak</span>
          <span>{pct}%</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-1000" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------
// ConfidenceSection
// -----------------------------------------------------------------------

function ConfidenceSection({ data }) {
  if (!data) return null;
  const metrics = [
    { label: "Overall", value: data.overall, color: "text-emerald-400" },
    { label: "Hourly", value: data.hourly, color: "text-cyan-400" },
    { label: "Daily", value: data.daily, color: "text-blue-400" },
    { label: "Weekly", value: data.weekly, color: "text-violet-400" },
    { label: "Peak Load", value: data.peak_load, color: "text-amber-400" },
  ];

  return (
    <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/30 transition-all duration-300">
      <SectionTitle icon={FaBullseye} title="Prediction Confidence" subtitle="AI model accuracy metrics" color="from-emerald-500 to-teal-600" />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {metrics.map((m) => (
          <div key={m.label} className="bg-[#0B1220] border border-slate-700 rounded-xl p-4 text-center">
            <p className="text-slate-400 text-xs mb-1">{m.label}</p>
            <p className={`text-2xl font-bold ${m.color}`}>{m.value}%</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-6 text-xs text-slate-500 border-t border-slate-800 pt-4">
        <span className="flex items-center gap-1"><FaDatabase className="text-cyan-400" /> Model: {data.model_version}</span>
        <span className="flex items-center gap-1"><FaClock className="text-cyan-400" /> Last trained: {data.last_trained}</span>
        <span className="flex items-center gap-1"><FaLayerGroup className="text-cyan-400" /> Data points: {data.data_points.toLocaleString()}</span>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------
// HourlyPredictionChart (24h)
// -----------------------------------------------------------------------

function HourlyPredictionChart({ data }) {
  if (!data || !data.length) return null;
  return (
    <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300">
      <SectionTitle icon={FaCalendarDay} title="24-Hour Prediction" subtitle="Hourly load forecast with confidence bands" />
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="hourlyPredGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
          <XAxis dataKey="time" stroke="#64748B" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
          <YAxis stroke="#64748B" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
          <Tooltip content={<ForecastTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12, color: "#94A3B8" }} />
          <Area type="monotone" dataKey="upper_bound" stroke="none" fill="rgba(6, 182, 212, 0.08)" name="Upper Bound" />
          <Area type="monotone" dataKey="lower_bound" stroke="none" fill="rgba(6, 182, 212, 0.08)" name="Lower Bound" />
          <Area type="monotone" dataKey="predicted" stroke="#06B6D4" strokeWidth={2.5} fill="url(#hourlyPredGrad)" dot={false} activeDot={{ r: 5, fill: "#06B6D4", stroke: "#0B1220", strokeWidth: 2 }} name="Predicted Load" animationDuration={1200} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// -----------------------------------------------------------------------
// DailyPredictionChart (7 days)
// -----------------------------------------------------------------------

function DailyPredictionChart({ data }) {
  if (!data || !data.length) return null;
  return (
    <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6 hover:border-violet-500/30 transition-all duration-300">
      <SectionTitle icon={FaCalendarWeek} title="7-Day Prediction" subtitle="Daily load forecast" color="from-violet-500 to-purple-600" />
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
          <XAxis dataKey="day" stroke="#64748B" tick={{ fill: "#94A3B8", fontSize: 12 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
          <YAxis stroke="#64748B" tick={{ fill: "#94A3B8", fontSize: 12 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
          <Tooltip content={<ForecastTooltip />} />
          <Bar dataKey="predicted" name="Predicted Load" radius={[6, 6, 0, 0]} animationDuration={1200}>
            {data.map((entry, idx) => {
              const intensity = 0.5 + (entry.predicted / 450) * 0.5;
              return <Cell key={idx} fill={`url(#dailyBarGrad_${idx})`} />;
            })}
          </Bar>
          <defs>
            {data.map((entry, idx) => {
              const intensity = 0.5 + (entry.predicted / 450) * 0.5;
              return (
                <linearGradient key={idx} id={`dailyBarGrad_${idx}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={`rgba(139, 92, 246, ${intensity})`} />
                  <stop offset="100%" stopColor={`rgba(139, 92, 246, ${intensity * 0.4})`} />
                </linearGradient>
              );
            })}
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// -----------------------------------------------------------------------
// ForecastTable
// -----------------------------------------------------------------------

function ForecastTable({ hourlyData, dailyData }) {
  const [view, setView] = useState("hourly");
  const source = view === "hourly" ? hourlyData : dailyData;

  return (
    <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300">
      <SectionTitle icon={FaChartBar} title="Forecast Table" subtitle="Detailed prediction breakdown" />
      <div className="flex items-center gap-2 mb-5">
        <button onClick={() => setView("hourly")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${view === "hourly" ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/20" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}>
          <FaClock className="inline mr-1.5" /> 24-Hour
        </button>
        <button onClick={() => setView("daily")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${view === "daily" ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}>
          <FaCalendarWeek className="inline mr-1.5" /> 7-Day
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 text-slate-400 text-sm font-medium">{view === "hourly" ? "Time" : "Day"}</th>
              <th className="text-right py-3 text-slate-400 text-sm font-medium">Predicted (MW)</th>
              <th className="text-right py-3 text-slate-400 text-sm font-medium">Lower Bound</th>
              <th className="text-right py-3 text-slate-400 text-sm font-medium">Upper Bound</th>
              <th className="text-right py-3 text-slate-400 text-sm font-medium">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {source && source.length > 0 ? (
              source.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-800 hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 text-white font-medium"><span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />{row.time || row.day}</span></td>
                  <td className="py-3 text-right text-white font-semibold">{row.predicted}</td>
                  <td className="py-3 text-right text-slate-400">{row.lower_bound}</td>
                  <td className="py-3 text-right text-slate-400">{row.upper_bound}</td>
                  <td className="py-3 text-right">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.confidence >= 90 ? "bg-emerald-500/20 text-emerald-400" : row.confidence >= 80 ? "bg-amber-500/20 text-amber-400" : "bg-red-500/20 text-red-400"}`}>
                      {row.confidence}%
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} className="py-8 text-center text-slate-500">No forecast data available</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------
// RecommendationPanel
// -----------------------------------------------------------------------

function RecommendationPanel({ data }) {
  const [applied, setApplied] = useState({});

  const handleApply = (id) => {
    setApplied((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => setApplied((prev) => ({ ...prev, [id]: false })), 2000);
  };

  if (!data || !data.length) {
    return (
      <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6">
        <SectionTitle icon={FaLightbulb} title="AI Recommendations" subtitle="No recommendations available" color="from-amber-500 to-yellow-600" />
        <p className="text-slate-500 text-center py-8">AI analysis in progress...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6 hover:border-amber-500/30 transition-all duration-300">
      <SectionTitle icon={FaLightbulb} title="AI Recommendation Panel" subtitle="AI-generated grid optimization suggestions" color="from-amber-500 to-yellow-600" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {data.map((rec) => {
          const Icon = recommendationIcons[rec.type] || FaLightbulb;
          const grad = recommendationColors[rec.type] || "from-slate-500 to-slate-600";
          const isApplied = applied[rec.id];

          return (
            <div key={rec.id} className="relative group bg-[#0B1220] border border-slate-700 rounded-2xl p-5 hover:border-slate-600 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/5">
              <div className={`absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br ${grad} opacity-[0.04] rounded-full blur-3xl group-hover:opacity-[0.08] transition-opacity`} />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center shadow-lg`}><Icon className="text-white text-lg" /></div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${impactBadge[rec.impact] || impactBadge.Medium}`}>{rec.impact}</span>
                </div>
                <h3 className="text-white font-semibold text-base mb-1">{rec.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{rec.description}</p>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><FaBolt className="text-cyan-400" /> Save: {rec.savings}</span>
                    <span className="flex items-center gap-1"><FaArrowRight className="text-cyan-400" /> {rec.zone}</span>
                  </div>
                  <button onClick={() => handleApply(rec.id)} disabled={isApplied}
                    className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${isApplied ? "bg-emerald-600 text-white" : "bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/30 border border-cyan-500/30"}`}>
                    {isApplied ? <span className="flex items-center gap-1"><FaCheckCircle /> Applied</span> : rec.action}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------
// ForecastStatCards
// -----------------------------------------------------------------------

function ForecastStatCards({ peakLoad, confidence }) {
  const cards = [
    { title: "Peak Load Prediction", value: peakLoad?.predicted_peak ? `${peakLoad.predicted_peak} ${peakLoad.unit}` : "--", subtitle: `Expected at ${peakLoad?.expected_time || "--"}`, icon: FaChartLine, gradient: "from-amber-500 to-orange-600" },
    { title: "Prediction Confidence", value: confidence?.overall ? `${confidence.overall}%` : "--", subtitle: `Model ${confidence?.model_version || "--"}`, icon: FaBullseye, gradient: "from-emerald-500 to-teal-600" },
    { title: "AI Efficiency", value: confidence?.data_points ? `${(confidence.data_points / 1000).toFixed(1)}K` : "--", subtitle: "Data points analyzed", icon: FaBrain, gradient: "from-pink-500 to-rose-600" },
    { title: "Remaining Capacity", value: peakLoad?.remaining_capacity ? `${peakLoad.remaining_capacity} MW` : "--", subtitle: "Available headroom", icon: FaServer, gradient: "from-cyan-500 to-teal-600" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="relative group overflow-hidden bg-[#101827] border border-slate-800 rounded-2xl p-5 hover:border-cyan-500/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/5">
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${card.gradient} opacity-80`} />
            <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${card.gradient} opacity-[0.04] rounded-full blur-3xl group-hover:opacity-[0.08] transition-opacity duration-700`} />
            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg`}><Icon className="text-white text-lg" /></div>
              </div>
              <h3 className="text-slate-400 text-xs mt-4 font-medium">{card.title}</h3>
              <div className="mt-1 flex items-baseline gap-1"><span className="text-2xl font-bold text-white tracking-tight">{card.value}</span></div>
              <p className="text-slate-500 text-[11px] mt-1">{card.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// -----------------------------------------------------------------------
// Main Analytics Page
// -----------------------------------------------------------------------

export default function Analytics() {
  const { liveData } = useWebSocketContext();
  const { data: hourlyData, loading: hourlyLoading } = useApi(() => analyticsService.getForecastHourly());
  const { data: dailyData, loading: dailyLoading } = useApi(() => analyticsService.getForecastDaily());
  const { data: peakLoad, loading: peakLoading } = useApi(() => analyticsService.getForecastPeakLoad());
  const { data: confidence, loading: confLoading } = useApi(() => analyticsService.getForecastConfidence());
  const { data: recommendations, loading: recLoading } = useApi(() => analyticsService.getRecommendations());

  const [hourly, setHourly] = useState(null);
  const [daily, setDaily] = useState(null);
  const [peak, setPeak] = useState(null);
  const [conf, setConf] = useState(null);
  const [recs, setRecs] = useState(null);
  const loading = hourlyLoading || dailyLoading || peakLoading || confLoading || recLoading;

  useEffect(() => {
    const wsForecast = liveData?.chart_data?.forecast;
    if (wsForecast && wsForecast.length > 0) {
      setHourly(wsForecast.map((d, i) => ({
        time: `${6 + i}:00`,
        predicted: d.value,
        lower_bound: d.value - Math.round(Math.random() * 30 + 10),
        upper_bound: d.value + Math.round(Math.random() * 30 + 10),
        confidence: Math.round(85 + Math.random() * 10),
      })));
    } else if (hourlyData) {
      setHourly(hourlyData);
    }
    if (dailyData) setDaily(dailyData);
    if (peakLoad) setPeak(peakLoad);
    if (confidence) setConf(confidence);
    if (recommendations) setRecs(recommendations);
  }, [liveData, hourlyData, dailyData, peakLoad, confidence, recommendations]);

  if (loading && !hourly && !daily && !peak && !conf && !recs) {
    return (
      <DashboardLayout>
        <PageLoader />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <section className="flex flex-col xl:flex-row xl:items-center xl:justify-between mb-8 gap-5">
        <div>
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <FaBrain className="text-cyan-400" /> AI Forecast Module
          </h1>
          <p className="text-slate-400 mt-2">
            Advanced AI-powered load forecasting with 24-hour and 7-day predictions, confidence metrics, and smart recommendations.
          </p>

        </div>
        
      </section>

      <section className="mb-8"><ForecastStatCards peakLoad={peak} confidence={conf} /></section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <PeakLoadCard data={peak} />
        <ConfidenceSection data={conf} />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <HourlyPredictionChart data={hourly} />
        <DailyPredictionChart data={daily} />
      </section>

      <section className="mb-8"><ForecastTable hourlyData={hourly} dailyData={daily} /></section>

      <section className="mb-8"><RecommendationPanel data={recs} /></section>
    </DashboardLayout>
  );
}
