import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import MediaUploader from "../../common/MediaUploader";

const EMPTY_FORM = { title: "", description: "", linkUrl: "", coverMediaId: null };

const ProfilePortfolioModal = ({ isOpen, onClose, onCreate }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) setForm(EMPTY_FORM);
  }, [isOpen]);

  if (!isOpen) return null;

  const updateField = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.coverMediaId) return;
    setIsSaving(true);
    try {
      if (await onCreate(form)) {
        setForm(EMPTY_FORM);
        onClose();
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/40 p-4">
      <form onSubmit={handleSubmit} role="dialog" aria-modal="true" aria-labelledby="portfolio-modal-title" className="my-auto w-full max-w-md space-y-4 rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 id="portfolio-modal-title" className="font-bold text-gray-900">Add portfolio project</h3>
          <button type="button" onClick={onClose} aria-label="Close portfolio modal" className="rounded-full p-1 text-gray-500 hover:bg-gray-100"><X className="h-5 w-5" /></button>
        </div>
        <input required value={form.title} onChange={updateField("title")} placeholder="Project title" className="w-full rounded-xl border p-3 text-sm" />
        <textarea value={form.description} onChange={updateField("description")} placeholder="Brief description" className="w-full rounded-xl border p-3 text-sm" rows={3} />
        <input value={form.linkUrl} onChange={updateField("linkUrl")} placeholder="Project link (optional)" className="w-full rounded-xl border p-3 text-sm" />
        <MediaUploader purpose="portfolio" label="Upload cover image" onUploaded={({ mediaId }) => setForm((current) => ({ ...current, coverMediaId: mediaId }))} />
        <button type="submit" disabled={isSaving || !form.coverMediaId} className="w-full rounded-full bg-[#016EA6] py-3 text-sm font-bold text-white disabled:opacity-50">
          {isSaving ? "Saving..." : "Save project"}
        </button>
      </form>
    </div>
  );
};

export default ProfilePortfolioModal;
