import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const dataOf = (response) => response.data?.data ?? response.data;

export const communityService = {
  // ---- Feed & Posts ----
  async getFeed({ feed = "latest", page = 1, limit = 20 } = {}) {
    const res = await axiosInstance.get(API_PATHS.COMMUNITY.POSTS, {
      params: { feed, page, limit },
    });
    return dataOf(res);
  },

  async getPost(postId) {
    const res = await axiosInstance.get(API_PATHS.COMMUNITY.POST_BY_ID(postId));
    return dataOf(res);
  },

  async createPost(payload) {
    const res = await axiosInstance.post(API_PATHS.COMMUNITY.POSTS, payload);
    return dataOf(res);
  },

  async updatePost(postId, payload) {
    const res = await axiosInstance.put(API_PATHS.COMMUNITY.POST_BY_ID(postId), payload);
    return dataOf(res);
  },

  async deletePost(postId) {
    const res = await axiosInstance.delete(API_PATHS.COMMUNITY.POST_BY_ID(postId));
    return dataOf(res);
  },

  async getUserPosts(userId, { page = 1, limit = 20 } = {}) {
    const res = await axiosInstance.get(API_PATHS.COMMUNITY.USER_POSTS(userId), {
      params: { page, limit },
    });
    return dataOf(res);
  },

  // ---- Reactions ----
  async reactToPost(postId, reaction = "like") {
    const res = await axiosInstance.post(API_PATHS.COMMUNITY.REACTIONS(postId), { reaction });
    return dataOf(res);
  },

  async removeReaction(postId) {
    const res = await axiosInstance.delete(API_PATHS.COMMUNITY.REACTIONS(postId));
    return dataOf(res);
  },

  // ---- Comments ----
  async getComments(postId, { page = 1, limit = 20 } = {}) {
    const res = await axiosInstance.get(API_PATHS.COMMUNITY.COMMENTS(postId), {
      params: { page, limit },
    });
    return dataOf(res);
  },

  async addComment(postId, { body, parentId } = {}) {
    const payload = parentId ? { body, parentId } : { body };
    const res = await axiosInstance.post(API_PATHS.COMMUNITY.COMMENTS(postId), payload);
    return dataOf(res);
  },

  async updateComment(commentId, body) {
    const res = await axiosInstance.put(API_PATHS.COMMUNITY.COMMENT_BY_ID(commentId), { body });
    return dataOf(res);
  },

  async deleteComment(commentId) {
    const res = await axiosInstance.delete(API_PATHS.COMMUNITY.COMMENT_BY_ID(commentId));
    return dataOf(res);
  },

  async likeComment(commentId) {
    const res = await axiosInstance.post(API_PATHS.COMMUNITY.COMMENT_LIKE(commentId));
    return dataOf(res);
  },

  async unlikeComment(commentId) {
    const res = await axiosInstance.delete(API_PATHS.COMMUNITY.COMMENT_LIKE(commentId));
    return dataOf(res);
  },

  // ---- Saved Posts ----
  async savePost(postId) {
    const res = await axiosInstance.post(API_PATHS.COMMUNITY.SAVE_POST(postId));
    return dataOf(res);
  },

  async unsavePost(postId) {
    const res = await axiosInstance.delete(API_PATHS.COMMUNITY.SAVE_POST(postId));
    return dataOf(res);
  },

  async getSavedPosts({ page = 1, limit = 20 } = {}) {
    const res = await axiosInstance.get(API_PATHS.COMMUNITY.SAVED_POSTS, {
      params: { page, limit },
    });
    return dataOf(res);
  },

  // ---- Hashtags ----
  async getTrendingHashtags() {
    const res = await axiosInstance.get(API_PATHS.COMMUNITY.TRENDING_HASHTAGS);
    return dataOf(res);
  },

  async getPostsByHashtag(tag, { page = 1, limit = 20 } = {}) {
    const res = await axiosInstance.get(API_PATHS.COMMUNITY.POSTS_BY_HASHTAG(tag), {
      params: { page, limit },
    });
    return dataOf(res);
  },

  // ---- Follows ----
  async followUser(userId) {
    const res = await axiosInstance.post(API_PATHS.COMMUNITY.FOLLOW_USER(userId));
    return dataOf(res);
  },

  async unfollowUser(userId) {
    const res = await axiosInstance.delete(API_PATHS.COMMUNITY.FOLLOW_USER(userId));
    return dataOf(res);
  },

  // ---- Reports ----
  async reportContent({ postId, commentId, reason, details }) {
    const res = await axiosInstance.post(API_PATHS.COMMUNITY.REPORTS, {
      ...(postId ? { postId } : {}),
      ...(commentId ? { commentId } : {}),
      reason,
      ...(details ? { details } : {}),
    });
    return dataOf(res);
  },
};

export default communityService;
