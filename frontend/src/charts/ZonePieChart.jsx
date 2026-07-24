import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import useApi from "../hooks/useApi";
import energyService from "../services/energyService";

const COLORS = [
  "#14B8A6",
  "#0EA5E9",
  "#FACC15",
  "#EF4444",
];

const dummyZones = [
  { name: "North", value: 35 },
  { name: "South", value: 25 },
  { name: "East", value: 20 },
  { name: "West", value: 20 },
];

export default function ZonePieChart() {

  const { data } =
    useApi(() => energyService.getZoneDistribution());

  const zones = Array.isArray(data)
  ? data
  : dummyZones;

  return (

    <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6">

      <h2 className="text-xl text-white font-semibold mb-5">

        Zone Distribution

      </h2>

      <ResponsiveContainer width="100%" height={250}>

        <PieChart>

          <Pie
            data={zones}
            dataKey="value"
            nameKey="name"
            outerRadius={90}
          >

            {zones.map((entry,index)=>(
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}

          </Pie>

          <Tooltip/>

        </PieChart>

      </ResponsiveContainer>

    </div>

  );
}