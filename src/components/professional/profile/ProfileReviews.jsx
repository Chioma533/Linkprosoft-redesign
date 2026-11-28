import React from "react";
import { Star } from "lucide-react";

const getRating = (review) => {
  const value = Number(review?.stars ?? review?.rating);
  return Number.isFinite(value) ? Math.min(5, Math.max(0, value)) : null;
};

const ProfileReviews = ({ reviews }) => (
  <section className="space-y-4 rounded-3xl border border-gray-100/50 bg-white p-6 shadow-xs">
    <h3 className="text-sm font-bold text-gray-900">Client Reviews</h3>
    {reviews.length ? (
      <div className="divide-y divide-gray-50">
        {reviews.map((review, index) => {
          const author = review.author || review.reviewer?.fullName || review.user?.fullName || "";
          const date = review.date || review.createdAt || review.created_at;
          const rating = getRating(review);
          const reviewText = review.text || review.comment || review.content;
          return (
            <article key={review.id || index} className={`${index ? "pt-4" : ""} space-y-2 pb-4 last:pb-0`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[10px] font-bold text-[#016EA6]">
                    {author ? author.slice(0, 2).toUpperCase() : "—"}
                  </div>
                  <div className="min-w-0">
                    <h4 className="truncate text-[10px] font-bold leading-tight text-gray-800">{author || "Reviewer"}</h4>
                    {date ? <time className="text-[8px] leading-none text-gray-400">{date}</time> : null}
                  </div>
                </div>
                {rating !== null ? (
                  <div className="flex shrink-0 gap-0.5 text-amber-500" aria-label={`Rated ${rating} out of 5`}>
                    {Array.from({ length: Math.round(rating) }, (_, starIndex) => <Star key={starIndex} className="h-3 w-3 fill-current" />)}
                  </div>
                ) : null}
              </div>
              {reviewText ? <p className="text-[10px] font-normal italic leading-relaxed text-gray-500">“{reviewText}”</p> : null}
            </article>
          );
        })}
      </div>
    ) : (
      <div className="rounded-2xl border border-dashed border-gray-100 bg-gray-50/50 py-10 text-center">
        <Star className="mx-auto mb-1.5 h-6 w-6 text-amber-400" />
        <p className="text-xs font-bold text-gray-800">No Reviews Yet</p>
        <p className="mt-0.5 text-[10px] text-gray-400">Reviews from completed jobs will appear here.</p>
      </div>
    )}
  </section>
);

export default ProfileReviews;
