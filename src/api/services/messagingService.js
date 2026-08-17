import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const dataOf = (response) => response.data?.data ?? response.data;

export const messagingService = {
  async createThread(participantId) {
    return dataOf(await axiosInstance.post(API_PATHS.MESSAGING.THREADS, { participantId }));
  },
  async getThreads() {
    const data = dataOf(await axiosInstance.get(API_PATHS.MESSAGING.THREADS));
    return Array.isArray(data) ? data : data.threads ?? [];
  },
  async getMessages(threadId, page = 1, limit = 20) {
    const data = dataOf(await axiosInstance.get(API_PATHS.MESSAGING.THREAD_MESSAGES(threadId), { params: { page, limit } }));
    return {
      messages: data.items ?? data.messages ?? [],
      total: data.total ?? 0,
      page: data.page ?? page,
      limit: data.limit ?? limit,
      totalPages: data.totalPages ?? 0,
    };
  },
  async sendMessage(threadId, content, attachmentUrl = null, attachmentType = null) {
    return dataOf(await axiosInstance.post(API_PATHS.MESSAGING.THREAD_MESSAGES(threadId), { content, attachmentUrl, attachmentType }));
  },
  async markThreadAsRead(threadId) {
    return dataOf(await axiosInstance.patch(API_PATHS.MESSAGING.THREAD_READ(threadId)));
  },
  async getUserInfo(userId) {
    return dataOf(await axiosInstance.get(API_PATHS.MESSAGING.USER_INFO(userId)));
  },
};
