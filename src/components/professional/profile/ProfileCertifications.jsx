import React from "react";
import { Award } from "lucide-react";

const ProfileCertifications = ({ certifications, onAdd }) => (
  <section className="space-y-4 rounded-3xl border border-gray-100/50 bg-white p-6 shadow-xs">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-bold text-gray-900">Certifications</h3>
      <button type="button" onClick={onAdd} className="text-xs font-bold text-[#016EA6]">Add</button>
    </div>
    {certifications.length ? (
      <div className="space-y-3">
        {certifications.map((certification, index) => (
          <div key={certification.id || index} className="flex items-start gap-3 rounded-2xl p-2 transition-all hover:bg-gray-50/50">
            <Award className="mt-0.5 h-5 w-5 shrink-0 text-[#016EA6]" />
            <div>
              <h4 className="text-xs font-bold leading-snug text-gray-800">{certification.title || "Certification"}</h4>
              {certification.issuer || certification.body ? <p className="text-[10px] leading-tight text-gray-400">{certification.issuer || certification.body}</p> : null}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="rounded-2xl border border-dashed border-gray-100 bg-gray-50/50 py-6 text-center">
        <p className="text-xs font-medium text-gray-400">No certifications uploaded yet.</p>
      </div>
    )}
  </section>
);

export default ProfileCertifications;
