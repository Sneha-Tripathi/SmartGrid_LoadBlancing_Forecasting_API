import api from "./api";

const meterService = {
  // Get all meters with search, filter, pagination, sorting
  async getMeters(params = {}) {
    const response = await api.get("/meters/", { params });
    return response.data;
  },

  // Get single meter with full detail (history, alerts, timeline)
  async getMeter(meterId) {
    const response = await api.get(`/meters/${meterId}`);
    return response.data;
  },

  // Create a new meter
  async createMeter(data) {
    const response = await api.post("/meters/", data);
    return response.data;
  },

  // Update an existing meter
  async updateMeter(meterId, data) {
    const response = await api.put(`/meters/${meterId}`, data);
    return response.data;
  },

  // Delete a meter
  async deleteMeter(meterId) {
    const response = await api.delete(`/meters/${meterId}`);
    return response.data;
  },

  // Get zones list
  async getZones() {
    const response = await api.get("/meters/zones");
    return response.data;
  },

  // Get statuses list
  async getStatuses() {
    const response = await api.get("/meters/statuses");
    return response.data;
  },
};

export default meterService;
