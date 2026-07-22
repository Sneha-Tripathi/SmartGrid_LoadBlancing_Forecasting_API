import api from "./api";

const dashboardService = {

  // Dashboard Cards
  async getDashboardCards() {
    const response = await api.get("/dashboard/cards");
    return response.data;
  },

  // Forecast Data
  async getForecast() {
    const response = await api.get("/forecast");
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
    const response = await api.get("/activity");
    return response.data;
  },

};

export default dashboardService;