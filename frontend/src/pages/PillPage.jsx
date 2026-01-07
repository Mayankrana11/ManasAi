import React, { useState, useMemo } from "react";
import { 
  ArrowLeft, Plus, Pill, FileText, CheckCircle2, 
  ChevronRight, BellRing, Upload, X, Clock, AlertCircle, Calendar,
  Trash2, ChevronDown
} from "lucide-react";

export default function PillPage({ setPage }) {
  // --- State Management ---
  const [meds, setMeds] = useState([
    { id: 1, name: "Metformin", dosage: "500mg", time: "08:00", taken: true, type: "After Food" },
    { id: 2, name: "Atorvastatin", dosage: "10mg", time: "14:00", taken: false, type: "Before Food" },
    { id: 3, name: "Lisinopril", dosage: "5mg", time: "20:00", taken: false, type: "With Water" }
  ]);

  const [reports, setReports] = useState([
    { id: 1, name: "BLOOD TEST REPORT", date: "DEC 20, 2025", lab: "MAX LAB" },
    { id: 2, name: "HEART ECG", date: "NOV 15, 2025", lab: "APOLLO CLINIC" }
  ]);

  // --- UI Logic States ---
  const [showModal, setShowModal] = useState(false);
  const [activeForm, setActiveForm] = useState(null); // 'med' | 'report' | null
  const [viewAllReports, setViewAllReports] = useState(false);
  
  // --- Form Temp States ---
  const [newEntry, setNewEntry] = useState({ name: "", dosage: "", time: "12:00", type: "After Food" });

  // --- Derived State: Find Next Dose ---
  const nextDose = useMemo(() => {
    return meds.find(m => !m.taken) || meds[0];
  }, [meds]);

  // --- Handlers ---
  const togglePill = (id) => {
    setMeds(meds.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
  };

  const deleteMed = (id) => {
    setMeds(meds.filter(m => m.id !== id));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (activeForm === 'med') {
      const med = { ...newEntry, id: Date.now(), taken: false };
      setMeds(prev => [...prev, med].sort((a, b) => a.time.localeCompare(b.time)));
    } else {
      const report = { 
        id: Date.now(), 
        name: newEntry.name.toUpperCase(), 
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase(),
        lab: newEntry.dosage.toUpperCase() || "GENERAL LAB"
      };
      setReports([report, ...reports]);
    }
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setActiveForm(null);
    setNewEntry({ name: "", dosage: "", time: "12:00", type: "After Food" });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 bg-[#FDFCFB] min-h-screen font-sans text-slate-900 selection:bg-blue-100">
      
      {/* 1. Enhanced Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setPage("ElderPage")} 
            className="group p-4 bg-white rounded-3xl shadow-sm border border-slate-100 hover:border-blue-200 transition-all active:scale-90"
          >
            <ArrowLeft size={24} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] italic">Active Monitoring</p>
            </div>
            <h1 className="text-4xl font-black tracking-tight leading-none">Pills & Reports</h1>
          </div>
        </div>
        
        <button 
          onClick={() => setShowModal(true)}
          className="group flex items-center gap-3 px-8 py-5 bg-slate-900 text-white rounded-[28px] font-black shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all active:scale-95"
        >
          <div className="bg-white/20 p-1 rounded-lg group-hover:rotate-90 transition-transform">
            <Plus size={20} />
          </div>
          ADD RECORD
        </button>
      </header>

      {/* 2. Dynamic Reminder Banner */}
      <div className="relative overflow-hidden bg-white border-2 border-orange-100 p-8 rounded-[48px] mb-12 flex flex-col md:flex-row items-center justify-between group shadow-sm">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
        
        <div className="flex items-center gap-8 relative z-10">
          <div className="bg-orange-500 p-6 rounded-[24px] text-white shadow-lg shadow-orange-200">
            <BellRing size={36} className={nextDose?.taken ? "" : "animate-bounce"} />
          </div>
          <div>
            <p className="text-[11px] font-black text-orange-600 uppercase tracking-widest mb-1 italic">
              {nextDose?.taken ? "All doses completed" : "Next Pending Dose"}
            </p>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase">
              {nextDose?.name || "No Meds Found"} — <span className="text-orange-500">{nextDose?.dosage}</span>
            </h2>
            <div className="flex items-center gap-4 mt-1">
              <span className="flex items-center gap-1 text-slate-400 font-bold text-sm">
                <Clock size={14} /> Scheduled: {nextDose?.time}
              </span>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-[10px] font-black uppercase">
                {nextDose?.type}
              </span>
            </div>
          </div>
        </div>
        <button className="relative z-10 mt-6 md:mt-0 bg-slate-800 text-white px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all active:scale-95 shadow-lg">
          Snooze 15m
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* 3. Daily Schedule List */}
        <div className="lg:col-span-7">
          <div className="flex items-center justify-between mb-8 px-4">
            <h2 className="text-2xl font-black text-slate-800 tracking-tighter border-l-8 border-blue-600 pl-4 uppercase italic">Daily Schedule</h2>
            <span className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest">
              {meds.filter(m => m.taken).length}/{meds.length} Done
            </span>
          </div>

          <div className="space-y-4">
            {meds.map((m) => (
              <div 
                key={m.id} 
                className={`group p-6 rounded-[40px] border-2 transition-all flex items-center justify-between ${m.taken ? 'bg-green-50 border-green-100 opacity-75' : 'bg-white border-slate-50 shadow-sm hover:border-blue-200'}`}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center transition-transform group-hover:scale-105 ${m.taken ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    <Pill size={32} />
                  </div>
                  <div>
                    <h3 className={`text-2xl font-black leading-none mb-2 ${m.taken ? 'text-green-700' : 'text-slate-800'}`}>{m.name}</h3>
                    <div className="flex items-center gap-2">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.dosage}</p>
                       <span className="w-1 h-1 bg-slate-200 rounded-full" />
                       <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{m.type}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right mr-4">
                    <p className="text-[10px] font-black text-slate-300 uppercase leading-none mb-1">Log Time</p>
                    <p className={`text-lg font-black uppercase tracking-tighter ${m.taken ? 'text-green-600' : 'text-slate-600'}`}>{m.time}</p>
                  </div>
                  <button 
                    onClick={() => togglePill(m.id)}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-sm ${m.taken ? 'bg-green-100 text-green-600' : 'bg-white border border-slate-200 text-slate-200 hover:text-blue-600 hover:border-blue-600'}`}
                  >
                    <CheckCircle2 size={32} />
                  </button>
                  <button onClick={() => deleteMed(m.id)} className="p-2 text-slate-200 hover:text-red-500 transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Doctor Reports Vault */}
        <div className="lg:col-span-5">
          <div className="flex items-center justify-between mb-8 px-4">
            <h2 className="text-2xl font-black text-slate-800 tracking-tighter border-l-8 border-purple-600 pl-4 uppercase italic">Doctor Reports</h2>
            <button className="text-purple-600 font-black text-[10px] flex items-center gap-2 uppercase tracking-widest hover:bg-purple-50 p-2 rounded-xl transition-all">
              <Upload size={16} /> Fast Upload
            </button>
          </div>

          <div className={`bg-white p-6 rounded-[48px] border-2 border-slate-50 shadow-sm overflow-hidden`}>
            <div className="space-y-3">
              {(viewAllReports ? reports : reports.slice(0, 2)).map((r) => (
                <div key={r.id} className="p-5 rounded-[32px] bg-slate-50 border border-transparent flex items-center justify-between group hover:bg-white hover:border-purple-100 hover:shadow-xl transition-all cursor-pointer">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-purple-600 shadow-sm group-hover:bg-purple-600 group-hover:text-white transition-all">
                      <FileText size={24} />
                    </div>
                    <div>
                      <p className="font-black text-slate-800 text-md leading-none mb-1 uppercase tracking-tight">{r.name}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{r.date} • {r.lab}</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>

            <button 
              onClick={() => setViewAllReports(!viewAllReports)}
              className="w-full mt-6 py-5 rounded-[28px] bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-purple-50 hover:text-purple-600 transition-all"
            >
              {viewAllReports ? "COLLAPSE ARCHIVES" : `VIEW ALL ARCHIVES (${reports.length})`}
            </button>
          </div>

          <div className="mt-8 bg-slate-900 p-8 rounded-[48px] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                <AlertCircle size={80} />
            </div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <AlertCircle size={20} className="text-yellow-400" />
              <h4 className="font-black uppercase tracking-widest text-[10px] italic">Expert Precaution</h4>
            </div>
            <p className="text-md font-medium leading-relaxed opacity-80 relative z-10">
              Metformin is best taken with meals. If you feel sudden fatigue, please check your blood sugar immediately.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Functional Modal with Step Logic */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl" onClick={closeModal}></div>
          
          <div className="relative bg-white w-full max-w-lg rounded-[56px] p-10 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            <button onClick={closeModal} className="absolute top-10 right-10 p-2 bg-slate-50 rounded-full text-slate-400 hover:text-red-500 transition-colors">
              <X size={24} />
            </button>
            
            {!activeForm ? (
              <div className="pt-4">
                <h2 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tighter italic">Create Entry</h2>
                <p className="text-slate-400 font-bold mb-10 uppercase text-[10px] tracking-[0.3em]">Select record category</p>
                
                <div className="grid grid-cols-1 gap-4">
                  <button 
                    onClick={() => setActiveForm('med')}
                    className="flex items-center gap-6 p-8 rounded-[36px] bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all group"
                  >
                    <div className="bg-white p-4 rounded-2xl group-hover:scale-110 transition-transform"><Pill size={40} /></div>
                    <div className="text-left">
                      <p className="font-black text-xl leading-none mb-1">Medication</p>
                      <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">Add a daily pill schedule</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => setActiveForm('report')}
                    className="flex items-center gap-6 p-8 rounded-[36px] bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white transition-all group"
                  >
                    <div className="bg-white p-4 rounded-2xl group-hover:scale-110 transition-transform"><FileText size={40} /></div>
                    <div className="text-left">
                      <p className="font-black text-xl leading-none mb-1">Health Report</p>
                      <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">Log clinical test results</p>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSave} className="pt-4 space-y-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 mb-1 uppercase italic">New {activeForm === 'med' ? 'Pill' : 'Report'}</h2>
                    <button onClick={() => setActiveForm(null)} className="text-[10px] font-black text-blue-600 uppercase hover:underline">← Change Category</button>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Subject Name</label>
                        <input 
                            required
                            autoFocus
                            className="w-full p-6 bg-slate-50 border-2 border-transparent focus:border-blue-200 focus:bg-white rounded-[24px] outline-none font-bold transition-all" 
                            placeholder={activeForm === 'med' ? "e.g., Vitamin C" : "e.g., Blood Panel"}
                            value={newEntry.name}
                            onChange={(e) => setNewEntry({...newEntry, name: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">{activeForm === 'med' ? 'Dosage' : 'Lab Name'}</label>
                            <input 
                                required
                                className="w-full p-6 bg-slate-50 border-2 border-transparent focus:border-blue-200 focus:bg-white rounded-[24px] outline-none font-bold transition-all" 
                                placeholder={activeForm === 'med' ? "100mg" : "Apollo Lab"}
                                value={newEntry.dosage}
                                onChange={(e) => setNewEntry({...newEntry, dosage: e.target.value})}
                            />
                        </div>
                        {activeForm === 'med' ? (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Schedule Time</label>
                                <input 
                                    type="time"
                                    className="w-full p-6 bg-slate-50 border-2 border-transparent focus:border-blue-200 focus:bg-white rounded-[24px] outline-none font-bold transition-all" 
                                    value={newEntry.time}
                                    onChange={(e) => setNewEntry({...newEntry, time: e.target.value})}
                                />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Upload File</label>
                                <div className="w-full p-6 bg-slate-50 rounded-[24px] flex items-center justify-center text-slate-300 border-2 border-dashed border-slate-200">
                                    <Upload size={20} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="w-full py-6 bg-slate-900 text-white font-black rounded-[28px] uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all active:scale-95"
                >
                    Confirm & Save Entry
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}