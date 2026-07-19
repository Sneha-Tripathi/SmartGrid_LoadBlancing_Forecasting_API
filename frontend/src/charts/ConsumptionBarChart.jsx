import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const consumptionData = [
  {
    sector: "Residential",
    consumption: 420,
  },
  {
    sector: "Industrial",
    consumption: 690,
  },
  {
    sector: "Commercial",
    consumption: 510,
  },
  {
    sector: "Agriculture",
    consumption: 310,
  },
];

export default function ConsumptionBarChart() {
  return (
    <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6 h-[380px]">

      {/* Header */}

      <div className="mb-6">

        <h2 className="text-xl font-semibold text-white">
          Power Consumption
        </h2>

        <p className="text-slate-400 text-sm mt-1">
          Electricity consumption by sector
        </p>

      </div>

      {/* Chart */}

      <ResponsiveContainer width="100%" height="82%">

        <BarChart data={consumptionData}>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1E293B"
          />

          <XAxis
            dataKey="sector"
            tick={{
              fill: "#94A3B8",
              fontSize: 12,
            }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{
              fill: "#94A3B8",
              fontSize: 12,
            }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              background: "#0F172A",
              border: "1px solid #334155",
              borderRadius: "10px",
              color: "#ffffff",
            }}
          />

          <Bar
            dataKey="consumption"
            fill="#14B8A6"
            radius={[8, 8, 0, 0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}