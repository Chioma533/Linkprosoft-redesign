import { ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const PublicProfileTopbar = () => {
  const navigate = useNavigate();

  return (
    <header className="border-b border-[#e9e9e9] bg-[#fafafa]">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-4 px-4 sm:px-7 lg:px-0">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate(-1)} aria-label="Go back" className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e6f3f8] text-[#263946] hover:bg-[#d8edf5]">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <Link to="/" className="text-lg font-semibold tracking-tight text-[#171717]">Linkprosoft</Link>
        </div>
        <Link to="/login" className="rounded-full border border-[#016EA6] px-4 py-2 text-xs font-bold text-[#016EA6] transition hover:bg-[#e6f3f8]">Sign in</Link>
      </div>
    </header>
  );
};

export default PublicProfileTopbar;
