import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import useApi from "../hooks/useApi";
import energyService from "../services/energyService";

const dummyData = [
  { time: "10 AM", load: 210 },
  { time: "11 AM", load: 240 },
  { time: "12 PM", load: 280 },
  { time: "1 PM", load: 260 },
  { time: "2 PM", load: 310 },
  { time: "3 PM", load: 295 },
];

export default function LoadChart() {

  const { data, loading, error } =
    useApi(() => energyService.getLoadTrend());

  const chartData = data || dummyData;

  if (loading) {
    return (
      <div className="bg-[#101827] h-80 rounded-2xl animate-pulse" />
    );
  }

  if (error) {
    console.warn("Using dummy Load Chart data.");
  }

  return (
    <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6">

      <h2 className="text-xl text-white font-semibold mb-5">
        Energy Load Trend
      </h2>

      <ResponsiveContainer width="100%" height={250}>

        <LineChart data={chartData}>

          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

          <XAxis dataKey="time" stroke="#94A3B8" />

          <YAxis stroke="#94A3B8" />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="load"
            stroke="#14B8A6"
            strokeWidth={3}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}