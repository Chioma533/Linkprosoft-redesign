import React from "react";
import { FiBookmark, FiImage, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import ProfessionalNavbar from "../../layouts/professional/ProfessionalNavbar";
import ProfessionalBottomNav from "../../components/professional/ProfessionalBottomNav";

const jobApplication = {
  id: 1,
  title: "Wardrobe Installation",
  employerName: "Jonathan David",
  employerAvatarUrl: "/professional_avatar.png",
  postedAgo: "Posted 2 min ago",
  description:
    "Hi, I'm looking for an experienced carpenter to build and install a custom wardrobe for my master bedroom. The wardrobe should have sliding doors, multiple shelves, hanging sections, and drawers.",
  budget: 10000,
  rating: 5,
  jobType: "Carpentry",
};

const portfolioSamples = [
  { id: 1, tone: "from-slate-200 via-slate-100 to-slate-300" },
  { id: 2, tone: "from-amber-100 via-orange-100 to-amber-200" },
  { id: 3, tone: "from-sky-100 via-cyan-100 to-sky-200" },
];

const JobApplicationPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f3f5f6] pb-24 md:pb-12">
      <ProfessionalNavbar activePage="browse-jobs" />

      <section className="bg-[#EEF5F9] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-14">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <div className="flex-1 max-w-full sm:max-w-xl">
              <h1 className="text-[1.125rem] font-regular leading-[1.2] tracking-[-0.03em] text-gray-900 sm:text-4xl sm:leading-tight sm:tracking-tight">
                Find Your Next Opportunity
              </h1>
              <p className="mt-0.5 text-[0.75rem] leading-relaxed text-gray-600 sm:mt-2 sm:text-base sm:font-normal">
                Looking for jobs? Browse our latest job openings to view
              </p>
            </div>

            <div
              className="hidden sm:flex sm:shrink-0 sm:w-64 sm:max-w-xs sm:items-end sm:justify-center"
              style={{ mixBlendMode: "multiply" }}
            >
              <img
                src="/tools_bucket_illustration.png"
                alt="Construction Tools"
                className="w-full object-contain sm:translate-y-[100px] lg:w-72"
              />
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.55fr]">
          <section className="rounded-[1.5rem] border border-[#dfeaf0] bg-white p-4 shadow-[0_12px_28px_rgba(15,23,42,0.04)] sm:p-6">
            <div className="flex items-center justify-between gap-3 pb-4">
              <h2 className="text-xl font-semibold text-gray-900">Apply for job</h2>
              <button
                type="button"
                onClick={() => navigate("/professional/home")}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-[#016EA6]/40 hover:text-[#016EA6]"
              >
                <FiArrowLeft className="h-3.5 w-3.5" />
                Back
              </button>
            </div>

            <div className="rounded-[1.5rem] border border-[#dfeaf0] bg-[#f7fafb] p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 overflow-hidden rounded-full border border-gray-200 bg-[#dfeaf0]">
                    <img
                      src={jobApplication.employerAvatarUrl}
                      alt={jobApplication.employerName}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-gray-900">
                      {jobApplication.title}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-[#016EA6]">{jobApplication.postedAgo}</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400 transition hover:text-[#016EA6]"
                  aria-label="Save job"
                >
                  <FiBookmark className="h-4 w-4" />
                </button>
              </div>

              <p className="mt-4 text-sm leading-6 text-gray-500">
                {jobApplication.description}
              </p>

              <div className="mt-5 space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-gray-700">John Miguel</span>
                  <div className="flex items-center gap-1 text-gray-800">
                    <span className="font-semibold">{jobApplication.rating}.0</span>
                    <span className="text-yellow-400">★</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span>Job type</span>
                  <span className="font-semibold text-gray-800">{jobApplication.jobType}</span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span>Budget</span>
                  <span className="font-semibold text-gray-800">₦ {jobApplication.budget.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-[#dfeaf0] bg-white p-4 shadow-[0_12px_28px_rgba(15,23,42,0.04)] sm:p-6">
            <div className="flex flex-col gap-2 border-b border-gray-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="text-[1.6rem] font-semibold text-gray-900">Application Details</h2>
              <p className="text-sm text-gray-500">Fill in the details below to apply for this job</p>
            </div>

            <div className="mt-6 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">Cover message</span>
                <textarea
                  rows={4}
                  className="w-full rounded-xl border border-[#dfeaf0] bg-gray-50 px-3.5 py-3 text-sm text-gray-700 outline-none transition focus:border-[#016EA6] focus:bg-white"
                  placeholder="Tell the client why you're the best fit."
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">Set your price</span>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-400">₦</span>
                  <input
                    type="text"
                    placeholder="Enter a price"
                    className="w-full rounded-xl border border-[#dfeaf0] bg-gray-50 py-3 pl-10 pr-3 text-sm text-gray-700 outline-none transition focus:border-[#016EA6] focus:bg-white"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">How long will you take to complete this?</span>
                <input
                  type="text"
                  value="6 days"
                  readOnly
                  className="w-full rounded-xl border border-[#dfeaf0] bg-gray-50 px-3.5 py-3 text-sm text-gray-700 outline-none"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">When can you start?</span>
                <input
                  type="text"
                  value="Immediately"
                  readOnly
                  className="w-full rounded-xl border border-[#dfeaf0] bg-gray-50 px-3.5 py-3 text-sm text-gray-700 outline-none"
                />
              </label>

              <div>
                <p className="mb-3 text-sm font-medium text-gray-700">
                  Portfolio (select at least 3 images)
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    className="flex h-24 w-24 flex-col items-center justify-center rounded-2xl border border-dashed border-[#b4d7e9] bg-[#eef6fb] text-[#016EA6] transition hover:border-[#016EA6]"
                  >
                    <FiImage className="mb-2 h-5 w-5" />
                    <span className="text-xs font-medium">Upload image</span>
                  </button>

                  {portfolioSamples.map((item) => (
                    <div
                      key={item.id}
                      className={`h-24 w-24 rounded-2xl border border-[#dfeaf0] bg-gradient-to-br ${item.tone} shadow-inner`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/professional/home")}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="rounded-xl bg-[#016EA6] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_18px_rgba(1,110,166,0.22)] transition hover:bg-[#015f92]"
                >
                  Submit Application
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <ProfessionalBottomNav activeTab="browse-jobs" />
    </div>
  );
};

export default JobApplicationPage;
