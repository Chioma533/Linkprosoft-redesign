import { FiStar } from "react-icons/fi";

const TrendingProfessionalCard = ({ professional, onViewProfile, onMessage }) => {
  const name =
    professional.fullName ||
    professional.full_name ||
    professional.name ||
    professional.user?.fullName ||
    "Professional";
  const profession =
    professional.profession ||
    professional.role ||
    professional.skills?.[0]?.name ||
    professional.skills?.[0] ||
    "Professional";
  const rating = Number(
    professional.avgRating ?? professional.rating ?? professional.averageRating ?? 0,
  );
  const avatar =
    professional.avatarUrl ||
    professional.avatar ||
    professional.user?.avatarUrl ||
    professional.user?.avatar ||
    "/professional_avatar.png";
  const bio =
    professional.bio ||
    "Experienced professional delivering quality work and reliable service.";

  return (
    <article className="flex flex-col rounded-2xl border border-gray-100 bg-white p-3 transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
        <img
          src={avatar}
          alt={`${name}, ${profession}`}
          className="h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = "/professional_avatar.png";
          }}
        />
        <span className="absolute left-2 top-2 rounded-full bg-[#016EA6] px-2 py-1 text-[10px] font-semibold leading-none text-white">
          Top Rated
        </span>
        <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/45 px-2 py-1 text-[10px] font-semibold text-white">
          <FiStar className="h-3 w-3 fill-amber-300 text-amber-300" />
          {rating.toFixed(1)}
        </span>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-3 pb-3 pt-8">
          <h2 className="truncate text-sm font-semibold text-white">{name}</h2>
        </div>
      </div>

      <p className="mt-2 truncate text-[11px] font-medium text-[#016EA6]">
        {profession}
        {professional.experience ? ` · ${professional.experience}` : ""}
      </p>
      <p className="mt-1 line-clamp-3 min-h-[3.75rem] text-xs leading-5 text-gray-600">
        {bio}
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onViewProfile}
          className="rounded-full bg-[#016EA6] px-3 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-[#015a8a]"
        >
          View Profile
        </button>
        <button
          type="button"
          onClick={onMessage}
          className="rounded-full border border-gray-200 px-3 py-2 text-[11px] font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Send a message
        </button>
      </div>
    </article>
  );
};

export default TrendingProfessionalCard;
