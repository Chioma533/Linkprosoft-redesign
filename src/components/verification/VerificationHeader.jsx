const VerificationHeader = ({ title, description, image }) => (
  <header className="flex items-start justify-between gap-4">
    <div>
      <h1 className="text-[clamp(1.5rem,3vw,2rem)] leading-tight text-[#15191b]">
        {title}
      </h1>

      <p className="mt-1 max-w-140 text-sm leading-relaxed text-[#777b7d]">
        {description}
      </p>
    </div>

    <img
      src={image}
      alt=""
      className="hidden shrink-0 text-[#0879aa] sm:block"
    />
  </header>
);

export default VerificationHeader;
