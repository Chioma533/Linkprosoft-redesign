import React from "react";
import { MapPin, Calendar, Edit3, Briefcase, Award, Star, ThumbsUp, ShieldCheck } from "lucide-react";
import StatsCard from "../../components/ui/StatsCard";

const ProfileSubpage = () => {
  const skills = ["Carpentry", "Installation", "Tv console", "Wardrobe", "Chairs", "Tables"];

  const certifications = [
    { title: "Certified Master Carpenter", body: "Guild of Lagos Woodworkers" },
    { title: "Linkprosoft Verified", body: "Identity & Skills Vetted" },
    { title: "Safety Certified", body: "Occupational Health & Safety" }
  ];

  const portfolio = [
    { id: 1, title: "Modern Bathroom Sink", category: "Plumbing" },
    { id: 2, title: "Bespoke TV Console", category: "Carpentry" },
    { id: 3, title: "Custom Bedroom Wardrobe", category: "Carpentry" },
    { id: 4, title: "Living Room Cabinet", category: "Carpentry" }
  ];

  const reviews = [
    {
      author: "Emily Ogwuche",
      date: "6 days ago",
      text: "Jonathan is an absolute pro. He helped fix a door that three other people couldn't get right. His attention to detail is remarkable. Highly recommended!",
      stars: 5
    },
    {
      author: "Emily Ogwuche",
      date: "6 days ago",
      text: "Jonathan is an absolute pro. He helped fix a door that three other people couldn't get right. His attention to detail is remarkable. Highly recommended!",
      stars: 5
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Cover Banner & Profile Card */}
      <div className="bg-white rounded-3xl border border-gray-100/50 shadow-sm overflow-hidden">
        {/* Whale Cover Banner Mock */}
        <div className="h-48 bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-800/20 via-transparent to-transparent" />
        </div>

        {/* Profile Info Container */}
        <div className="px-4 md:px-8 pb-6 md:pb-8 relative">
          {/* Avatar floating */}
          <div className="absolute -top-16 left-4 md:left-8 flex items-end gap-5">
            <div className="w-28 h-28 rounded-full border-4 border-white bg-[#016EA6] text-white flex items-center justify-center font-extrabold text-2xl relative shadow-md">
              SM
              <span className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center" title="100% Job Success">
                <Star className="w-3.5 h-3.5 fill-current text-white" />
              </span>
            </div>
          </div>

          <div className="pt-16 flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">Samuel Marvelous .O</h2>
                <span className="px-2 py-0.5 bg-blue-50 text-[#016EA6] text-[10px] font-bold rounded-lg flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Pro</span>
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 font-semibold">
                A professional Plumber with vast years of experience and proven track records
              </p>
              <div className="flex flex-wrap items-center gap-4 text-[10px] text-gray-400 font-semibold mt-3">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Lekki Lagos</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Member since Jan 2020</span>
                </span>
              </div>
            </div>

            <button className="px-5 py-2.5 bg-sky-50/50 hover:bg-[#016EA6]/10 text-[#016EA6] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer self-start">
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* About Me card */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-gray-900">About me</h3>
        <p className="text-xs text-gray-400 leading-relaxed">
          With over 8 years of dedicated experience in Nigeria's high-end residential market, I specialize in creating bespoke furniture and precision home installations. My work is defined by a commitment to durability and aesthetic excellence. From intricate cabinetry in premium Lagos estates to structural door repairs and elegant wardrobe solutions, I bring a master's touch to every project. I pride myself on punctuality, clear communication, and leaving every workspace cleaner than I found it.
        </p>
      </div>

      {/* Layout Columns: Metrics, Skills, Certifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance indicators */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 mb-2">Performance</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center justify-center p-4 bg-gray-50/50 rounded-2xl border border-gray-100/30 text-center">
              <div className="w-12 h-12 rounded-full border-4 border-emerald-400 flex items-center justify-center font-bold text-xs text-emerald-500">
                100%
              </div>
              <span className="text-[10px] text-gray-400 font-semibold mt-2">Job success</span>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-gray-50/50 rounded-2xl border border-gray-100/30 text-center">
              <div className="w-12 h-12 bg-sky-50 text-[#016EA6] rounded-2xl flex items-center justify-center shrink-0">
                <Briefcase className="w-6 h-6" />
              </div>
              <span className="text-[10px] text-gray-800 font-bold mt-2">186 jobs</span>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-gray-50/50 rounded-2xl border border-gray-100/30 text-center">
              <span className="text-sm font-extrabold text-indigo-500">8 Yrs</span>
              <span className="text-[10px] text-gray-400 font-semibold mt-2">Experience</span>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-gray-50/50 rounded-2xl border border-gray-100/30 text-center">
              <div className="w-12 h-12 rounded-full border-4 border-blue-400 flex items-center justify-center font-bold text-xs text-[#016EA6]">
                78%
              </div>
              <span className="text-[10px] text-gray-400 font-semibold mt-2">Avg Response</span>
            </div>
          </div>
        </div>

        {/* Skills and Services */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900">Skills and Services</h3>
          <div className="grid grid-cols-2 gap-2.5">
            {skills.map((skill, idx) => (
              <span key={idx} className="px-4 py-2 border border-gray-100 bg-gray-50/50 hover:bg-gray-50 rounded-xl text-center text-xs font-semibold text-gray-500 transition-colors">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Certifications list */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900">Certifications</h3>
          <div className="space-y-3">
            {certifications.map((cert, idx) => (
              <div key={idx} className="flex gap-3 items-start hover:bg-gray-50/50 p-2 rounded-xl transition-all">
                <div className="p-2 bg-blue-50 text-[#016EA6] rounded-xl mt-0.5">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800 leading-snug">{cert.title}</h4>
                  <p className="text-[10px] text-gray-400 leading-tight">{cert.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center pt-2">
        <button className="px-6 py-2.5 border border-gray-100 hover:bg-gray-50 text-gray-500 hover:text-gray-900 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer">
          View All Details
        </button>
      </div>

      {/* Portfolio Gallery grid & Reviews section columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gallery */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 mb-2">Portfolio</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {portfolio.map((port) => (
              <div key={port.id} className="group relative rounded-2xl overflow-hidden aspect-video bg-slate-100 border border-gray-100 flex flex-col justify-end p-4">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent z-10 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-20 text-white">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-sky-200">{port.category}</span>
                  <h4 className="text-xs font-bold mt-0.5 leading-snug">{port.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900">Reviews and rating</h3>
          <div className="space-y-4 divide-y divide-gray-50">
            {reviews.map((rev, idx) => (
              <div key={idx} className={`${idx > 0 ? "pt-4" : ""} space-y-2`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center font-bold text-gray-700 text-[10px]">
                      EO
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-800 leading-tight">{rev.author}</h4>
                      <span className="text-[8px] text-gray-400 leading-none">{rev.date}</span>
                    </div>
                  </div>
                  <div className="flex gap-0.5 text-amber-500">
                    {[...Array(rev.stars)].map((_, s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed font-semibold italic">
                  "{rev.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSubpage;
