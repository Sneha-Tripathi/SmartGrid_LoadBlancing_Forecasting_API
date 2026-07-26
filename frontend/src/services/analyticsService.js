import api from "./api";

const analyticsService = {
  async getForecastHourly() {
    const response = await api.get("/analytics/forecast/hourly");
    return response.data;
  },

  async getForecastDaily() {
    const response = await api.get("/analytics/forecast/daily");
    return response.data;
  },

  async getForecastPeakLoad() {
    const response = await api.get("/analytics/forecast/peak-load");
    return response.data;
  },

  async getForecastConfidence() {
    const response = await api.get("/analytics/forecast/confidence");
    return response.data;
  },

  async getRecommendations() {
    const response = await api.get("/analytics/recommendations");
    return response.data;
  },

  async getTodayEnergy() {
    const response = await api.get("/analytics/today-energy");
    return response.data;
  },

  async getWeeklyUsage() {
    const response = await api.get("/analytics/weekly-usage");
    return response.data;
  },

  async getMonthlyUsage() {
    const response = await api.get("/analytics/monthly-usage");
    return response.data;
  },

  async getPredictionAccuracy() {
    const response = await api.get("/analytics/prediction-accuracy");
    return response.data;
  },

  async getCarbonSaved() {
    const response = await api.get("/analytics/carbon-saved");
    return response.data;
  },

  async getAiEfficiency() {
    const response = await api.get("/analytics/ai-efficiency");
    return response.data;
  },
};

export default analyticsService;
