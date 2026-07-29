import { useEffect, useState, useRef, useCallback } from "react";
import {
  FaBell,
  FaSearch,
  FaSignOutAlt,
  FaClock,
  FaUser,
  FaArrowLeft,
  FaCheckDouble,
  FaTrash,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaFileAlt,
  FaCog,
} from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import notificationService from "../../services/notificationService";

export default function DashboardNavbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [currentTime, setCurrentTime] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const notifRef = useRef(null);

  // Fetch unread count periodically
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const data = await notificationService.getUnreadCount();
        setUnreadCount(data.unread_count || 0);
      } catch {
        // Silent fail
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, []);

  // Fetch notifications when dropdown opens
  const fetchNotifications = useCallback(async () => {
    setLoadingNotifs(true);
    try {
      const data = await notificationService.getNotifications({ page_size: 10 });
      setNotifications(data.items || []);
      setUnreadCount(data.unread_count || 0);
    } catch {
      // Silent fail
    } finally {
      setLoadingNotifs(false);
    }
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleNotifications = () => {
    const next = !showNotifications;
    setShowNotifications(next);
    if (next) {
      fetchNotifications();
    }
  };

  const handleMarkAsRead = async (notifId) => {
    try {
      await notificationService.markAsRead(notifId);
      setNotifications((prev) => prev.map((n) => n.id === notifId ? { ...n, read: true } : n));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // Silent fail
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  const handleDeleteNotif = async (notifId, e) => {
    e.stopPropagation();
    try {
      await notificationService.deleteNotification(notifId);
      setNotifications((prev) => prev.filter((n) => n.id !== notifId));
      if (!notifications.find((n) => n.id === notifId)?.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch {
      // Silent fail
    }
  };

  const getNotifIcon = (type) => {
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

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged Out Successfully");
    navigate("/login");
  };

  const username = user?.name || "Guest";
  const firstLetter = username.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 h-20 bg-[#050816]/90 backdrop-blur-xl border-b border-slate-800">
      <div className="h-full px-3 flex items-center justify-between">
        {/* Left */}
<div className="flex items-center gap-2">

  {/* Back to Home */}
  <button
    onClick={() => navigate("/")}
    className="
      flex
      items-center
      gap-2
      h-11
      px-5
      rounded-xl
      border
      border-cyan-500/40
      bg-[#0B1220]
      text-cyan-400
      hover:bg-cyan-500/10
      hover:border-cyan-400
      transition-all
      duration-300
    "
  >
    <FaArrowLeft className="text-sm" />
    <span className="hidden md:block font-medium">
      Back to Home
    </span>
  </button>

  {/* Date & Time */}
  <div className="hidden xl:flex items-center gap-2 bg-[#0B1220] border border-slate-700 rounded-xl px-3 py-2">
    <FaClock className="text-cyan-400" />
    <span className="text-sm text-slate-300">
      {currentTime}
    </span>
  </div>

</div>

        {/* Right */}
        <div className="flex items-center gap-5">
          {/* Search */}
          <div className="relative hidden lg:block">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
            <input type="text" placeholder="Search..."
              className="w-72 h-11 rounded-xl bg-[#0B1220] border border-slate-700 pl-11 pr-4 text-sm text-white outline-none focus:border-cyan-500" />
          </div>

          {/* Notification */}
          <div className="relative" ref={notifRef}>
            <button onClick={toggleNotifications}
              className="relative w-11 h-11 rounded-xl bg-[#0B1220] border border-slate-700 flex items-center justify-center hover:border-cyan-500 duration-300">
              <FaBell className={`text-white ${unreadCount > 0 ? 'animate-pulse' : ''}`} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-medium">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-14 w-96 bg-[#101827] border border-slate-700 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                  <h3 className="text-white font-semibold">Notifications</h3>
                  <div className="flex gap-2">
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllRead} className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                        <FaCheckDouble /> Mark All Read
                      </button>
                    )}
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {loadingNotifs ? (
                    <div className="flex items-center justify-center py-8">
                      <FaSpinner className="animate-spin text-cyan-400 text-xl" />
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <FaBell className="mx-auto text-3xl mb-2 opacity-50" />
                      <p className="text-sm">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div key={notif.id}
                        className={`px-4 py-3 border-b border-slate-800 hover:bg-slate-800/40 transition cursor-pointer ${!notif.read ? 'bg-cyan-500/5' : ''}`}
                        onClick={() => handleMarkAsRead(notif.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">{getNotifIcon(notif.type)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-sm ${!notif.read ? 'text-white font-semibold' : 'text-slate-300'}`}>
                                {notif.title}
                              </p>
                              <button onClick={(e) => handleDeleteNotif(notif.id, e)}
                                className="text-slate-600 hover:text-red-400 flex-shrink-0">
                                <FaTrash className="text-xs" />
                              </button>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notif.message}</p>
                            <p className="text-xs text-slate-600 mt-1">{getTimeAgo(notif.created_at)}</p>
                          </div>
                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0 mt-2" />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-3 border-t border-slate-700 text-center">
                  <Link to="/alerts" className="text-xs text-cyan-400 hover:text-cyan-300" onClick={() => setShowNotifications(false)}>
                    View All Notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User - Link to Profile */}
          <Link to="/profile" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg group-hover:shadow-lg group-hover:shadow-cyan-500/30 transition-shadow">
              {firstLetter}
            </div>
            <div className="hidden md:block">
              <h4 className="text-white font-semibold group-hover:text-cyan-300 transition">{username}</h4>
              <p className="text-slate-400 text-sm capitalize">{user?.role || "Grid Administrator"}</p>
            </div>
          </Link>

          {/* Logout */}
          <button onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 px-2 py-2 rounded-xl text-white transition">
            <FaSignOutAlt />
            <span className="hidden lg:block">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
