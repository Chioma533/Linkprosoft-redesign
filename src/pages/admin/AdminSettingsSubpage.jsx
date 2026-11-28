import React, { useEffect, useState } from "react";
import { 
  Percent, 
  DollarSign, 
  Clock, 
  UserPlus, 
  Save, 
  Info,
  Trash2,
  Star,
  Landmark,
  Sliders
} from "lucide-react";
import { toast } from "react-hot-toast";
import { DEFAULT_VERIFICATION_CONFIG } from "../../utils/verificationConfig";
import { adminService } from "../../api/services/adminService";

const AdminSettingsSubpage = () => {
  const [commissionRate, setCommissionRate] = useState(10); // 10%
  const [payoutMin, setPayoutMin] = useState(50); // $50
  const [sessionExpiry, setSessionExpiry] = useState(24); // 24 hours

  // Configurable verification & rating thresholds
  const [minRating, setMinRating] = useState(DEFAULT_VERIFICATION_CONFIG.ratingPathway.minAverageRating);
  const [minJobs, setMinJobs] = useState(DEFAULT_VERIFICATION_CONFIG.ratingPathway.minCompletedJobs);
  const [minReviews, setMinReviews] = useState(DEFAULT_VERIFICATION_CONFIG.ratingPathway.minGenuineReviews);
  const [fraudProtection, setFraudProtection] = useState(DEFAULT_VERIFICATION_CONFIG.ratingPathway.fraudProtectionEnabled);
  const [gracePeriodDays, setGracePeriodDays] = useState(DEFAULT_VERIFICATION_CONFIG.subscriptionMaintenance.gracePeriodDays);
  const [enforceProSubscription, setEnforceProSubscription] = useState(true);
  const [enforceCompanySubscription, setEnforceCompanySubscription] = useState(true);

  const [adminList, setAdminList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [newAdminRole, setNewAdminRole] = useState("Support Staff");
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    let active = true;
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const [settingsResponse, adminsResponse] = await Promise.all([
          adminService.getCommissionSettings(),
          adminService.getAdmins(),
        ]);
        if (!active) return;

        const settings = settingsResponse?.data || settingsResponse || {};
        setCommissionRate(Number(settings.standard_commission_percentage ?? settings.standardCommissionPercentage ?? 10));
        setPayoutMin(Number(settings.minimum_wallet_payout ?? settings.minimumWalletPayout ?? 50));
        setSessionExpiry(Number(settings.admin_session_expiry_hours ?? settings.adminSessionExpiryHours ?? 24));
        setMinRating(Number(settings.rating_min_average ?? settings.ratingMinAverage ?? 4.5));
        setMinJobs(Number(settings.rating_min_completed_jobs ?? settings.ratingMinCompletedJobs ?? 10));
        setMinReviews(Number(settings.rating_min_genuine_reviews ?? settings.ratingMinGenuineReviews ?? 5));
        setFraudProtection(Boolean(settings.fraud_protection_enabled ?? settings.fraudProtectionEnabled ?? true));
        setEnforceProSubscription(Boolean(settings.subscription_professional_enabled ?? settings.subscriptionProfessionalEnabled ?? true));
        setEnforceCompanySubscription(Boolean(settings.subscription_company_enabled ?? settings.subscriptionCompanyEnabled ?? true));
        setGracePeriodDays(Number(settings.subscription_grace_period_days ?? settings.subscriptionGracePeriodDays ?? 7));

        const admins = adminsResponse?.data || adminsResponse || [];
        setAdminList(Array.isArray(admins) ? admins.map((admin) => ({
          id: String(admin.id),
          name: admin.full_name || admin.name || "Administrator",
          email: admin.email,
          role: admin.role || "Support Staff",
          lastActive: admin.updated_at ? new Date(admin.updated_at).toLocaleString() : "Never",
          active: admin.account_status !== "suspended" && admin.is_active !== false,
        })) : []);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load admin settings.");
      } finally {
        if (active) setIsLoading(false);
      }
    };
    loadSettings();
    return () => { active = false; };
  }, []);

  const handleSaveConfigs = async () => {
    setIsSaving(true);
    try {
      await adminService.updateCommissionSettings({
        standardCommissionPercentage: commissionRate,
        tieredCommissionEnabled: false,
        automaticPayoutsEnabled: false,
        minimumWalletPayout: payoutMin,
        adminSessionExpiryHours: sessionExpiry,
        ratingMinAverage: minRating,
        ratingMinCompletedJobs: minJobs,
        ratingMinGenuineReviews: minReviews,
        fraudProtectionEnabled: fraudProtection,
        subscriptionProfessionalEnabled: enforceProSubscription,
        subscriptionCompanyEnabled: enforceCompanySubscription,
        subscriptionGracePeriodDays: gracePeriodDays,
        tiers: [],
      });
      toast.success("Platform settings and verification thresholds saved successfully!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save platform settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddAdmin = async (event) => {
    event.preventDefault();
    if (!newAdminName.trim() || !newAdminEmail.trim() || !newAdminPassword) {
      toast.error("Please fill in name, email, and password fields.");
      return;
    }
    try {
      const response = await adminService.createAdmin({
        name: newAdminName,
        email: newAdminEmail,
        password: newAdminPassword,
        role: newAdminRole,
      });
      const admin = response?.data || response;
      setAdminList((current) => [...current, {
        id: String(admin.id),
        name: admin.full_name || newAdminName,
        email: admin.email || newAdminEmail,
        role: admin.role || newAdminRole,
        lastActive: "Never",
        active: true,
      }]);
      setNewAdminName("");
      setNewAdminEmail("");
      setNewAdminPassword("");
      setShowAddModal(false);
      toast.success(`${newAdminName} added as an Administrator.`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add administrator.");
    }
  };

  const handleDeleteAdmin = async (id, name) => {
    try {
      await adminService.revokeAdmin(id);
      setAdminList((current) => current.filter((admin) => admin.id !== id));
      toast.success(`${name} account access revoked.`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to revoke administrator access.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Subpage Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Configuration</h1>
        <p className="text-sm text-gray-500 mt-1">Manage global fee rates, verification badge criteria, rating thresholds, and administrator access.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Columns - Settings Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Verification Badge & Rating Thresholds */}
          <div className="bg-white border border-gray-150 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-sky-50 text-[#016EA6] rounded-xl">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Verification & Badge Maintenance Thresholds</h3>
                  <p className="text-[11px] text-gray-500">Configure eligibility metrics and subscription maintenance policies</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-[#016EA6] border border-sky-150">
                Configurable
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="block text-xs font-bold text-gray-600">
                Min. Average Rating
                <div className="relative mt-1.5">
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className="w-full pl-3 pr-8 py-2 border border-gray-200 focus:border-[#016EA6] rounded-xl text-xs outline-none bg-white font-bold text-gray-800"
                  />
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-current absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
                <span className="text-[10px] text-gray-400 block mt-1">Required for Pathway 2</span>
              </label>

              <label className="block text-xs font-bold text-gray-600">
                Min. Completed Jobs
                <div className="relative mt-1.5">
                  <input
                    type="number"
                    min="1"
                    value={minJobs}
                    onChange={(e) => setMinJobs(Number(e.target.value))}
                    className="w-full pl-3 pr-3 py-2 border border-gray-200 focus:border-[#016EA6] rounded-xl text-xs outline-none bg-white font-bold text-gray-800"
                  />
                </div>
                <span className="text-[10px] text-gray-400 block mt-1">Successful contracts</span>
              </label>

              <label className="block text-xs font-bold text-gray-600">
                Min. Genuine Reviews
                <div className="relative mt-1.5">
                  <input
                    type="number"
                    min="1"
                    value={minReviews}
                    onChange={(e) => setMinReviews(Number(e.target.value))}
                    className="w-full pl-3 pr-3 py-2 border border-gray-200 focus:border-[#016EA6] rounded-xl text-xs outline-none bg-white font-bold text-gray-800"
                  />
                </div>
                <span className="text-[10px] text-gray-400 block mt-1">Independent clients</span>
              </label>
            </div>

            {/* Subscription & Integrity Rules */}
            <div className="pt-2 border-t border-gray-100 space-y-2.5">
              <label className="flex items-center justify-between text-xs font-semibold text-gray-700 cursor-pointer">
                <span>Fraud & Self-Rating Detection Filter</span>
                <input
                  type="checkbox"
                  checked={fraudProtection}
                  onChange={(e) => setFraudProtection(e.target.checked)}
                  className="rounded border-gray-300 text-[#016EA6] focus:ring-[#016EA6]"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-semibold text-gray-700 cursor-pointer">
                <span>Enforce Subscription Maintenance for Professional Blue Badge</span>
                <input
                  type="checkbox"
                  checked={enforceProSubscription}
                  onChange={(e) => setEnforceProSubscription(e.target.checked)}
                  className="rounded border-gray-300 text-[#016EA6] focus:ring-[#016EA6]"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-semibold text-gray-700 cursor-pointer">
                <span>Enforce Subscription Maintenance for Company Gold Badge</span>
                <input
                  type="checkbox"
                  checked={enforceCompanySubscription}
                  onChange={(e) => setEnforceCompanySubscription(e.target.checked)}
                  className="rounded border-gray-300 text-[#016EA6] focus:ring-[#016EA6]"
                />
              </label>

              <div className="flex items-center justify-between text-xs font-semibold text-gray-700 bg-gray-50/70 p-2.5 rounded-xl border border-gray-150">
                <span className="flex items-center gap-1.5 text-gray-700">
                  <Landmark className="w-3.5 h-3.5 text-[#73777D]" />
                  Government Agency Verification Policy
                </span>
                <span className="text-[10px] font-bold text-[#73777D] bg-white px-2 py-0.5 rounded border border-gray-200">
                  Institutionally Validated (Exempt from Subscriptions)
                </span>
              </div>
            </div>
          </div>

          {/* Fee settings */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-4 mb-4">Fee Structure</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block text-xs font-bold text-gray-500">
                Platform Commission Fee (%)
                <div className="relative mt-2">
                  <input
                    type="number"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className="w-full pl-3 pr-10 py-2.5 border border-gray-200 focus:border-[#016EA6] rounded-xl text-xs outline-none bg-white font-bold text-gray-800"
                  />
                  <Percent className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
                <span className="text-[10px] text-gray-400 block mt-1.5 font-medium">Charged on every completed contract release.</span>
              </label>

              <label className="block text-xs font-bold text-gray-500">
                Minimum Wallet Payout ($)
                <div className="relative mt-2">
                  <input
                    type="number"
                    value={payoutMin}
                    onChange={(e) => setPayoutMin(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2.5 border border-gray-200 focus:border-[#016EA6] rounded-xl text-xs outline-none bg-white font-bold text-gray-800"
                  />
                  <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <span className="text-[10px] text-gray-400 block mt-1.5 font-medium">Minimum threshold required to request withdrawal.</span>
              </label>
            </div>
          </div>

          {/* Security & Access */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-4 mb-4">Security Parameters</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block text-xs font-bold text-gray-500">
                Admin Session Auto-Expiry (Hours)
                <div className="relative mt-2">
                  <input
                    type="number"
                    value={sessionExpiry}
                    onChange={(e) => setSessionExpiry(Number(e.target.value))}
                    className="w-full pl-3 pr-10 py-2.5 border border-gray-200 focus:border-[#016EA6] rounded-xl text-xs outline-none bg-white font-bold text-gray-800"
                  />
                  <Clock className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
                <span className="text-[10px] text-gray-400 block mt-1.5 font-medium">Force logout inactive administrators after time limit.</span>
              </label>

              <div className="flex flex-col justify-end">
                <button 
                  onClick={handleSaveConfigs}
                  disabled={isLoading || isSaving}
                  className="w-full py-2.5 bg-[#016EA6] hover:bg-[#061EA6] text-white rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save className="w-4 h-4" /> {isSaving ? "Saving..." : "Save Global Configuration"}
                </button>
              </div>
            </div>

            <div className="flex gap-2.5 p-3 bg-blue-50/50 rounded-xl text-[10px] text-[#016EA6] font-semibold leading-relaxed mt-5">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Saving updates will audit-log your admin reference ID and immediately apply these parameters across verification evaluators and live platform modules.</span>
            </div>
          </div>
        </div>

        {/* Right Column - Team Administrators List */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-50 pb-4 mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Administrator Roles</h3>
                <p className="text-xs text-gray-400">Roster of accounts with system credentials</p>
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="p-2 bg-sky-50 text-[#016EA6] hover:bg-sky-100/60 rounded-xl transition-all cursor-pointer border border-sky-100"
                title="Add Admin"
              >
                <UserPlus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {isLoading && (
                <p className="py-6 text-center text-xs text-gray-400">Loading administrators...</p>
              )}
              {!isLoading && adminList.length === 0 && (
                <p className="py-6 text-center text-xs text-gray-400">No administrator accounts found.</p>
              )}
              {adminList.filter((admin) => admin.active !== false).map((admin) => (
                <div key={admin.id} className="flex items-start justify-between p-3.5 border border-gray-50 rounded-xl hover:bg-gray-50/30 transition-colors">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-[#016EA6] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {admin.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-800">{admin.name}</h4>
                      <p className="text-[9px] text-gray-400 font-medium mt-0.5">{admin.email}</p>
                      <span className="inline-block mt-1 bg-gray-50 text-[9px] px-1.5 py-0.5 rounded border border-gray-100 font-bold text-gray-500">{admin.role}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 text-right">
                    <span className="text-[8px] text-gray-400 font-semibold uppercase">{admin.lastActive}</span>
                    {admin.role !== "Super Admin" && (
                      <button 
                        onClick={() => handleDeleteAdmin(admin.id, admin.name)}
                        className="text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Revoke access"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-gray-100">
            <h3 className="text-base font-bold text-gray-900">Add Administrator</h3>
            <form onSubmit={handleAddAdmin} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#016EA6]"
                  placeholder="e.g. Samuel Alex"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#016EA6]"
                  placeholder="alex@linkprosoft.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Initial Password</label>
                <input
                  type="password"
                  required
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#016EA6]"
                  placeholder="8+ chars, uppercase, number, symbol"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Permission Role</label>
                <select
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#016EA6] bg-white font-medium"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Verification Officer">Verification Officer</option>
                  <option value="Payments Manager">Payments Manager</option>
                  <option value="Dispute Moderator">Dispute Moderator</option>
                  <option value="Support Staff">Support Staff</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 text-xs font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-[#016EA6] hover:bg-[#061EA6] rounded-xl transition-colors"
                >
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettingsSubpage;
