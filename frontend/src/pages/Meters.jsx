import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMicrochip,
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUp,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import DashboardLayout from "../components/layout/DashboardLayout";
import TableLoader from "../components/common/TableLoader";
import EmptyState from "../components/common/EmptyState";
import ErrorMessage from "../components/common/ErrorMessage";
import api from "../services/api";
import toast from "react-hot-toast";

const ZONES = ["North Zone", "South Zone", "East Zone", "West Zone", "Central Zone"];
const STATUSES = ["Normal", "Warning", "High", "Critical"];
const PAGE_SIZE = 10;

const getStatusStyle = (status) => {
  switch (status) {
    case "Normal": return "bg-green-500/20 text-green-400";
    case "Warning": return "bg-yellow-500/20 text-yellow-400";
    case "High": return "bg-orange-500/20 text-orange-400";
    case "Critical": return "bg-red-500/20 text-red-400";
    default: return "bg-slate-500/20 text-slate-300";
  }
};

export default function Meters() {
  const navigate = useNavigate();
  const [meters, setMeters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterZone, setFilterZone] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("meter_id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchMeters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, page_size: PAGE_SIZE, sort_by: sortBy, sort_order: sortOrder };
      if (search) params.search = search;
      if (filterZone) params.zone = filterZone;
      if (filterStatus) params.status = filterStatus;
      const res = await api.get("/meters/", { params });
      setMeters(res.data.items || []);
      setTotalPages(res.data.total_pages || 1);
      setTotal(res.data.total || 0);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, sortOrder, search, filterZone, filterStatus]);

  useEffect(() => { fetchMeters(); }, [fetchMeters]);

  const handleDelete = async (meterId) => {
    if (!window.confirm(`Delete meter ${meterId}?`)) return;
    try {
      await api.delete(`/meters/${meterId}`);
      toast.success(`Meter ${meterId} deleted`);
      fetchMeters();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Delete failed");
    }
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return (
    <DashboardLayout>
      <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-5">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FaMicrochip className="text-cyan-400" /> Smart Meters
          </h1>
          <p className="text-slate-400 mt-2">Manage and monitor all connected smart meters.</p>
        </div>
      </section>

      <section className="bg-[#101827] border border-slate-800 rounded-2xl p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="text" placeholder="Search meters..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full bg-[#0B1220] border border-slate-700 rounded-xl pl-11 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition text-sm" />
          </div>
          <select value={filterZone} onChange={(e) => { setFilterZone(e.target.value); setPage(1); }}
            className="bg-[#0B1220] border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/50">
            <option value="">All Zones</option>
            {ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
          </select>
          <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            className="bg-[#0B1220] border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/50">
            <option value="">All Statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </section>

      {loading && <TableLoader rows={5} />}
      {error && !loading && <ErrorMessage title="Failed to Load Meters" message={error.message} onRetry={fetchMeters} />}

      {!loading && !error && meters.length === 0 && (
        <EmptyState title="No Meters Found" description={search ? "No meters match your search." : "No meters registered."} />
      )}

      {!loading && !error && meters.length > 0 && (
        <section className="bg-[#101827] border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Meters ({total})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700 bg-[#0B1220]/50">
                  {[
                    { key: "meter_id", label: "Meter ID" },
                    { key: "zone", label: "Zone" },
                    { key: "type", label: "Type" },
                    { key: "load", label: "Load" },
                    { key: "status", label: "Status" },
                  ].map((col) => (
                    <th key={col.key} className="text-left py-3.5 px-5 text-slate-400 text-sm font-medium cursor-pointer hover:text-white transition" onClick={() => toggleSort(col.key)}>
                      <span className="flex items-center gap-1">
                        {col.label}
                        {sortBy === col.key && (sortOrder === "asc" ? <FaSortAmountDown className="text-xs" /> : <FaSortAmountUp className="text-xs" />)}
                      </span>
                    </th>
                  ))}
                  <th className="text-right py-3.5 px-5 text-slate-400 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {meters.map((meter) => (
                  <tr key={meter.id || meter.meter_id} className="border-b border-slate-800 hover:bg-slate-800/40 transition cursor-pointer" onClick={() => navigate(`/meters/${meter.meter_id}`)}>
                    <td className="py-4 px-5 text-white font-medium">{meter.meter_id}</td>
                    <td className="py-4 px-5 text-slate-300">{meter.zone}</td>
                    <td className="py-4 px-5 text-slate-300">{meter.type}</td>
                    <td className="py-4 px-5 text-slate-300">{meter.load}</td>
                    <td className="py-4 px-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(meter.status)}`}>
                        {meter.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => navigate(`/meters/${meter.meter_id}`)} className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition" title="View Details">
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDelete(meter.meter_id)} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition" title="Delete Meter">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-5 border-t border-slate-800">
              <span className="text-sm text-slate-400">Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm disabled:opacity-50 hover:bg-slate-700 transition">Previous</button>
                <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm disabled:opacity-50 hover:bg-slate-700 transition">Next</button>
              </div>
            </div>
          )}
        </section>
      )}
    </DashboardLayout>
  );
}
