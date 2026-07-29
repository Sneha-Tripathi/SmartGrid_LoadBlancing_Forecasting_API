import { useState, useEffect, useCallback } from "react";
import {
  FaCog,
  FaPalette,
  FaBell,
  FaGlobe,
  FaSave,
  FaRedo,
  FaSpinner,
  FaShieldAlt,
  FaDatabase,
  FaWifi,
} from "react-icons/fa";
import DashboardLayout from "../components/layout/DashboardLayout";
import SkeletonLoader from "../components/common/SkeletonLoader";
import ErrorMessage from "../components/common/ErrorMessage";
import toast from "react-hot-toast";
import settingsService from "../services/settingsService";
import { useTheme } from "../context/ThemeContext";

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState({});
  const { theme: contextTheme, toggleTheme } = useTheme();

  const [settings, setSettings] = useState({
    theme: "dark",
    language: "en",
    timezone: "UTC",
    compactView: false,
    emailAlerts: true,
    pushAlerts: true,
    criticalAlerts: true,
    weeklyDigest: false,
    autoRefresh: true,
    refreshInterval: "30",
    dataRetention: "90",
    twoFactor: false,
    sessionTimeout: "30",
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Load from localStorage first for instant display
        const storedTheme = localStorage.getItem("theme");
        const storedCompact = localStorage.getItem("compactView");
        const storedSettings = localStorage.getItem("sg-settings");
        
        if (storedSettings) {
          const parsed = JSON.parse(storedSettings);
          setSettings((prev) => ({ ...prev, ...parsed }));
        }
        if (storedTheme) {
          setSettings((prev) => ({ ...prev, theme: storedTheme }));
        }
        if (storedCompact) {
          setSettings((prev) => ({ ...prev, compactView: storedCompact === "true" }));
        }

        // Then load from backend for authoritative data
        const data = await settingsService.getSettings();
        setSettings((prev) => ({ ...prev, ...data }));
        localStorage.setItem("sg-settings", JSON.stringify(data));
        localStorage.setItem("theme", data.theme);
        localStorage.setItem("compactView", String(data.compactView));
      } catch (err) {
        console.warn("Settings API unavailable, using local storage");
        // Continue with localStorage values
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleChange = (key, value) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: value };
      
      // Persist theme immediately to localStorage
      if (key === "theme") {
        localStorage.setItem("theme", value);
        document.documentElement.setAttribute("data-theme", value);
        // Also update ThemeContext
        if (value === "light" && contextTheme === "dark") toggleTheme();
        else if (value === "dark" && contextTheme === "light") toggleTheme();
      }
      if (key === "compactView") {
        localStorage.setItem("compactView", String(value));
      }
      
      // Save all settings to localStorage
      localStorage.setItem("sg-settings", JSON.stringify(updated));
      
      return updated;
    });
  };

  const handleSave = async (section) => {
    setSaving((prev) => ({ ...prev, [section]: true }));
    try {
      // Map section to relevant keys
      const sectionKeys = {
        display: ["theme", "language", "timezone", "compactView"],
        notifications: ["emailAlerts", "pushAlerts", "criticalAlerts", "weeklyDigest"],
        system: ["autoRefresh", "refreshInterval", "dataRetention"],
        security: ["twoFactor", "sessionTimeout"],
      };

      const keysToSave = sectionKeys[section] || [];
      const payload = {};
      for (const key of keysToSave) {
        payload[key] = settings[key];
      }

      await settingsService.updateSettings(payload);
      
      // Persist to localStorage
      const existing = JSON.parse(localStorage.getItem("sg-settings") || "{}");
      localStorage.setItem("sg-settings", JSON.stringify({ ...existing, ...payload }));

      toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully`);
    } catch (err) {
      toast.error("Failed to save settings");
    } finally {
      setSaving((prev) => ({ ...prev, [section]: false }));
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <SkeletonLoader variant="settings" />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <ErrorMessage title="Failed to Load Settings" message={error.message || "Unable to load settings."} />
        <button onClick={() => { setError(null); setLoading(true); }} className="mt-4 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition text-sm">Retry</button>
      </DashboardLayout>
    );
  }

  const sections = [
    {
      id: "display",
      title: "Display Preferences",
      icon: FaPalette,
      color: "from-cyan-500 to-teal-600",
      fields: [
        { key: "theme", label: "Theme", type: "select", options: [
          { value: "dark", label: "Dark" }, { value: "light", label: "Light" }, { value: "system", label: "System" }
        ]},
        { key: "language", label: "Language", type: "select", options: [
          { value: "en", label: "English" }, { value: "es", label: "Spanish" }, { value: "fr", label: "French" }, { value: "de", label: "German" }
        ]},
        { key: "timezone", label: "Timezone", type: "select", options: [
          { value: "UTC", label: "UTC (Coordinated Universal Time)" }, { value: "EST", label: "EST (Eastern Standard Time)" }, { value: "PST", label: "PST (Pacific Standard Time)" }, { value: "CET", label: "CET (Central European Time)" }
        ]},
        { key: "compactView", label: "Compact Dashboard View", type: "toggle" },
      ],
    },
    {
      id: "notifications",
      title: "Notification Preferences",
      icon: FaBell,
      color: "from-amber-500 to-orange-600",
      fields: [
        { key: "emailAlerts", label: "Email Alerts", type: "toggle", desc: "Receive alert notifications via email" },
        { key: "pushAlerts", label: "Push Notifications", type: "toggle", desc: "Receive push notifications in browser" },
        { key: "criticalAlerts", label: "Critical Alerts Only", type: "toggle", desc: "Only receive notifications for critical alerts" },
        { key: "weeklyDigest", label: "Weekly Digest", type: "toggle", desc: "Receive a weekly summary of grid activity" },
      ],
    },
    {
      id: "system",
      title: "System Configuration",
      icon: FaCog,
      color: "from-violet-500 to-purple-600",
      fields: [
        { key: "autoRefresh", label: "Auto-Refresh Dashboard", type: "toggle", desc: "Automatically refresh dashboard data" },
        { key: "refreshInterval", label: "Refresh Interval (seconds)", type: "select", options: [
          { value: "15", label: "15 seconds" }, { value: "30", label: "30 seconds" }, { value: "60", label: "1 minute" }, { value: "300", label: "5 minutes" }
        ]},
        { key: "dataRetention", label: "Data Retention (days)", type: "select", options: [
          { value: "30", label: "30 days" }, { value: "60", label: "60 days" }, { value: "90", label: "90 days" }, { value: "180", label: "180 days" }, { value: "365", label: "1 year" }
        ]},
      ],
    },
    {
      id: "security",
      title: "Security Settings",
      icon: FaShieldAlt,
      color: "from-emerald-500 to-teal-600",
      fields: [
        { key: "twoFactor", label: "Two-Factor Authentication", type: "toggle", desc: "Add an extra layer of security" },
        { key: "sessionTimeout", label: "Session Timeout (minutes)", type: "select", options: [
          { value: "15", label: "15 minutes" }, { value: "30", label: "30 minutes" }, { value: "60", label: "1 hour" }, { value: "240", label: "4 hours" }, { value: "0", label: "Never" }
        ]},
      ],
    },
  ];

  return (
    <DashboardLayout>
      <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-5">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FaCog className="text-cyan-400" />
            Settings
          </h1>
          <p className="text-slate-400 mt-2">Configure your Smart Grid dashboard preferences.</p>
        </div>
      </section>

      <div className="space-y-8">
        {sections.map((section) => {
          const Icon = section.icon;
          const isSaving = saving[section.id];

          return (
            <section key={section.id} className="bg-[#101827] border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="text-white text-lg" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{section.title}</h2>
                </div>
                <div className="h-[2px] flex-1 ml-4 bg-gradient-to-r from-cyan-500/20 to-transparent" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-slate-300 text-sm mb-1.5">{field.label}</label>
                    {field.desc && <p className="text-slate-500 text-xs mb-2">{field.desc}</p>}
                    {field.type === "select" && (
                      <select value={settings[field.key]} onChange={(e) => handleChange(field.key, e.target.value)}
                        className="w-full bg-[#0B1220] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 transition text-sm">
                        {field.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    )}
                    {field.type === "toggle" && (
                      <button onClick={() => handleChange(field.key, !settings[field.key])}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${settings[field.key] ? "bg-cyan-500" : "bg-slate-700"}`}>
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-300 shadow ${settings[field.key] ? "translate-x-6" : "translate-x-0"}`} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-6 pt-4 border-t border-slate-800">
                <button onClick={() => handleSave(section.id)} disabled={isSaving}
                  className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 px-5 py-2.5 rounded-xl text-white font-medium transition text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20">
                  {isSaving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                  {isSaving ? "Saving..." : `Save ${section.title}`}
                </button>
              </div>
            </section>
          );
        })}
      </div>

      <section className="mt-8 bg-[#101827] border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaDatabase className="text-cyan-400 text-lg" />
          <h2 className="text-lg font-bold text-white">System Information</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          {[
            { label: "App Version", value: "1.0.0", icon: FaCog },
            { label: "API Status", value: "Online", icon: FaGlobe },
            { label: "WebSocket", value: "Connected", icon: FaWifi },
            { label: "Last Sync", value: new Date().toLocaleTimeString(), icon: FaDatabase },
          ].map((info) => {
            const InfoIcon = info.icon;
            return (
              <div key={info.label} className="bg-[#0B1220] rounded-xl p-4 flex items-center gap-3">
                <InfoIcon className="text-cyan-400 text-lg" />
                <div>
                  <p className="text-slate-500 text-xs">{info.label}</p>
                  <p className="text-white font-medium">{info.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </DashboardLayout>
  );
}
