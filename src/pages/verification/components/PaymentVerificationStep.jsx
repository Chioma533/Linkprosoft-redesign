import VerificationHeader from "../../../components/verification/VerificationHeader";
import VerificationField from "../../../components/verification/VerificationField";
import VerificationPreview from "../../../components/verification/VerificationPreview";
import VerificationActionBar from "../../../components/verification/VerificationActionBar";
import PaymentIllustration from "../../../assets/images/payment-verification_illustration.png";

const PaymentVerificationStep = ({
  profile,
  errors,
  banks,
  bankError,
  uploadedFile,
  updateProfile,
  resolveBankAccount,
  isLoading,
  onBack,
  onContinue,
}) => (
  <>
    <VerificationHeader
      title="Payment Setup & Payout Verification."
      description="Securely link your verified bank details for automated escrow releases"
      image={PaymentIllustration}
    />
    <div className="verification-panel mt-6 grid gap-6 rounded-2xl border border-[#e7e8e8] p-4 sm:grid-cols-[1.25fr_.75fr] sm:p-6">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Commercial Bank</label>
          <select
            value={profile.bankCode || ""}
            onChange={(event) => {
              const code = event.target.value;
              const bank = banks.find((item) => item.code === code);
              updateProfile("bankCode", code);
              updateProfile("bankName", bank?.name || "");
            }}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-xs outline-none focus:border-[#0879aa]"
          >
            <option value="">Select Financial Institution</option>
            {banks.map((bank) => (
              <option key={bank.code} value={bank.code}>{bank.name}</option>
            ))}
          </select>
          {errors.bankName && <p className="text-[10px] text-rose-500 mt-1">{errors.bankName}</p>}
          {bankError && <p className="text-[10px] text-rose-500 mt-1">{bankError}</p>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <VerificationField label="Account Number (10-Digit NUBAN)" placeholder="0123456789" value={profile.accountNumber || ""} onChange={(event) => updateProfile("accountNumber", event.target.value)} error={errors.accountNumber} />
          <VerificationField label="Resolved Account Name" placeholder="Account Holder Name" value={profile.accountName || profile.account_name || ""} disabled onChange={() => {}} error={errors.accountName} />
          <VerificationField label="Set payment password" optional type="password" autoComplete="new-password" placeholder="Enter password" value={profile.paymentPassword || ""} onChange={(event) => updateProfile("paymentPassword", event.target.value)} />
        </div>
        <div className="flex justify-end">
          <button type="button" onClick={() => resolveBankAccount(profile.bankCode, profile.accountNumber)} className="px-4 py-2 rounded-xl text-xs font-bold bg-[#eef8fc] text-[#0879aa] hover:bg-sky-100 transition cursor-pointer">
            Verify Account Number
          </button>
        </div>
      </div>
      <VerificationPreview profile={profile} compact uploadedFile={uploadedFile} />
    </div>
    <VerificationActionBar onBack={onBack} onContinue={onContinue} isLoading={isLoading} />
  </>
);

export default PaymentVerificationStep;
