import React, { useEffect, useState } from "react";
import { FiMenu, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/layout/DashboardNavbar";
import ThemeSwitcher from "../components/common/ThemeSwitcher";
import CommunityProfileSidebar from "../components/community/CommunityProfileSidebar";
import CommunityMessagesSidebar from "../components/community/CommunityMessagesSidebar";
import CommunityFeed from "../components/community/CommunityFeed";
import { useAuthStore } from "../store/authStore";
import { useDashboardStore } from "../store/dashboardStore";
import { useMessaging } from "../hooks/useMessaging";
import { profileService } from "../api/services/profileService";
import mediaService from "../api/services/mediaService";
import coverImg from "../assets/images/IMG-20260704-WA0194.jpg";
import avatarImg from "../assets/images/handyman.jfif";

const CommunityPage = () => {
  const navigate = useNavigate();
  const { user, isSessionLoading } = useAuthStore();
  const setActiveTab = useDashboardStore((state) => state.setActiveTab);
  const messaging = useMessaging();
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const loadProfile = async () => {
      if (!user?.id && !user?.userId) return;
      setProfileLoading(true);
      setProfileError(null);

      try {
        let loaded = null;
        if (user.role === "employer") {
          const result = await profileService.getPublicEmployerProfile(user.id || user.userId);
          loaded = result?.employer || result || null;
        } else {
          loaded = await profileService.getMyProfile();
        }

        const hydrated = { ...(loaded || {}) };
        if (hydrated.avatarMediaId) {
          try {
            hydrated.avatarUrl = await mediaService.getUrl(hydrated.avatarMediaId);
          } catch {
            // Reuse the existing fallback below.
          }
        }
        if (hydrated.coverMediaId) {
          try {
            hydrated.coverImageUrl = await mediaService.getUrl(hydrated.coverMediaId);
          } catch {
            // Reuse the existing fallback below.
          }
        }
        if (mounted) setProfile(hydrated);
      } catch (error) {
        if (mounted) setProfileError(error.response?.data?.message || "Unable to load profile");
      } finally {
        if (mounted) setProfileLoading(false);
      }
    };

    loadProfile();
    return () => {
      mounted = false;
    };
  }, [user?.id, user?.userId, user?.role]);

  useEffect(() => {
    const currentUserId = user?.id || user?.userId;
    if (currentUserId) messaging.loadThreads(currentUserId);
  }, [user?.id, user?.userId]);

  const openProfile = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setActiveTab("profile");
    navigate(user.role === "employer" ? "/employer/dashboard" : "/professional/dashboard");
  };

  const openMessages = (threadId = null) => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (threadId) messaging.setActiveThread(threadId);
    setActiveTab(user.role === "employer" ? "messages" : "chat");
    navigate(user.role === "employer" ? "/employer/dashboard" : "/professional/dashboard");
  };

  const profileName =
    profile?.fullName ||
    profile?.name ||
    profile?.user?.fullName ||
    user?.fullName ||
    user?.full_name ||
    "";
  const profileAvatar =
    profile?.avatarUrl ||
    profile?.avatar ||
    user?.avatarUrl ||
    user?.avatar ||
    avatarImg;
  const profileCover =
    profile?.coverImageUrl ||
    profile?.coverUrl ||
    profile?.coverImage ||
    user?.coverImageUrl ||
    coverImg;

  return (
    <div className="community-page min-h-screen bg-[#f3f3f3] text-[#141414]">
      <div className="hidden lg:block">
        <DashboardNavbar title="Community" isOpen={false} onMenuClick={() => {}} />
      </div>

      <header className="border-b border-[#dfe5e8] bg-[#f3f3f3] lg:hidden">
        <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between gap-2 px-3 py-3 sm:px-5">
          <div className="flex items-center gap-1">
            <button className="flex h-8 w-8 items-center justify-center text-[#1d1d1d]" aria-label="Open menu">
              <FiMenu className="h-5 w-5" />
            </button>
            <ThemeSwitcher />
          </div>
          <h1 className="min-w-0 truncate text-base font-medium text-[#1d1d1d]">Community</h1>
          {profileAvatar ? (
            <img src={profileAvatar} alt="" className="h-9 w-9 rounded-full object-cover" />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d8d8d8]">
              <FiUser className="h-4 w-4" />
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1320px] px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-[minmax(220px,0.75fr)_minmax(0,1.5fr)] lg:grid-cols-[290px_minmax(0,1fr)_300px] lg:items-start lg:gap-6">
          <CommunityProfileSidebar
            name={profileName}
            profession={profile?.profession || user?.profession || ""}
            bio={profile?.bio || profile?.headline || user?.bio || ""}
            location={profile?.location || user?.location || ""}
            avatarUrl={profileAvatar}
            coverUrl={profileCover}
            loading={isSessionLoading || profileLoading}
            error={profileError}
            onOpenProfile={openProfile}
          />

          <CommunityFeed />

          <CommunityMessagesSidebar
            threads={messaging.threads}
            loading={messaging.threadsLoading}
            error={messaging.threadsError}
            onlineUsers={messaging.onlineUsers}
            currentUserId={user?.id || user?.userId}
            onOpenThread={openMessages}
            onViewMore={() => openMessages()}
          />
        </div>
      </main>
    </div>
  );
};

export default CommunityPage;
