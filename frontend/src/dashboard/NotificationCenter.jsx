import { memo, useEffect, useState, useCallback } from "react";
import {
  FaBell,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaFileAlt,
  FaCog,
  FaTrash,
  FaCheckDouble,
  FaSpinner,
} from "react-icons/fa";

import notificationService from "../services/notificationService";
import { useWebSocketContext } from "../context/WebSocketContext";

const MAX_NOTIFICATIONS = 10;

const NotificationCenter = memo(function NotificationCenter() {
  const { liveData } = useWebSocketContext();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await notificationService.getNotifications({ page_size: MAX_NOTIFICATIONS });
      setNotifications(data.items || []);
      setUnreadCount(data.unread_count || 0);
    } catch {
      // Backend unavailable - that's ok
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Add WebSocket live alerts as notifications
  useEffect(() => {
    if (!liveData) return;
    if (!liveData.status || !liveData.alert) return;

    const notification = {
      id: `live-${Date.now()}`,
      title: liveData.status === "Critical" ? "Critical Alert" : liveData.status === "Warning" ? "Warning" : "Status Update",
      message: liveData.alert,
      type: liveData.status === "Critical" ? "alert_created" : liveData.status === "Warning" ? "system_warning" : "info",
      read: false,
      created_at: liveData.timestamp || new Date().toISOString(),
    };

    setNotifications((prev) => [notification, ...prev.slice(0, MAX_NOTIFICATIONS - 1)]);
    if (!notification.read) {
      setUnreadCount((prev) => prev + 1);
    }
  }, [liveData]);

  const handleMarkAsRead = async (notifId) => {
    try {
      await notificationService.markAsRead(notifId);
      setNotifications((prev) => prev.map((n) => n.id === notifId ? { ...n, read: true } : n));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      setNotifications((prev) => prev.map((n) => n.id === notifId ? { ...n, read: true } : n));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    }
  };

  const handleDelete = async (notifId) => {
    try {
      await notificationService.deleteNotification(notifId);
      setNotifications((prev) => prev.filter((n) => n.id !== notifId));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      setNotifications((prev) => prev.filter((n) => n.id !== notifId));
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "alert_created": return <FaExclamationTriangle className="text-red-400" />;
      case "report_generated": return <FaFileAlt className="text-cyan-400" />;
      case "settings_updated": return <FaCog className="text-blue-400" />;
      case "login_success": return <FaCheckCircle className="text-green-400" />;
      case "login_failure":
      case "system_warning": return <FaExclamationTriangle className="text-amber-400" />;
      default: return <FaInfoCircle className="text-cyan-400" />;
    }
  };

  const getTimeAgo = (dateStr) => {
    if (!dateStr) return "";
    try {
      const diff = Date.now() - new Date(dateStr).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return "just now";
      if (mins < 60) return `${mins}m ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs}h ago`;
      return `${Math.floor(hrs / 24)}d ago`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaBell className="text-cyan-400 text-xl" />
          <h2 className="text-xl font-semibold text-white">Notifications</h2>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-medium">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead} className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
            <FaCheckDouble /> Mark All Read
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <FaSpinner className="animate-spin text-cyan-400 text-xl" />
        </div>
      ) : notifications.length === 0 ? (
        <p className="text-slate-400 text-center py-8">No notifications yet. Live alerts will appear here.</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`bg-[#0B1220] border rounded-xl p-4 transition-all duration-200 ${
                !item.read ? 'border-cyan-500/30 bg-cyan-500/5' : 'border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getIcon(item.type || item.status)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`text-sm ${!item.read ? 'text-white font-semibold' : 'text-slate-300'}`}>
                        {item.title || item.message}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.message || item.title}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!item.read && (
                        <button onClick={() => handleMarkAsRead(item.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition">
                          <FaCheckCircle className="text-xs" />
                        </button>
                      )}
                      <button onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition">
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs ${item.status === 'Critical' ? 'text-red-400' : item.status === 'Warning' ? 'text-yellow-400' : 'text-slate-500'}`}>
                      {item.status || item.type}
                    </span>
                    <span className="text-xs text-slate-600">{getTimeAgo(item.time || item.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default NotificationCenter;
