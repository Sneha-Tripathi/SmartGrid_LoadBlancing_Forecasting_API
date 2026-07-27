import { useState, useCallback, useRef, useEffect } from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ReferenceArea,
  CartesianGrid,
} from "recharts";

import useApi from "../hooks/useApi";
import energyService from "../services/energyService";
import { useWebSocketContext } from "../context/WebSocketContext";

const dummyConsumption = [
  { zone: "North", power: 420 },
  { zone: "South", power: 350 },
  { zone: "East", power: 310 },
  { zone: "West", power: 390 },
];

const GRADIENT_COLORS = [
  ["#06B6D4", "#0891B2"],
  ["#14B8A6", "#0D9488"],
  ["#FACC15", "#D97706"],
  ["#EF4444", "#DC2626"],
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-[#0B1220] border border-cyan-500/30 rounded-xl px-4 py-3 shadow-xl shadow-cyan-500/10">
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      {payload.map((entry, idx) => (
        <p key={idx} className="text-white font-bold text-lg">
          {entry.value}{" "}
          <span className="text-cyan-400 text-sm font-normal">kW</span>
        </p>
      ))}
    </div>
  );
}

function CustomLegend() {
  return (
    <div className="flex items-center gap-4 mt-3 flex-wrap">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-cyan-500" />
        <span className="text-slate-400 text-xs">Zone Power</span>
      </div>
    </div>
  );
}

export default function ConsumptionBarChart() {
  const { data: apiData } = useApi(() => energyService.getConsumption());
  const { liveData } = useWebSocketContext();

  const [data, setData] = useState(dummyConsumption);
  const [zoomRange, setZoomRange] = useState({ left: null, right: null });
  const [refAreaLeft, setRefAreaLeft] = useState("");
  const [refAreaRight, setRefAreaRight] = useState("");
  const barRef = useRef(null);

  useEffect(() => {
    if (liveData?.chart_data?.consumption) {
      setData(liveData.chart_data.consumption);
    } else if (Array.isArray(apiData) && apiData.length > 0) {
      setData(apiData);
    }
  }, [liveData, apiData]);

  const handleMouseDown = useCallback((e) => {
    if (e?.activeLabel) setRefAreaLeft(e.activeLabel);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (refAreaLeft && e?.activeLabel) setRefAreaRight(e.activeLabel);
  }, [refAreaLeft]);

  const handleMouseUp = useCallback(() => {
    if (refAreaLeft && refAreaRight) {
      const left = Math.min(
        data.findIndex((d) => d.zone === refAreaLeft),
        data.findIndex((d) => d.zone === refAreaRight)
      );
      const right = Math.max(
        data.findIndex((d) => d.zone === refAreaLeft),
        data.findIndex((d) => d.zone === refAreaRight)
      );
      setZoomRange({ left: data[left]?.zone, right: data[right]?.zone });
    }
    setRefAreaLeft("");
    setRefAreaRight("");
  }, [refAreaLeft, refAreaRight, data]);

  const handleZoomOut = () => setZoomRange({ left: null, right: null });

  // Filter data based on zoom range
  const filteredData =
    zoomRange.left && zoomRange.right
      ? data.filter((d) => {
          const idx = data.findIndex((item) => item.zone === d.zone);
          const leftIdx = data.findIndex((item) => item.zone === zoomRange.left);
          const rightIdx = data.findIndex((item) => item.zone === zoomRange.right);
          return idx >= leftIdx && idx <= rightIdx;
        })
      : data;

  return (
    <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl text-white font-semibold">
          Zone Power Consumption
        </h2>
        {zoomRange.left && (
          <button
            onClick={handleZoomOut}
            className="text-xs text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 rounded-lg px-3 py-1 transition"
          >
            Reset Zoom
          </button>
        )}
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={filteredData}
          ref={barRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ cursor: refAreaLeft ? "ew-resize" : "default" }}
        >
          <defs>
            {GRADIENT_COLORS.map(([from, to], i) => (
              <linearGradient
                key={i}
                id={`barGrad${i}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={from} stopOpacity={1} />
                <stop offset="100%" stopColor={to} stopOpacity={0.8} />
              </linearGradient>
            ))}
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />

          <XAxis
            dataKey="zone"
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

          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(6, 182, 212, 0.08)" }} />

          <Bar
            dataKey="power"
            radius={[8, 8, 0, 0]}
            animationBegin={0}
            animationDuration={1200}
            animationEasing="ease-out"
          >
            {filteredData.map((_, index) => (
              <Cell
                key={index}
                fill={`url(#barGrad${index % GRADIENT_COLORS.length})`}
              />
            ))}
          </Bar>

          {refAreaLeft && refAreaRight && (
            <ReferenceArea
              x1={refAreaLeft}
              x2={refAreaRight}
              strokeOpacity={0.3}
              fill="rgba(6, 182, 212, 0.1)"
            />
          )}
        </BarChart>
      </ResponsiveContainer>

      <CustomLegend />
    </div>
  );
}
