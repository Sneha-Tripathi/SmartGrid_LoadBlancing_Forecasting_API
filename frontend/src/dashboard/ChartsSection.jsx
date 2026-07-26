import { memo } from "react";
import LoadChart from "../charts/LoadChart";
import ForecastChart from "../charts/ForecastChart";
import ZonePieChart from "../charts/ZonePieChart";
import ConsumptionBarChart from "../charts/ConsumptionBarChart";

const ChartsSection = memo(function ChartsSection() {
  return (
    <section className="mt-8">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <LoadChart />
        <ForecastChart />
        <ZonePieChart />
        <ConsumptionBarChart />
      </div>
    </section>
  );
});

export default ChartsSection;
