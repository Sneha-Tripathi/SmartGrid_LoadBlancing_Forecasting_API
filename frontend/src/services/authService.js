import api from "./api";

const authService = {
  // Register a new user
  async register(name, email, password, phone = "") {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
      phone,
    });
    return response.data;
  },

  // Login with email & password
  async login(email, password) {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  // Refresh access token
  async refresh(refreshToken) {
    const response = await api.post("/auth/refresh", {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  // Logout (revoke refresh token)
  async logout(refreshToken) {
    const response = await api.post("/auth/logout", {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  // Logout from all devices
  async logoutAll() {
    const response = await api.post("/auth/logout-all");
    return response.data;
  },

  // Get current user profile
  async getMe() {
    const response = await api.get("/auth/me");
    return response.data;
  },

  // Update profile (name, email, phone, avatar)
  async updateProfile(data) {
    const response = await api.put("/auth/profile", data);
    return response.data;
  },

  // Change password
  async changePassword(currentPassword, newPassword) {
    const response = await api.put("/auth/change-password", {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  },
};

export default authService;
