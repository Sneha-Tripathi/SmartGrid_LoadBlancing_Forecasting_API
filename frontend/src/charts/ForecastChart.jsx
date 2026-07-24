import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import useApi from "../hooks/useApi";
import energyService from "../services/energyService";

const dummyForecast = [
  { day: "Mon", value: 300 },
  { day: "Tue", value: 340 },
  { day: "Wed", value: 320 },
  { day: "Thu", value: 360 },
  { day: "Fri", value: 390 },
];

export default function ForecastChart() {

  const { data } =
    useApi(() => energyService.getForecast());

  const forecast = Array.isArray(data)
  ? data
  : dummyForecast;

  return (

    <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6">

      <h2 className="text-xl text-white font-semibold mb-5">

        AI Load Forecast

      </h2>

      <ResponsiveContainer width="100%" height={250}>

        <AreaChart data={forecast}>

          <XAxis dataKey="day"/>

          <YAxis/>

          <Tooltip/>

          <Area
            type="monotone"
            dataKey="value"
            stroke="#06B6D4"
            fill="#06B6D4"
            fillOpacity={0.3}
          />

        </AreaChart>

      </ResponsiveContainer>

    </div>

  );
}