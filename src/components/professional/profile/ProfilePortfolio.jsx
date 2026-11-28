import React from "react";
import { Briefcase, ExternalLink, Trash2 } from "lucide-react";

const ProfilePortfolio = ({ portfolio, onAdd, onDelete, highlightSection }) => (
  <section
    id="profile-portfolio-section"
    className={`space-y-4 rounded-3xl border border-gray-100/50 bg-white p-6 shadow-xs transition-all duration-300 lg:col-span-2 ${
      highlightSection === "portfolio" ? "border-2 border-[#016EA6] shadow-md ring-4 ring-[#016EA6]/30" : ""
    }`}
  >
    <div className="mb-2 flex items-center justify-between">
      <h3 className="text-sm font-bold text-gray-900">Portfolio &amp; Case Studies</h3>
      <button type="button" onClick={onAdd} className="text-xs font-bold text-[#016EA6]">Add project</button>
    </div>

    {portfolio.length ? (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {portfolio.map((item, index) => (
          <article key={item.id || `${item.title || "portfolio"}-${index}`} className="group relative flex aspect-video flex-col justify-end overflow-hidden rounded-2xl border border-gray-100 bg-slate-100 p-4 shadow-xs">
            {item.imageUrl ? <img src={item.imageUrl} alt={item.title || "Portfolio project"} className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" /> : null}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
            {item.id ? (
              <button
                type="button"
                onClick={() => onDelete(item.id)}
                title="Delete project"
                aria-label={`Delete ${item.title || "portfolio project"}`}
                className="absolute right-2.5 top-2.5 z-30 cursor-pointer rounded-full bg-black/50 p-1.5 text-white/80 opacity-0 transition-all hover:bg-black/70 hover:text-red-400 group-hover:opacity-100"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            ) : null}
            <div className="relative z-20 text-white">
              <span className="text-[9px] font-bold uppercase tracking-wider text-sky-200">{item.category || "Project"}</span>
              <h4 className="mt-0.5 text-xs font-bold leading-snug">{item.title || "Portfolio project"}</h4>
              {item.description ? <p className="mt-1 line-clamp-2 text-[10px] text-white/80">{item.description}</p> : null}
              {item.linkUrl ? (
                <a href={item.linkUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-sky-200 hover:text-white">
                  View project <ExternalLink className="h-3 w-3" />
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-100 bg-gray-50/50 py-12 text-center">
        <Briefcase className="mb-2 h-7 w-7 text-[#016EA6]" />
        <h4 className="text-xs font-bold text-gray-800">Your Portfolio is Empty</h4>
        <p className="mt-0.5 text-[11px] font-medium text-gray-400">Add projects to showcase your work.</p>
      </div>
    )}
  </section>
);

export default ProfilePortfolio;
