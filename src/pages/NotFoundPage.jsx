import { ArrowLeft, House, SearchX } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#f7fafc] px-5 py-16">
      <div className="mx-auto max-w-lg rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm md:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sky-50 text-[#016EA6]">
          <SearchX className="h-8 w-8" />
        </div>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#016EA6]">404 Error</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Page not found</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-500">
          The page you requested does not exist or may have moved.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </button>
          <button
            type="button"
            onClick={() => navigate("/", { replace: true })}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#016EA6] px-5 py-3 text-sm font-semibold text-white"
          >
            <House className="h-4 w-4" />
            Return home
          </button>
        </div>
      </div>
    </main>
  );
};

export default NotFoundPage;
