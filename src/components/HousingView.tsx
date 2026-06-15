import React, { useState } from "react";
import { 
  Home, 
  Users, 
  Clock, 
  MapPin, 
  Scissors, 
  ExternalLink, 
  CheckCircle, 
  AlertTriangle, 
  Plus, 
  Upload, 
  Sparkles,
  Shield,
  Trash2,
  PackageOpen
} from "lucide-react";

interface HousingViewProps {
  userRole: "student" | "parent";
  tasks: any[];
  onToggleTask: (id: string) => void;
  purchases: any[];
  onAddPurchase: (purchase: any) => void;
  documents: any[];
  onAddDocument: (doc: any) => void;
}

export default function HousingView({
  userRole,
  tasks,
  onToggleTask,
  purchases,
  onAddPurchase,
  documents,
  onAddDocument
}: HousingViewProps) {
  // Local form state for new purchases in housing packing list
  const [newPackItem, setNewPackItem] = useState("");
  const [newPackCost, setNewPackCost] = useState("");
  const [newPackOwner, setNewPackOwner] = useState<"student" | "parent" | "both">("both");

  // Local state for uploading custom documents
  const [newDocLabel, setNewDocLabel] = useState("");

  // Roommate agreement checklist items
  const [roommateAgreements, setRoommateAgreements] = useState([
    { id: "ra1", item: "Micro-Fridge (Microwave + Fridge combo)", status: "Completed", notes: "Ordered via Penn Student Services, split cost 50/50" },
    { id: "ra2", item: "Area Rug / Crimson Accent Carpet", status: "Completed", notes: "Roommate bringing 5x7 rug fitting the Single/Double layout" },
    { id: "ra3", item: "Tall Floor Lamp & Desk Light", status: "Pending", notes: "Gabby coordinates warm low-wattage desk lamp" },
    { id: "ra4", item: "Coffee Maker & Mug Rack", status: "Completed", notes: "Roommate bringing Keurig mini format" },
    { id: "ra5", item: "Dyson Cordless vacuum setup", status: "Pending", notes: "Adrian evaluating parent discount purchase options" }
  ]);

  const handleUpdateAgreement = (id: string) => {
    setRoommateAgreements(prev => prev.map(ra => {
      if (ra.id === id) {
        return {
          ...ra,
          status: ra.status === "Completed" ? "Pending" : "Completed"
        };
      }
      return ra;
    }));
  };

  // Filter tasks belonging to housing/dorm
  const housingTasks = tasks.filter(t => t.category === "housing" || t.category === "packing");
  
  // Filter purchases belonging to housing/packing category
  const housingPurchases = purchases.filter(p => p.category === "housing" || p.category === "packing");

  const handleCreatePackItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPackItem) return;
    
    const cost = parseFloat(newPackCost) || 0;
    const newP = {
      id: `p-item-${Date.now()}`,
      name: newPackItem,
      cost,
      category: "packing",
      status: "allocated",
      notes: "Custom packing item added on Housing Page",
      owner: newPackOwner,
      milestoneId: "m4"
    };

    onAddPurchase(newP);
    setNewPackItem("");
    setNewPackCost("");
  };

  const handleUploadDormDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocLabel) return;

    onAddDocument({
      id: `d-doc-${Date.now()}`,
      name: newDocLabel.endsWith(".pdf") ? newDocLabel : `${newDocLabel}.pdf`,
      status: "APPROVED",
      size: "1.1 MB",
      type: "Dorm Layout Plans"
    });

    setNewDocLabel("");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-[#1D1D1F]">
      
      {/* Title Header */}
      <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-3xs">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-gray-100 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#011F5B] rounded-xl flex items-center justify-center text-white font-bold shadow-xs">
              <Home className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#011F5B] text-lg tracking-tight">Housing & Dorm Room Coordinator</h3>
              <p className="text-xs text-gray-500 mt-0.5 font-medium">
                The Quadrangle assigned room space, roommates coordination, and packing check logs.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-gray-500 bg-slate-100 border px-3 py-1.5 rounded-lg shrink-0">
            Dormitory: <strong>The Quad (Ware College House)</strong>
          </span>
        </div>

        {/* Resident Summary Panel */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
          <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3 flex flex-col gap-1">
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">Building & Entrance</span>
            <span className="text-[#011F5B] font-extrabold text-sm flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Ware College House (The Quad)
            </span>
          </div>
          <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3 flex flex-col gap-1">
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">Address Submittal</span>
            <span className="text-slate-700 font-bold text-xs font-mono">3700 Spruce St, Phila, PA 19104</span>
          </div>
          <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3 flex flex-col gap-1">
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">Room Format</span>
            <span className="text-slate-700 font-extrabold text-xs">Twin XL Single (Shared hall bath)</span>
          </div>
          <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3 flex flex-col gap-1">
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">Move-In Slot Booked</span>
            <span className="text-green-700 font-black text-xs flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> August 21, 2026 @ 10:00 AM
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: ROOMMATE & DORM PACKS (8cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* ROOMMATE APPLIANCE CO-SYNCHRONIZATION */}
          <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#011F5B]" />
                <h4 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider">
                  Roommate Co-Sharing Appliance Sync
                </h4>
              </div>
              <span className="text-[9px] bg-green-50 text-green-700 border border-green-200 font-black px-2 py-0.5 rounded-full uppercase">
                Active Coordination Linked
              </span>
            </div>

            <p className="text-xs text-gray-500 mb-4 font-medium leading-relaxed">
              Gabby requested compatibility review to avoid hauling duplicate micro-fridges or carpets. Below is the mutually synchronized list. Click checklist status items to mark as active or resolved.
            </p>

            <div className="space-y-2">
              {roommateAgreements.map((ra) => {
                const isDone = ra.status === "Completed";
                return (
                  <div 
                    key={ra.id}
                    onClick={() => handleUpdateAgreement(ra.id)}
                    className={`p-3.5 border rounded-xl flex items-center justify-between cursor-pointer transition duration-155 ${
                      isDone 
                        ? "bg-green-50/35 border-green-150 hover:bg-green-50/50" 
                        : "bg-white border-gray-150 hover:bg-slate-50/60"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 shrink-0 mt-0.5 ${
                        isDone 
                          ? "bg-green-650 border-green-650 text-white" 
                          : "border-gray-300 text-transparent"
                      }`}>
                        {isDone && <CheckCircle className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <h5 className={`text-xs font-bold ${isDone ? "text-slate-800 line-through" : "text-gray-900"}`}>
                          {ra.item}
                        </h5>
                        <p className="text-[10px] text-gray-500 mt-0.5 font-medium">{ra.notes}</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                      isDone ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800 animate-pulse"
                    }`}>
                      {ra.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DORM ESSENTIAL PACKING HUB & ADDICTIONS */}
          <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <PackageOpen className="w-4 h-4 text-[#011F5B]" />
                <h4 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider">
                  Dorm Room Essentials Packing Tracker
                </h4>
              </div>
              <span className="text-[10px] font-mono text-gray-400 font-black">
                {housingPurchases.length} Items Listed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Add Custom Packing Item */}
              <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 h-fit">
                <h5 className="font-extrabold text-[#011F5B] text-[11px] uppercase tracking-wider mb-2.5 flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> List Packing / Item to Buy
                </h5>
                <form onSubmit={handleCreatePackItem} className="space-y-2.5">
                  <div>
                    <label className="text-[10px] font-extrabold uppercase text-gray-500 block mb-1">Item Title</label>
                    <input 
                      type="text"
                      className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-blue-600 outline-none"
                      placeholder="e.g. Memory foam mattress topper"
                      value={newPackItem}
                      onChange={(e) => setNewPackItem(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-extrabold uppercase text-gray-500 block mb-1">Cost (Est $)</label>
                      <input 
                        type="number"
                        className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-600"
                        placeholder="85"
                        value={newPackCost}
                        onChange={(e) => setNewPackCost(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-extrabold uppercase text-gray-500 block mb-1">Assigned Buyer</label>
                      <select 
                        className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none"
                        value={newPackOwner}
                        onChange={(e: any) => setNewPackOwner(e.target.value)}
                      >
                        <option value="student">Gabby (Student)</option>
                        <option value="parent">Adrian (Parent)</option>
                        <option value="both">Both Combined</option>
                      </select>
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-1.5 bg-[#011F5B] hover:bg-[#001743] shadow-3xs cursor-pointer text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1"
                  >
                    Add to Dorm Ledger
                  </button>
                </form>
              </div>

              {/* Purchase Lists */}
              <div className="space-y-2.5 max-h-[290px] overflow-y-auto pr-1">
                <span className="text-[10px] font-extrabold uppercase text-gray-500 block">Current Packing Budget Items</span>
                
                {housingPurchases.map((p) => {
                  const isBought = p.status === "purchased";
                  return (
                    <div 
                      key={p.id}
                      className={`p-2.5 border rounded-xl flex flex-col gap-1 shadow-3xs transition-shadow hover:shadow-2xs ${
                        isBought ? "bg-emerald-50/20 border-emerald-150" : "bg-white border-slate-150"
                      }`}
                    >
                      <div className="flex justify-between items-center text-[9px] font-bold text-gray-400">
                        <span className="bg-slate-100 font-mono text-gray-500 px-1.5 py-0.5 rounded uppercase">
                          {p.category}
                        </span>
                        <span className="text-slate-700">${p.cost}</span>
                      </div>
                      <h6 className="font-bold text-xs text-slate-800 leading-tight">
                        {p.name}
                      </h6>
                      <div className="flex items-center justify-between text-[9px] text-gray-400 mt-1 uppercase font-bold">
                        <span>Buyer: {p.owner.toUpperCase()}</span>
                        <span className={isBought ? "text-emerald-700" : "text-amber-700 animate-pulse"}>
                          {p.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: REQUISITE HOUSING DEADLINES & DOCUMENTS (4cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* HOUSING TASKS & DEADLINES */}
          <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-xs">
            <h4 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider border-b border-gray-100 pb-2.5 mb-3 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#011F5B]" /> Required Campus Clearances
            </h4>

            <div className="space-y-2.5">
              {housingTasks.map((t) => {
                const isDone = t.completed;
                return (
                  <div 
                    key={t.id}
                    onClick={() => onToggleTask(t.id)}
                    className={`group p-3 border rounded-xl flex items-start gap-2.5 cursor-pointer transition ${
                      isDone 
                        ? "bg-slate-50/40 border-slate-150" 
                        : "bg-rose-50/20 border-rose-100/70 hover:bg-rose-50/40"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center border shrink-0 mt-0.5 transition-transform group-hover:scale-110 ${
                      isDone 
                        ? "bg-green-600 border-green-600 text-white" 
                        : "border-slate-300 bg-white"
                    }`}>
                      {isDone && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className={`text-xs font-bold leading-tight ${isDone ? "text-slate-400 line-through" : "text-slate-800"}`}>
                        {t.title}
                      </h5>
                      <p className="text-[10px] text-gray-400 mt-0.5 font-mono">Due: {t.dueDate}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DORM LAYOUT UPLOAD CABINET */}
          <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-xs">
            <h4 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider border-b border-gray-100 pb-2.5 mb-3 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-[#011F5B]" /> Dorm Blueprints Cabinet
            </h4>

            <form onSubmit={handleUploadDormDoc} className="space-y-3 mb-4">
              <div className="flex flex-col gap-1.5">
                <input 
                  type="text"
                  className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none"
                  placeholder="e.g. Quad Ware Layout Specs"
                  value={newDocLabel}
                  onChange={(e) => setNewDocLabel(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                className="w-full py-2 border border-[#011F5B] hover:bg-[#011F5B]/5 shadow-3xs cursor-pointer text-[#011F5B] rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" /> Upload Dorm Artifact (.pdf)
              </button>
            </form>

            <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1">
              {documents.filter(d => d.type === "Dorm Layout Plans" || d.name.includes("Quad") || d.name.includes("Dining")).map((doc) => (
                <div 
                  key={doc.id}
                  className="p-2.5 bg-slate-50 border border-slate-200/90 rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[16px] shrink-0">📄</span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-slate-850 truncate leading-snug">{doc.name}</p>
                      <span className="text-[8px] text-gray-400 font-mono">{doc.size}</span>
                    </div>
                  </div>
                  <span className="text-[8px] font-black bg-blue-100 text-[#011F5B] px-1.5 py-0.5 rounded uppercase shrink-0">
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
