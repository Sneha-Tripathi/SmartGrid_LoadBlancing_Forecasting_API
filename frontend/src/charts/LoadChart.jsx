import { useState, useEffect, useCallback } from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceArea,
  Brush,
  Legend,
} from "recharts";

import useApi from "../hooks/useApi";
import energyService from "../services/energyService";
import { useWebSocketContext } from "../context/WebSocketContext";

const dummyData = [
  { time: "10 AM", load: 210, forecast: 220 },
  { time: "11 AM", load: 240, forecast: 235 },
  { time: "12 PM", load: 280, forecast: 270 },
  { time: "1 PM", load: 260, forecast: 265 },
  { time: "2 PM", load: 310, forecast: 295 },
  { time: "3 PM", load: 295, forecast: 300 },
  { time: "4 PM", load: 330, forecast: 315 },
  { time: "5 PM", load: 350, forecast: 340 },
  { time: "6 PM", load: 320, forecast: 325 },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-[#0B1220] border border-cyan-500/30 rounded-xl px-4 py-3 shadow-xl shadow-cyan-500/10">
      <p className="text-slate-300 text-xs font-medium mb-2">{label}</p>
      {payload.map((entry, idx) => (
        <div key={idx} className="flex items-center gap-2 text-sm mb-1">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-slate-400">{entry.name}:</span>
          <span className="text-white font-semibold">{entry.value} MW</span>
        </div>
      ))}
    </div>
  );
}

const renderLegend = (props) => {
  const { payload } = props;
  return (
    <div className="flex items-center gap-6 mt-3 flex-wrap justify-center">
      {payload.map((entry, index) => (
        <div key={`item-${index}`} className="flex items-center gap-2">
          <div
            className="w-8 h-[2px] rounded-full"
            style={{
              background:
                entry.value === "load"
                  ? "linear-gradient(to right, #06B6D4, #0891B2)"
                  : "linear-gradient(to right, #FACC15, #D97706)",
            }}
          />
          <span className="text-slate-400 text-xs capitalize">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function LoadChart() {
  const { data: apiData, loading, error } = useApi(() =>
    energyService.getLoadTrend()
  );
  const { liveData } = useWebSocketContext();

  const [data, setData] = useState(dummyData);
  const [refAreaLeft, setRefAreaLeft] = useState("");
  const [refAreaRight, setRefAreaRight] = useState("");
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    const wsData = liveData?.chart_data?.load_trend;
    if (wsData && wsData.length > 0) {
      const enriched = wsData.map((d, i) => ({
        ...d,
        forecast: typeof d.forecast === "number" ? d.forecast : d.load + Math.round((Math.random() - 0.3) * 30),
      }));
      setData(enriched);
    } else if (Array.isArray(apiData) && apiData.length > 0) {
      const enriched = apiData.map((d) => ({
        ...d,
        forecast: d.forecast ?? d.load + Math.round((Math.random() - 0.3) * 30),
      }));
      setData(enriched);
    }
  }, [liveData, apiData]);

  const handleMouseDown = useCallback((e) => {
    if (e?.activeLabel) {
      setRefAreaLeft(e.activeLabel);
      setRefAreaRight("");
    }
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (refAreaLeft && e?.activeLabel) {
        setRefAreaRight(e.activeLabel);
      }
    },
    [refAreaLeft]
  );

  const handleMouseUp = useCallback(() => {
    if (refAreaLeft && refAreaRight) {
      setZoomed(true);
    }
    setRefAreaLeft("");
    setRefAreaRight("");
  }, [refAreaLeft, refAreaRight]);

  const handleZoomOut = () => setZoomed(false);

  if (loading) {
    return (
      <div className="bg-[#101827] h-80 rounded-2xl animate-pulse" />
    );
  }

  if (error) {
    console.warn("Using dummy Load Chart data.");
  }

  const filteredData = zoomed && refAreaLeft && refAreaRight
    ? data.filter(
        (d) =>
          d.time >= refAreaLeft &&
          d.time <= refAreaRight
      )
    : data;

  return (
    <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl text-white font-semibold">
          Energy Load Trend
        </h2>
        {zoomed && (
          <button
            onClick={handleZoomOut}
            className="text-xs text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 rounded-lg px-3 py-1 transition"
          >
            Reset Zoom
          </button>
        )}
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={filteredData}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ cursor: refAreaLeft ? "ew-resize" : "default" }}
        >
          <defs>
            <linearGradient id="loadStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#0891B2" />
            </linearGradient>
            <linearGradient id="forecastStrokeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />

          <XAxis
            dataKey="time"
            stroke="#64748B"
            tick={{ fill: "#94A3B8", fontSize: 12 }}
            axisLine={{ stroke: "#334155" }}
            tickLine={false}
          />

          <YAxis
            stroke="#64748B"
            tick={{ fill: "#94A3B8", fontSize: 12 }}
            axisLine={{ stroke: "#334155" }}
            tickLine={false}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend content={renderLegend} />

          <Line
            type="monotone"
            dataKey="load"
            name="load"
            stroke="url(#loadStroke)"
            strokeWidth={3}
            dot={{ r: 4, fill: "#0B1220", stroke: "#06B6D4", strokeWidth: 2 }}
            activeDot={{ r: 7, fill: "#06B6D4", stroke: "#0B1220", strokeWidth: 3 }}
            animationBegin={0}
            animationDuration={1200}
            animationEasing="ease-out"
          />

          <Line
            type="monotone"
            dataKey="forecast"
            name="forecast"
            stroke="url(#forecastStrokeGrad)"
            strokeWidth={2}
            strokeDasharray="6 3"
            dot={{ r: 3, fill: "#0B1220", stroke: "#FACC15", strokeWidth: 2 }}
            activeDot={{ r: 6, fill: "#FACC15", stroke: "#0B1220", strokeWidth: 3 }}
            animationBegin={300}
            animationDuration={1200}
            animationEasing="ease-out"
          />

          {refAreaLeft && refAreaRight && (
            <ReferenceArea
              x1={refAreaLeft}
              x2={refAreaRight}
              strokeOpacity={0.3}
              fill="rgba(6, 182, 212, 0.08)"
            />
          )}

          <Brush
            dataKey="time"
            height={20}
            stroke="#06B6D4"
            fill="#0B1220"
            travellerWidth={10}
            gap={5}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
