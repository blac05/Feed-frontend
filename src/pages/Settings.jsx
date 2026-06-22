import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, UserX, VolumeX, Key, Bell, Eye, EyeOff, 
  QrCode, Smartphone, Copy, CheckCircle2 
} from "lucide-react";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";

export default function Settings() {
  const { toast } = useToast();

  // ==========================================
  // STATE MANAGEMENT PIPELINES
  // ==========================================
  const [blocked, setBlocked] = useState([]);
  const [muted, setMuted] = useState([]);
  
  // Password state
  const [changePwForm, setChangePwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [changingPw, setChangingPw] = useState(false);
  const [showPw, setShowPw] = useState(false);

  // Profile preferences state
  const [notifications, setNotifications] = useState(true);
  const [updatingSettings, setUpdatingSettings] = useState(false);

  // 2FA state engine
  const [twoFAStatus, setTwoFAStatus] = useState({ enabled: false, loaded: false });
  const [twoFASetup, setTwoFASetup] = useState(null); // { secret, qrDataUrl }
  const [twoFACode, setTwoFACode] = useState("");
  const [twoFALoading, setTwoFALoading] = useState(false);
  const [disableCode, setDisableCode] = useState("");
  const [showDisable, setShowDisable] = useState(false);
  const [copied, setCopied] = useState(false);

  // ==========================================
  // DATA LIFECYCLE HYDRATION
  // ==========================================
  useEffect(() => {
    // 2FA Status Sync
    api.get("/auth/2fa/status")
      .then(res => setTwoFAStatus({ enabled: res.data.twoFactorEnabled, loaded: true }))
      .catch(() => setTwoFAStatus({ enabled: false, loaded: true }));

    // Privacy Registries Hydration
    api.get("/users/blocked")
      .then(res => setBlocked(res.data.blocked || []))
      .catch(() => {});
      
    api.get("/users/muted")
      .then(res => setMuted(res.data.muted || []))
      .catch(() => {});

    // System Preferences Configuration
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

  const toggleNotificationPreferences = async () => {
    const targetState = !notifications;
    setNotifications(targetState);
    setUpdatingSettings(true);
    try {
      await api.put("/users/me", { pushNotifications: targetState });
      toast({ message: "Notification system configurations updated", type: "success" });
    } catch (e) {
      toast({ message: "Failed to sync system preferences", type: "error" });
      setNotifications(notifications);
    } finally {
      setUpdatingSettings(false);
    }
  };

  // ==========================================
  // 2FA CONTROL INTERFACES
  // ==========================================
  const handleInitiate2FA = async () => {
    setTwoFALoading(true);
    try {
      const res = await api.post("/auth/2fa/initiate");
      setTwoFASetup({ secret: res.data.secret, qrDataUrl: res.data.qrDataUrl });
    } catch (e) {
      toast({ message: "Failed to initiate 2FA setup", type: "error" });
    } finally {
      setTwoFALoading(false);
    }
  };

  const handleVerify2FA = async () => {
    if (twoFACode.length !== 6) { toast({ message: "Enter the 6-digit code", type: "error" }); return; }
    setTwoFALoading(true);
    try {
      await api.post("/auth/2fa/verify", { token: twoFACode });
      setTwoFAStatus({ enabled: true, loaded: true });
      setTwoFASetup(null);
      setTwoFACode("");
      toast({ message: "2FA enabled! Your account is now more secure 🛡️", type: "success" });
    } catch (e) {
      toast({ message: e.response?.data?.message || "Invalid code", type: "error" });
    } finally {
      setTwoFALoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (disableCode.length !== 6) { toast({ message: "Enter your 6-digit code to confirm", type: "error" }); return; }
    setTwoFALoading(true);
    try {
      await api.post("/auth/2fa/disable", { token: disableCode });
      setTwoFAStatus({ enabled: false, loaded: true });
      setShowDisable(false);
      setDisableCode("");
      toast({ message: "2FA security disabled", type: "success" });
    } catch (e) {
      toast({ message: e.response?.data?.message || "Invalid code", type: "error" });
    } finally {
      setTwoFALoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ message: "Secret key copied to clipboard", type: "success" });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      
      {/* 1. PREFERENCES MATRIX CONFIGURATION */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#1e2732] rounded-2xl border border-gray-100 dark:border-[#38444d] shadow-sm p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Bell size={18} className="text-blue-500" />
          <h2 className="font-bold text-gray-800 dark:text-white">System Preferences</h2>
        </div>
        <div className="flex items-center justify-between bg-gray-50 dark:bg-[#15202b] rounded-xl px-4 py-3.5">
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-white">Push Notifications</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Receive system broadcasts and direct activity signals</p>
          </div>
          <button
            type="button"
            disabled={updatingSettings}
            onClick={toggleNotificationPreferences}
            className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none ${
              notifications ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
            } ${updatingSettings ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="bg-white w-5 h-5 rounded-full shadow-md"
              style={{ x: notifications ? 20 : 0 }}
            />
          </button>
        </div>
      </motion.div>

      {/* 2. TWO-FACTOR AUTHENTICATION ENGINE */}
      {twoFAStatus.loaded && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white dark:bg-[#1e2732] rounded-2xl border border-gray-100 dark:border-[#38444d] shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-blue-500" />
              <h2 className="font-bold text-gray-800 dark:text-white">Two-Factor Authentication</h2>
            </div>
            {twoFAStatus.enabled && (
              <span className="text-[11px] bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 px-2.5 py-1 rounded-full font-bold border border-green-200/40 dark:border-transparent">
                ✓ Active Sec
              </span>
            )}
          </div>

          {twoFAStatus.enabled ? (
            /* ACTIVE ACCOUNT LAYER PROTECTION */
            <div>
              <div className="flex items-start gap-3 bg-green-50/50 dark:bg-green-950/10 border border-green-100/50 dark:border-transparent rounded-2xl p-4 mb-4">
                <Shield size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-green-800 dark:text-green-300 text-sm">Your account is highly protected</p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-0.5 leading-relaxed">
                    TOTP cross-verification adds an intensive protection layer. Unauthorized log-in vectors are currently restricted.
                  </p>
                </div>
              </div>

              {!showDisable ? (
                <button
                  onClick={() => setShowDisable(true)}
                  className="w-full text-red-500 border border-gray-200 dark:border-[#38444d] py-2.5 rounded-xl font-bold text-sm hover:bg-red-50 dark:hover:bg-red-950/20 transition duration-200"
                >
                  Disable 2FA Security
                </button>
              ) : (
                <div className="space-y-3.5 bg-gray-50 dark:bg-[#15202b] rounded-2xl p-4 border border-gray-100/50 dark:border-transparent">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Enter your authenticator token to revoke security rules:</p>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={disableCode}
                    onChange={e => setDisableCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000"
                    className="w-full border border-gray-200 dark:border-[#38444d] bg-white dark:bg-[#1e2732] text-gray-800 dark:text-white rounded-xl px-4 py-2.5 text-center font-mono text-xl tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-red-500/40"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => { setShowDisable(false); setDisableCode(""); }}
                      className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-[#38444d] text-gray-600 dark:text-gray-400 text-xs font-bold hover:bg-gray-100 dark:hover:bg-[#1e2732] transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDisable2FA}
                      disabled={twoFALoading || disableCode.length !== 6}
                      className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition disabled:opacity-40"
                    >
                      {twoFALoading ? "Verifying..." : "Confirm Disable"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : !twoFASetup ? (
            /* INITIAL INITIATION RUNTIME */
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                Secure your profile from targeted breaches. Enabling cryptographic challenges requires a synchronized TOTP device utility like Google Authenticator, Authy, or 1Password.
              </p>
              <button
                onClick={handleInitiate2FA}
                disabled={twoFALoading}
                className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition disabled:opacity-40 flex items-center justify-center gap-2 shadow-sm"
              >
                <Smartphone size={16} />
                {twoFALoading ? "Configuring Matrix..." : "Set Up 2FA Verification"}
              </button>
            </div>
          ) : (
            /* PAIRING PROTOCOL INTERFACE (QR RENDERING) */
            <div className="space-y-4 pt-2">
              <div className="bg-gray-50 dark:bg-[#15202b] rounded-2xl p-4 border border-gray-100/50 dark:border-transparent text-center">
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center justify-center gap-1.5">
                  <QrCode size={14} className="text-blue-500" /> Step 1: Scan deployment code
                </p>
                <div className="inline-block bg-white p-3 rounded-xl border border-gray-100 shadow-sm mb-2">
                  <img src={twoFASetup.qrDataUrl} alt="Secure 2FA Token QR" className="w-40 h-40 object-contain mx-auto" />
                </div>
                
                <div className="mt-2 text-left bg-white dark:bg-[#1e2732] border border-gray-200 dark:border-[#38444d] rounded-xl p-2.5 flex items-center justify-between">
                  <div className="overflow-hidden mr-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Manual Configuration Key</p>
                    <p className="font-mono text-xs text-gray-700 dark:text-gray-300 truncate select-all">{twoFASetup.secret}</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => copyToClipboard(twoFASetup.secret)}
                    className="p-2 text-gray-400 hover:text-blue-500 transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-[#15202b]"
                  >
                    {copied ? <CheckCircle2 size={15} className="text-green-500" /> : <Copy size={15} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                  <Smartphone size={14} className="text-blue-500" /> Step 2: Input generated security token
                </p>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={twoFACode}
                  onChange={e => setTwoFACode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  className="w-full border border-gray-200 dark:border-[#38444d] bg-gray-50 dark:bg-[#15202b] text-gray-800 dark:text-white rounded-xl px-4 py-2.5 text-center font-mono text-xl tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  autoFocus
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => { setTwoFASetup(null); setTwoFACode(""); }}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-[#38444d] text-gray-600 dark:text-gray-400 text-xs font-bold hover:bg-gray-50 dark:hover:bg-[#15202b] transition"
                >
                  Cancel Setup
                </button>
                <button
                  onClick={handleVerify2FA}
                  disabled={twoFALoading || twoFACode.length !== 6}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition disabled:opacity-40 shadow-sm"
                >
                  {twoFALoading ? "Verifying..." : "Authorize 2FA"}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* 3. CHANGE PASSWORD ENGINE */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-[#1e2732] rounded-2xl border border-gray-100 dark:border-[#38444d] shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Key size={18} className="text-blue-500" />
            <h2 className="font-bold text-gray-800 dark:text-white">Change Password</h2>
          </div>
          <button
            type="button"
            onClick={() => setShowPw(s => !s)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex items-center gap-1 text-xs font-semibold transition"
          >
            {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
            <span>{showPw ? "Hide" : "Show"} Passwords</span>
          </button>
        </div>

        <div className="space-y-3.5">
          {[
            { key: "current", label: "Current Password", placeholder: "Your current password" },
            { key: "newPw", label: "New Password", placeholder: "At least 6 characters" },
            { key: "confirm", label: "Confirm New Password", placeholder: "Repeat new password" },
          ].map(field => (
            <div key={field.key}>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 block">{field.label}</label>
              <input
                type={showPw ? "text" : "password"}
                value={changePwForm[field.key]}
                onChange={e => setChangePwForm({ ...changePwForm, [field.key]: e.target.value })}
                placeholder={field.placeholder}
                className="w-full border border-gray-200 dark:border-[#38444d] bg-gray-50 dark:bg-[#15202b] text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all duration-200"
              />
            </div>
          ))}

          <button
            onClick={handleChangePassword}
            disabled={changingPw || !changePwForm.current || !changePwForm.newPw || !changePwForm.confirm}
            className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-bold hover:bg-blue-700 transition text-sm disabled:opacity-40 mt-2 shadow-sm"
          >
            {changingPw ? "Changing..." : "Change Password"}
          </button>
        </div>
      </motion.div>

      {/* 4. PRIVACY LABS: BLOCK & MUTE INTERACTIVE MANAGER */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white dark:bg-[#1e2732] rounded-2xl border border-gray-100 dark:border-[#38444d] shadow-sm p-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <Shield size={18} className="text-blue-500" />
          <h2 className="font-bold text-gray-800 dark:text-white">Privacy Registries</h2>
        </div>

        {/* BLOCKED INDEX */}
        <div className="mb-6">
          <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2.5 flex items-center gap-1.5">
            <UserX size={15} className="text-red-500" /> Blocked Accounts ({blocked.length})
          </p>
          {blocked.length === 0 ? (
            <p className="text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-[#15202b] rounded-xl px-4 py-3 border border-dashed border-gray-200 dark:border-[#38444d]">
              No accounts are blocked on this index.
            </p>
          ) : (
            <div className="space-y-2">
              <AnimatePresence initial={false}>
                {blocked.map(u => (
                  <motion.div 
                    key={u._id}
                    initial={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0, paddingHeight: 0, margin: 0, overflow: "hidden" }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-between bg-gray-50 dark:bg-[#15202b] rounded-xl px-3 py-2 border border-gray-100/50 dark:border-transparent"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={u.avatar || `https://ui-avatars.com/api/?name=${u.username}&background=2563eb&color=fff`}
                        className="w-8 h-8 rounded-full object-cover"
                        alt={u.username}
                      />
                      <div>
                        <p className="text-xs font-bold text-gray-800 dark:text-white">{u.name || u.username}</p>
                        <p className="text-[11px] text-gray-400">@{u.username}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleUnblock(u._id)}
                      className="text-xs bg-red-50 dark:bg-red-950/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 px-3 py-1.5 rounded-lg font-bold transition"
                    >
                      Unblock
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* MUTED INDEX */}
        <div>
          <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2.5 flex items-center gap-1.5">
            <VolumeX size={15} className="text-blue-500" /> Muted Accounts ({muted.length})
          </p>
          {muted.length === 0 ? (
            <p className="text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-[#15202b] rounded-xl px-4 py-3 border border-dashed border-gray-200 dark:border-[#38444d]">
              No accounts are currently muted.
            </p>
          ) : (
            <div className="space-y-2">
              <AnimatePresence initial={false}>
                {muted.map(u => (
                  <motion.div 
                    key={u._id}
                    initial={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0, paddingHeight: 0, margin: 0, overflow: "hidden" }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-between bg-gray-50 dark:bg-[#15202b] rounded-xl px-3 py-2 border border-gray-100/50 dark:border-transparent"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={u.avatar || `https://ui-avatars.com/api/?name=${u.username}&background=2563eb&color=fff`}
                        className="w-8 h-8 rounded-full object-cover"
                        alt={u.username}
                      />
                      <div>
                        <p className="text-xs font-bold text-gray-800 dark:text-white">{u.name || u.username}</p>
                        <p className="text-[11px] text-gray-400">@{u.username}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleUnmute(u._id)}
                      className="text-xs bg-blue-50 dark:bg-blue-950/20 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/40 px-3 py-1.5 rounded-lg font-bold transition"
                    >
                      Unmute
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>

    </div>
  );
}
