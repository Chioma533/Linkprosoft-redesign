import React, { useState } from "react";
import { 
  Percent, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  UserPlus, 
  Save, 
  Info,
  Trash2,
  Lock,
  User
} from "lucide-react";
import { toast } from "react-hot-toast";

const AdminSettingsSubpage = () => {
  const [commissionRate, setCommissionRate] = useState(10); // 10%
  const [payoutMin, setPayoutMin] = useState(50); // $50
  const [sessionExpiry, setSessionExpiry] = useState(24); // 24 hours
  const [adminList, setAdminList] = useState([
    { id: "ADM-001", name: "System Master", email: "master@linkprosoft.com", role: "Super Admin", lastActive: "Just now" },
    { id: "ADM-002", name: "Auditor Smith", email: "smith.a@linkprosoft.com", role: "Payments Manager", lastActive: "2 hours ago" },
    { id: "ADM-003", name: "Support Agent Jane", email: "jane.s@linkprosoft.com", role: "Support Staff", lastActive: "Yesterday" }
  ]);

  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState("Support Staff");
  const [showAddModal, setShowAddModal] = useState(false);

  const handleSaveConfigs = () => {
    toast.success("Platform settings saved and deployed successfully!");
  };

  const handleAddAdmin = (e) => {
    e.preventDefault();
    if (!newAdminName.trim() || !newAdminEmail.trim()) {
      toast.error("Please fill in name and email fields.");
      return;
    }
    const newAdmin = {
      id: `ADM-00${adminList.length + 1}`,
      name: newAdminName,
      email: newAdminEmail,
      role: newAdminRole,
      lastActive: "Never"
    };
    setAdminList([...adminList, newAdmin]);
    setNewAdminName("");
    setNewAdminEmail("");
    setShowAddModal(false);
    toast.success(`${newAdminName} added as an Administrator.`);
  };

  const handleDeleteAdmin = (id, name) => {
    if (id === "ADM-001") {
      toast.error("Cannot delete the Super Admin master account.");
      return;
    }
    setAdminList(adminList.filter(a => a.id !== id));
    toast.success(`${name} account access revoked.`);
  };

  return (
    <div className="space-y-6">
      {/* Subpage Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Configuration</h1>
        <p className="text-sm text-gray-500 mt-1">Manage global commission fee rates, minimum transaction limits, and administrator roles access.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Columns - Settings Forms */}
        <div className="lg:col-span-2 space-y-6">
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
                  className="w-full py-2.5 bg-[#016EA6] hover:bg-[#061EA6] text-white rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Save className="w-4 h-4" /> Save Global Configuration
                </button>
              </div>
            </div>

            <div className="flex gap-2.5 p-3 bg-blue-50/50 rounded-xl text-[10px] text-[#016EA6] font-semibold leading-relaxed mt-5">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Saving updates will audit-log your admin reference ID and immediately apply these parameters across live client payment routers.</span>
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
              {adminList.map((admin) => (
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
                    {admin.id !== "ADM-001" && (
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

      {/* Add Admin Dialog Popup overlay */}
      {showAddModal && (
        <>
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs z-50 transition-opacity" onClick={() => setShowAddModal(false)} />
          <div className="fixed bottom-0 inset-x-0 bg-white rounded-t-3xl border-t border-gray-100 z-50 p-6 space-y-4
            md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:bottom-auto md:w-full md:max-w-md md:rounded-2xl md:border border-gray-100
            transition-all duration-300"
          >
            <div className="flex items-center justify-between border-b border-gray-50 pb-3">
              <h3 className="text-sm font-bold text-gray-900">Add System Administrator</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-gray-400 hover:text-gray-650 hover:bg-gray-50 rounded-full cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleAddAdmin} className="space-y-4 text-xs font-semibold text-gray-700">
              <label className="block">
                Full Name
                <input
                  type="text"
                  required
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  placeholder="Enter administrator name"
                  className="w-full mt-1.5 p-2.5 border border-gray-200 focus:border-[#016EA6] rounded-xl text-xs bg-white outline-none text-gray-800"
                />
              </label>

              <label className="block">
                Email Address
                <input
                  type="email"
                  required
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="example@linkprosoft.com"
                  className="w-full mt-1.5 p-2.5 border border-gray-200 focus:border-[#016EA6] rounded-xl text-xs bg-white outline-none text-gray-800"
                />
              </label>

              <label className="block">
                Administrator Role
                <select
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value)}
                  className="w-full mt-1.5 p-2.5 border border-gray-200 focus:border-[#016EA6] rounded-xl text-xs bg-white outline-none text-gray-600 font-bold"
                >
                  <option value="Support Staff">Support Staff (Ticket agent)</option>
                  <option value="Payments Manager">Payments Manager (Escrow approvals)</option>
                  <option value="Super Admin">Super Admin (All permissions)</option>
                </select>
              </label>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-[#016EA6] hover:bg-[#061EA6] text-white rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" /> Grant Credentials Access
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminSettingsSubpage;
