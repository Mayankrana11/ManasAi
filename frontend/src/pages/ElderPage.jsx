import React, { useState } from "react";
import {
  ArrowLeft,
  PhoneCall,
  ChevronRight,
  User,
  Bell,
  Coffee,
  Footprints,
  HandHelping,
  MessageSquare,
  Utensils,
  Zap,
  Watch,
  AlertCircle,
  Plus,
  X,
  Edit3,
  Trash2,
} from "lucide-react";

export default function ElderPage({ setPage }) {
  const watchConnected = false;

  const [contacts, setContacts] = useState([
    { id: 1, name: "Rahul", rel: "Son", phone: "+91 98765 43210" },
    { id: 2, name: "Anjali", rel: "Daughter", phone: "+91 98765 43211" },
    { id: 3, name: "Dr. Aman", rel: "Doctor", phone: "+91 98765 43212" },
  ]);

  const [showManager, setShowManager] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  const supportActions = [
    { id: "water", icon: <Coffee />, label: "Request Water", color: "bg-blue-50 text-blue-600" },
    { id: "walk", icon: <Footprints />, label: "Go for Walk", color: "bg-orange-50 text-orange-600" },
    { id: "food", icon: <Utensils />, label: "Need Food", color: "bg-green-50 text-green-600" },
    { id: "washroom", icon: <Zap />, label: "Washroom", color: "bg-yellow-50 text-yellow-600" },
    { id: "help", icon: <HandHelping />, label: "Need Help", color: "bg-purple-50 text-purple-600" },
    { id: "reach", icon: <MessageSquare />, label: "Reach Out", color: "bg-slate-900 text-white" },
  ];

  const saveContact = () => {
    if (!editingContact.name || !editingContact.phone) return;

    setContacts((prev) => {
      const exists = prev.find((c) => c.id === editingContact.id);
      if (exists) {
        return prev.map((c) =>
          c.id === editingContact.id ? editingContact : c
        );
      }
      return [...prev, { ...editingContact, id: Date.now() }];
    });

    setEditingContact(null);
  };

  const deleteContact = (id) => {
    const ok = window.confirm("Delete this contact?");
    if (!ok) return;

    setContacts((prev) => prev.filter((c) => c.id !== id));
    setEditingContact(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-[#FDFCFB] min-h-screen font-sans">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setPage("AppDesktop")}
            className="p-4 bg-white rounded-2xl shadow-sm border"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <p className="text-green-600 font-black text-[10px] uppercase italic">
              Care Active
            </p>
            <h1 className="text-4xl font-black">Elder Support</h1>
          </div>
        </div>
        <button className="p-4 bg-white rounded-2xl shadow-sm text-slate-400">
          <Bell size={24} />
        </button>
      </header>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-14">
        {supportActions.map((a) => (
          <button
            key={a.id}
            className={`${a.color} p-6 rounded-[32px] border shadow-sm flex flex-col items-center`}
          >
            {a.icon}
            <span className="text-[11px] font-black uppercase mt-2">
              {a.label}
            </span>
          </button>
        ))}
      </div>

      {/* LIVE VITALS */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black border-l-8 border-blue-600 pl-4 uppercase">
          Live Vitals
        </h2>
        <button
          onClick={() => setPage("MonitorPage")}
          className="text-blue-600 font-bold text-sm flex items-center gap-1"
        >
          Detailed View <ChevronRight size={16} />
        </button>
      </div>

      {!watchConnected && (
        <div className="bg-white p-10 rounded-[40px] border border-dashed text-center mb-14">
          <Watch size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-black">Smartwatch Not Connected</h3>
          <p className="text-slate-500 mt-2">
            Connect a supported smartwatch to enable live vitals.
          </p>
          <div className="mt-4 text-sm text-amber-600 flex justify-center gap-2">
            <AlertCircle size={16} /> No vitals available
          </div>
        </div>
      )}

      {/* FAMILY CONTACTS HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black border-l-8 border-red-500 pl-4 uppercase">
          Family Contacts
        </h2>
        <button
          onClick={() => setShowManager(true)}
          className="flex items-center gap-2 text-sm font-bold text-blue-600"
        >
          <Edit3 size={16} /> Manage Contacts
        </button>
      </div>

      {/* CONTACT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-20">
        {contacts.map((c) => (
          <a
            key={c.id}
            href={`tel:${c.phone}`}
            className="bg-white p-6 rounded-[32px] border shadow-sm flex justify-between"
          >
            <div className="flex gap-4">
              <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center">
                <User size={26} />
              </div>
              <div>
                <p className="font-black">{c.name}</p>
                <p className="text-xs text-slate-400 uppercase">{c.rel}</p>
              </div>
            </div>
            <div className="bg-green-50 p-3 rounded-xl text-green-600">
              <PhoneCall size={20} />
            </div>
          </a>
        ))}
      </div>

      {/* CONTACT MANAGER PANEL */}
      {showManager && (
        <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
          <div className="w-[420px] bg-white h-full p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black">Manage Contacts</h3>
              <button onClick={() => setShowManager(false)}>
                <X />
              </button>
            </div>

            {contacts.map((c) => (
              <button
                key={c.id}
                onClick={() => setEditingContact(c)}
                className="w-full text-left p-4 border rounded-xl mb-3 hover:bg-slate-50"
              >
                <p className="font-bold">{c.name}</p>
                <p className="text-xs text-slate-500">
                  {c.rel} • {c.phone}
                </p>
              </button>
            ))}

            <button
              onClick={() =>
                setEditingContact({ name: "", rel: "", phone: "" })
              }
              className="mt-4 flex items-center gap-2 text-blue-600 font-bold"
            >
              <Plus size={18} /> Add New Contact
            </button>

            {editingContact && (
              <div className="mt-6 space-y-3">
                <input
                  placeholder="Name"
                  className="w-full border p-2 rounded"
                  value={editingContact.name}
                  onChange={(e) =>
                    setEditingContact({
                      ...editingContact,
                      name: e.target.value,
                    })
                  }
                />
                <input
                  placeholder="Relation"
                  className="w-full border p-2 rounded"
                  value={editingContact.rel}
                  onChange={(e) =>
                    setEditingContact({
                      ...editingContact,
                      rel: e.target.value,
                    })
                  }
                />
                <input
                  placeholder="Phone"
                  className="w-full border p-2 rounded"
                  value={editingContact.phone}
                  onChange={(e) =>
                    setEditingContact({
                      ...editingContact,
                      phone: e.target.value,
                    })
                  }
                />

                <button
                  onClick={saveContact}
                  className="w-full bg-blue-600 text-white py-2 rounded font-bold"
                >
                  Save Contact
                </button>

                {editingContact.id && (
                  <button
                    onClick={() => deleteContact(editingContact.id)}
                    className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2 rounded font-bold border border-red-100"
                  >
                    <Trash2 size={16} /> Delete Contact
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
