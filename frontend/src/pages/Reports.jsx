import { useState, useEffect, useCallback } from "react";
import {
  FaFileAlt,
  FaDownload,
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaCalendarAlt,
  FaFilePdf,
  FaFileExcel,
  FaRedo,
  FaSearch,
  FaTrash,
  FaSpinner,
} from "react-icons/fa";
import DashboardLayout from "../components/layout/DashboardLayout";
import SkeletonLoader from "../components/common/SkeletonLoader";
import EmptyState from "../components/common/EmptyState";
import ErrorMessage from "../components/common/ErrorMessage";
import toast from "react-hot-toast";
import reportService from "../services/reportService";

const REPORT_TYPES = [
  { id: "daily", label: "Daily Summary", icon: FaCalendarAlt, desc: "24-hour grid performance overview" },
  { id: "weekly", label: "Weekly Report", icon: FaChartBar, desc: "7-day energy consumption and trends" },
  { id: "monthly", label: "Monthly Report", icon: FaChartLine, desc: "Monthly load analysis and forecasts" },
  { id: "zones", label: "Zone Analysis", icon: FaChartPie, desc: "Per-zone distribution and performance" },
  { id: "alerts", label: "Alert Log", icon: FaFileAlt, desc: "Complete alert and incident history" },
  { id: "efficiency", label: "Efficiency Report", icon: FaChartLine, desc: "Grid efficiency and AI optimization metrics" },
];

function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [generating, setGenerating] = useState(null);
  const [downloading, setDownloading] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        page_size: pageSize,
        sort_by: "date",
        sort_order: "desc",
      };
      if (searchQuery) params.search = searchQuery;
      if (filterType !== "all") params.type = filterType;

      const data = await reportService.getReports(params);
      setReports(data.items || []);
      setTotalPages(data.total_pages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Failed to load reports:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, filterType]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleGenerate = async (reportType) => {
    setGenerating(reportType);
    try {
      const newReport = await reportService.generateReport(reportType);
      setReports((prev) => [newReport, ...prev]);
      setTotal((prev) => prev + 1);
      toast.success(`${REPORT_TYPES.find((r) => r.id === reportType)?.label || reportType} report generated successfully`);
    } catch (err) {
      toast.error("Failed to generate report");
    } finally {
      setGenerating(null);
    }
  };

  const handleDownloadPdf = async (reportId, e) => {
    e.stopPropagation();
    setDownloading(`pdf-${reportId}`);
    try {
      const blob = await reportService.downloadPdf(reportId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${reportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("PDF downloaded successfully");
    } catch (err) {
      toast.error("Failed to download PDF");
    } finally {
      setDownloading(null);
    }
  };

  const handleDownloadExcel = async (reportId, e) => {
    e.stopPropagation();
    setDownloading(`excel-${reportId}`);
    try {
      const blob = await reportService.downloadExcel(reportId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${reportId}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Excel downloaded successfully");
    } catch (err) {
      toast.error("Failed to download Excel");
    } finally {
      setDownloading(null);
    }
  };

  const handleDelete = async (reportId) => {
    try {
      await reportService.deleteReport(reportId);
      setReports((prev) => prev.filter((r) => r.id !== reportId));
      setTotal((prev) => prev - 1);
      toast.success("Report deleted");
    } catch (err) {
      toast.error("Failed to delete report");
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
    setPage(1);
  };

  return (
    <DashboardLayout>
      <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-5">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FaFileAlt className="text-cyan-400" />
            Reports
          </h1>
          <p className="text-slate-400 mt-2">Generate and download grid performance reports.</p>
        </div>
      </section>

      {/* Report Type Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {REPORT_TYPES.map((rt) => {
          const Icon = rt.icon;
          const isGenerating = generating === rt.id;
          return (
            <button key={rt.id} onClick={() => handleGenerate(rt.id)} disabled={isGenerating}
              className="bg-[#101827] border border-slate-800 rounded-2xl p-5 text-left hover:border-cyan-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/5 disabled:opacity-50 disabled:cursor-not-allowed group">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-teal-600 flex items-center justify-center mb-3 shadow-lg group-hover:shadow-cyan-500/20 transition`}>
                {isGenerating ? <FaSpinner className="text-white text-lg animate-spin" /> : <Icon className="text-white text-lg" />}
              </div>
              <h3 className="text-white font-semibold text-sm">{rt.label}</h3>
              <p className="text-slate-500 text-xs mt-1">{rt.desc}</p>
              {isGenerating ? (
                <span className="inline-block mt-3 text-xs text-cyan-400 animate-pulse">Generating...</span>
              ) : (
                <span className="inline-block mt-3 text-xs text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">Generate →</span>
              )}
            </button>
          );
        })}
      </section>

      {/* Search & Filter */}
      <section className="bg-[#101827] border border-slate-800 rounded-2xl p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="text" placeholder="Search reports..." value={searchQuery} onChange={handleSearch}
              className="w-full bg-[#0B1220] border border-slate-700 rounded-xl pl-11 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition text-sm" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", "daily", "weekly", "monthly", "zones", "alerts", "efficiency"].map((t) => (
              <button key={t} onClick={() => handleFilterChange(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition ${filterType === t ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <section>
          <SkeletonLoader variant="report" />
        </section>
      )}

      {/* Error State */}
      {error && !loading && (
        <section className="mb-8">
          <ErrorMessage title="Failed to Load Reports" message={error.message || "Unable to fetch report data."} />
          <button onClick={fetchReports} className="mt-4 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition text-sm">Retry</button>
        </section>
      )}

      {/* Empty State */}
      {!loading && !error && reports.length === 0 && (
        <section>
          <EmptyState title="No Reports Found" description={searchQuery ? "No reports match your search." : "No reports generated yet. Click a report type above to generate one."} />
        </section>
      )}

      {/* Reports List */}
      {!loading && !error && reports.length > 0 && (
        <section className="bg-[#101827] border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-slate-800">
            <h2 className="text-lg font-semibold text-white">Generated Reports ({total})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700 bg-[#0B1220]/50">
                  <th className="text-left py-3.5 px-5 text-slate-400 text-sm font-medium">Report</th>
                  <th className="text-left py-3.5 px-5 text-slate-400 text-sm font-medium">Type</th>
                  <th className="text-left py-3.5 px-5 text-slate-400 text-sm font-medium">Date</th>
                  <th className="text-left py-3.5 px-5 text-slate-400 text-sm font-medium">Size</th>
                  <th className="text-left py-3.5 px-5 text-slate-400 text-sm font-medium">Status</th>
                  <th className="text-right py-3.5 px-5 text-slate-400 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} className="border-b border-slate-800 hover:bg-slate-800/40 transition">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <FaFileAlt className="text-cyan-400/70 text-lg" />
                        <span className="text-white text-sm font-medium">{report.title}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="capitalize text-slate-300 text-sm">{report.type}</span>
                    </td>
                    <td className="py-4 px-5 text-slate-300 text-sm">{formatDate(report.date)}</td>
                    <td className="py-4 px-5 text-slate-300 text-sm">{report.size}</td>
                    <td className="py-4 px-5">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${report.status === "Generated" ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => handleDownloadPdf(report.id, e)}
                          disabled={downloading === `pdf-${report.id}`}
                          className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition disabled:opacity-50"
                          title="Download PDF"
                        >
                          {downloading === `pdf-${report.id}` ? <FaSpinner className="animate-spin" /> : <FaFilePdf />}
                        </button>
                        <button
                          onClick={(e) => handleDownloadExcel(report.id, e)}
                          disabled={downloading === `excel-${report.id}`}
                          className="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition disabled:opacity-50"
                          title="Download Excel"
                        >
                          {downloading === `excel-${report.id}` ? <FaSpinner className="animate-spin" /> : <FaFileExcel />}
                        </button>
                        <button
                          onClick={() => handleDelete(report.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-5 border-t border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 text-sm">
                Page {page} of {totalPages} ({total} total)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 disabled:opacity-50 text-sm"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 disabled:opacity-50 text-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </DashboardLayout>
  );
}
