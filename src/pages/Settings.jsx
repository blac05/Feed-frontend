import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, UserX, VolumeX, Key, User, Bell } from "lucide-react";
import api from "../api/axios"; // Your Axios utility instance
import { useToast } from "../context/ToastContext";

export default function Settings() {
  const { toast } = useToast();

  // ==========================================
  // STATE MANAGEMENT PIPELINES
  // ==========================================
  const [blocked, setBlocked] = useState([]);
  const [muted, setMuted] = useState([]);
  const [changePwForm, setChangePwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [changingPw, setChangingPw] = useState(false);
  const [showPw, setShowPw] = useState(false);

  // Profile preferences sync state
  const [notifications, setNotifications] = useState(true);
  const [updatingSettings, setUpdatingSettings] = useState(false);

  // ==========================================
  // DATA LIFECYCLE HYDRATION
  // ==========================================
  useEffect(() => {
    api.get("/users/blocked")
      .then(res => setBlocked(res.data.blocked || []))
      .catch(() => {});
      
    api.get("/users/muted")
      .then(res => setMuted(res.data.muted || []))
      .catch(() => {});

    // Sync initial profile state configuration
    api.get("/users/me")
      .then(res => {
        if (res.data.user) {
          setNotifications(res.data.user.pushNotifications ?? true);
        }
      })
      .catch(() => {});
  }, []);

  // ==========================================
  // ACTION UTILITIES & DISPATCHERS
  // ==========================================
  const handleUnblock = async (userId) => {
    try {
      await api.post(`/users/${userId}/block`);
      setBlocked(prev => prev.filter(u => u._id !== userId));
      toast({ message: "User unblocked successfully", type: "success" });
    } catch (e) { 
      toast({ message: "Failed to lift block restriction", type: "error" }); 
    }
  };

  const handleUnmute = async (userId) => {
    try {
      await api.post(`/users/${userId}/mute`);
      setMuted(prev => prev.filter(u => u._id !== userId));
      toast({ message: "User unmuted successfully", type: "success" });
    } catch (e) { 
      toast({ message: "Failed to lift mute restriction", type: "error" }); 
    }
  };

  const handleChangePassword = async () => {
    if (changePwForm.newPw !== changePwForm.confirm) {
      toast({ message: "Passwords do not match", type: "error" }); 
      return;
    }
    if (changePwForm.newPw.length < 6) {
      toast({ message: "Password must be at least 6 characters", type: "error" }); 
      return;
    }
    
    setChangingPw(true);
    try {
      await api.post("/auth/change-password", {
        currentPassword: changePwForm.current,
        newPassword: changePwForm.newPw,
      });
      toast({ message: "Password updated successfully! 🔑", type: "success" });
      setChangePwForm({ current: "", newPw: "", confirm: "" });
    } catch (e) {
      toast({ message: e.response?.data?.message || "Failed to change password", type: "error" });
    } finally {
      setChangingPw(false);
    }
  };

  const toggleNotificationPreferences = async (checked) => {
    setNotifications(checked);
    setUpdatingSettings(true);
    try {
      await api.put("/users/me", { pushNotifications: checked });
      toast({ message: "Notification system configurations updated", type: "success" });
    } catch (e) {
      toast({ message: "Failed to sync system preferences", type: "error" });
      setNotifications(!checked); // Rollback state index on error sync breach
    } finally {
      setUpdatingSettings(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      
      {/* PREFERENCES MATRIX CONFIGURATION */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#1e2732] rounded-2xl border border-gray-100 dark:border-[#38444d] shadow-sm p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Bell size={18} className="text-blue-600" />
          <h2 className="font-bold text-gray-800 dark:text-white">System Preferences</h2>
        </div>
        <div className="flex items-center justify-between bg-gray-50 dark:bg-[#15202b] rounded-xl px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-white">Push Notifications</p>
            <p className="text-xs text-gray-400">Receive system broadcasts and direct activity signals</p>
          </div>
          <input 
            type="checkbox" 
            disabled={updatingSettings}
            checked={notifications} 
            onChange={(e) => toggleNotificationPreferences(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
        </div>
      </motion.div>

      {/* CHANGE PASSWORD ENGINE */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="bg-white dark:bg-[#1e2732] rounded-2xl border border-gray-100 dark:border-[#38444d] shadow-sm p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Key size={18} className="text-blue-600" />
          <h2 className="font-bold text-gray-800 dark:text-white">Change Password</h2>
        </div>
        <div className="space-y-3">
          {[
            { key: "current", label: "Current Password", placeholder: "Your current password" },
            { key: "newPw", label: "New Password", placeholder: "At least 6 characters" },
            { key: "confirm", label: "Confirm New Password", placeholder: "Repeat new password" },
          ].map(field => (
            <div key={field.key}>
              <label className="text-xs font-medium text-gray-500 mb-1 block">{field.label}</label>
              <input
                type={showPw ? "text" : "password"}
                value={changePwForm[field.key]}
                onChange={e => setChangePwForm({ ...changePwForm, [field.key]: e.target.value })}
                placeholder={field.placeholder}
                className="w-full border border-gray-200 dark:border-[#38444d] bg-gray-50 dark:bg-[#15202b] text-gray-800 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transitions-all duration-200"
              />
            </div>
          ))}
          <div className="flex items-center gap-2 pt-1">
            <input 
              type="checkbox" 
              id="showpw" 
              checked={showPw} 
              onChange={() => setShowPw(s => !s)} 
              className="rounded dark:bg-[#15202b] border-gray-300 dark:border-[#38444d]" 
            />
            <label htmlFor="showpw" className="text-xs text-gray-500 select-none cursor-pointer">Show passwords</label>
          </div>
          <button
            onClick={handleChangePassword}
            disabled={changingPw || !changePwForm.current || !changePwForm.newPw}
            className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition text-sm disabled:opacity-50 mt-2"
          >
            {changingPw ? "Changing..." : "Change Password"}
          </button>
        </div>
      </motion.div>

      {/* PRIVACY LABS: BLOCK & MUTE INTERACTIVE MANAGER */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
        className="bg-white dark:bg-[#1e2732] rounded-2xl border border-gray-100 dark:border-[#38444d] shadow-sm p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Shield size={18} className="text-blue-600" />
          <h2 className="font-bold text-gray-800 dark:text-white">Blocked & Muted Registry</h2>
        </div>

        {/* BLOCKED INDEX */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
            <UserX size={14} className="text-red-500" /> Blocked Users ({blocked.length})
          </p>
          {blocked.length === 0 ? (
            <p className="text-xs text-gray-400 bg-gray-50 dark:bg-[#15202b] rounded-xl px-4 py-3 border border-dashed border-gray-200 dark:border-[#38444d]">No accounts are blocked on this index.</p>
          ) : (
            <div className="space-y-2">
              {blocked.map(u => (
                <div key={u._id} className="flex items-center justify-between bg-gray-50 dark:bg-[#15202b] rounded-xl px-3 py-2 border border-gray-100 dark:border-transparent">
                  <div className="flex items-center gap-2">
                    <img
                      src={u.avatar || `https://ui-avatars.com/api/?name=${u.username}&background=2563eb&color=fff`}
                      className="w-8 h-8 rounded-full object-cover"
                      alt={u.username}
                    />
                    <div>
                      <p className="text-xs font-semibold text-gray-800 dark:text-white">{u.name || u.username}</p>
                      <p className="text-xs text-gray-400">@{u.username}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUnblock(u._id)}
                    className="text-xs bg-red-50 dark:bg-red-950/30 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 px-3 py-1.5 rounded-lg font-medium transition"
                  >
                    Unblock
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MUTED INDEX */}
        <div>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
            <VolumeX size={14} className="text-blue-500" /> Muted Users ({muted.length})
          </p>
          {muted.length === 0 ? (
            <p className="text-xs text-gray-400 bg-gray-50 dark:bg-[#15202b] rounded-xl px-4 py-3 border border-dashed border-gray-200 dark:border-[#38444d]">No accounts are currently muted.</p>
          ) : (
            <div className="space-y-2">
              {muted.map(u => (
                <div key={u._id} className="flex items-center justify-between bg-gray-50 dark:bg-[#15202b] rounded-xl px-3 py-2 border border-gray-100 dark:border-transparent">
                  <div className="flex items-center gap-2">
                    <img
                      src={u.avatar || `https://ui-avatars.com/api/?name=${u.username}&background=2563eb&color=fff`}
                      className="w-8 h-8 rounded-full object-cover"
                      alt={u.username}
                    />
                    <div>
                      <p className="text-xs font-semibold text-gray-800 dark:text-white">{u.name || u.username}</p>
                      <p className="text-xs text-gray-400">@{u.username}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUnmute(u._id)}
                    className="text-xs bg-blue-50 dark:bg-blue-950/30 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-3 py-1.5 rounded-lg font-medium transition"
                  >
                    Unmute
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

    </div>
  );
}
