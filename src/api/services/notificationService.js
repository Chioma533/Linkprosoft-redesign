import axiosInstance from "../../utils/axiosInstance";

const mockMessages = [
  { id: "msg-1", sender: "Jhon Miguel", text: "Hello how are you doing? let me know when you are available.", time: "10:30 AM", unread: true },
  { id: "msg-2", sender: "Jhon Miguel", text: "Are we still on for the Wardrobe installation?", time: "Yesterday", unread: true },
  { id: "msg-3", sender: "Jhon Miguel", text: "Thanks for the quick response. I appreciate your work.", time: "Jul 12", unread: false },
  { id: "msg-4", sender: "Jhon Miguel", text: "Hello Samuel, can you send the invoice?", time: "Jul 10", unread: false }
];

const mockNotifications = [
  { id: "not-1", title: "Account Verified", body: "Your linkprosoft account is live", time: "Just now", unread: true },
  { id: "not-2", title: "Job Offer Accepted", body: "John M accepted your bid on Wardrobe Installation", time: "2 hrs ago", unread: true },
  { id: "not-3", title: "Payment Received", body: "Successfully received #45,000 for Kitchen Plumbing", time: "Yesterday", unread: false },
  { id: "not-4", title: "New Job Match", body: "A new Wardrobe installation match was found in Lekki", time: "3 days ago", unread: false }
];

const mockPerformance = {
  responseRate: 75,
  successRate: 75,
  reviews: 5.0,
  reviewsCount: 12,
  earningsTotal: 500000,
  completedJobsCount: 288,
  upcomingJobsCount: 172,
  performancePercentage: 80
};

const mockSchedules = [
  { id: "sch-1", orderId: "ORD-87W7", jobTitle: "Wardrobe installation", location: "Lekki Lagos", client: "John M", time: "Jul 10 • 9:00 AM", date: "2026-07-02" },
  { id: "sch-2", orderId: "ORD-87W7", jobTitle: "Wardrobe installation", location: "Lekki Lagos", client: "John M", time: "Jul 12 • 10:00 AM", date: "2026-07-09" },
  { id: "sch-3", orderId: "ORD-87W7", jobTitle: "Wardrobe installation", location: "Lekki Lagos", client: "John M", time: "Jul 15 • 11:30 AM", date: "2026-07-15" },
  { id: "sch-4", orderId: "ORD-87W7", jobTitle: "Wardrobe installation", location: "Lekki Lagos", client: "John M", time: "Jul 18 • 1:00 PM", date: "2026-07-18" }
];

export const notificationService = {
  getMessages: async () => {
    try {
      const response = await axiosInstance.get("/api/messages");
      return response.data?.length > 0 ? response.data : mockMessages;
    } catch (error) {
      console.warn("Using mock messages fallback:", error.message);
      return mockMessages;
    }
  },

  getNotifications: async () => {
    try {
      const response = await axiosInstance.get("/api/notifications");
      return response.data?.length > 0 ? response.data : mockNotifications;
    } catch (error) {
      console.warn("Using mock notifications fallback:", error.message);
      return mockNotifications;
    }
  },

  getPerformanceMetrics: async () => {
    try {
      const response = await axiosInstance.get("/api/performance");
      return response.data || mockPerformance;
    } catch (error) {
      console.warn("Using mock performance metrics fallback:", error.message);
      return mockPerformance;
    }
  },

  getSchedules: async () => {
    try {
      const response = await axiosInstance.get("/api/schedules");
      return response.data?.length > 0 ? response.data : mockSchedules;
    } catch (error) {
      console.warn("Using mock schedules fallback:", error.message);
      return mockSchedules;
    }
  }
};
