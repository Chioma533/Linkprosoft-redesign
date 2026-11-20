import React, { useState } from "react";
import { X, Building2, Upload, FileText, AlertCircle, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";

/**
 * Company / Employer Verification Modal.
 * Collects registered business identity, CAC / Registration Number, and supporting business documentation.
 * Grants the Gold Badge (#D69A16) upon administrative approval.
 */
const CompanyVerificationModal = ({ isOpen, onClose, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    companyName: "",
    registrationNumber: "", // CAC / TIN
    incorporationDate: "",
    registeredAddress: "",
    industry: "Construction & Services",
    signatoryName: "",
    signatoryRole: "Managing Director",
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
    if (!formData.companyName.trim() || !formData.registrationNumber.trim()) {
      toast.error("Please enter company name and registration number.");
      return;
    }

    if (!selectedFile) {
      toast.error("Please upload business registration document (CAC Certificate / Memorandum).");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Company verification documents submitted for administrative audit!");
      onSubmitSuccess?.({
        ...formData,
        category: "company",
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
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-amber-50/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D69A16] text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Company & Business Verification
              </h2>
              <p className="text-xs text-gray-500">
                Unlock the Gold Verified Badge (#D69A16) by submitting corporate identity evidence
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
          <div className="rounded-xl bg-amber-50/80 p-3 flex items-start gap-2.5 text-amber-900 text-xs">
            <ShieldCheck className="w-4 h-4 shrink-0 text-[#D69A16] mt-0.5" />
            <span>
              <strong>Note:</strong> Company verification is not automatically granted simply by holding an employer account. Legitimate business registration evidence is audited before approval.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Registered Company / Business Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. BuildPro Engineering Ltd."
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#D69A16]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                CAC Registration / RC Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. RC-1489201"
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#D69A16]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Date of Incorporation *
              </label>
              <input
                type="date"
                required
                value={formData.incorporationDate}
                onChange={(e) => setFormData({ ...formData, incorporationDate: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#D69A16]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Industry Sector
              </label>
              <select
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#D69A16]"
              >
                <option value="Construction & Services">Construction & Built Environment</option>
                <option value="Facility Management">Facility & Property Management</option>
                <option value="Electrical & Power">Electrical & Energy Infrastructure</option>
                <option value="Logistics & Supply">Logistics & Supply Chain</option>
                <option value="Information Technology">Information Technology</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Registered Physical Business Address *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 15 Marina Boulevard, Victoria Island, Lagos"
              value={formData.registeredAddress}
              onChange={(e) => setFormData({ ...formData, registeredAddress: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#D69A16]"
            />
          </div>

          {/* Document Upload */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              CAC Incorporation Certificate / Business Registration Document *
            </label>
            <div className="mt-1 flex justify-center rounded-xl border-2 border-dashed border-gray-300 px-6 py-5 hover:border-[#D69A16] transition bg-gray-50/50">
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <div className="mt-2 flex text-xs text-gray-600 justify-center">
                  <label className="relative cursor-pointer font-bold text-[#D69A16] hover:underline">
                    <span>Upload business document</span>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">Official CAC Certificate or TIN Doc (PDF/JPG max 5MB)</p>
                {selectedFile && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-[#D69A16] rounded-full text-xs font-bold">
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
              className="rounded-xl bg-[#D69A16] px-5 py-2 text-xs font-bold text-white hover:bg-amber-600 transition disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Company Evidence"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyVerificationModal;
