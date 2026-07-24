import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import useApi from "../hooks/useApi";
import energyService from "../services/energyService";

const dummyConsumption = [
  { zone: "North", power: 420 },
  { zone: "South", power: 350 },
  { zone: "East", power: 310 },
  { zone: "West", power: 390 },
];

export default function ConsumptionBarChart() {

  const { data } =
    useApi(() => energyService.getConsumption());

  const consumption = Array.isArray(data)
  ? data
  : dummyConsumption;

  return (

    <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6">

      <h2 className="text-xl text-white font-semibold mb-5">

        Zone Power Consumption

      </h2>

      <ResponsiveContainer width="100%" height={250}>

        <BarChart data={consumption}>

          <XAxis dataKey="zone"/>

          <YAxis/>

          <Tooltip/>

          <Bar
            dataKey="power"
            fill="#14B8A6"
            radius={[8,8,0,0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>

  );
}