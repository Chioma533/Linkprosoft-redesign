const VerificationPreview = ({ profile, compact = false, onClose }) => {
  return (
    <aside
      className={`rounded-2xl bg-[#fafafa] ${
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
          ["First Name", profile.firstName],
          ["Last Name", profile.lastName],
          ["Phone Number", profile.phone],
          ["Date of birth", profile.dateOfBirth],
          ["Residential Address", profile.address],
          ["Nationality", profile.nationality],
        ].map(([label, value]) => (
          <div key={label} className="min-w-0">
            <p className="text-[#44484a]">{label}</p>
            <p className="mt-1 truncate text-[#85898b]">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-2 overflow-hidden">
        <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg border border-[#dcecef] bg-[#e9f5ee] text-[9px] font-semibold text-[#43876a]">
          NIGERIA ID
        </div>

        <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg border border-[#e5e5df] bg-[#f3f1e7] text-[9px] text-[#67675d]">
          IDENTITY CARD
        </div>
      </div>
    </aside>
  );
};

export default VerificationPreview;