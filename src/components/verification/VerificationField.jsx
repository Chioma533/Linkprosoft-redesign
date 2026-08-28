const VerificationField = ({ label, optional, ...props }) => {
  return (
    <label className="block text-xs text-[#44484a]">
      <span>
        {label} {optional && <span className="text-[#999d9f]">(Optional)</span>}
      </span>

      <input
        {...props}
        className="mt-2 h-10 w-full rounded-full border border-[#e7e8e8] px-4 text-xs text-[#333] outline-none placeholder:text-[#a5a8aa] focus:border-[#0879aa]"
      />
    </label>
  );
};

export default VerificationField;
