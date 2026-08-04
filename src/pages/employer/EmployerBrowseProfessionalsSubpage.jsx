import React from "react";
import { FiStar, FiCheckCircle, FiSearch, FiMapPin, FiMail } from "react-icons/fi";
import { toast } from "react-hot-toast";

const EmployerBrowseProfessionalsSubpage = () => {
  const professionals = [
    {
      name: "David Jonathan",
      role: "Master Carpenter & Cabinetry Expert",
      avatar: "DJ",
      location: "Lekki, Lagos",
      rating: 5.0,
      reviewCount: 45,
      successRate: 100,
      skills: ["Carpentry", "Installation", "Tv console", "Wardrobe"],
      bio: "Master craftsman with over 8 years experience building high-end custom cabinetry and wardrobes in Lekki residential estates. Guarantees prompt delivery and fine details."
    },
    {
      name: "Marvelous Samuel",
      role: "Certified Plumber & Installer",
      avatar: "MS",
      location: "Ikeja, Lagos",
      rating: 4.9,
      reviewCount: 38,
      successRate: 98,
      skills: ["Plumbing", "Repairs", "Kitchen Sink", "Bath Fitting"],
      bio: "Licensed plumber specialized in high-pressure piping, drain restorations, and luxury kitchen fixtures. Vetted for emergency callouts and residential overhauls."
    },
    {
      name: "Bayo Alao",
      role: "Professional Electrical Diagnostics",
      avatar: "BA",
      location: "Surulere, Lagos",
      rating: 4.8,
      reviewCount: 29,
      successRate: 95,
      skills: ["Electrical", "Wiring", "Diagnostic", "Inverter Setup"],
      bio: "Diagnostic electrician focused on safety audits, smart home automated integrations, and power inverter configurations. Available for building inspections."
    }
  ];

  const handleInvite = (name) => {
    toast.success(`Invitation request sent to ${name}!`);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Welcome Header */}
      <div>
        <h2 className="text-2xl font-normal text-gray-900">Browse Professionals</h2>
        <p className="text-sm text-gray-400 mt-1 font-light">Manage your jobs and payments effortlessly.</p>
      </div>

      {/* Search Filter Row (updated to match Manage Jobs styling) */}
      <div className="rounded-full flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by skill, name or trade..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-[#e9e8e7] rounded-full text-xs outline-none focus:border-[#016EA6] focus:bg-white transition-all duration-200"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <select className="w-full sm:w-44 pl-4 pr-8 py-2.5 bg-gray-50 border border-[#e9e8e7] rounded-full text-xs outline-none cursor-pointer text-gray-500 font-semibold">
            <option>All Locations</option>
            <option>Lekki</option>
            <option>Ikeja</option>
          </select>

          <select className="w-full sm:w-44 pl-4 pr-8 py-2.5 bg-gray-50 border border-[#e9e8e7] rounded-full text-xs outline-none cursor-pointer text-gray-500 font-semibold">
            <option>Sort by: Newest</option>
            <option>Sort by: Oldest</option>
          </select>

          <button className="bg-[#016EA6] hover:bg-[#061EA6] text-white px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer text-center">
            Filter
          </button>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {professionals.map((pro, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
            {/* Header info */}
            <div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#016EA6]/10 text-[#016EA6] flex items-center justify-center font-extrabold text-sm relative">
                  {pro.avatar}
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center" title="Verified Pro">
                    <FiCheckCircle className="w-3 h-3 text-white fill-current" />
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm leading-tight">{pro.name}</h3>
                  <span className="text-[10px] text-gray-400 font-bold">{pro.role}</span>
                </div>
              </div>

              {/* Stats badges */}
              <div className="flex items-center gap-4 mt-4 text-[10px] font-bold text-gray-500">
                <span className="flex items-center gap-1 text-amber-500">
                  <FiStar className="w-3.5 h-3.5 fill-current" />
                  <span>{pro.rating} ({pro.reviewCount} reviews)</span>
                </span>
                <span>•</span>
                <span className="text-emerald-600 font-extrabold">{pro.successRate}% Success</span>
              </div>

              {/* Bio description */}
              <p className="text-xs text-gray-400 mt-4 leading-relaxed line-clamp-3 font-medium">
                {pro.bio}
              </p>

              {/* Skills list */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {pro.skills.map((skill, sIdx) => (
                  <span key={sIdx} className="px-2.5 py-1 bg-slate-50 text-gray-500 rounded-lg text-[9px] font-bold">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-50">
              <button className="flex-1 py-2.5 border border-gray-100 hover:bg-gray-50 text-gray-500 hover:text-gray-900 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                <FiMail className="w-3.5 h-3.5" />
                <span>Message</span>
              </button>
              <button
                onClick={() => handleInvite(pro.name)}
                className="flex-1 py-2.5 bg-[#016EA6] hover:bg-[#061EA6] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm text-center"
              >
                Invite to Project
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployerBrowseProfessionalsSubpage;
