import React, { useState } from "react";
import { FiStar, FiBookmark } from "react-icons/fi";

/**
 * ProfessionalCard — matches the Figma design for the "Default Buyer Screen"
 * Shows: avatar, name, role badge, star rating + review count, bio, price, contact button, bookmark icon
 */
const ProfessionalCard = ({
  id,
  name = "Jonathan David",
  role = "Carpenter",
  avatarUrl = "/professional_avatar.png",
  rating = 2.5,
  reviewCount = 32,
  bio = "Skilled carpenter specializing in custom wardrobes, sliding doors, and bespoke storage solutions. Available for on-site consultation this week.",
  pricePerDay = 10000,
  isBookmarked = false,
  isSelected = false,
  onContact,
  onBookmark,
}) => {
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [isContacting, setIsContacting] = useState(false);

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    onBookmark?.(!bookmarked);
  };

  const handleContact = async () => {
    setIsContacting(true);
    await onContact?.();
    setTimeout(() => setIsContacting(false), 1000);
  };

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <FiStar
            key={i}
            className="w-3 h-3 fill-amber-400 text-amber-400"
          />
        );
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(
          <FiStar
            key={i}
            className="w-3 h-3 text-amber-400"
            style={{ clipPath: "inset(0 50% 0 0)", fill: "#fbbf24" }}
          />
        );
      } else {
        stars.push(
          <FiStar
            key={i}
            className="w-3 h-3 text-gray-300"
          />
        );
      }
    }
    return stars;
  };

  return (
    <article
      id={`professional-card-${id}`}
      className="bg-[#f9f9f9] rounded-2xl transition-all duration-300 flex flex-col overflow-hidden group relative border border-transparent hover:border-[#016EA6]"
    >
      {/* Card body */}
      <div className="p-4 sm:p-6 flex flex-col gap-4 flex-1">
        {/* Header row: avatar + name/role + bookmark */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-100 shrink-0 shadow-sm">
              <img
                src={avatarUrl}
                alt={name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML = `<div class="w-full h-full bg-[#016EA6]/10 flex items-center justify-center text-[#016EA6] font-bold text-sm">${name.charAt(0)}</div>`;
                }}
              />
            </div>
            {/* Name + Role */}
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-gray-900 leading-tight truncate">
                {name}
              </h3>
              <span className="text-sm font-medium text-[#016EA6] mt-0.5 block truncate">
                {role}
              </span>
            </div>
          </div>

          {/* Bookmark icon */}
          <button
            id={`bookmark-btn-${id}`}
            onClick={handleBookmark}
            className="p-2 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer shrink-0 mt-0.5"
            title={bookmarked ? "Remove bookmark" : "Bookmark"}
          >
            <FiBookmark
              className={`w-4 h-4 transition-colors ${
                bookmarked
                  ? "fill-[#016EA6] text-[#016EA6]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            />
          </button>
        </div>

        {/* Star rating row */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {renderStars(rating)}
          </div>
          <span className="text-[11px] text-gray-500 font-medium">
            ({reviewCount} review)
          </span>
        </div>

        {/* Bio */}
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1">
          {bio}
        </p>
      </div>
      {/* Footer: price + contact */}
      <div className="px-4 sm:px-6 pb-4 sm:pb-5 flex items-center justify-between border-t border-gray-100 pt-4">
        <div className="flex items-baseline gap-2">
          <span className="text-lg text-gray-900 font-medium">₦</span>
          <span className="text-xl font-bold text-gray-900">{pricePerDay.toLocaleString()}</span>
        </div>
        <button
          id={`contact-btn-${id}`}
          onClick={handleContact}
          disabled={isContacting}
          className="px-4 py-2 bg-[#e6f1f6] hover:bg-[#d5e7ef] text-[#2683b3] text-xs font-semibold rounded-full border border-[#2683b3]/10 transition-all duration-200 cursor-pointer disabled:opacity-70"
        >
          {isContacting ? "..." : "Contact"}
        </button>
      </div>
    </article>
  );
};

export default ProfessionalCard;
