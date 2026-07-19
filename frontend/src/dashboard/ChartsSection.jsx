import LoadChart from "../charts/LoadChart";
import ForecastChart from "../charts/ForecastChart";
import ZonePieChart from "../charts/ZonePieChart";
import ConsumptionBarChart from "../charts/ConsumptionBarChart";

export default function ChartsSection() {
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
}