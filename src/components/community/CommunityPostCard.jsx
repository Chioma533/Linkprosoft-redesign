import React, { useState } from "react";
import {
  FiBookmark,
  FiEdit2,
  FiFlag,
  FiGlobe,
  FiHeart,
  FiMessageCircle,
  FiMoreHorizontal,
  FiRepeat,
  FiSend,
  FiThumbsUp,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import communityService from "../../api/services/communityService";

const REACTIONS = [
  { key: "like", label: "Like", emoji: "👍" },
  { key: "celebrate", label: "Celebrate", emoji: "🎉" },
  { key: "support", label: "Support", emoji: "🙌" },
  { key: "insightful", label: "Insightful", emoji: "💡" },
  { key: "love", label: "Love", emoji: "❤️" },
];

const initials = (name = "Member") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const renderCaptionWithHashtags = (text, onSelectHashtag) => {
  if (!text) return null;
  const parts = text.split(/(#[a-zA-Z0-9_]+)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("#") && part.length > 1) {
      const tag = part.slice(1).toLowerCase();
      return (
        <button
          key={`${part}-${idx}`}
          type="button"
          onClick={() => onSelectHashtag?.(tag)}
          className="font-medium text-[#0c76c9] hover:underline"
        >
          {part}
        </button>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
};

const CommunityPostCard = ({
  post,
  currentUserId,
  isFollowingAuthor = false,
  onToggleFollow,
  onSelectHashtag,
  onEdit,
  onPostUpdated,
  onPostDeleted,
  onPostCreated,
  onReport,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentBody, setCommentBody] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [articleExpanded, setArticleExpanded] = useState(false);

  const isOwner = Boolean(currentUserId && post.author_id === currentUserId);
  const authorName = post.author?.full_name || "Community Member";
  const authorRole = post.author?.role === "employer" ? "Employer" : "Professional";

  const handleReact = async (reaction = "like") => {
    setShowReactions(false);
    try {
      if (post.user_reaction === reaction) {
        await communityService.removeReaction(post.id);
        onPostUpdated({
          ...post,
          user_reaction: null,
          like_count: Math.max((post.like_count || 0) - 1, 0),
        });
      } else {
        const hadReaction = Boolean(post.user_reaction);
        await communityService.reactToPost(post.id, reaction);
        onPostUpdated({
          ...post,
          user_reaction: reaction,
          like_count: hadReaction ? post.like_count : (post.like_count || 0) + 1,
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update reaction");
    }
  };

  const handleToggleSave = async () => {
    try {
      if (post.is_saved) {
        await communityService.unsavePost(post.id);
        onPostUpdated({ ...post, is_saved: false });
        toast.success("Removed from saved items");
      } else {
        await communityService.savePost(post.id);
        onPostUpdated({ ...post, is_saved: true });
        toast.success("Saved to your items");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update saved state");
    }
  };

  const handleRepost = async () => {
    try {
      const created = await communityService.createPost({
        postType: "repost",
        visibility: "public",
        originalPostId: post.original_post_id || post.id,
      });
      onPostUpdated({ ...post, repost_count: (post.repost_count || 0) + 1 });
      onPostCreated?.(created);
      toast.success("Reposted to your feed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not repost");
    }
  };

  const handleDelete = async () => {
    setMenuOpen(false);
    try {
      await communityService.deletePost(post.id);
      toast.success("Post deleted");
      onPostDeleted(post.id);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete post");
    }
  };

  const toggleComments = async () => {
    const next = !commentsOpen;
    setCommentsOpen(next);
    if (next && comments.length === 0) {
      setCommentsLoading(true);
      try {
        const data = await communityService.getComments(post.id, { page: 1, limit: 20 });
        setComments(data?.items || data?.comments || []);
      } catch {
        toast.error("Failed to load comments");
      } finally {
        setCommentsLoading(false);
      }
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentBody.trim()) return;
    setSubmittingComment(true);
    try {
      const created = await communityService.addComment(post.id, { body: commentBody.trim() });
      setComments((prev) => [...prev, created]);
      setCommentBody("");
      onPostUpdated({ ...post, comment_count: (post.comment_count || 0) + 1 });
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await communityService.deleteComment(commentId);
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, is_deleted: true, body: "[deleted]" } : c))
      );
      onPostUpdated({ ...post, comment_count: Math.max((post.comment_count || 0) - 1, 0) });
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete comment");
    }
  };

  const activeReactionObj = REACTIONS.find((r) => r.key === post.user_reaction);

  return (
    <article className="rounded-[22px] border border-[#e1e5e9] bg-[#f8f8f8] p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {post.author?.avatar_url ? (
            <img src={post.author.avatar_url} alt={authorName} className="h-11 w-11 shrink-0 rounded-full object-cover" />
          ) : (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1f4d75] via-[#7aa6bd] to-[#dfeaf0] text-xs font-bold text-white">
              {initials(authorName)}
            </div>
          )}

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-[#141414]">{authorName}</h3>
              <span className="rounded-full bg-[#e9eff5] px-2 py-0.5 text-[10px] font-medium text-[#1f4d75]">
                {authorRole}
              </span>
              {post.post_type === "repost" && (
                <span className="text-[11px] text-[#777]">reposted</span>
              )}
            </div>
            <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-[#777]">
              <span>{formatDate(post.created_at)}</span>
              <span>•</span>
              {post.visibility === "public" ? (
                <FiGlobe className="h-3 w-3" title="Public" />
              ) : (
                <FiUsers className="h-3 w-3" title="Connections only" />
              )}
            </div>
          </div>
        </div>

        <div className="relative flex items-center gap-1.5">
          {!isOwner && onToggleFollow && (
            <button
              type="button"
              onClick={() => onToggleFollow(post.author_id)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                isFollowingAuthor
                  ? "border border-[#d8d8d8] bg-white text-[#555]"
                  : "bg-[#edf6ff] text-[#0c76c9] hover:bg-[#dceeff]"
              }`}
            >
              {isFollowingAuthor ? "Following" : "+ Follow"}
            </button>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#666] hover:bg-[#ececec]"
            aria-label="Post options"
          >
            <FiMoreHorizontal className="h-4 w-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-9 z-20 w-40 rounded-xl border border-[#e1e5e9] bg-white py-1 shadow-lg">
              {isOwner ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(post);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-[#222] hover:bg-[#f5f5f5]"
                  >
                    <FiEdit2 className="h-3.5 w-3.5" /> Edit post
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50"
                  >
                    <FiTrash2 className="h-3.5 w-3.5" /> Delete post
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onReport(post);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-[#444] hover:bg-[#f5f5f5]"
                >
                  <FiFlag className="h-3.5 w-3.5" /> Report post
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="mt-3 space-y-3">
        {post.post_type === "article" && (
          <div className="rounded-2xl border border-[#e1e5e9] bg-white p-4">
            <span className="inline-block rounded-full bg-[#edf6ff] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#0c76c9]">
              Article
            </span>
            <h4 className="mt-2 text-base font-bold text-[#141414]">{post.article_title}</h4>
            <p className={`mt-2 whitespace-pre-line text-sm leading-6 text-[#333] ${articleExpanded ? "" : "line-clamp-4"}`}>
              {post.article_body}
            </p>
            {(post.article_body || "").length > 260 && (
              <button
                type="button"
                onClick={() => setArticleExpanded((v) => !v)}
                className="mt-1.5 text-xs font-medium text-[#0c76c9] hover:underline"
              >
                {articleExpanded ? "Show less" : "Read full article"}
              </button>
            )}
          </div>
        )}

        {post.caption && (
          <p className="whitespace-pre-line text-sm leading-6 text-[#222]">
            {renderCaptionWithHashtags(post.caption, onSelectHashtag)}
          </p>
        )}

        {/* Hashtag pills */}
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.hashtags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onSelectHashtag?.(tag)}
                className="rounded-full bg-[#edf6ff] px-2.5 py-0.5 text-[11px] font-medium text-[#0c76c9] hover:bg-[#dceeff]"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Media Attachments */}
        {post.media && post.media.length > 0 && (
          <div
            className={`grid gap-2 overflow-hidden rounded-2xl ${
              post.media.length === 1 ? "grid-cols-1" : "grid-cols-2"
            }`}
          >
            {post.media.map((m) => {
              const isVideo = m.content_type?.startsWith("video/");
              if (!m.url) return null;
              return isVideo ? (
                <video
                  key={m.media_id}
                  src={m.url}
                  controls
                  className="max-h-96 w-full rounded-xl bg-black object-contain"
                />
              ) : (
                <img
                  key={m.media_id}
                  src={m.url}
                  alt="Post attachment"
                  className="max-h-96 w-full rounded-xl object-cover"
                  loading="lazy"
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="mt-3 flex items-center justify-between border-b border-[#e1e5e9] pb-2.5 text-[11px] text-[#6b6b6b]">
        <span>{post.like_count || 0} reactions</span>
        <div className="flex items-center gap-3">
          <button type="button" onClick={toggleComments} className="hover:underline">
            {post.comment_count || 0} comments
          </button>
          <span>{post.repost_count || 0} reposts</span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="relative mt-2 flex items-center justify-between gap-1 text-xs font-medium text-[#555]">
        <div
          className="relative flex-1"
          onMouseEnter={() => setShowReactions(true)}
          onMouseLeave={() => setShowReactions(false)}
        >
          <button
            type="button"
            onClick={() => handleReact(post.user_reaction || "like")}
            className={`flex w-full items-center justify-center gap-1.5 rounded-xl py-2 transition hover:bg-[#efefef] ${
              post.user_reaction ? "font-semibold text-[#0c76c9]" : ""
            }`}
          >
            {activeReactionObj ? (
              <span>{activeReactionObj.emoji}</span>
            ) : (
              <FiThumbsUp className="h-4 w-4" />
            )}
            <span>{activeReactionObj ? activeReactionObj.label : "Like"}</span>
          </button>

          {showReactions && (
            <div className="absolute bottom-full left-0 z-20 mb-1 flex items-center gap-1 rounded-full border border-[#e1e5e9] bg-white px-2 py-1 shadow-lg">
              {REACTIONS.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => handleReact(r.key)}
                  title={r.label}
                  className="rounded-full p-1 text-base transition hover:scale-125"
                >
                  {r.emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={toggleComments}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 transition hover:bg-[#efefef]"
        >
          <FiMessageCircle className="h-4 w-4" />
          <span>Comment</span>
        </button>

        <button
          type="button"
          onClick={handleRepost}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 transition hover:bg-[#efefef]"
        >
          <FiRepeat className="h-4 w-4" />
          <span>Repost</span>
        </button>

        <button
          type="button"
          onClick={handleToggleSave}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 transition hover:bg-[#efefef] ${
            post.is_saved ? "font-semibold text-[#0c76c9]" : ""
          }`}
        >
          <FiBookmark className="h-4 w-4" />
          <span>{post.is_saved ? "Saved" : "Save"}</span>
        </button>
      </div>

      {/* Comments Section */}
      {commentsOpen && (
        <div className="mt-3 space-y-3 border-t border-[#e1e5e9] pt-3">
          <form onSubmit={handleAddComment} className="flex items-center gap-2">
            <input
              type="text"
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              placeholder="Write a comment..."
              maxLength={2000}
              className="flex-1 rounded-full border border-[#e1e5e9] bg-white px-3.5 py-2 text-xs text-[#141414] outline-none focus:border-[#0c76c9]"
            />
            <button
              type="submit"
              disabled={submittingComment || !commentBody.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0c76c9] text-white transition hover:bg-[#095fa3] disabled:opacity-50"
              aria-label="Send comment"
            >
              <FiSend className="h-3.5 w-3.5" />
            </button>
          </form>

          {commentsLoading ? (
            <p className="text-center text-xs text-[#777]">Loading comments…</p>
          ) : comments.length === 0 ? (
            <p className="text-center text-xs text-[#777]">No comments yet. Start the conversation!</p>
          ) : (
            <div className="space-y-2.5">
              {comments.map((comment) => {
                const isCommentOwner = Boolean(currentUserId && comment.author_id === currentUserId);
                return (
                  <div key={comment.id} className="rounded-2xl bg-white p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-[#141414]">
                        {comment.author_name || "Member"}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#888]">{formatDate(comment.created_at)}</span>
                        {isCommentOwner && !comment.is_deleted && (
                          <button
                            type="button"
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-[10px] text-red-500 hover:underline"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                    <p className={`mt-1 text-xs leading-5 ${comment.is_deleted ? "italic text-[#999]" : "text-[#333]"}`}>
                      {comment.body}
                    </p>
                    {!comment.is_deleted && (
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await communityService.likeComment(comment.id);
                            setComments((prev) =>
                              prev.map((c) =>
                                c.id === comment.id ? { ...c, like_count: (c.like_count || 0) + 1 } : c
                              )
                            );
                          } catch {
                            toast.error("Could not like comment");
                          }
                        }}
                        className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-[#666] hover:text-[#0c76c9]"
                      >
                        <FiHeart className="h-3 w-3" /> {comment.like_count || 0}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </article>
  );
};

export default CommunityPostCard;
