import api from "./api";
const energyService = {

  // Energy Load Trend
  async getLoadTrend() {
    const response = await api.get("/energy/load-trend");
    return response.data;
  },

  // AI Forecast
  async getForecast() {
    const response = await api.get("/energy/forecast");
    return response.data;
  },

  // Zone Distribution
  async getZoneDistribution() {
    const response = await api.get("/energy/zones");
    return response.data;
  },

  // Power Consumption
  async getConsumption() {
    const response = await api.get("/energy/consumption");
    return response.data;
  },

};

export default energyService;