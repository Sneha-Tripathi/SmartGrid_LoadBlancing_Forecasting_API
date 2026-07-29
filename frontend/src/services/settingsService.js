import api from "./api";

const settingsService = {
  async getSettings() {
    const response = await api.get("/settings/");
    return response.data;
  },

  async updateSettings(data) {
    const response = await api.put("/settings/", data);
    return response.data;
  },

  async updateSingleSetting(key, value) {
    const response = await api.put(`/settings/${key}`, { value });
    return response.data;
  },

  async resetSettings() {
    const response = await api.post("/settings/reset");
    return response.data;
  },
};

export default settingsService;
