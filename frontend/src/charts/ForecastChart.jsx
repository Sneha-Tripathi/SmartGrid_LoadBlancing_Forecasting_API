import { useState, useEffect, useCallback } from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceArea,
  Brush,
} from "recharts";

import useApi from "../hooks/useApi";
import energyService from "../services/energyService";
import { useWebSocketContext } from "../context/WebSocketContext";

const dummyForecast = [
  { day: "Mon", value: 300 },
  { day: "Tue", value: 340 },
  { day: "Wed", value: 320 },
  { day: "Thu", value: 360 },
  { day: "Fri", value: 390 },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-[#0B1220] border border-teal-500/30 rounded-xl px-4 py-3 shadow-xl shadow-teal-500/10">
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      {payload.map((entry, idx) => (
        <p key={idx} className="text-white font-bold text-lg">
          {entry.value}{" "}
          <span className="text-teal-400 text-sm font-normal">MW</span>
        </p>
      ))}
      <div className="mt-1.5 pt-1.5 border-t border-slate-700">
        <p className="text-slate-500 text-[10px]">AI Forecast</p>
      </div>
    </div>
  );
}

function CustomLegend() {
  return (
    <div className="flex items-center gap-4 mt-3 flex-wrap">
      <div className="flex items-center gap-2">
        <div className="w-8 h-[2px] rounded-full bg-gradient-to-r from-cyan-400 to-teal-400" />
        <span className="text-slate-400 text-xs">Forecasted Load</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-sm bg-teal-500/30 border border-teal-400/50" />
        <span className="text-slate-400 text-xs">Confidence Band</span>
      </div>
    </div>
  );
}

export default function ForecastChart() {
  const { data: apiData } = useApi(() => energyService.getForecast());
  const { liveData } = useWebSocketContext();

  const [data, setData] = useState(dummyForecast);
  const [refAreaLeft, setRefAreaLeft] = useState("");
  const [refAreaRight, setRefAreaRight] = useState("");
  const [zoomed, setZoomed] = useState(false);
  const [zoomLeft, setZoomLeft] = useState("");
  const [zoomRight, setZoomRight] = useState("");

  useEffect(() => {
    if (liveData?.chart_data?.forecast) {
      setData(liveData.chart_data.forecast);
    } else if (Array.isArray(apiData) && apiData.length > 0) {
      setData(apiData);
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
      setZoomLeft(refAreaLeft);
      setZoomRight(refAreaRight);
      setZoomed(true);
    }
    setRefAreaLeft("");
    setRefAreaRight("");
  }, [refAreaLeft, refAreaRight]);

  const handleZoomOut = () => {
    setZoomed(false);
    setZoomLeft("");
    setZoomRight("");
  };

  const filteredData =
    zoomed && zoomLeft && zoomRight
      ? data.filter((d) => d.day >= zoomLeft && d.day <= zoomRight)
      : data;

  const maxVal = Math.max(...data.map((d) => d.value));

  return (
    <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6 hover:border-teal-500/30 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl text-white font-semibold">
          AI Load Forecast
        </h2>
        {zoomed && (
          <button
            onClick={handleZoomOut}
            className="text-xs text-teal-400 hover:text-teal-300 border border-teal-500/30 rounded-lg px-3 py-1 transition"
          >
            Reset Zoom
          </button>
        )}
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart
          data={filteredData}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ cursor: refAreaLeft ? "ew-resize" : "default" }}
        >
          <defs>
            <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.6} />
              <stop offset="50%" stopColor="#14B8A6" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#14B8A6" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="forecastStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#14B8A6" />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />

          <XAxis
            dataKey="day"
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
            domain={[0, Math.ceil(maxVal / 100) * 100 + 50]}
          />

          <Tooltip content={<CustomTooltip />} />

          {/* Confidence band */}
          <Area
            type="monotone"
            dataKey="value"
            stroke="none"
            fill="url(#forecastGrad)"
            fillOpacity={0.3}
            animationBegin={200}
            animationDuration={1000}
            animationEasing="ease-out"
          />

          <Area
            type="monotone"
            dataKey="value"
            stroke="url(#forecastStroke)"
            strokeWidth={3}
            fill="none"
            dot={{ r: 4, fill: "#0B1220", stroke: "#14B8A6", strokeWidth: 2 }}
            activeDot={{ r: 6, fill: "#14B8A6", stroke: "#0B1220", strokeWidth: 3 }}
            animationBegin={0}
            animationDuration={1400}
            animationEasing="ease-out"
          />

          {refAreaLeft && refAreaRight && (
            <ReferenceArea
              x1={refAreaLeft}
              x2={refAreaRight}
              strokeOpacity={0.3}
              fill="rgba(20, 184, 166, 0.1)"
            />
          )}

          <Brush
            dataKey="day"
            height={20}
            stroke="#14B8A6"
            fill="#0B1220"
            travellerWidth={10}
            gap={5}
          />
        </AreaChart>
      </ResponsiveContainer>

      <CustomLegend />
    </div>
  );
}
