import { meterData } from "../data/dashboardData";

export default function MeterTable() {

  const badgeColor = (status) => {

    switch (status) {

      case "Normal":
        return "bg-green-500/10 text-green-400 border border-green-500/30";

      case "High":
        return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30";

      case "Critical":
        return "bg-red-500/10 text-red-400 border border-red-500/30";

      default:
        return "bg-slate-500/10 text-slate-300 border border-slate-600";
    }

  };

  return (

    <section
      className="
      rounded-2xl
      border
      border-slate-800
      bg-[#0B1220]
      p-6
      "
    >

      {/* Header */}

      <div className="flex items-center justify-between mb-6">

        <div>

          <h2 className="text-xl font-semibold text-white">
            Meter Monitoring
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Live smart meter status across all zones
          </p>

        </div>

        <button
          className="
          px-4
          py-2
          rounded-lg
          bg-teal-700
          hover:bg-teal-600
          transition
          text-sm
          "
        >
          View All
        </button>

      </div>

      {/* Table */}

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b border-slate-800">

              <th className="text-left py-4 text-sm text-slate-400 font-medium">
                Meter ID
              </th>

              <th className="text-left py-4 text-sm text-slate-400 font-medium">
                Zone
              </th>

              <th className="text-left py-4 text-sm text-slate-400 font-medium">
                Current Load
              </th>

              <th className="text-left py-4 text-sm text-slate-400 font-medium">
                Voltage
              </th>

              <th className="text-left py-4 text-sm text-slate-400 font-medium">
                Frequency
              </th>

              <th className="text-left py-4 text-sm text-slate-400 font-medium">
                Status
              </th>

              <th className="text-left py-4 text-sm text-slate-400 font-medium">
                Updated
              </th>

            </tr>

          </thead>

          <tbody>

            {meterData.map((meter) => (

              <tr
                key={meter.id}
                className="
                border-b
                border-slate-800/60
                hover:bg-[#111827]
                transition
                "
              >

                <td className="py-5 font-medium text-white">
                  {meter.id}
                </td>

                <td className="text-slate-300">
                  {meter.zone}
                </td>

                <td className="text-teal-400 font-semibold">
                  {meter.load}
                </td>

                <td className="text-slate-300">
                  {meter.voltage}
                </td>

                <td className="text-slate-300">
                  {meter.frequency}
                </td>

                <td>

                  <span
                    className={`
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      font-medium
                      ${badgeColor(meter.status)}
                    `}
                  >
                    {meter.status}
                  </span>

                </td>

                <td className="text-slate-400">
                  {meter.updated}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </section>

  );
}