import VerificationHeader from "../../../components/verification/VerificationHeader";
import VerificationActionBar from "../../../components/verification/VerificationActionBar";
import PreviewIllustration from "../../../assets/images/preview-verification_illustration.png";

const VerificationReviewStep = ({ profile, isLoading, onBack, onContinue }) => (
  <>
    <VerificationHeader
      title="Review & Final Confirmation"
      description="Double-check your submitted dossier before committing to platform compliance review"
      image={PreviewIllustration}
    />
    <div className="mt-6 rounded-2xl border border-gray-200 p-6 bg-white space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="text-xs font-bold text-gray-400 uppercase">Identity</h4>
          <p className="text-sm font-bold text-gray-800 mt-1">{profile.firstName} {profile.lastName}</p>
          <p className="text-xs text-gray-500">{profile.phone}</p>
          <p className="text-xs text-gray-500">{profile.address}</p>
        </div>
        <div>
          <h4 className="text-xs font-bold text-gray-400 uppercase">Trade & Discipline</h4>
          <p className="text-sm font-bold text-gray-800 mt-1">{profile.profession || "N/A"}</p>
          <p className="text-xs text-gray-500">{profile.category}</p>
          <p className="text-xs text-gray-500">{profile.yearsOfExperience} years experience</p>
        </div>
        <div>
          <h4 className="text-xs font-bold text-gray-400 uppercase">Payout Bank</h4>
          <p className="text-sm font-bold text-gray-800 mt-1">{profile.bankName || "N/A"}</p>
          <p className="text-xs text-gray-500">{profile.accountNumber}</p>
          <p className="text-xs text-emerald-600 font-semibold">{profile.accountName}</p>
        </div>
      </div>
    </div>
    <VerificationActionBar onBack={onBack} onContinue={onContinue} isLoading={isLoading} backLabel="Go back" continueLabel="Confirm & Submit Dossier" />
  </>
);

export default VerificationReviewStep;
