import api from "./api";

const reportService = {
  async getReports(params = {}) {
    const response = await api.get("/reports/", { params });
    return response.data;
  },

  async generateReport(reportType) {
    const response = await api.post(`/reports/generate/${reportType}`);
    return response.data;
  },

  async downloadPdf(reportId) {
    const response = await api.get(`/reports/${reportId}/download-pdf`, {
      responseType: "blob",
    });
    return response.data;
  },

  async downloadExcel(reportId) {
    const response = await api.get(`/reports/${reportId}/download-excel`, {
      responseType: "blob",
    });
    return response.data;
  },

  async deleteReport(reportId) {
    const response = await api.delete(`/reports/${reportId}`);
    return response.data;
  },
};

export default reportService;
