import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

import useApi from "../hooks/useApi";
import energyService from "../services/energyService";
import { useWebSocketContext } from "../context/WebSocketContext";

const COLORS = [
  "#06B6D4",
  "#14B8A6",
  "#FACC15",
  "#EF4444",
];

const GRADIENT_COLORS = [
  ["#06B6D4", "#0891B2"],
  ["#14B8A6", "#0D9488"],
  ["#FACC15", "#D97706"],
  ["#EF4444", "#DC2626"],
];

const dummyZones = [
  { name: "North", value: 35 },
  { name: "South", value: 25 },
  { name: "East", value: 20 },
  { name: "West", value: 20 },
];

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const { name, value } = payload[0];
  const total = payload[0].payload.total ?? 100;
  const pct = ((value / total) * 100).toFixed(1);
  return (
    <div className="bg-[#0B1220] border border-cyan-500/30 rounded-xl px-4 py-3 shadow-xl shadow-cyan-500/10">
      <p className="text-slate-300 text-xs font-medium mb-2">{name}</p>
      <p className="text-white font-bold text-lg">
        {value}{" "}
        <span className="text-cyan-400 text-sm font-normal">MW</span>
      </p>
      <p className="text-slate-400 text-xs mt-1">{pct}% of total</p>
    </div>
  );
}

const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 25;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null;

  return (
    <text
      x={x}
      y={y}
      fill="#94A3B8"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={11}
    >
      {`${name} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const renderLegend = (props) => {
  const { payload } = props;
  return (
    <div className="flex items-center justify-center gap-5 mt-4 flex-wrap">
      {payload.map((entry, index) => (
        <div key={`item-${index}`} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-slate-400 text-xs">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function ZonePieChart() {
  const { data: apiData } = useApi(() => energyService.getZoneDistribution());
  const { liveData } = useWebSocketContext();

  const [zones, setZones] = useState(dummyZones);

  useEffect(() => {
    if (liveData?.chart_data?.zones) {
      setZones(liveData.chart_data.zones);
    } else if (Array.isArray(apiData) && apiData.length > 0) {
      setZones(apiData);
    }
  }, [liveData, apiData]);

  const total = zones.reduce((sum, z) => sum + z.value, 0);
  const dataWithTotal = zones.map((z) => ({ ...z, total }));

  return (
    <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300 group">
      <h2 className="text-xl text-white font-semibold mb-2">
        Zone Distribution
      </h2>
      <p className="text-slate-400 text-sm mb-5">
        Total: {total}{" "}
        <span className="text-cyan-400">MW</span>
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <defs>
            {GRADIENT_COLORS.map(([from, to], i) => (
              <linearGradient
                key={i}
                id={`pieGrad${i}`}
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop offset="0%" stopColor={from} stopOpacity={1} />
                <stop offset="100%" stopColor={to} stopOpacity={0.85} />
              </linearGradient>
            ))}
          </defs>

          <Pie
            data={dataWithTotal}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={45}
            label={renderCustomLabel}
            labelLine={false}
            animationBegin={0}
            animationDuration={1200}
            animationEasing="ease-out"
          >
            {dataWithTotal.map((entry, index) => (
              <Cell
                key={index}
                fill={`url(#pieGrad${index % GRADIENT_COLORS.length})`}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={1}
              />
            ))}
          </Pie>

          <Tooltip content={<CustomTooltip />} />

          <Legend content={renderLegend} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
