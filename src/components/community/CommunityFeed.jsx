import React, { useCallback, useEffect, useState } from "react";
import { FiEdit3, FiHash, FiImage, FiRefreshCw, FiUser, FiVideo, FiX } from "react-icons/fi";
import { toast } from "react-hot-toast";
import communityService from "../../api/services/communityService";
import CreatePostModal from "./CreatePostModal";
import CommunityPostCard from "./CommunityPostCard";

const FEED_TABS = [
  { id: "latest", label: "Latest" },
  { id: "following", label: "Following" },
  { id: "trending", label: "Trending" },
  { id: "saved", label: "Saved" },
];

const CommunityFeed = ({
  currentUserId,
  userAvatar,
  userName,
  feedMode = "latest",
  onChangeFeedMode,
}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [activeHashtag, setActiveHashtag] = useState(null);
  const [trendingHashtags, setTrendingHashtags] = useState([]);
  const [followingIds, setFollowingIds] = useState(new Set());

  // Create / Edit Modal state
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerMode, setComposerMode] = useState("standard");
  const [composerMediaType, setComposerMediaType] = useState(null);
  const [editingPost, setEditingPost] = useState(null);

  // Report Modal state
  const [reportingPost, setReportingPost] = useState(null);
  const [reportReason, setReportReason] = useState("spam");
  const [reportDetails, setReportDetails] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);

  const loadFeed = useCallback(
    async (pageNum = 1, append = false) => {
      if (append) setLoadingMore(true);
      else setLoading(true);
      setError(null);

      try {
        let result;
        if (activeHashtag) {
          result = await communityService.getPostsByHashtag(activeHashtag, { page: pageNum, limit: 15 });
        } else if (feedMode === "saved") {
          result = await communityService.getSavedPosts({ page: pageNum, limit: 15 });
        } else {
          result = await communityService.getFeed({ feed: feedMode, page: pageNum, limit: 15 });
        }

        const items = result?.items || result?.posts || [];
        setPosts((prev) => (append ? [...prev, ...items] : items));
        setPage(result?.page || pageNum);
        setTotalPages(result?.totalPages || 1);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load community feed");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [feedMode, activeHashtag]
  );

  useEffect(() => {
    loadFeed(1, false);
  }, [loadFeed]);

  useEffect(() => {
    let mounted = true;
    communityService
      .getTrendingHashtags()
      .then((tags) => {
        if (mounted && Array.isArray(tags)) setTrendingHashtags(tags.slice(0, 8));
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const openComposer = (mode = "standard", mediaType = null) => {
    if (!currentUserId) {
      toast.error("Please sign in to create a post");
      return;
    }
    setEditingPost(null);
    setComposerMode(mode);
    setComposerMediaType(mediaType);
    setComposerOpen(true);
  };

  const handlePostSuccess = (post, isEdit) => {
    if (isEdit) {
      setPosts((prev) => prev.map((p) => (p.id === post.id ? post : p)));
    } else {
      setPosts((prev) => [post, ...prev]);
    }
  };

  const handleToggleFollow = async (targetUserId) => {
    if (!currentUserId) {
      toast.error("Please sign in to follow members");
      return;
    }
    const isFollowing = followingIds.has(targetUserId);
    try {
      if (isFollowing) {
        await communityService.unfollowUser(targetUserId);
        setFollowingIds((prev) => {
          const next = new Set(prev);
          next.delete(targetUserId);
          return next;
        });
        toast.success("Unfollowed");
      } else {
        await communityService.followUser(targetUserId);
        setFollowingIds((prev) => new Set(prev).add(targetUserId));
        toast.success("Following");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!reportingPost) return;
    setSubmittingReport(true);
    try {
      await communityService.reportContent({
        postId: reportingPost.id,
        reason: reportReason,
        details: reportDetails.trim() || undefined,
      });
      toast.success("Report submitted. Thank you for keeping the community safe.");
      setReportingPost(null);
      setReportDetails("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit report");
    } finally {
      setSubmittingReport(false);
    }
  };

  return (
    <section className="min-w-0 space-y-4">
      {/* Create Post Card */}
      <div className="rounded-[22px] border border-[#e1e5e9] bg-[#f8f8f8] p-3 sm:p-4">
        <button
          type="button"
          onClick={() => openComposer("standard", null)}
          className="flex w-full items-center gap-3 rounded-full bg-[#f2f2f2] px-3 py-2.5 text-left transition hover:bg-[#eaeaea]"
        >
          {userAvatar ? (
            <img src={userAvatar} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" />
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1f4d75] via-[#7aa6bd] to-[#dfeaf0] text-white">
              <FiUser className="h-4 w-4" />
            </div>
          )}
          <span className="flex-1 text-sm text-[#7a7a7a]">Create Post</span>
        </button>

        <div className="mt-3 flex items-center justify-between gap-1 border-t border-[#e1e5e9] pt-3 text-[10px] text-[#555] sm:gap-2 sm:text-[11px]">
          <button
            type="button"
            onClick={() => openComposer("standard", "video")}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl px-1 py-1.5 font-medium transition hover:bg-[#efefef]"
          >
            <FiVideo className="h-3.5 w-3.5 text-[#2dc36f]" />
            <span>Video</span>
          </button>
          <button
            type="button"
            onClick={() => openComposer("standard", "image")}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl px-1 py-1.5 font-medium transition hover:bg-[#efefef]"
          >
            <FiImage className="h-3.5 w-3.5 text-[#0c76c9]" />
            <span>Photos</span>
          </button>
          <button
            type="button"
            onClick={() => openComposer("article", null)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl px-1 py-1.5 font-medium transition hover:bg-[#efefef]"
          >
            <FiEdit3 className="h-3.5 w-3.5 text-[#e67e22]" />
            <span>Article</span>
          </button>
        </div>
      </div>

      {/* Feed Tabs & Hashtag Filter */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {FEED_TABS.map((tab) => {
              const active = !activeHashtag && feedMode === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveHashtag(null);
                    onChangeFeedMode?.(tab.id);
                  }}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                    active
                      ? "bg-[#141414] text-white"
                      : "border border-[#e1e5e9] bg-[#f8f8f8] text-[#555] hover:bg-[#efefef]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {activeHashtag && (
            <button
              type="button"
              onClick={() => setActiveHashtag(null)}
              className="inline-flex items-center gap-1 rounded-full bg-[#edf6ff] px-3 py-1 text-xs font-medium text-[#0c76c9]"
            >
              <FiHash className="h-3 w-3" /> {activeHashtag}
              <FiX className="ml-1 h-3 w-3" />
            </button>
          )}
        </div>

        {trendingHashtags.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <span className="shrink-0 text-[11px] font-medium text-[#777]">Trending:</span>
            {trendingHashtags.map((ht) => (
              <button
                key={ht.id || ht.tag}
                type="button"
                onClick={() => setActiveHashtag(ht.tag)}
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
                  activeHashtag === ht.tag
                    ? "bg-[#0c76c9] text-white"
                    : "border border-[#e1e5e9] bg-white text-[#555] hover:bg-[#f2f2f2]"
                }`}
              >
                #{ht.tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Feed Content */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse rounded-[22px] border border-[#e1e5e9] bg-[#f8f8f8] p-5">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-[#e5e7eb]" />
                <div className="space-y-2">
                  <div className="h-3.5 w-32 rounded bg-[#e5e7eb]" />
                  <div className="h-2.5 w-20 rounded bg-[#e5e7eb]" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-3 w-full rounded bg-[#e5e7eb]" />
                <div className="h-3 w-4/5 rounded bg-[#e5e7eb]" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <article className="rounded-[22px] border border-[#e1e5e9] bg-[#f8f8f8] p-6 text-center">
          <p className="text-sm font-medium text-red-600">{error}</p>
          <button
            type="button"
            onClick={() => loadFeed(1, false)}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#e1e5e9] bg-white px-4 py-1.5 text-xs font-medium text-[#222] hover:bg-[#f2f2f2]"
          >
            <FiRefreshCw className="h-3.5 w-3.5" /> Retry
          </button>
        </article>
      ) : posts.length === 0 ? (
        <article className="rounded-[22px] border border-[#e1e5e9] bg-[#f8f8f8] p-6 text-center">
          <h2 className="text-sm font-semibold text-[#1d1d1d]">
            {feedMode === "saved"
              ? "No saved posts yet"
              : feedMode === "following"
              ? "No posts from people you follow"
              : activeHashtag
              ? `No posts tagged #${activeHashtag}`
              : "No community posts yet"}
          </h2>
          <p className="mt-1.5 text-xs leading-5 text-[#777]">
            {feedMode === "saved"
              ? "Bookmark posts from the feed to find them quickly here."
              : "Be the first to share your work, insights, or an article with the community."}
          </p>
          <button
            type="button"
            onClick={() => openComposer("standard", null)}
            className="mt-4 rounded-full bg-[#0c76c9] px-5 py-2 text-xs font-semibold text-white hover:bg-[#095fa3]"
          >
            Create Post
          </button>
        </article>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <CommunityPostCard
              key={post.id}
              post={post}
              currentUserId={currentUserId}
              isFollowingAuthor={followingIds.has(post.author_id)}
              onToggleFollow={handleToggleFollow}
              onSelectHashtag={(tag) => setActiveHashtag(tag)}
              onEdit={(p) => {
                setEditingPost(p);
                setComposerOpen(true);
              }}
              onPostUpdated={(updated) =>
                setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
              }
              onPostDeleted={(deletedId) =>
                setPosts((prev) => prev.filter((p) => p.id !== deletedId))
              }
              onPostCreated={(created) => setPosts((prev) => [created, ...prev])}
              onReport={(p) => setReportingPost(p)}
            />
          ))}

          {page < totalPages && (
            <button
              type="button"
              disabled={loadingMore}
              onClick={() => loadFeed(page + 1, true)}
              className="w-full rounded-full border border-[#e1e5e9] bg-[#f8f8f8] py-2.5 text-xs font-medium text-[#333] hover:bg-[#efefef] disabled:opacity-60"
            >
              {loadingMore ? "Loading more..." : "Load more posts"}
            </button>
          )}
        </div>
      )}

      {/* Create / Edit Post Modal */}
      <CreatePostModal
        isOpen={composerOpen}
        initialMode={composerMode}
        initialMediaType={composerMediaType}
        userAvatar={userAvatar}
        userName={userName}
        editingPost={editingPost}
        onClose={() => {
          setComposerOpen(false);
          setEditingPost(null);
        }}
        onSuccess={handlePostSuccess}
      />

      {/* Report Modal */}
      {reportingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-[22px] border border-[#e1e5e9] bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e1e5e9] pb-3">
              <h3 className="text-sm font-semibold text-[#141414]">Report Post</h3>
              <button
                type="button"
                onClick={() => setReportingPost(null)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-[#666] hover:bg-[#f2f2f2]"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSubmitReport} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#444]">Reason</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#e1e5e9] bg-[#fafafa] px-3 py-2 text-xs text-[#141414] outline-none"
                >
                  <option value="spam">Spam or misleading</option>
                  <option value="harassment">Harassment or hate speech</option>
                  <option value="inappropriate">Inappropriate content</option>
                  <option value="scam">Scam or fraud</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#444]">Additional details (optional)</label>
                <textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  rows={3}
                  maxLength={1000}
                  placeholder="Tell us more..."
                  className="mt-1 w-full resize-none rounded-xl border border-[#e1e5e9] bg-[#fafafa] px-3 py-2 text-xs text-[#141414] outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReportingPost(null)}
                  className="rounded-full px-4 py-1.5 text-xs font-medium text-[#666] hover:bg-[#f2f2f2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReport}
                  className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                >
                  {submittingReport ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default CommunityFeed;
