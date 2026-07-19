import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const forecastData = [
  { day: "Mon", forecast: 3.1 },
  { day: "Tue", forecast: 3.4 },
  { day: "Wed", forecast: 4.0 },
  { day: "Thu", forecast: 4.8 },
  { day: "Fri", forecast: 4.2 },
  { day: "Sat", forecast: 3.6 },
  { day: "Sun", forecast: 3.2 },
];

export default function ForecastChart() {
  return (
    <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6 h-[380px]">

      {/* Header */}

      <div className="mb-6">

        <h2 className="text-xl font-semibold text-white">
          AI Load Forecast
        </h2>

        <p className="text-slate-400 text-sm mt-1">
          Predicted electricity demand for the next 7 days
        </p>

      </div>

      {/* Chart */}

      <ResponsiveContainer width="100%" height="82%">

        <AreaChart data={forecastData}>

          <defs>

            <linearGradient
              id="forecastGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >

              <stop
                offset="5%"
                stopColor="#14B8A6"
                stopOpacity={0.8}
              />

              <stop
                offset="95%"
                stopColor="#14B8A6"
                stopOpacity={0}
              />

            </linearGradient>

          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1E293B"
          />

          <XAxis
            dataKey="day"
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
              color: "#ffffff",
            }}
          />

          <Area
            type="monotone"
            dataKey="forecast"
            stroke="#14B8A6"
            strokeWidth={3}
            fill="url(#forecastGradient)"
          />

        </AreaChart>

      </ResponsiveContainer>

    </div>
  );
}