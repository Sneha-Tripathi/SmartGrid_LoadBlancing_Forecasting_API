import api from "./api";

const authService = {
  async login(email, password) {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  async register(name, email, password, phone = "") {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
      phone,
    });
    return response.data;
  },

  async logout(refreshToken) {
    const response = await api.post("/auth/logout", {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  async getMe() {
    const response = await api.get("/auth/me");
    return response.data;
  },

  async updateProfile(profileData) {
    const response = await api.put("/auth/profile", profileData);
    return response.data;
  },

  async changePassword(currentPassword, newPassword) {
    const response = await api.put("/auth/change-password", {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  },

  async refreshToken(refreshToken) {
    const response = await api.post("/auth/refresh", {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  async logoutAll() {
    const response = await api.post("/auth/logout-all");
    return response.data;
  },
};

export default authService;
