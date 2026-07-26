import api from "./api";

const analyticsService = {
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

  async getAIEfficiency() {
    const response = await api.get("/analytics/ai-efficiency");
    return response.data;
  },

  // -----------------------------------------------------------------------
  // Day 14 — AI Forecast Module
  // -----------------------------------------------------------------------

  /** 24-hour load prediction */
  async getForecastHourly() {
    const response = await api.get("/analytics/forecast/hourly");
    return response.data;
  },

  /** 7-day load prediction */
  async getForecastDaily() {
    const response = await api.get("/analytics/forecast/daily");
    return response.data;
  },

  /** Peak load prediction */
  async getForecastPeakLoad() {
    const response = await api.get("/analytics/forecast/peak-load");
    return response.data;
  },

  /** Prediction confidence metrics */
  async getForecastConfidence() {
    const response = await api.get("/analytics/forecast/confidence");
    return response.data;
  },

  /** AI recommendations */
  async getRecommendations() {
    const response = await api.get("/analytics/recommendations");
    return response.data;
  },
};

export default analyticsService;
