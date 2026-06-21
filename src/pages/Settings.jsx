import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { User, Bell, Lock, Camera, Shield, RefreshCw, Moon, Sun, Download } from "lucide-react"; 
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext"; 
import useUpload from "../hooks/useUpload";

export default function Settings() {
  const { setUser: setAuthUser } = useAuth();
  const { uploadAvatar, uploading: uploadingAvatar } = useUpload();
  const { dark, toggleTheme } = useTheme(); 

  // Core profile & infrastructure states
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ username: "", bio: "", location: "", website: "" });
  const [notifications, setNotifications] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [applyingVerification, setApplyingVerification] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("none"); 
  const [avatar, setAvatar] = useState(null);
  const fileRef = useRef();

  // PWA Installation States
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  // Fetch initial profile configurations
  useEffect(() => {
    api.get("/users/me")
      .then(res => {
        const userData = res.data.user;
        setUser(userData);
        setForm({
          username: userData.username || "",
          bio: userData.bio || "",
          location: userData.location || "",
          website: userData.website || "",
        });
        setAvatar(userData.avatar || null);
        setNotifications(userData.pushNotifications !== false);
        
        if (userData.isVerified) {
          setVerificationStatus("verified");
        } else if (userData.verificationPending) {
          setVerificationStatus("pending");
        }
      })
      .catch((err) => console.error("Failed to load user profile options:", err));
  }, []);

  // PWA Installation Listener
  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    });
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }
  }, []);

  // PWA Action Controller
  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
      setInstallPrompt(null);
      if (typeof toast !== "undefined") {
        toast({ message: "Feed installed! 🎉", type: "success" });
      } else {
        console.log("Feed installed! 🎉");
      }
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setAvatar(reader.result);
    reader.readAsDataURL(file);

    const url = await uploadAvatar(file);
    if (url) setAvatar(url);
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await api.put("/users/me", { ...form, avatar });
      setUser(res.data.user);
      setAuthUser(res.data.user);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Profile save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleApplyVerification = async () => {
    setApplyingVerification(true);
    try {
      await api.post("/verifications/apply");
      setVerificationStatus("pending");
    } catch (err) {
      console.error("Verification deployment error:", err);
    } finally {
      setApplyingVerification(false);
    }
  };

  const handleNotificationToggle = async () => {
    const nextState = !notifications;
    setNotifications(nextState);
    try {
      await api.put("/users/me", { pushNotifications: nextState });
    } catch (err) {
      console.error("Notification sync error:", err);
      setNotifications(notifications);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-4">
      <h1 className="text-xl font-bold text-gray-800 dark:text-white">Settings</h1>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#1e2732] rounded-2xl border border-gray-100 dark:border-[#38444d] shadow-sm p-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <User size={18} className="text-blue-600" />
          <h2 className="font-bold text-gray-800 dark:text-white">Profile</h2>
        </div>

        {/* Avatar Setup */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <img
              src={avatar || `https://ui-avatars.com/api/?name=${user?.username || "U"}&background=2563eb&color=fff`}
              className="w-20 h-20 rounded-full object-cover border-4 border-blue-100"
              alt="avatar"
            />
            {uploadingAvatar && (
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <button
              onClick={() => fileRef.current.click()}
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full shadow hover:bg-blue-700 transition"
            >
              <Camera size={12} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-100">{user?.username || "Your Name"}</p>
            <p className="text-sm text-gray-400">{user?.email}</p>
            <button
              onClick={() => fileRef.current.click()}
              disabled={uploadingAvatar}
              className="text-sm text-blue-600 font-medium hover:underline mt-1 disabled:opacity-50"
            >
              {uploadingAvatar ? "Uploading..." : "Change photo"}
            </button>
          </div>
        </div>

        {/* Info Inputs */}
        <div className="space-y-3">
          {[
            { key: "username", label: "Username" },
            { key: "location", label: "Location" },
            { key: "website", label: "Website" },
          ].map(field => (
            <div key={field.key}>
              <label className="text-xs font-medium text-gray-500 mb-1 block">{field.label}</label>
              <input
                value={form[field.key]}
                onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#15202b] text-gray-800 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          ))}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Bio</label>
            <textarea
              value={form.bio}
              onChange={e => setForm({ ...form, bio: e.target.value })}
              rows={3}
              maxLength={160}
              className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#15202b] text-gray-800 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
            <p className="text-xs text-gray-400 text-right">{form.bio.length}/160</p>
          </div>
        </div>

        <button
          onClick={save}
          disabled={saving || uploadingAvatar}
          className="mt-5 w-full bg-gradient-to-r from-sky-500 to-blue-700 text-white py-2.5 rounded-xl font-semibold hover:brightness-110 transition disabled:opacity-50"
        >
          {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Changes"}
        </button>
      </motion.div>

      {/* Verification Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white dark:bg-[#1e2732] rounded-2xl border border-gray-100 dark:border-[#38444d] shadow-sm p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Shield size={18} className="text-blue-600" />
          <h2 className="font-bold text-gray-800 dark:text-white">Verification Status</h2>
        </div>

        {verificationStatus === "verified" && (
          <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl p-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 dark:text-white text-sm">Your account is verified ✓</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">The organizational blue badge is active on your profile</p>
            </div>
          </div>
        )}

        {verificationStatus === "pending" && (
          <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl p-4 border border-amber-100 dark:border-amber-900/40">
            <RefreshCw size={18} className="text-amber-600 animate-spin" />
            <div>
              <p className="font-semibold text-amber-900 dark:text-amber-200 text-sm">Application Under Review</p>
              <p className="text-xs text-amber-600 dark:text-amber-400">Our trust and safety team is reviewing your profile metrics.</p>
            </div>
          </div>
        )}

        {verificationStatus === "none" && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Apply for an organizational blue verification badge. Eligible for creators, groups, and verified companies.
            </p>
            <button 
              onClick={handleApplyVerification}
              disabled={applyingVerification}
              className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition text-sm disabled:opacity-50"
            >
              {applyingVerification ? "Submitting Request..." : "Apply for Verification"}
            </button>
          </div>
        )}
      </motion.div>

      {/* Integrated Standalone Dark Mode Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="bg-white dark:bg-[#1e2732] rounded-2xl border border-gray-100 dark:border-[#38444d] shadow-sm p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          {dark ? <Moon size={18} className="text-blue-600" /> : <Sun size={18} className="text-blue-600" />}
          <h2 className="font-bold text-gray-800 dark:text-white">Appearance</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Dark Mode</p>
            <p className="text-xs text-gray-400">Switch between light and dark</p>
          </div>
          <button
            onClick={toggleTheme}
            className={`w-12 h-6 rounded-full transition-colors relative ${dark ? "bg-blue-600" : "bg-gray-200"}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform ${dark ? "translate-x-6" : "translate-x-0.5"}`} />
          </button>
        </div>
      </motion.div>

      {/* Integrated Premium PWA Install Banner */}
      {(installPrompt || !isInstalled) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Download size={22} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-white">Install Feed App</p>
              <p className="text-blue-200 text-xs mt-0.5">Add to home screen for the best experience</p>
            </div>
          </div>
          <button
            onClick={handleInstall}
            className="mt-4 w-full bg-white text-blue-600 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-50 transition"
          >
            Install Now
          </button>
        </motion.div>
      )}

      {/* Notifications Module */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
        className="bg-white dark:bg-[#1e2732] rounded-2xl border border-gray-100 dark:border-[#38444d] shadow-sm p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Bell size={18} className="text-blue-600" />
          <h2 className="font-bold text-gray-800 dark:text-white">Notifications</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Push Notifications</p>
            <p className="text-xs text-gray-400">Get notified about live feed events and wallet operations</p>
          </div>
          <button
            onClick={handleNotificationToggle}
            className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? "bg-blue-600" : "bg-gray-200"}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform ${notifications ? "translate-x-6" : "translate-x-0.5"}`} />
          </button>
        </div>
      </motion.div>

      {/* Security Features Panel */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.20 }}
        className="bg-white dark:bg-[#1e2732] rounded-2xl border border-gray-100 dark:border-[#38444d] shadow-sm p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Lock size={18} className="text-blue-600" />
          <h2 className="font-bold text-gray-800 dark:text-white">Privacy & Security</h2>
        </div>
        <div className="space-y-2">
          <button className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-[#15202b] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 transition">
            🔑 Change Password
          </button>
          <button className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-[#15202b] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 transition">
            🛡️ Two-Factor Authentication
          </button>
          <button className="w-full text-left px-4 py-3 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 transition">
            🗑️ Delete Account
          </button>
        </div>
      </motion.div>
    </div>
  );
}
