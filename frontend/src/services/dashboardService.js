import api from "./api";

const dashboardService = {

  // Dashboard Statistics
  async getDashboardStats() {
    const response = await api.get("/dashboard/stats");
    return response.data;
  },

  // Dashboard Cards
  async getDashboardCards() {
    const response = await api.get("/dashboard/cards");
    return response.data;
  },

  // Meter Table
  async getMeters() {
    const response = await api.get("/meters");
    return response.data;
  },

  // Live Alerts
  async getAlerts() {
    const response = await api.get("/alerts");
    return response.data;
  },

  // Recent Activity
  async getActivities() {
    const response = await api.get("/activities");
    return response.data;
  },

};

export default dashboardService;