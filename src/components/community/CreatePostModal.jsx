import React, { useEffect, useRef, useState } from "react";
import { FiEdit3, FiFileText, FiGlobe, FiImage, FiLock, FiUsers, FiVideo, FiX } from "react-icons/fi";
import { toast } from "react-hot-toast";
import mediaService from "../../api/services/mediaService";
import communityService from "../../api/services/communityService";

const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";
const VIDEO_ACCEPT = "video/mp4,video/webm";

const CreatePostModal = ({
  isOpen,
  initialMode = "standard",
  initialMediaType = null,
  userAvatar,
  userName,
  editingPost = null,
  onClose,
  onSuccess,
}) => {
  const [postType, setPostType] = useState(initialMode);
  const [visibility, setVisibility] = useState("public");
  const [caption, setCaption] = useState("");
  const [articleTitle, setArticleTitle] = useState("");
  const [articleBody, setArticleBody] = useState("");
  const [hashtagsInput, setHashtagsInput] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    if (editingPost) {
      setPostType(editingPost.post_type === "article" ? "article" : "standard");
      setVisibility(editingPost.visibility || "public");
      setCaption(editingPost.caption || "");
      setArticleTitle(editingPost.article_title || "");
      setArticleBody(editingPost.article_body || "");
      setHashtagsInput((editingPost.hashtags || []).join(", "));
      setFiles([]);
      setPreviews([]);
    } else {
      setPostType(initialMode === "article" ? "article" : "standard");
      setVisibility("public");
      setCaption("");
      setArticleTitle("");
      setArticleBody("");
      setHashtagsInput("");
      setFiles([]);
      setPreviews([]);
      if (initialMediaType === "image") {
        setTimeout(() => imageInputRef.current?.click(), 80);
      } else if (initialMediaType === "video") {
        setTimeout(() => videoInputRef.current?.click(), 80);
      }
    }
  }, [isOpen, initialMode, initialMediaType, editingPost]);

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;

    const remaining = 10 - files.length;
    const toAdd = selected.slice(0, remaining);
    if (selected.length > remaining) {
      toast.error("Maximum 10 media attachments per post");
    }

    const nextFiles = [...files, ...toAdd];
    const nextPreviews = [
      ...previews,
      ...toAdd.map((file) => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith("video/") ? "video" : "image",
        name: file.name,
      })),
    ];

    setFiles(nextFiles);
    setPreviews(nextPreviews);
    e.target.value = "";
  };

  const removeFile = (index) => {
    URL.revokeObjectURL(previews[index].url);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const parseHashtags = () => {
    return hashtagsInput
      .split(/[\s,]+/)
      .map((t) => t.replace(/^#/, "").trim().toLowerCase())
      .filter((t) => /^[a-z0-9_]+$/.test(t));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (postType === "article") {
      if (!articleTitle.trim() || !articleBody.trim()) {
        toast.error("Article title and body are required");
        return;
      }
    } else if (!caption.trim() && files.length === 0 && !editingPost) {
      toast.error("Write a caption or attach a photo/video");
      return;
    }

    setSubmitting(true);
    try {
      const hashtags = parseHashtags();

      if (editingPost) {
        const updated = await communityService.updatePost(editingPost.id, {
          ...(postType === "article"
            ? { articleTitle: articleTitle.trim(), articleBody: articleBody.trim() }
            : { caption: caption.trim() }),
          visibility,
          hashtags,
        });
        toast.success("Post updated");
        onSuccess(updated, true);
        onClose();
        return;
      }

      let mediaIds = [];
      if (files.length > 0) {
        const uploaded = await Promise.all(
          files.map((file) => mediaService.uploadFile(file, "community_post"))
        );
        mediaIds = uploaded.map((item) => item.mediaId);
      }

      const payload = {
        postType,
        visibility,
        ...(postType === "article"
          ? { articleTitle: articleTitle.trim(), articleBody: articleBody.trim(), caption: caption.trim() || undefined }
          : { caption: caption.trim() || undefined }),
        ...(hashtags.length > 0 ? { hashtags } : {}),
        ...(mediaIds.length > 0 ? { mediaIds } : {}),
      };

      const created = await communityService.createPost(payload);
      toast.success(postType === "article" ? "Article published" : "Post published");
      onSuccess(created, false);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to publish post");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-[22px] border border-[#e1e5e9] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#e1e5e9] px-5 py-4">
          <h2 className="text-base font-semibold text-[#141414]">
            {editingPost ? "Edit Post" : postType === "article" ? "Write an Article" : "Create Post"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#666] hover:bg-[#f2f2f2]"
            aria-label="Close modal"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          {/* Author & Visibility */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {userAvatar ? (
                <img src={userAvatar} alt="" className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1f4d75] text-xs font-semibold text-white">
                  {(userName || "U")[0].toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-[#141414]">{userName || "Member"}</p>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setVisibility((v) => (v === "public" ? "connections_only" : "public"))}
                    className="inline-flex items-center gap-1 rounded-full border border-[#e1e5e9] bg-[#f8f8f8] px-2.5 py-0.5 text-[11px] font-medium text-[#555] hover:bg-[#efefef]"
                  >
                    {visibility === "public" ? (
                      <>
                        <FiGlobe className="h-3 w-3" /> Public
                      </>
                    ) : (
                      <>
                        <FiUsers className="h-3 w-3" /> Connections only
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {!editingPost && (
              <div className="inline-flex rounded-full border border-[#e1e5e9] bg-[#f4f4f4] p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setPostType("standard")}
                  className={`flex items-center gap-1 rounded-full px-3 py-1 font-medium transition ${
                    postType === "standard" ? "bg-white text-[#141414] shadow-xs" : "text-[#666]"
                  }`}
                >
                  <FiEdit3 className="h-3 w-3" /> Post
                </button>
                <button
                  type="button"
                  onClick={() => setPostType("article")}
                  className={`flex items-center gap-1 rounded-full px-3 py-1 font-medium transition ${
                    postType === "article" ? "bg-white text-[#141414] shadow-xs" : "text-[#666]"
                  }`}
                >
                  <FiFileText className="h-3 w-3" /> Article
                </button>
              </div>
            )}
          </div>

          {/* Content Inputs */}
          {postType === "article" ? (
            <div className="space-y-3">
              <input
                type="text"
                value={articleTitle}
                onChange={(e) => setArticleTitle(e.target.value)}
                placeholder="Article headline..."
                maxLength={300}
                className="w-full rounded-xl border border-[#e1e5e9] bg-[#fafafa] px-3.5 py-2.5 text-sm font-medium text-[#141414] outline-none focus:border-[#0c76c9]"
              />
              <textarea
                value={articleBody}
                onChange={(e) => setArticleBody(e.target.value)}
                placeholder="Write your article..."
                rows={6}
                className="w-full resize-none rounded-xl border border-[#e1e5e9] bg-[#fafafa] px-3.5 py-2.5 text-sm text-[#141414] outline-none focus:border-[#0c76c9]"
              />
            </div>
          ) : (
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Share your work, insight, or update... Use #hashtags to help others discover it."
              rows={4}
              maxLength={3000}
              className="w-full resize-none rounded-xl border border-[#e1e5e9] bg-[#fafafa] px-3.5 py-2.5 text-sm text-[#141414] outline-none focus:border-[#0c76c9]"
            />
          )}

          {/* Hashtags input */}
          <div>
            <input
              type="text"
              value={hashtagsInput}
              onChange={(e) => setHashtagsInput(e.target.value)}
              placeholder="Add hashtags (e.g. webdev, react, plumbing)"
              className="w-full rounded-xl border border-[#e1e5e9] bg-[#fafafa] px-3.5 py-2 text-xs text-[#141414] outline-none focus:border-[#0c76c9]"
            />
          </div>

          {/* Media Previews */}
          {previews.length > 0 && (
            <div className="grid max-h-48 grid-cols-3 gap-2 overflow-y-auto rounded-xl border border-[#e1e5e9] p-2">
              {previews.map((item, idx) => (
                <div key={item.url} className="group relative aspect-square overflow-hidden rounded-lg bg-[#f2f2f2]">
                  {item.type === "video" ? (
                    <video src={item.url} className="h-full w-full object-cover" />
                  ) : (
                    <img src={item.url} alt={item.name} className="h-full w-full object-cover" />
                  )}
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
                    aria-label="Remove attachment"
                  >
                    <FiX className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Hidden File Inputs */}
          <input
            ref={imageInputRef}
            type="file"
            accept={IMAGE_ACCEPT}
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          <input
            ref={videoInputRef}
            type="file"
            accept={VIDEO_ACCEPT}
            multiple
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Footer Actions */}
          <div className="flex items-center justify-between border-t border-[#e1e5e9] pt-3">
            {!editingPost ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#e1e5e9] bg-[#f8f8f8] px-3 py-1.5 text-xs font-medium text-[#444] hover:bg-[#efefef]"
                >
                  <FiImage className="h-3.5 w-3.5 text-[#0c76c9]" /> Photos
                </button>
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#e1e5e9] bg-[#f8f8f8] px-3 py-1.5 text-xs font-medium text-[#444] hover:bg-[#efefef]"
                >
                  <FiVideo className="h-3.5 w-3.5 text-[#2dc36f]" /> Video
                </button>
              </div>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] text-[#777]">
                <FiLock className="h-3 w-3" /> Editing post
              </span>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="rounded-full px-4 py-1.5 text-xs font-medium text-[#666] hover:bg-[#f2f2f2]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-[#0c76c9] px-5 py-1.5 text-xs font-semibold text-white transition hover:bg-[#095fa3] disabled:opacity-60"
              >
                {submitting ? "Publishing..." : editingPost ? "Save Changes" : "Publish"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
