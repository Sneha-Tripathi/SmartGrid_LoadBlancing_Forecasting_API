import api from "./api";

const authService = {
  async login(email, password) {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },
  async register(name, email, password, phone = "") {
    const response = await api.post("/auth/register", { name, email, password, phone });
    return response.data;
  },
  async logout(refreshToken) {
    const response = await api.post("/auth/logout", { refresh_token: refreshToken });
    return response.data;
  },
  async getMe() {
    const response = await api.get("/auth/me");
    return response.data;
  },
  async updateProfile(data) {
    const response = await api.put("/auth/profile", data);
    return response.data;
  },
  async changePassword(currentPassword, newPassword) {
    const response = await api.put("/auth/change-password", {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  },
};

export default authService;
