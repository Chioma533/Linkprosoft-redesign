import React from "react";
import { FiBookmark, FiArrowLeft, FiUploadCloud } from "react-icons/fi";
import wardrobeImg from "../../assets/images/progress_wardrobe.png";
import tvStandImg from "../../assets/images/progress_tv_stand.png";

const jobApplication = {
  id: 1,
  title: "Wardrobe Installation",
  employerName: "John Miguel",
  employerAvatarUrl: "/professional_avatar.png",
  postedAgo: "Posted 2 min ago",
  description:
    "Hi, I'm looking for an experienced carpenter to build and install a custom wardrobe for my master bedroom. The wardrobe should have sliding doors, multiple shelves, hanging sections, and drawers.",
  budget: 10000,
  spent: "$5K",
  delivery: "3 days delivery",
  rating: "5.0",
};

const JobApplicationPage = ({ job = jobApplication, onBack }) => {
  const application = { ...jobApplication, ...job };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] xl:grid-cols-[410px_1fr] gap-6 lg:gap-8 items-start">
          {/* Left Card: Apply for Job preview */}
          <section className="rounded-[1.5rem] bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-4 mb-5">
              <h2 className="text-xl font-semibold text-gray-900">Apply for job</h2>
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 transition hover:border-[#016EA6]/40 hover:text-[#016EA6]"
              >
                <FiArrowLeft className="h-3.5 w-3.5" />
                Back
              </button>
            </div>

            <div className="rounded-2xl border border-[#016EA6] bg-white p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 overflow-hidden rounded-full border border-gray-200 bg-[#dfeaf0] shrink-0">
                    <img
                      src={application.employerAvatarUrl}
                      alt={application.employerName}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-gray-900">
                      {application.title}
                    </h3>
                    <p className="text-xs font-medium text-[#016EA6]">{application.postedAgo}</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:text-[#016EA6]"
                  aria-label="Save job"
                >
                  <FiBookmark className="h-4 w-4" />
                </button>
              </div>

              <p className="mt-4 text-xs sm:text-sm leading-relaxed text-gray-600">
                {application.description}
              </p>

              <div className="my-4 border-t border-dashed border-gray-200" />

              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-1.5 text-gray-700">
                  <span className="font-medium text-gray-800">{application.employerName}</span>
                  <span className="text-gray-500">({application.rating})</span>
                  <span className="text-amber-400 text-base leading-none">★</span>
                </div>

                <p className="text-xs font-medium text-gray-600">
                  {application.spent} Spent
                </p>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs sm:text-sm text-gray-600">
                    {application.delivery}
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-gray-900">
                    ₦ {application.budget.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Right Card: Application Details Form */}
          <section className="rounded-[1.5rem] bg-white p-5 sm:p-7">
            <div className="border-b border-gray-100 pb-4 mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Application Details</h2>
              <p className="mt-1 text-sm text-gray-500">
                Fill in the details below to apply for this job
              </p>
            </div>

            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">Cover message</span>
                <textarea
                  rows={4}
                  className="w-full rounded-xl border border-[#dfeaf0] bg-[#fbfcfd] px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 outline-none transition focus:border-[#016EA6] focus:bg-white"
                  placeholder="Tell the client why you're the best fit."
                />
              </label>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">State your price</label>
                <div className="flex items-center rounded-xl border border-[#dfeaf0] bg-[#fbfcfd] overflow-hidden focus-within:border-[#016EA6] focus-within:bg-white transition">
                  <span className="flex items-center justify-center bg-[#e5ecef] px-3.5 py-3 text-base font-semibold text-gray-700 select-none">
                    ₦
                  </span>
                  <input
                    type="text"
                    placeholder="Enter a price"
                    className="w-full bg-transparent px-3.5 py-3 text-sm text-gray-700 placeholder:text-gray-400 outline-none"
                  />
                </div>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  How long will you take to complete this?
                </span>
                <input
                  type="text"
                  defaultValue="6 days"
                  className="w-full rounded-xl border border-[#dfeaf0] bg-[#fbfcfd] px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#016EA6] focus:bg-white"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  When can you start?
                </span>
                <input
                  type="text"
                  defaultValue="Immediately"
                  className="w-full rounded-xl border border-[#dfeaf0] bg-[#fbfcfd] px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#016EA6] focus:bg-white"
                />
              </label>

              <div>
                <p className="mb-3 text-sm font-medium text-gray-700">
                  Portfolio (Select at least 3 images)
                </p>

                <div className="flex flex-wrap items-center gap-3.5">
                  <button
                    type="button"
                    className="flex h-24 w-24 flex-col items-center justify-center rounded-xl bg-[#eef6fb] text-[#016EA6] transition hover:bg-[#e2eff7]"
                  >
                    <FiUploadCloud className="mb-1.5 h-6 w-6" />
                    <span className="text-xs font-medium">Upload image</span>
                  </button>

                  <div className="relative h-24 w-24 overflow-hidden rounded-xl border border-[#dfeaf0] bg-gray-100">
                    <img
                      src={wardrobeImg}
                      alt="Portfolio sample 1"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="relative h-24 w-24 overflow-hidden rounded-xl border border-[#dfeaf0] bg-gray-100">
                    <img
                      src={tvStandImg}
                      alt="Portfolio sample 2"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onBack}
                  className="rounded-full bg-[#f3f5f6] px-8 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="rounded-full bg-[#016EA6] px-8 py-3 text-sm font-medium text-white transition hover:bg-[#015f92]"
                >
                  Submit Application
                </button>
              </div>
            </div>
          </section>
        </div>
    </main>
  );
};

export default JobApplicationPage;

