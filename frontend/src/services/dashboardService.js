import api from "./api";

const dashboardService = {

  // Dashboard Cards
  async getDashboardCards() {
    try {
      const response = await api.get("/dashboard/cards");
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard cards:", error);
      throw error;
    }
  },

  // Forecast Data
  async getForecast() {
    try {
      const response = await api.get("/forecast");
      return response.data;
    } catch (error) {
      console.error("Error fetching forecast data:", error);
      throw error;
    }
  },

  // Smart Meter Data (returns array for backward compat)
  async getMeters() {
    try {
      const response = await api.get("/meters/", { params: { page_size: 100 } });
      return response.data.items || response.data;
    } catch (error) {
      console.error("Error fetching meter data:", error);
      throw error;
    }
  },

  // Live Alerts
  async getAlerts() {
    try {
      const response = await api.get("/alerts");
      return response.data;
    } catch (error) {
      console.error("Error fetching alerts:", error);
      throw error;
    }
  },

  // Recent Activity
  async getActivities() {
    try {
      const response = await api.get("/activity");
      return response.data;
    } catch (error) {
      console.error("Error fetching recent activity:", error);
      throw error;
    }
  },

};

export default dashboardService;