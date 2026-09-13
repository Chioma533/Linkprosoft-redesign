import React, { useState } from "react";
import {
  FiBookmark,
  FiArrowLeft,
  FiUploadCloud,
  FiCheckCircle,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import wardrobeImg from "../../assets/images/progress_wardrobe.png";
import tvStandImg from "../../assets/images/progress_tv_stand.png";
import { useDashboardStore } from "../../store/dashboardStore";

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
  const applyForJob = useDashboardStore((state) => state.applyForJob);
  const [form, setForm] = useState({
    coverLetter: "",
    bidAmount: application.budget ? String(application.budget) : "",
    estimatedDays: "6",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.bidAmount || Number(form.bidAmount) <= 0) {
      toast.error("Please enter a valid price.");
      return;
    }

    if (!form.coverLetter.trim()) {
      toast.error("Please include a cover message.");
      return;
    }

    setIsSubmitting(true);
    try {
      await applyForJob(
        application.id,
        Number(form.bidAmount),
        form.coverLetter,
        Number(form.estimatedDays) || 1,
      );
      toast.success("Application submitted successfully.");
      setIsSubmitted(true);
    } catch (error) {
      toast.error(error.message || "Failed to submit application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-xl rounded-[1.75rem] border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF5FB] text-[#016EA6] sm:h-20 sm:w-20">
              <FiCheckCircle className="h-8 w-8 sm:h-10 sm:w-10" />
            </div>
          </div>

          <h2 className="mt-6 text-center text-[1.5rem] font-bold text-gray-900 sm:text-[2rem]">
            Application Submitted
          </h2>

          <p className="mt-2 text-center text-sm leading-relaxed text-gray-500 sm:text-base">
            Your proposal for{" "}
            <span className="font-semibold text-gray-700">
              {application.title}
            </span>{" "}
            has been sent successfully.
          </p>

          <div className="mt-6 rounded-2xl border border-[#dfeaf0] bg-[#f7fafc] p-4 sm:p-5">
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
                  <p className="mt-1 text-xs font-medium text-[#016EA6]">
                    {application.postedAgo}
                  </p>
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

            <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-[#dfeaf0] bg-white px-3 py-2.5">
              <span className="text-xs text-gray-500">Budget</span>
              <span className="text-base font-bold text-gray-900">
                ₦ {application.budget.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={onBack}
              className="rounded-full bg-[#016EA6] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#015f92]"
            >
              Back to Browse Jobs
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[380px_1fr] xl:grid-cols-[410px_1fr] lg:gap-8 items-start">
        {/* Left Card: Apply for Job preview */}
        <section className="rounded-3xl border border-[#cfe4ef] bg-[#eef6fb] p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3 border-b border-[#d8eaf5] pb-4">
            <h2 className="text-xl font-semibold text-gray-900 sm:text-[1.75rem]">
              Apply for job
            </h2>
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 transition hover:border-[#016EA6]/40 hover:text-[#016EA6]"
            >
              <FiArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>
          </div>

          <div className="rounded-2xl border border-[#016EA6]/20 bg-white p-4 shadow-sm sm:p-5">
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
                  <p className="mt-1 text-xs font-medium text-[#016EA6]">
                    {application.postedAgo}
                  </p>
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

            <p className="mt-4 text-xs leading-relaxed text-gray-600 sm:text-sm">
              {application.description}
            </p>

            <div className="my-4 border-t border-dashed border-gray-200" />

            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-1.5 text-gray-700">
                <span className="font-medium text-gray-800">
                  {application.employerName}
                </span>
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
                <span className="text-lg font-bold text-gray-900 sm:text-xl">
                  ₦ {application.budget.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Card: Application Details Form */}
        <section className="rounded-3xl border border-[#e7edf1] bg-white p-4 shadow-sm sm:p-6 lg:p-7">
          <div className="mb-6 border-b border-gray-100 pb-4">
            <h2 className="text-[1.4rem] font-semibold text-gray-900 sm:text-2xl">
              Application Details
            </h2>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Fill in the details below to apply for this job
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">
                Cover message
              </span>
              <textarea
                rows={4}
                value={form.coverLetter}
                onChange={(event) =>
                  setForm({ ...form, coverLetter: event.target.value })
                }
                className="w-full rounded-xl border border-[#dfeaf0] bg-[#fbfcfd] px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 outline-none transition focus:border-[#016EA6] focus:bg-white"
                placeholder="Tell the client why you're the best fit."
              />
            </label>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                State your price
              </label>
              <div className="flex items-center overflow-hidden rounded-xl border border-[#dfeaf0] bg-[#fbfcfd] transition focus-within:border-[#016EA6] focus-within:bg-white">
                <span className="flex items-center justify-center bg-[#e5ecef] px-3.5 py-3 text-base font-semibold text-gray-700 select-none">
                  ₦
                </span>
                <input
                  type="number"
                  min="1"
                  value={form.bidAmount}
                  onChange={(event) =>
                    setForm({ ...form, bidAmount: event.target.value })
                  }
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
                type="number"
                min="1"
                value={form.estimatedDays}
                onChange={(event) =>
                  setForm({ ...form, estimatedDays: event.target.value })
                }
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
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-[#016EA6] px-8 py-3 text-sm font-medium text-white transition hover:bg-[#015f92]"
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default JobApplicationPage;
