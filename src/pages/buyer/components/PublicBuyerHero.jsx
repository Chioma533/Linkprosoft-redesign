const PublicBuyerHero = () => (
  <>
    <section id="public-hero-section" className="bg-[#EEF5F9] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-14">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <div className="flex-1 max-w-full sm:max-w-xl">
            <h1 className="text-[1.125rem] font-regular leading-[1.2] tracking-[-0.03em] text-gray-900 sm:text-4xl sm:leading-tight sm:tracking-tight">
              Find The Right Professional
            </h1>
            <p className="mt-0.5 text-[0.75rem] leading-relaxed text-gray-600 sm:mt-2 sm:text-base sm:font-normal">
              Need help with a project? Browse verified professionals.
            </p>
            <div className="-mt-6 flex items-end justify-end gap-2 sm:hidden z-10">
              <div className="w-[43%] z-0" style={{ mixBlendMode: "multiply" }}>
                <img src="/tools_illustration.png" alt="Construction Tools" className="w-full object-contain translate-y-[38px] translate-x-[25px]" />
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center justify-center flex-1 max-w-xs" style={{ mixBlendMode: "multiply" }}>
            <img src="/tools_illustration.png" alt="Professional Tools" className="w-56 sm:w-64 lg:w-72 object-contain" style={{ transform: "rotate(-10deg) translateY(8px)" }} />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#016EA6]/20 to-transparent" />
    </section>
  </>
);

export default PublicBuyerHero;
