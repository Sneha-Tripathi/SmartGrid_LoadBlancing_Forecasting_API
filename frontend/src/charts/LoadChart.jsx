import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const loadData = [
  { time: "00:00", load: 2.1 },
  { time: "04:00", load: 2.5 },
  { time: "08:00", load: 3.8 },
  { time: "12:00", load: 4.5 },
  { time: "16:00", load: 4.1 },
  { time: "20:00", load: 3.4 },
  { time: "24:00", load: 2.8 },
];

export default function LoadChart() {
  return (
    <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6 h-[380px]">

      {/* Header */}

      <div className="mb-6">

        <h2 className="text-xl font-semibold text-white">
          Energy Load Trend
        </h2>

        <p className="text-slate-400 text-sm mt-1">
          24-hour electricity load monitoring
        </p>

      </div>

      {/* Chart */}

      <ResponsiveContainer width="100%" height="82%">

        <LineChart data={loadData}>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1E293B"
          />

          <XAxis
            dataKey="time"
            tick={{ fill: "#94A3B8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: "#94A3B8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              background: "#0F172A",
              border: "1px solid #334155",
              borderRadius: "10px",
              color: "#fff",
            }}
          />

          <Line
            type="monotone"
            dataKey="load"
            stroke="#14B8A6"
            strokeWidth={3}
            dot={{
              r: 5,
              fill: "#14B8A6",
            }}
            activeDot={{
              r: 7,
            }}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}