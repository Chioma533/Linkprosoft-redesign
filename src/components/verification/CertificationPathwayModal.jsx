import React, { useState } from "react";
import { X, Award, Upload, Calendar, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import { toast } from "react-hot-toast";

/**
 * Pathway 1: Certification-based verification modal.
 * Captures certification name, issuing authority, certificate number, issue date, expiry date, and supporting documents.
 */
const CertificationPathwayModal = ({ isOpen, onClose, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    certificationName: "",
    issuingAuthority: "",
    certificateNumber: "",
    issueDate: "",
    hasExpiry: false,
    expiryDate: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.certificationName.trim() || !formData.issuingAuthority.trim()) {
      toast.error("Please fill in certification name and issuing authority.");
      return;
    }

    if (!selectedFile) {
      toast.error("Please upload your certification document.");
      return;
    }

    setIsSubmitting(true);
    // Simulate submission to admin queue
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Certification submitted successfully! Sent to administrative review.");
      onSubmitSuccess?.({
        ...formData,
        documentName: selectedFile.name,
        status: "pending",
        submittedAt: new Date().toISOString(),
      });
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-sky-50/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#016EA6] text-white">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Government-Recognised Certification Pathway
              </h2>
              <p className="text-xs text-gray-500">
                Submit certified credentials to earn the Blue Professional Verified Badge (#016EA6)
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Certification Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Master Plumber License"
                value={formData.certificationName}
                onChange={(e) => setFormData({ ...formData, certificationName: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#016EA6]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Issuing Authority / Board *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. State Trade Licensing Board"
                value={formData.issuingAuthority}
                onChange={(e) => setFormData({ ...formData, issuingAuthority: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#016EA6]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Certificate Number
              </label>
              <input
                type="text"
                placeholder="e.g. LIC-2026-98124"
                value={formData.certificateNumber}
                onChange={(e) => setFormData({ ...formData, certificateNumber: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#016EA6]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Issue Date *
              </label>
              <input
                type="date"
                required
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#016EA6]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="hasExpiry"
                checked={formData.hasExpiry}
                onChange={(e) => setFormData({ ...formData, hasExpiry: e.target.checked })}
                className="rounded border-gray-300 text-[#016EA6] focus:ring-[#016EA6]"
              />
              <label htmlFor="hasExpiry" className="text-xs font-semibold text-gray-700">
                This certification has an expiration date
              </label>
            </div>

            {formData.hasExpiry && (
              <div className="sm:w-1/2 pt-1">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  required={formData.hasExpiry}
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#016EA6]"
                />
              </div>
            )}
          </div>

          {/* Document Upload */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Supporting Certification Document (PDF, JPG, PNG) *
            </label>
            <div className="mt-1 flex justify-center rounded-xl border-2 border-dashed border-gray-300 px-6 py-5 hover:border-[#016EA6] transition bg-gray-50/50">
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <div className="mt-2 flex text-xs text-gray-600 justify-center">
                  <label className="relative cursor-pointer font-bold text-[#016EA6] hover:underline">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">PDF, PNG, JPG up to 5MB</p>
                {selectedFile && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-[#016EA6] rounded-full text-xs font-bold">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{selectedFile.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-amber-50 p-3 flex items-start gap-2 text-amber-800 text-[11px]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <span>
              All certifications are securely verified by our compliance team. Once approved, you will be awarded the Blue Professional Verified Badge.
            </span>
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
              className="rounded-xl bg-[#016EA6] px-5 py-2 text-xs font-bold text-white hover:bg-[#061EA6] transition disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit for Verification"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CertificationPathwayModal;
