import VerificationHeader from "../../../components/verification/VerificationHeader";
import VerificationField from "../../../components/verification/VerificationField";
import VerificationPreview from "../../../components/verification/VerificationPreview";
import VerificationActionBar from "../../../components/verification/VerificationActionBar";
import IdentityIllustration from "../../../assets/images/identity-verification_illustration.png";

const IdentityVerificationStep = ({
  profile,
  errors,
  updateProfile,
  idDocumentFile,
  uploadedFile,
  handleIdentityUpload,
  isLoading,
  onBack,
  onContinue,
}) => (
  <>
    <VerificationHeader
      title="Identity Verification."
      description="Get your details verified to create a trusted profile and start reaching to clients"
      image={IdentityIllustration}
    />
    <div className="verification-panel mt-6 grid gap-6 rounded-2xl border border-[#e7e8e8] p-4 sm:grid-cols-[1.25fr_.75fr] sm:p-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <VerificationField label="First Name" placeholder="Enter name" value={profile.firstName || ""} onChange={(event) => updateProfile("firstName", event.target.value)} error={errors.firstName} />
        <VerificationField label="Last Name" placeholder="Enter name" value={profile.lastName || ""} onChange={(event) => updateProfile("lastName", event.target.value)} error={errors.lastName} />
        <VerificationField label="Phone Number" placeholder="(+234)" value={profile.phone || ""} onChange={(event) => updateProfile("phone", event.target.value)} error={errors.phone} />
        <VerificationField
          label="Date of birth"
          placeholder="DD/MM/YY"
          maxLength={8}
          inputMode="numeric"
          value={profile.dateOfBirth || ""}
          onChange={(event) => {
            const digits = event.target.value.replace(/\D/g, "").slice(0, 6);
            let formatted = digits;
            if (digits.length > 4) formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
            else if (digits.length > 2) formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
            updateProfile("dateOfBirth", formatted);
          }}
          error={errors.dateOfBirth}
        />
        <VerificationField label="Residential Address" placeholder="Enter address" value={profile.address || ""} onChange={(event) => updateProfile("address", event.target.value)} error={errors.address} />
        <VerificationField label="Nationality" placeholder="Select nationality" value={profile.nationality || ""} onChange={(event) => updateProfile("nationality", event.target.value)} error={errors.nationality} />
      </div>
      <VerificationPreview profile={profile} documentFile={idDocumentFile} onUpload={handleIdentityUpload} uploadedFile={uploadedFile} error={errors.idDocument} />
    </div>
    <VerificationActionBar onBack={onBack} onContinue={onContinue} isLoading={isLoading} />
  </>
);

export default IdentityVerificationStep;
