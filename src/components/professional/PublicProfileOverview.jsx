import { Award, BriefcaseBusiness, ChevronDown, Star } from "lucide-react";

const getSkillName = (skill) => skill?.name || skill?.skill?.name;
const getImageUrl = (item) => item?.imageUrl || item?.image_url;

const PublicProfileOverview = ({ profile, showDetails, onToggleDetails }) => {
  const skills = (profile.skills || []).map(getSkillName).filter(Boolean);
  const certifications = profile.certifications || [];
  const portfolioItems = profile.portfolioItems || profile.portfolio || [];
  const reviews = profile.reviews || [];
  const hasDetails = portfolioItems.length > 0 || reviews.length > 0;
  const rating = Number(profile.avgRating ?? profile.avg_rating);

  return (
    <>
      {profile.bio && (
        <section className="mx-5 rounded-[22px] bg-[#f8f8f8] px-5 py-5 sm:mx-0" aria-labelledby="profile-about">
          <h2 id="profile-about" className="text-base font-medium text-[#171717]">About</h2>
          <p className="mt-2 whitespace-pre-line text-base leading-[1.6] text-[#66615e]">{profile.bio}</p>
        </section>
      )}

      {(skills.length > 0 || certifications.length > 0 || Number.isFinite(rating) || profile.totalReviews > 0) && (
        <div className="mx-5 mt-7 grid gap-6 sm:mx-0 lg:grid-cols-3 lg:gap-8">
          {(Number.isFinite(rating) || profile.totalReviews > 0) && (
            <section className="rounded-[28px] bg-[#f8f8f8] px-6 py-6" aria-labelledby="profile-performance">
              <h2 id="profile-performance" className="text-lg font-medium text-[#171717]">Performance</h2>
              <div className="mt-6 grid grid-cols-2 gap-5">
                {Number.isFinite(rating) && <div className="text-center"><Star className="mx-auto h-8 w-8 fill-[#f4ad30] text-[#f4ad30]" /><p className="mt-2 text-lg font-medium">{rating.toFixed(1)}</p><p className="text-sm text-[#85817e]">Average rating</p></div>}
                {profile.totalReviews > 0 && <div className="text-center"><BriefcaseBusiness className="mx-auto h-8 w-8 text-[#087eb7]" /><p className="mt-2 text-lg font-medium">{profile.totalReviews}</p><p className="text-sm text-[#85817e]">Client reviews</p></div>}
              </div>
            </section>
          )}
          {skills.length > 0 && (
            <section className="rounded-[28px] bg-[#f8f8f8] px-6 py-6" aria-labelledby="profile-skills"><h2 id="profile-skills" className="text-lg font-medium text-[#171717]">Skills and services</h2><ul className="mt-5 flex flex-wrap gap-2">{skills.map((skill) => <li key={skill} className="rounded-full border border-[#e4e2e0] bg-white px-4 py-2 text-sm text-[#66615e]">{skill}</li>)}</ul></section>
          )}
          {certifications.length > 0 && (
            <section className="rounded-[28px] bg-[#f8f8f8] px-6 py-6" aria-labelledby="profile-certifications"><h2 id="profile-certifications" className="text-lg font-medium text-[#171717]">Certifications</h2><ul className="mt-5 space-y-4">{certifications.map((certification, index) => <li key={certification.id || `${certification.title}-${index}`} className="flex gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white"><Award className="h-6 w-6 text-[#087eb7]" /></span><span><span className="block text-sm text-[#171717]">{certification.title}</span>{certification.issuer && <span className="block text-sm text-[#85817e]">{certification.issuer}</span>}</span></li>)}</ul></section>
          )}
        </div>
      )}

      {showDetails && hasDetails && <div className="mx-5 mt-8 grid gap-6 sm:mx-0 lg:grid-cols-2">
        {portfolioItems.length > 0 && <section className="rounded-[28px] bg-[#f8f8f8] p-6" aria-labelledby="profile-work"><h2 id="profile-work" className="text-lg font-medium text-[#171717]">Portfolio</h2><div className="mt-5 grid grid-cols-2 gap-3">{portfolioItems.map((item, index) => <article key={item.id || index} className="overflow-hidden rounded-2xl bg-white">{getImageUrl(item) && <img src={getImageUrl(item)} alt={item.title || "Portfolio work"} className="aspect-[4/3] w-full object-cover" />}<div className="p-3"><h3 className="text-sm font-medium">{item.title || "Project"}</h3>{item.description && <p className="mt-1 text-xs text-[#77716d]">{item.description}</p>}</div></article>)}</div></section>}
        {reviews.length > 0 && <section className="rounded-[28px] bg-[#f8f8f8] p-6" aria-labelledby="profile-reviews"><h2 id="profile-reviews" className="text-lg font-medium text-[#171717]">Client reviews</h2><div className="mt-5 space-y-4">{reviews.map((review, index) => <blockquote key={review.id || index} className="rounded-2xl bg-white p-4"><div className="flex items-center justify-between"><span className="text-sm font-medium">{review.author || review.reviewerName || "Client"}</span>{Number.isFinite(Number(review.rating)) && <span className="inline-flex items-center gap-1 text-sm text-[#77716d]"><Star className="h-4 w-4 fill-[#f4ad30] text-[#f4ad30]" />{review.rating}</span>}</div>{(review.comment || review.text) && <p className="mt-2 text-sm leading-6 text-[#77716d]">{review.comment || review.text}</p>}</blockquote>)}</div></section>}
      </div>}

      {hasDetails && <div className="relative mx-5 mt-12 flex justify-center border-t border-[#e8e5e3] sm:mx-0"><button type="button" onClick={onToggleDetails} aria-expanded={showDetails} className="absolute -top-[19px] inline-flex h-10 min-w-[190px] items-center justify-center gap-2 rounded-full border border-[#e8e5e3] bg-white px-8 text-sm text-[#777] hover:border-[#087eb7] hover:text-[#087eb7]">{showDetails ? "Show less" : "View details"}<ChevronDown className={`h-4 w-4 transition-transform ${showDetails ? "rotate-180" : ""}`} /></button></div>}
    </>
  );
};

export default PublicProfileOverview;
