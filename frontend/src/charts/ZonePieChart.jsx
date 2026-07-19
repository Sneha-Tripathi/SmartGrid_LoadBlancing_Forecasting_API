import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const zoneData = [
  { name: "North", value: 28 },
  { name: "South", value: 22 },
  { name: "East", value: 18 },
  { name: "West", value: 17 },
  { name: "Central", value: 15 },
];

const COLORS = [
  "#14B8A6",
  "#0EA5E9",
  "#6366F1",
  "#8B5CF6",
  "#F59E0B",
];

export default function ZonePieChart() {
  return (
    <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6 h-[380px]">

      {/* Header */}

      <div className="mb-6">

        <h2 className="text-xl font-semibold text-white">
          Zone Distribution
        </h2>

        <p className="text-slate-400 text-sm mt-1">
          Current energy load distribution across all zones
        </p>

      </div>

      {/* Pie Chart */}

      <ResponsiveContainer width="100%" height="82%">

        <PieChart>

          <Pie
            data={zoneData}
            cx="50%"
            cy="50%"
            outerRadius={105}
            innerRadius={55}
            paddingAngle={4}
            dataKey="value"
          >
            {zoneData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              background: "#0F172A",
              border: "1px solid #334155",
              borderRadius: "10px",
              color: "#ffffff",
            }}
          />

          <Legend
            verticalAlign="bottom"
            wrapperStyle={{
              color: "#CBD5E1",
              fontSize: "14px",
              paddingTop: "12px",
            }}
          />

        </PieChart>

      </ResponsiveContainer>

    </div>
  );
}