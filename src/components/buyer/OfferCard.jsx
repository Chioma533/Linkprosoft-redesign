import React from "react";
import { FiCalendar, FiCheck, FiMapPin, FiStar } from "react-icons/fi";

const OfferCard = ({
  id,
  name = "Jonathan David",
  role = "Carpenter",
  verified = true,
  rating = 5,
  reviewCount = 32,
  summary = "Hello, I can handle this project successfully. I have vast years of experience in creating a professional and beautiful TV console.",
  location = "Can Start Tomorrow",
  delivery = "3 days delivery",
  price = "22,000",
  onViewProfile,
  onAcceptOffer,
}) => {
  const stars = Array.from({ length: rating }, (_, index) => (
    <FiStar key={`${id}-star-${index}`} className="h-3.5 w-3.5 fill-[#f4b942] text-[#f4b942]" />
  ));

  return (
    <article
      id={`offer-card-${id}`}
      className="flex flex-col rounded-2xl border border-[#e5e7eb] bg-[#f9f9f9] p-4 transition-all duration-200 hover:border-[#016EA6]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#486b84] via-[#7da1b8] to-[#dfeaf0] text-[0.65rem] font-bold text-white">
            {(name || "Pro")
              .split(" ")
              .filter(Boolean)
              .map((part) => part[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-[0.96rem] font-semibold text-[#1f1f1f] leading-tight">
                {name}
              </h3>
              {verified && (
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#eaf5ff] text-[#016EA6]">
                  <FiCheck className="h-2.5 w-2.5" />
                </span>
              )}
            </div>
            <p className="text-[0.7rem] text-[#5b5b5b]">{role}</p>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        <div className="flex items-center gap-0.5">{stars}</div>
        <span className="text-[0.68rem] text-[#5f5f5f]">({reviewCount} review)</span>
      </div>

      <p className="mt-3 text-[0.82rem] leading-7 text-[#2d2d2d]">{summary}</p>

      <div className="mt-4 space-y-3 text-[0.76rem] text-[#414141]">
        <div className="flex items-center gap-2">
          <FiCalendar className="h-3.5 w-3.5 text-[#4d4d4d]" />
          <span>{location}</span>
        </div>

        <div className="flex items-center gap-2">
          <FiCheck className="h-3.5 w-3.5 text-[#4d4d4d]" />
          <span>{delivery}</span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#e6e6e6] pt-4">
        <span className="text-[0.76rem] text-[#5c5c5c]">Quoted Price</span>
        <span className="text-[1.08rem] font-bold text-[#1b1b1b]">₦ {price}</span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-35">
        <button
          type="button"
          onClick={onViewProfile}
          className="w-[118px] rounded-full border border-[#dfe9f2] bg-[#edf5fb] px-3 py-2 text-[0.74rem] font-semibold text-[#0d7dc0] transition hover:bg-[#e1f0fb]"
        >
          View Profile
        </button>
        <button
          type="button"
          onClick={onAcceptOffer}
          className="w-[118px] rounded-full bg-[#016EA6] px-3 py-2 text-[0.74rem] font-semibold text-white transition hover:bg-[#015b8e]"
        >
          Accept Offer
        </button>
      </div>
    </article>
  );
};

export default OfferCard;
