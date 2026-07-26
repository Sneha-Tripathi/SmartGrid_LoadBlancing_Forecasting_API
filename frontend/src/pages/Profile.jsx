import { useState } from "react";
import useAuth from "../hooks/useAuth";
import DashboardLayout from "../components/layout/DashboardLayout";
import toast from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaShieldAlt,
  FaSave,
  FaKey,
  FaSpinner,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";

export default function Profile() {
  const { user, updateProfile, changePassword } = useAuth();

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    avatar: user?.avatar || "",
  });
  const [profileSaving, setProfileSaving] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordSaving, setPasswordSaving] = useState(false);

  const handleProfileChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!profile.name.trim() || !profile.email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    setProfileSaving(true);
    try {
      const updated = await updateProfile({
        name: profile.name.trim(),
        email: profile.email.trim().toLowerCase(),
        phone: profile.phone.trim(),
        avatar: profile.avatar.trim() || undefined,
      });
      setProfile({
        name: updated.name,
        email: updated.email,
        phone: updated.phone || "",
        avatar: updated.avatar || "",
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      const msg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Failed to update profile";
      toast.error(msg);
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwords.currentPassword) {
      toast.error("Current password is required");
      return;
    }
    if (!passwords.newPassword || passwords.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setPasswordSaving(true);
    try {
      await changePassword(passwords.currentPassword, passwords.newPassword);
      toast.success("Password changed successfully");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      const msg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Failed to change password";
      toast.error(msg);
    } finally {
      setPasswordSaving(false);
    }
  };

  const initials = profile.name
    ? profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const roleBadgeColors = {
    admin: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    operator: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    user: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  };
  const roleBadge = roleBadgeColors[user?.role] || roleBadgeColors.user;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">My Profile</h1>
          <p className="text-slate-400 mt-1">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Avatar & Info */}
          <div className="lg:col-span-1">
            <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6 sticky top-24">
              <div className="flex flex-col items-center">
                <div className="w-28 h-28 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center text-white font-bold text-4xl border-4 border-cyan-500/30">
                  {initials}
                </div>
                <div className="mt-4 text-center">
                  <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                  <span className={"inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold border " + roleBadge}>
                    {user?.role?.toUpperCase() || "USER"}
                  </span>
                </div>
              </div>

              {/* Quick Info */}
              <div className="mt-6 space-y-3 border-t border-slate-800 pt-6">
                <div className="flex items-center gap-3 text-sm">
                  <FaEnvelope className="text-cyan-400" />
                  <span className="text-slate-300">{user?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FaPhone className="text-teal-400" />
                  <span className="text-slate-300">{user?.phone || "Not set"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FaShieldAlt className="text-purple-400" />
                  <span className="text-slate-300 capitalize">{user?.role || "user"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FaCalendarAlt className="text-slate-400" />
                  <span className="text-slate-300">Joined {formatDate(user?.created_at)}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FaClock className="text-slate-400" />
                  <span className="text-slate-300">Updated {formatDate(user?.updated_at)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Edit Profile */}
            <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <FaUser className="text-cyan-400 text-xl" />
                <h2 className="text-xl font-bold text-white">Edit Profile</h2>
              </div>
              <form onSubmit={handleUpdateProfile} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-slate-300 mb-2 text-sm">Full Name</label>
                    <input type="text" name="name" value={profile.name} onChange={handleProfileChange}
                      placeholder="Enter your name"
                      className="w-full bg-[#0B1220] border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-cyan-500 transition placeholder:text-slate-600" />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-2 text-sm">Email</label>
                    <input type="email" name="email" value={profile.email} onChange={handleProfileChange}
                      placeholder="Enter your email"
                      className="w-full bg-[#0B1220] border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-cyan-500 transition placeholder:text-slate-600" />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-2 text-sm">Phone</label>
                    <input type="tel" name="phone" value={profile.phone} onChange={handleProfileChange}
                      placeholder="+1-555-0000"
                      className="w-full bg-[#0B1220] border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-cyan-500 transition placeholder:text-slate-600" />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-2 text-sm">Avatar URL</label>
                    <input type="url" name="avatar" value={profile.avatar} onChange={handleProfileChange}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full bg-[#0B1220] border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-cyan-500 transition placeholder:text-slate-600" />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button type="submit" disabled={profileSaving}
                    className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 px-6 py-3 rounded-lg text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed">
                    {profileSaving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                    {profileSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>

            {/* Change Password */}
            <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <FaKey className="text-teal-400 text-xl" />
                <h2 className="text-xl font-bold text-white">Change Password</h2>
              </div>
              <form onSubmit={handleChangePassword} className="space-y-5">
                <div>
                  <label className="block text-slate-300 mb-2 text-sm">Current Password</label>
                  <input type="password" name="currentPassword" value={passwords.currentPassword}
                    onChange={handlePasswordChange} placeholder="Enter current password"
                    className="w-full bg-[#0B1220] border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-cyan-500 transition placeholder:text-slate-600"
                    autoComplete="current-password" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-slate-300 mb-2 text-sm">New Password</label>
                    <input type="password" name="newPassword" value={passwords.newPassword}
                      onChange={handlePasswordChange} placeholder="Min 6 characters"
                      className="w-full bg-[#0B1220] border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-cyan-500 transition placeholder:text-slate-600"
                      autoComplete="new-password" />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-2 text-sm">Confirm New Password</label>
                    <input type="password" name="confirmPassword" value={passwords.confirmPassword}
                      onChange={handlePasswordChange} placeholder="Re-enter new password"
                      className="w-full bg-[#0B1220] border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-cyan-500 transition placeholder:text-slate-600"
                      autoComplete="new-password" />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button type="submit" disabled={passwordSaving}
                    className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 px-6 py-3 rounded-lg text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed">
                    {passwordSaving ? <FaSpinner className="animate-spin" /> : <FaKey />}
                    {passwordSaving ? "Changing..." : "Change Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
