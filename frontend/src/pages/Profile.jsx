import { useState } from "react";
import { FaUser, FaSave, FaSpinner } from "react-icons/fa";
import DashboardLayout from "../components/layout/DashboardLayout";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";

export default function Profile() {
  const { user, updateProfile, changePassword } = useAuth();
  const [saving, setSaving] = useState(false);
  const [passSaving, setPassSaving] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name, phone });
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setPassSaving(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to change password");
    } finally {
      setPassSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <FaUser className="text-cyan-400" /> Profile
        </h1>
        <p className="text-slate-400 mt-2">Manage your account settings.</p>
      </section>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Profile Information</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <div>
              <label className="block text-slate-300 text-sm mb-1.5">Email</label>
              <input type="email" value={user?.email || ""} disabled className="w-full bg-[#0B1220] border border-slate-700 rounded-xl px-4 py-2.5 text-slate-500 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-slate-300 text-sm mb-1.5">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#0B1220] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 transition" />
            </div>
            <div>
              <label className="block text-slate-300 text-sm mb-1.5">Phone</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-[#0B1220] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 transition" />
            </div>
            <button type="submit" disabled={saving} className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 px-5 py-2.5 rounded-xl text-white font-medium transition disabled:opacity-50">
              {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Change Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-5">
            <div>
              <label className="block text-slate-300 text-sm mb-1.5">Current Password</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full bg-[#0B1220] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 transition" />
            </div>
            <div>
              <label className="block text-slate-300 text-sm mb-1.5">New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-[#0B1220] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 transition" />
            </div>
            <button type="submit" disabled={passSaving} className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 px-5 py-2.5 rounded-xl text-white font-medium transition disabled:opacity-50">
              {passSaving ? <FaSpinner className="animate-spin" /> : <FaSave />}
              {passSaving ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
