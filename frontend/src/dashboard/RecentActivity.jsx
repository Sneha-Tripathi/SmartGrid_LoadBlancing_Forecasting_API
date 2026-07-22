import useApi from "../hooks/useApi";
import dashboardService from "../services/dashboardService";

const dummyActivity = [
  {
    time: "09:45",
    event: "Load Forecast Generated",
  },
  {
    time: "09:30",
    event: "New Meter Connected",
  },
  {
    time: "09:12",
    event: "Voltage Restored",
  },
];

export default function RecentActivity() {

  const {
    data,
    loading,
    error,
  } = useApi(() => dashboardService.getActivities());

  const activities = data || dummyActivity;

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-[#0B1220] p-6 animate-pulse h-[260px]" />
    );
  }

  if (error) {
    console.warn("Activity API unavailable.");
  }

  return (

    <section className="rounded-2xl border border-slate-800 bg-[#0B1220] p-6">

      <h2 className="text-xl font-semibold text-white">
        Recent Activity
      </h2>

      <p className="text-sm text-slate-400 mt-1 mb-8">
        Latest dashboard events
      </p>

      <div className="relative">

        <div className="absolute left-[11px] top-2 bottom-2 w-px bg-slate-700"></div>

        <div className="space-y-7">

          {activities.map((item, index) => (

            <div
              key={index}
              className="relative flex items-start gap-5"
            >

              <div className="w-6 h-6 rounded-full bg-teal-600 border-4 border-[#0B1220] z-10"></div>

              <div>

                <p className="text-sm text-slate-500">
                  {item.time}
                </p>

                <h3 className="text-white font-medium mt-1">
                  {item.event}
                </h3>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}