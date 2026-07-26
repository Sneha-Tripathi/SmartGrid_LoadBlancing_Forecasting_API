import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaPlus, FaTrash, FaEdit, FaSort, FaSortUp, FaSortDown, FaChevronLeft, FaChevronRight, FaBolt, FaMapMarkerAlt, FaChartLine, FaWifi, FaMicrochip } from "react-icons/fa";
import DashboardLayout from "../components/layout/DashboardLayout";
import meterService from "../services/meterService";
import toast from "react-hot-toast";

const STATUS_STYLES = {
  Normal: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  Warning: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
  High: "bg-orange-500/15 text-orange-400 border border-orange-500/20",
  Critical: "bg-red-500/15 text-red-400 border border-red-500/20",
};

const STATUS_DOTS = {
  Normal: "bg-emerald-400",
  Warning: "bg-amber-400",
  High: "bg-orange-400",
  Critical: "bg-red-400",
};

const TYPE_ICONS = {
  "Smart Meter": <FaMicrochip className="text-cyan-400" />,
  "Basic Meter": <FaWifi className="text-slate-400" />,
};

export default function Meters() {
  const navigate = useNavigate();
  const [data, setData] = useState({ items: [], total: 0, page: 1, page_size: 10, total_pages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [zoneFilter, setZoneFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("meter_id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [zones, setZones] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editMeter, setEditMeter] = useState(null);
  const [formData, setFormData] = useState({
    meter_id: "", zone: "North Zone", location: "", load: "",
    voltage: "", frequency: "", current: "", power_factor: "",
    status: "Normal", type: "Smart Meter", consumer: "", install_date: "", last_maintenance: "",
  });

  const pageSize = 10;

  const fetchMeters = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, page_size: pageSize, sort_by: sortBy, sort_order: sortOrder };
      if (search) params.search = search;
      if (zoneFilter) params.zone = zoneFilter;
      if (statusFilter) params.status = statusFilter;
      const result = await meterService.getMeters(params);
      setData(result);
    } catch (err) {
      console.error("Failed to fetch meters:", err);
      toast.error("Failed to load meters");
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, sortOrder, search, zoneFilter, statusFilter]);

  useEffect(() => { fetchMeters(); }, [fetchMeters]);

  useEffect(() => {
    meterService.getZones().then(setZones).catch(() => {});
    meterService.getStatuses().then(setStatuses).catch(() => {});
  }, []);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const handleDelete = async (meterId) => {
    if (!confirm("Delete meter " + meterId + "?")) return;
    try {
      await meterService.deleteMeter(meterId);
      toast.success("Meter " + meterId + " deleted");
      fetchMeters();
    } catch (err) {
      toast.error("Failed to delete meter");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await meterService.createMeter(formData);
      toast.success("Meter created successfully");
      setShowCreateModal(false);
      resetForm();
      fetchMeters();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to create meter");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editMeter) return;
    try {
      await meterService.updateMeter(editMeter.meter_id, formData);
      toast.success("Meter updated successfully");
      setShowEditModal(false);
      setEditMeter(null);
      resetForm();
      fetchMeters();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to update meter");
    }
  };

  const openEdit = (meter) => {
    setEditMeter(meter);
    setFormData({
      meter_id: meter.meter_id, zone: meter.zone, location: meter.location || "",
      load: meter.load, voltage: meter.voltage || "", frequency: meter.frequency || "",
      current: meter.current || "", power_factor: meter.power_factor || "",
      status: meter.status, type: meter.type || "Smart Meter", consumer: meter.consumer || "",
      install_date: meter.install_date || "", last_maintenance: meter.last_maintenance || "",
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      meter_id: "", zone: "North Zone", location: "", load: "",
      voltage: "", frequency: "", current: "", power_factor: "",
      status: "Normal", type: "Smart Meter", consumer: "", install_date: "", last_maintenance: "",
    });
  };

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return <FaSort className="inline ml-1 text-slate-500 text-xs" />;
    return sortOrder === "asc"
      ? <FaSortUp className="inline ml-1 text-cyan-400 text-xs" />
      : <FaSortDown className="inline ml-1 text-cyan-400 text-xs" />;
  };

  const COLUMNS = [
    { key: "meter_id", label: "Meter ID" },
    { key: "zone", label: "Zone" },
    { key: "load", label: "Load" },
    { key: "voltage", label: "Voltage" },
    { key: "frequency", label: "Freq" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
    { key: "consumer", label: "Consumer" },
  ];

  return (
    <DashboardLayout>
      <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-5">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FaBolt className="text-cyan-400" />
            Meter Management
          </h1>
          <p className="text-slate-400 mt-2">
            Manage all smart meters &mdash; create, edit, search, filter, and monitor.
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowCreateModal(true); }}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white px-5 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/20"
        >
          <FaPlus /> Add Meter
        </button>
      </section>

      <section className="bg-[#101827] border border-slate-800 rounded-2xl p-5 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search meters by ID, zone, location, consumer..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full bg-[#0B1220] border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition"
            />
          </div>
          <select
            value={zoneFilter}
            onChange={(e) => { setZoneFilter(e.target.value); setPage(1); }}
            className="bg-[#0B1220] border border-slate-700 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-cyan-500/50 transition"
          >
            <option value="">All Zones</option>
            {zones.map(z => <option key={z} value={z}>{z}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="bg-[#0B1220] border border-slate-700 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-cyan-500/50 transition"
          >
            <option value="">All Statuses</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </section>

      <section className="bg-[#101827] border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 bg-[#0B1220]/50">
                {COLUMNS.map(col => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="text-left py-4 px-4 text-slate-400 text-sm font-medium cursor-pointer hover:text-white transition select-none"
                  >
                    {col.label} <SortIcon field={col.key} />
                  </th>
                ))}
                <th className="text-right py-4 px-4 text-slate-400 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-20 text-center">
                    <div className="inline-block w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-500 mt-3">Loading meters...</p>
                  </td>
                </tr>
              ) : data.items.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-20 text-center">
                    <p className="text-slate-500">No meters found</p>
                  </td>
                </tr>
              ) : (
                data.items.map((meter, i) => (
                  <tr
                    key={meter.id || i}
                    onClick={() => navigate("/meters/" + meter.meter_id)}
                    className="border-b border-slate-800 hover:bg-slate-800/40 transition cursor-pointer"
                  >
                    <td className="py-4 px-4">
                      <span className="text-white font-mono text-sm">{meter.meter_id}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-slate-500 text-xs" />
                        <span className="text-slate-300 text-sm">{meter.zone}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <FaChartLine className="text-slate-500 text-xs" />
                        <span className="text-slate-300 text-sm">{meter.load}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-300 text-sm">{meter.voltage || "--"}</td>
                    <td className="py-4 px-4 text-slate-300 text-sm">{meter.frequency || "--"}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {TYPE_ICONS[meter.type] || <FaMicrochip className="text-slate-400" />}
                        <span className="text-slate-300 text-sm">{meter.type}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={"px-3 py-1 rounded-full text-xs font-medium " + (STATUS_STYLES[meter.status] || STATUS_STYLES.Normal)}>
                        <span className={"inline-block w-1.5 h-1.5 rounded-full mr-1.5 " + (STATUS_DOTS[meter.status] || "bg-slate-400")} />
                        {meter.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-300 text-sm">{meter.consumer || "--"}</td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => openEdit(meter)}
                          className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(meter.meter_id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800">
          <span className="text-slate-400 text-sm">
            Showing {data.items.length} of {data.total} meters
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <FaChevronLeft />
            </button>
            {Array.from({ length: Math.min(data.total_pages, 5) }, (_, i) => {
              const start = Math.max(1, page - 2);
              const p = start + i;
              if (p > data.total_pages) return null;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={
                    "w-9 h-9 rounded-lg text-sm font-medium transition " +
                    (p === page ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800")
                  }
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => setPage(p => Math.min(data.total_pages, p + 1))}
              disabled={page >= data.total_pages}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </section>

      {showCreateModal && (
        <ModalForm
          title="Create New Meter"
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleCreate}
          onClose={() => setShowCreateModal(false)}
          submitLabel="Create Meter"
          isEdit={false}
        />
      )}

      {showEditModal && (
        <ModalForm
          title={"Edit Meter " + (editMeter?.meter_id || "")}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleUpdate}
          onClose={() => { setShowEditModal(false); setEditMeter(null); }}
          submitLabel="Update Meter"
          isEdit={true}
        />
      )}
    </DashboardLayout>
  );
}

function ModalForm({ title, formData, setFormData, onSubmit, onClose, submitLabel, isEdit }) {
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#101827] border border-slate-700 rounded-2xl p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput label="Meter ID" name="meter_id" value={formData.meter_id} onChange={handleChange} required disabled={isEdit} />
          <FormSelect label="Zone" name="zone" value={formData.zone} onChange={handleChange}
            options={["North Zone", "South Zone", "East Zone", "West Zone", "Central Zone"]} />
          <FormInput label="Location" name="location" value={formData.location} onChange={handleChange} />
          <FormInput label="Load (e.g. 2.45 MW)" name="load" value={formData.load} onChange={handleChange} required />
          <FormInput label="Voltage" name="voltage" value={formData.voltage} onChange={handleChange} />
          <FormInput label="Frequency" name="frequency" value={formData.frequency} onChange={handleChange} />
          <FormInput label="Current" name="current" value={formData.current} onChange={handleChange} />
          <FormInput label="Power Factor" name="power_factor" value={formData.power_factor} onChange={handleChange} />
          <FormSelect label="Status" name="status" value={formData.status} onChange={handleChange}
            options={["Normal", "Warning", "High", "Critical"]} />
          <FormSelect label="Type" name="type" value={formData.type} onChange={handleChange}
            options={["Smart Meter", "Basic Meter"]} />
          <FormInput label="Consumer" name="consumer" value={formData.consumer} onChange={handleChange} />
          <FormInput label="Install Date" name="install_date" value={formData.install_date} onChange={handleChange} />
          <div className="md:col-span-2 flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition">Cancel</button>
            <button type="submit" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white transition shadow-lg">{submitLabel}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormInput({ label, name, value, onChange, required, disabled }) {
  return (
    <div>
      <label className="block text-slate-400 text-sm mb-1.5">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="w-full bg-[#0B1220] border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition disabled:opacity-50"
      />
    </div>
  );
}

function FormSelect({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-slate-400 text-sm mb-1.5">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-[#0B1220] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 transition"
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
