import { ArrowRight } from "lucide-react";

const VerificationCard = ({
  icon: Icon,
  title,
  description,
  duration,
  onStart,
}) => {
  return (
    <article className="flex min-h-[250px] flex-col rounded-2xl border border-[#e7e8e8] p-5">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eef8fc] text-[#0879aa]">
        <Icon size={24} />
      </div>

      <span className="mt-7 w-fit rounded-md bg-[#eaf3f6] px-3 py-1 text-[10px] text-[#555b5e]">
        Duration: {duration}
      </span>

      <h2 className="mt-4 text-base">{title}</h2>

      <p className="mt-1 text-xs leading-relaxed text-[#85898b]">
        {description}
      </p>

      <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-xs text-[#85898b]">
        <button type="button" className="whitespace-nowrap">
          Learn more <ArrowRight size={14} className="ml-1 inline" />
        </button>

        <button
          type="button"
          onClick={onStart}
          className="whitespace-nowrap rounded-full bg-[#0879aa] px-4 py-2 text-[10px] text-white hover:bg-[#076b97]"
        >
          Start Verification
        </button>
      </div>
    </article>
  );
};

export default VerificationCard;
