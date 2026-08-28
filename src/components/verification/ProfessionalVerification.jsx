import VerificationField from "./VerificationField";
import VerificationPreview from "./VerificationPreview";
import VerificationActionBar from "./VerificationActionBar";

const categories = ["Home Services", "Design", "Tech", "Events"];

const ProfessionalVerification = ({ onBack, onContinue, profile }) => {
  return (
    <>
      <div className="mt-6 grid gap-6 rounded-2xl border border-[#e7e8e8] p-4 sm:p-6 lg:grid-cols-[1.25fr_.75fr]">
        {/* Form */}
        <div className="min-w-0">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <VerificationField label="Profession" placeholder="e.g carpenter" />

            <VerificationField
              label="Years of experience"
              placeholder="Enter name"
            />

            <VerificationField label="Bio" placeholder="(+234)" />

            <VerificationField label="Category" placeholder="Enter name" />
          </div>

          {/* Categories */}
          <div className="mt-5">
            <p className="text-xs text-[#44484a]">Select Categories</p>

            <div className="mt-3 space-y-3">
              {[0, 1, 2].map((row) => (
                <div key={row} className="flex flex-wrap gap-2">
                  {categories.map((category, index) => (
                    <button
                      key={`${row}-${category}`}
                      type="button"
                      className={`rounded-full border px-4 py-1.5 text-[10px] transition ${
                        index === 0
                          ? "border-[#0879aa] bg-[#eef8fc] text-[#0879aa]"
                          : "border-[#e5e7e8] bg-white text-[#777b7d] hover:border-[#0879aa] hover:text-[#0879aa]"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview */}
        <VerificationPreview profile={profile} compact />
      </div>

      <VerificationActionBar onBack={onBack} onContinue={onContinue} />
    </>
  );
};

export default ProfessionalVerification;
