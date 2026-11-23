import { useState } from "react";
import {
  Bell,
  ChevronRight,
  CreditCard,
  FileText,
  Headset,
  KeyRound,
  Link2,
  LogOut,
  Mail,
  Monitor,
  ShieldCheck,
  Sun,
  SunMoon,
  Moon,
  UserRound,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useDashboardStore } from "../store/dashboardStore";
import { useTheme } from "../context/useTheme";

const SettingRow = ({ icon: Icon, label, onClick, iconClass = "", trailing }) => {
  const contents = (
    <>
      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${iconClass}`}>
        <Icon className="h-4 w-4" />
      </span>
      <span className="flex-1 text-left text-[11px] text-[#424242]">{label}</span>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex min-h-[45px] w-full items-center gap-3 bg-white px-3 text-left transition-colors hover:bg-[#FCFCFC]"
      >
        {contents}
        {trailing || <ChevronRight className="h-3.5 w-3.5 text-[#777]" />}
      </button>
    );
  }

  return (
    <div className="flex min-h-[45px] items-center gap-3 bg-white px-3">
      {contents}
      {trailing}
    </div>
  );
};

const SettingSection = ({ title, children }) => (
  <section>
    <h2 className="mb-2 px-1 text-[12px] font-medium text-[#222]">{title}</h2>
    <div className="overflow-hidden rounded-xl border border-[#E8E8E8] bg-white divide-y divide-[#EAEAEA]">
      {children}
    </div>
  </section>
);

const NotificationSwitch = ({ label, enabled, onToggle, icon: Icon, iconClass }) => (
  <SettingRow
    icon={Icon}
    label={label}
    iconClass={iconClass}
    trailing={
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        onClick={(event) => {
          event.stopPropagation();
          onToggle(!enabled);
        }}
        className={`relative h-[18px] w-[34px] shrink-0 rounded-full transition-colors ${
          enabled ? "bg-[#DCEEF5]" : "bg-[#E4E4E4]"
        }`}
      >
        <span
          className={`absolute top-[3px] h-3 w-3 rounded-full transition-all ${
            enabled ? "left-[16px] bg-[#0879A8]" : "left-[4px] bg-white"
          }`}
        />
      </button>
    }
  />
);

const ThemePreferenceSetting = () => {
  const { preference, setThemePreference } = useTheme();
  const options = [
    { value: "light", label: "Light", Icon: Sun },
    { value: "dark", label: "Dark", Icon: Moon },
    { value: "auto", label: "Default", Icon: Monitor },
  ];

  return (
    <SettingRow
      icon={SunMoon}
      label="Theme"
      iconClass="bg-[#FFF6E8] text-[#D28A21]"
      trailing={
        <div
          role="group"
          aria-label="Theme preference"
          className="flex items-center rounded-full bg-[#F3F4F5] p-0.5"
        >
          {options.map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              aria-pressed={preference === value}
              aria-label={`${label} theme`}
              title={`${label} theme`}
              onClick={() => setThemePreference(value)}
              className={`flex items-center gap-1 rounded-full px-2 py-1.5 text-[9px] transition-colors ${
                preference === value
                  ? "bg-[#0879A8] text-white"
                  : "text-[#777] hover:bg-white"
              }`}
            >
              <Icon className="h-3 w-3" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      }
    />
  );
};

const SettingsSubpage = () => {
  const { user, logout } = useAuthStore();
  const { setActiveTab } = useDashboardStore();
  const navigate = useNavigate();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const role = user?.role || "professional";
  const currentMode = role === "employer" ? "Client" : "Professional";
  const name = user?.fullName || user?.full_name || user?.name || "Your account";
  const avatar = user?.avatarUrl || user?.avatar_url || user?.avatar;

  const showUnavailable = (setting) => {
    toast(`${setting} settings are not available yet.`);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="mx-auto w-full max-w-[900px] space-y-5 pb-8 pt-3">
      <div className="flex min-h-[54px] items-center justify-between gap-3 rounded-xl border border-[#E8E8E8] bg-white px-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E4F1F6] text-[#0879A8]">
            {avatar ? (
              <img src={avatar} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-sm font-semibold">{name.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div>
            <p className="text-[9px] text-[#8A8A8A]">Account mode</p>
            <p className="mt-0.5 text-xs font-medium text-[#292929]">{currentMode}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center rounded-full bg-[#F5F5F5] p-0.5">
          {["Client", "Professional"].map((mode) => (
            <button
              key={mode}
              type="button"
              disabled={mode !== currentMode}
              aria-pressed={mode === currentMode}
              title={mode === currentMode ? `${mode} mode` : `${mode} mode is not available for this account`}
              className={`rounded-full px-3 py-1.5 text-[9px] transition-colors ${
                mode === currentMode
                  ? "bg-[#0879A8] text-white"
                  : "cursor-not-allowed text-[#929292]"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <SettingSection title="Account">
        <SettingRow
          icon={UserRound}
          label="Edit profile"
          iconClass="bg-[#EEF4FF] text-[#2876D2]"
          onClick={() => setActiveTab("profile")}
        />
        <SettingRow
          icon={KeyRound}
          label="Change password"
          iconClass="bg-[#FFF6E8] text-[#D28A21]"
          onClick={() => showUnavailable("Password change")}
        />
        <ThemePreferenceSetting />
      </SettingSection>

      <SettingSection title="Notification">
        <NotificationSwitch
          icon={Bell}
          label="Push notification"
          iconClass="bg-[#FFF4E7] text-[#D8891C]"
          enabled={pushEnabled}
          onToggle={setPushEnabled}
        />
        <NotificationSwitch
          icon={Mail}
          label="Email notification"
          iconClass="bg-[#EAF5FF] text-[#2980C8]"
          enabled={emailEnabled}
          onToggle={setEmailEnabled}
        />
      </SettingSection>

      <SettingSection title="Payment">
        <SettingRow
          icon={CreditCard}
          label="Payment method"
          iconClass="bg-[#EEF2FF] text-[#415AC7]"
          onClick={() => setActiveTab("wallet")}
        />
        <SettingRow
          icon={Link2}
          label="Linked accounts"
          iconClass="bg-[#EEF5F8] text-[#5D7E91]"
          onClick={() => showUnavailable("Linked account")}
        />
      </SettingSection>

      <SettingSection title="About">
        <SettingRow
          icon={ShieldCheck}
          label="Privacy policy"
          iconClass="bg-[#FFF2E8] text-[#C87937]"
          onClick={() => showUnavailable("Privacy policy")}
        />
        <SettingRow
          icon={FileText}
          label="Terms and conditions"
          iconClass="bg-[#EEF4FF] text-[#5184D5]"
          onClick={() => showUnavailable("Terms and conditions")}
        />
      </SettingSection>

      <SettingSection title="Help and support">
        <SettingRow
          icon={Headset}
          label="Contact support"
          iconClass="bg-[#F1EEFF] text-[#7961D3]"
          onClick={() => setActiveTab(role === "employer" ? "messages" : "chat")}
        />
      </SettingSection>

      <div className="overflow-hidden rounded-xl border border-[#E8E8E8] bg-white">
        <SettingRow
          icon={LogOut}
          label="Log out"
          iconClass="bg-[#FFF0EC] text-[#C4523C]"
          onClick={handleLogout}
        />
      </div>
    </div>
  );
};

export default SettingsSubpage;
