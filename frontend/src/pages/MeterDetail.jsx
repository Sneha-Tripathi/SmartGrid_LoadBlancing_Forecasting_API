import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaMicrochip, FaExclamationTriangle } from "react-icons/fa";
import DashboardLayout from "../components/layout/DashboardLayout";

const metersData = {
  "MTR-1001": { meter_id: "MTR-1001", zone: "North Zone", load: "2.45 MW", voltage: "228 V", frequency: "50.0 Hz", status: "Normal", type: "Smart Meter", consumer: "Industrial Corp", location: "Building A, Floor 3" },
  "MTR-1002": { meter_id: "MTR-1002", zone: "South Zone", load: "3.82 MW", voltage: "230 V", frequency: "50.0 Hz", status: "High", type: "Smart Meter", consumer: "Tech Park", location: "Building B, Floor 1" },
  "MTR-1003": { meter_id: "MTR-1003", zone: "East Zone", load: "1.98 MW", voltage: "224 V", frequency: "49.9 Hz", status: "Normal", type: "Smart Meter", consumer: "Residential Complex A", location: "Building C, Floor 2" },
  "MTR-1004": { meter_id: "MTR-1004", zone: "West Zone", load: "4.76 MW", voltage: "233 V", frequency: "50.1 Hz", status: "Critical", type: "Smart Meter", consumer: "Data Center Pro", location: "Building D, Floor 5" },
  "MTR-1005": { meter_id: "MTR-1005", zone: "Central Zone", load: "2.89 MW", voltage: "226 V", frequency: "50.0 Hz", status: "Normal", type: "Smart Meter", consumer: "Shopping Mall", location: "Building E, Ground Floor" },
};

export default function MeterDetail() {
  const { meterId } = useParams();
  const [meter, setMeter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMeter(metersData[meterId] || null);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [meterId]);

  return (
    <DashboardLayout>
      <section className="mb-6">
        <Link to="/meters" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition">
          <FaArrowLeft /> Back to Meters
        </Link>
      </section>

      {loading ? (
        <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6 animate-pulse h-64" />
      ) : !meter ? (
        <div className="bg-[#101827] border border-slate-800 rounded-2xl p-12 text-center">
          <FaExclamationTriangle className="text-yellow-400 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Meter Not Found</h2>
          <p className="text-slate-400">Meter {meterId} does not exist.</p>
        </div>
      ) : (
        <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <FaMicrochip className="text-cyan-400 text-2xl" />
            <h1 className="text-2xl font-bold text-white">{meter.meter_id}</h1>
            <span className={"px-3 py-1 rounded-full text-xs font-medium " + (meter.status === "Critical" ? "bg-red-500/20 text-red-400" : meter.status === "High" || meter.status === "Warning" ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400")}>
              {meter.status}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { label: "Zone", value: meter.zone },
              { label: "Location", value: meter.location },
              { label: "Load", value: meter.load },
              { label: "Voltage", value: meter.voltage },
              { label: "Frequency", value: meter.frequency },
              { label: "Type", value: meter.type },
              { label: "Consumer", value: meter.consumer },
            ].map((field) => (
              <div key={field.label} className="bg-[#0B1220] border border-slate-700 rounded-xl p-4">
                <p className="text-slate-400 text-xs">{field.label}</p>
                <p className="text-white font-semibold mt-1">{field.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
