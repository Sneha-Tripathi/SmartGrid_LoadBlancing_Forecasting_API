import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaMicrochip, FaSearch } from "react-icons/fa";
import DashboardLayout from "../components/layout/DashboardLayout";

const initialMeters = [
  { meter_id: "MTR-1001", zone: "North Zone", load: "2.45 MW", voltage: "228 V", status: "Normal", type: "Smart Meter", consumer: "Industrial Corp" },
  { meter_id: "MTR-1002", zone: "South Zone", load: "3.82 MW", voltage: "230 V", status: "High", type: "Smart Meter", consumer: "Tech Park" },
  { meter_id: "MTR-1003", zone: "East Zone", load: "1.98 MW", voltage: "224 V", status: "Normal", type: "Smart Meter", consumer: "Residential Complex A" },
  { meter_id: "MTR-1004", zone: "West Zone", load: "4.76 MW", voltage: "233 V", status: "Critical", type: "Smart Meter", consumer: "Data Center Pro" },
  { meter_id: "MTR-1005", zone: "Central Zone", load: "2.89 MW", voltage: "226 V", status: "Normal", type: "Smart Meter", consumer: "Shopping Mall" },
];

export default function Meters() {
  const [meters, setMeters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setMeters(initialMeters);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredMeters = meters.filter((m) =>
    !search || m.meter_id.toLowerCase().includes(search.toLowerCase()) ||
    m.zone.toLowerCase().includes(search.toLowerCase()) ||
    (m.consumer && m.consumer.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <DashboardLayout>
      <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-5">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FaMicrochip className="text-cyan-400" /> Meters
          </h1>
          <p className="text-slate-400 mt-2">Manage and monitor smart meters across all zones.</p>
        </div>
      </section>

      <section className="bg-[#101827] border border-slate-800 rounded-2xl p-4 mb-6">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" placeholder="Search meters..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0B1220] border border-slate-700 rounded-xl pl-11 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition text-sm" />
        </div>
      </section>

      {loading ? (
        <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6 animate-pulse">
          <div className="h-6 w-40 bg-slate-700 rounded mb-6" />
          {[1,2,3,4,5].map((i) => (
            <div key={i} className="h-12 bg-slate-700 rounded mb-3" />
          ))}
        </div>
      ) : (
        <section className="bg-[#101827] border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700 bg-[#0B1220]/50">
                  <th className="text-left py-3.5 px-5 text-slate-400 text-sm font-medium">Meter ID</th>
                  <th className="text-left py-3.5 px-5 text-slate-400 text-sm font-medium">Zone</th>
                  <th className="text-left py-3.5 px-5 text-slate-400 text-sm font-medium">Load</th>
                  <th className="text-left py-3.5 px-5 text-slate-400 text-sm font-medium">Status</th>
                  <th className="text-left py-3.5 px-5 text-slate-400 text-sm font-medium">Consumer</th>
                  <th className="text-right py-3.5 px-5 text-slate-400 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMeters.map((meter) => (
                  <tr key={meter.meter_id} className="border-b border-slate-800 hover:bg-slate-800/40 transition">
                    <td className="py-4 px-5">
                      <Link to={"/meters/" + meter.meter_id} className="text-cyan-400 hover:text-cyan-300 font-medium">{meter.meter_id}</Link>
                    </td>
                    <td className="py-4 px-5 text-slate-300">{meter.zone}</td>
                    <td className="py-4 px-5 text-slate-300">{meter.load}</td>
                    <td className="py-4 px-5">
                      <span className={"px-2.5 py-0.5 rounded-full text-xs font-medium " + (meter.status === "Critical" ? "bg-red-500/20 text-red-400" : meter.status === "High" || meter.status === "Warning" ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400")}>{meter.status}</span>
                    </td>
                    <td className="py-4 px-5 text-slate-300">{meter.consumer}</td>
                    <td className="py-4 px-5 text-right">
                      <Link to={"/meters/" + meter.meter_id} className="p-2 rounded-lg text-cyan-400 hover:bg-cyan-500/10 transition inline-block">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </DashboardLayout>
  );
}
