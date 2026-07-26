import { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaSave,
  FaSpinner,
  FaCamera,
  FaShieldAlt,
  FaKey,
} from "react-icons/fa";
import DashboardLayout from "../components/layout/DashboardLayout";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";

export default function Profile() {
  const { user, updateProfile, changePassword } = useAuth();
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(profile);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }
    if (passwordData.new_password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setChangingPassword(true);
    try {
      await changePassword(passwordData.current_password, passwordData.new_password);
      toast.success("Password changed successfully");
      setPasswordData({ current_password: "", new_password: "", confirm_password: "" });
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <section className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FaUser className="text-cyan-400" /> Profile Settings
          </h1>
          <p className="text-slate-400 mt-2">Manage your account profile and security.</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6 text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center text-white text-3xl font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <h2 className="text-xl font-bold text-white mt-4">{user?.name || "User"}</h2>
              <p className="text-slate-400 capitalize">{user?.role || "User"}</p>
              <div className="mt-6 space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <FaEnvelope className="text-cyan-400" />
                  <span>{user?.email || "—"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <FaPhone className="text-cyan-400" />
                  <span>{user?.phone || "—"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <FaUser className="text-cyan-400" /> Edit Profile
              </h2>
              <form onSubmit={handleProfileUpdate} className="space-y-5">
                <div>
                  <label className="block text-slate-300 text-sm mb-1.5">Full Name</label>
                  <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full bg-[#0B1220] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 transition text-sm" />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm mb-1.5">Email</label>
                  <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full bg-[#0B1220] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 transition text-sm" />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm mb-1.5">Phone</label>
                  <input type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full bg-[#0B1220] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 transition text-sm" />
                </div>
                <button type="submit" disabled={saving}
                  className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 px-5 py-2.5 rounded-xl text-white font-medium transition text-sm disabled:opacity-50">
                  {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>

            {/* Change Password */}
            <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <FaKey className="text-cyan-400" /> Change Password
              </h2>
              <form onSubmit={handlePasswordChange} className="space-y-5">
                <div>
                  <label className="block text-slate-300 text-sm mb-1.5">Current Password</label>
                  <input type="password" value={passwordData.current_password} onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                    className="w-full bg-[#0B1220] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 transition text-sm" />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm mb-1.5">New Password</label>
                  <input type="password" value={passwordData.new_password} onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                    className="w-full bg-[#0B1220] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 transition text-sm" />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm mb-1.5">Confirm New Password</label>
                  <input type="password" value={passwordData.confirm_password} onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                    className="w-full bg-[#0B1220] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 transition text-sm" />
                </div>
                <button type="submit" disabled={changingPassword}
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 px-5 py-2.5 rounded-xl text-white font-medium transition text-sm disabled:opacity-50">
                  {changingPassword ? <FaSpinner className="animate-spin" /> : <FaShieldAlt />}
                  {changingPassword ? "Changing..." : "Change Password"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
