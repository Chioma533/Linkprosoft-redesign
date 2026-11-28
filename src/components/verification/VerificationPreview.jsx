import React, { useEffect, useState } from "react";

const VerificationPreview = ({
  profile = {},
  compact = false,
  onClose,
  uploadedFile = null,
  documentFile = null,
  onUpload,
  error,
}) => {
  const [documentPreviewUrl, setDocumentPreviewUrl] = useState(null);

  useEffect(() => {
    if (!documentFile) {
      setDocumentPreviewUrl(null);
      return undefined;
    }

    const previewUrl = URL.createObjectURL(documentFile);
    setDocumentPreviewUrl(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [documentFile]);

  return (
    <aside
      className={`verification-preview-panel rounded-2xl bg-[#fafafa] ${
        compact ? "p-4" : "p-5 sm:p-6"
      }`}
    >
      <div className="flex items-center justify-between border-b border-[#ececec] pb-4">
        <span className="text-sm text-[#424648]">Preview</span>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="text-[#787d80]"
          >
            ✕
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-6 pt-5 text-xs">
        {[
          ["First Name", profile.firstName || "Marvellous"],
          ["Last Name", profile.lastName || "Oluwaseun"],
          ["Phone Number", profile.phone || "+2349066760056"],
          ["Date of birth", profile.dateOfBirth || "July 09 2002"],
          ["Residential Address", profile.address || "No 2 Aremu olatunbosun"],
          ["Nationality", profile.nationality || "Nigerian"],
        ].map(([label, value]) => (
          <div key={label} className="min-w-0">
            <p className="text-[#44484a]">{label}</p>
            <p className="mt-1 truncate text-[#85898b]">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        {documentPreviewUrl && documentFile?.type === "application/pdf" ? (
          <iframe
            src={documentPreviewUrl}
            title={`Preview of ${documentFile.name}`}
            className="h-48 w-full rounded-lg border border-[#e5e5df] bg-white"
          />
        ) : documentPreviewUrl && documentFile?.type.startsWith("image/") ? (
          <img
            src={documentPreviewUrl}
            alt={`Preview of ${documentFile.name}`}
            className="max-h-48 w-full rounded-lg border border-[#e5e5df] bg-white object-contain"
          />
        ) : (
          <div className="flex gap-2 overflow-hidden">
            <div className="verification-document-card verification-document-valid flex h-16 w-24 shrink-0 items-center justify-center rounded-lg border border-[#dcecef] bg-[#e9f5ee] text-[9px] font-semibold text-[#43876a]">
              {uploadedFile ? "ID ATTACHED" : "NIGERIA ID"}
            </div>

            <div className="verification-document-card flex h-16 w-24 shrink-0 items-center justify-center rounded-lg border border-[#e5e5df] bg-[#f3f1e7] text-[9px] text-[#67675d]">
              IDENTITY CARD
            </div>
          </div>
        )}
      </div>

      {onUpload && (
        <div className="mt-4">
          <input
            id="verification-id-document"
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            onChange={(event) => {
              onUpload(event.target.files?.[0]);
              event.target.value = "";
            }}
            aria-describedby={error ? "verification-id-document-error" : undefined}
            className="peer sr-only"
          />
          <label
            htmlFor="verification-id-document"
            className="inline-flex cursor-pointer rounded-full border border-[#0879aa] px-4 py-2 text-xs font-semibold text-[#0879aa] transition hover:bg-[#eef8fc] peer-focus-visible:ring-2 peer-focus-visible:ring-[#0879aa]"
          >
            {uploadedFile ? "Replace identity document" : "Upload identity document"}
          </label>
          {uploadedFile && (
            <p className="mt-2 break-all text-[10px] text-[#85898b]">
              Selected: {uploadedFile}
            </p>
          )}
          {error && (
            <p
              id="verification-id-document-error"
              role="alert"
              className="mt-2 text-[10px] text-rose-500"
            >
              {error}
            </p>
          )}
          <p className="mt-1 text-[10px] text-[#85898b]">
            JPG, PNG, WebP, or PDF up to 5 MB.
          </p>
        </div>
      )}
    </aside>
  );
};

export default VerificationPreview;