import api from "./api";

const notificationService = {
  async getNotifications(params = {}) {
    const response = await api.get("/notifications/", { params });
    return response.data;
  },

  async getUnreadCount() {
    const response = await api.get("/notifications/unread-count");
    return response.data;
  },

  async markAsRead(notificationId) {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  async markAllAsRead() {
    const response = await api.put("/notifications/read-all");
    return response.data;
  },

  async deleteNotification(notificationId) {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },

  async clearAll() {
    const response = await api.delete("/notifications/");
    return response.data;
  },
};

export default notificationService;
