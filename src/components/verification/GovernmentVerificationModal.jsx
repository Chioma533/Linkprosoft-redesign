import React, { useState } from "react";
import { X, Landmark, Upload, FileText, ShieldAlert, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";

/**
 * Government Agency / Institutional Verification Modal.
 * For official government ministries, agencies, departments, or public corporations.
 * Grants the Ash/Grey Badge (#73777D) upon strict administrative validation.
 */
const GovernmentVerificationModal = ({ isOpen, onClose, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    agencyName: "",
    ministryDepartment: "",
    mandateGazetteNumber: "",
    contactOfficerName: "",
    officialEmail: "",
    jurisdiction: "Federal / National",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must not exceed 5MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.agencyName.trim() || !formData.officialEmail.trim()) {
      toast.error("Please fill in agency name and official government email.");
      return;
    }

    if (!selectedFile) {
      toast.error("Please upload official authorization letter or Gazette reference.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Institutional verification dossier submitted to Compliance Director!");
      onSubmitSuccess?.({
        ...formData,
        category: "government",
        documentName: selectedFile.name,
        status: "pending_review",
        submittedAt: new Date().toISOString(),
      });
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#73777D] text-white">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Government Institutional Recognition
              </h2>
              <p className="text-xs text-gray-500">
                Unlock the Ash/Grey Institutional Badge (#73777D) via official accreditation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div className="rounded-xl bg-gray-100/70 p-3 flex items-start gap-2.5 text-gray-700 text-xs border border-gray-200">
            <ShieldAlert className="w-4 h-4 shrink-0 text-[#73777D] mt-0.5" />
            <span>
              <strong>Institutional Policy:</strong> This badge is strictly reserved for recognised government bodies and public statutory authorities. It cannot be unlocked through user ratings or ordinary subscriptions.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Official Agency / Department Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ministry of Works & Housing"
                value={formData.agencyName}
                onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#73777D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Supervising Ministry / Board
              </label>
              <input
                type="text"
                placeholder="e.g. Federal Ministry of Infrastructure"
                value={formData.ministryDepartment}
                onChange={(e) => setFormData({ ...formData, ministryDepartment: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#73777D]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Enabling Act / Gazette Notice Number
              </label>
              <input
                type="text"
                placeholder="e.g. Official Gazette No. 42 / 2024"
                value={formData.mandateGazetteNumber}
                onChange={(e) => setFormData({ ...formData, mandateGazetteNumber: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#73777D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Official Government Email (.gov / .org) *
              </label>
              <input
                type="email"
                required
                placeholder="liaison@works.gov.ng"
                value={formData.officialEmail}
                onChange={(e) => setFormData({ ...formData, officialEmail: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#73777D]"
              />
            </div>
          </div>

          {/* Document Upload */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Letter of Authorization or Official Warrant (PDF) *
            </label>
            <div className="mt-1 flex justify-center rounded-xl border-2 border-dashed border-gray-300 px-6 py-5 hover:border-[#73777D] transition bg-gray-50/50">
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <div className="mt-2 flex text-xs text-gray-600 justify-center">
                  <label className="relative cursor-pointer font-bold text-[#73777D] hover:underline">
                    <span>Upload ministerial letter</span>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">Official letterhead warrant or Gazette copy (PDF up to 5MB)</p>
                {selectedFile && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-gray-200 text-[#73777D] rounded-full text-xs font-bold">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{selectedFile.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#73777D] px-5 py-2 text-xs font-bold text-white hover:bg-gray-700 transition disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Institutional Dossier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GovernmentVerificationModal;
