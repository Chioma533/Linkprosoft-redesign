import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import ChatAvatar from "./ChatAvatar";

const initials = (name = "") => name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

const StartConversationModal = ({ contacts, loading, onClose, onSelect }) => {
  const [query, setQuery] = useState("");
  const filteredContacts = useMemo(() => contacts.filter((contact) =>
    `${contact.fullName} ${contact.professionalType ?? ""}`.toLowerCase().includes(query.toLowerCase())), [contacts, query]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" role="dialog" aria-modal="true" aria-label="Start a conversation">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <div className="flex items-center justify-between gap-4">
          <div><h2 className="text-base font-bold text-gray-900">New conversation</h2><p className="mt-1 text-xs text-gray-500">Choose an approved contact to message directly.</p></div>
          <button onClick={onClose} className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"><X className="h-4 w-4" /></button>
        </div>
        <label className="relative mt-4 block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search approved contacts"
            className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#016EA6] focus:ring-2 focus:ring-[#016EA6]/10" />
        </label>
        <div className="mt-4 max-h-80 space-y-1 overflow-y-auto">
          {loading && <p className="py-8 text-center text-sm text-gray-400">Loading contacts…</p>}
          {!loading && filteredContacts.length === 0 && <p className="py-8 text-center text-sm text-gray-400">No approved contacts found.</p>}
          {filteredContacts.map((contact, index) => <button key={contact.id} onClick={() => onSelect(contact)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-[#EBF3FA]">
            <ChatAvatar initials={initials(contact.fullName)} colorIdx={index} />
            <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-gray-800">{contact.fullName}</span><span className="block truncate text-xs text-gray-400">{contact.professionalType || contact.role}</span></span>
          </button>)}
        </div>
      </div>
    </div>
  );
};

export default StartConversationModal;
