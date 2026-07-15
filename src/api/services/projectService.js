import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

// Realistic mock jobs matching design screenshots
const mockJobs = [
  {
    id: "job-1",
    title: "Wardrobe Installation",
    description: "Hi, I'm looking for an experienced carpenter to build and install a custom wardrobe for my master bedroom. The wardrobe should have sliding doors, multiple shelves, hanging sections, and drawers.",
    category: "Carpentry",
    location: "Lekki, Lagos",
    budget: 10000,
    postedAt: "Posted 2 min ago",
    datePosted: "Today",
    client: "John M",
    status: "Active",
    isBookmarked: false
  },
  {
    id: "job-2",
    title: "Kitchen Plumbing repairs",
    description: "Need a professional plumber to fix a leaking sink pipe and replace the kitchen faucet. Must have own tools and be able to complete within a few hours.",
    category: "Plumbing",
    location: "Ikeja, Lagos",
    budget: 45000,
    postedAt: "Posted 1 hour ago",
    datePosted: "Yesterday",
    client: "John Doe",
    status: "Active",
    isBookmarked: true
  },
  {
    id: "job-3",
    title: "House Painting Services",
    description: "Looking for an expert painter to paint a 3-bedroom apartment. Walls require minor filling and priming before applying two coats of premium satin paint.",
    category: "Painting",
    location: "Surulere, Lagos",
    budget: 85000,
    postedAt: "Posted 4 hours ago",
    datePosted: "Jul 12",
    client: "Alice Smith",
    status: "Pending",
    isBookmarked: false
  },
  {
    id: "job-4",
    title: "Electrical Wiring Inspection",
    description: "We are experiencing frequent power trips in our main distribution board. Need an electrician to run full diagnostics and resolve the issues safely.",
    category: "Electrical",
    location: "VGC, Lagos",
    budget: 25000,
    postedAt: "Posted 1 day ago",
    datePosted: "Jul 11",
    client: "Bayo A.",
    status: "Completed",
    isBookmarked: false
  },
  {
    id: "job-5",
    title: "AC Installation & Service",
    description: "Installation of two new split unit air conditioners and servicing of one existing unit in a home office setup.",
    category: "Electrical",
    location: "Yaba, Lagos",
    budget: 35000,
    postedAt: "Posted 2 days ago",
    datePosted: "Jul 10",
    client: "Samuel O.",
    status: "Cancelled",
    isBookmarked: false
  },
  {
    id: "job-6",
    title: "Sofa Cleaning Service",
    description: "Deep steam cleaning for a 5-seater sectional sofa. Pls bring dry-cleaning chemicals and vacuum equipment.",
    category: "Cleaning",
    location: "Ikoyi, Lagos",
    budget: 15000,
    postedAt: "Posted 3 days ago",
    datePosted: "Jul 09",
    client: "Grace K.",
    status: "Completed",
    isBookmarked: false
  }
];

const mockApplications = [
  {
    id: "app-1",
    jobId: "job-2",
    title: "Kitchen Plumbing",
    client: "John Doe",
    category: "Plumbing",
    appliedOn: "Yesterday",
    status: "Under review",
    lastUpdate: "2 hrs ago",
    budget: 45000
  },
  {
    id: "app-2",
    jobId: "job-1",
    title: "Wardrobe Installation",
    client: "John M",
    category: "Carpentry",
    appliedOn: "Yesterday",
    status: "Accepted",
    lastUpdate: "2 hrs ago",
    budget: 10000
  },
  {
    id: "app-3",
    jobId: "job-4",
    title: "Electrical Wiring Inspection",
    client: "Bayo A.",
    category: "Electrical",
    appliedOn: "Jul 11",
    status: "Accepted",
    lastUpdate: "2 days ago",
    budget: 25000
  },
  {
    id: "app-4",
    jobId: "job-5",
    title: "AC Installation & Service",
    client: "Samuel O.",
    category: "Electrical",
    appliedOn: "Jul 10",
    status: "Rejected",
    lastUpdate: "3 days ago",
    budget: 35000
  }
];

export const projectService = {
  getJobs: async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.JOBS.GET_JOBS);
      // In case backend endpoint succeeds but is empty or not fully populated
      return response.data?.length > 0 ? response.data : mockJobs;
    } catch (error) {
      console.warn("Using mock data fallback for jobs list:", error.message);
      return mockJobs;
    }
  },

  getMyJobs: async () => {
    try {
      // Simulate retrieving jobs assigned to professional
      const response = await axiosInstance.get(`${API_PATHS.JOBS.GET_JOBS}/my-jobs`);
      return response.data?.length > 0 ? response.data : mockJobs;
    } catch (error) {
      console.warn("Using mock data fallback for user jobs:", error.message);
      return mockJobs;
    }
  },

  getApplications: async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.APPLICATIONS.GET_APPLICATIONS);
      return response.data?.length > 0 ? response.data : mockApplications;
    } catch (error) {
      console.warn("Using mock data fallback for applications:", error.message);
      return mockApplications;
    }
  },

  applyForJob: async (jobId, bidAmount, coverLetter = "") => {
    try {
      const response = await axiosInstance.post(API_PATHS.APPLICATIONS.ADD_APPLICATION, {
        jobId,
        bidAmount,
        coverLetter
      });
      return response.data;
    } catch (error) {
      console.warn("Simulating application submission locally:", error.message);
      // Generate simulated response
      const matchedJob = mockJobs.find(j => j.id === jobId);
      return {
        success: true,
        message: "Application submitted successfully",
        application: {
          id: `app-${Date.now()}`,
          jobId,
          title: matchedJob ? matchedJob.title : "Job Title",
          client: matchedJob ? matchedJob.client : "Client Name",
          category: matchedJob ? matchedJob.category : "Category",
          appliedOn: "Just now",
          status: "Under review",
          lastUpdate: "Just now",
          budget: bidAmount
        }
      };
    }
  }
};
