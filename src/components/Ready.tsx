import React, { useState, useEffect } from "react";
import { 
  Plane, 
  Home, 
  Laptop, 
  Compass, 
  ShieldAlert, 
  PackageOpen, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ChevronRight,
  Edit2,
  Check,
  Plus,
  Paperclip,
  CheckSquare,
  DollarSign,
  Tag,
  Calendar,
  Lock,
  User,
  Users
} from "lucide-react";
import { ReadinessArea, ReadinessStatus, UserRole, Task } from "../types";

// Dynamic map to load Lucide icons
const iconMap: Record<string, any> = {
  Plane: Plane,
  Home: Home,
  Laptop: Laptop,
  Compass: Compass,
  ShieldAlert: ShieldAlert,
  PackageOpen: PackageOpen,
  CreditCard: CreditCard,
};

interface ReadyProps {
  userRole: UserRole;
  readinessAreas: ReadinessArea[];
  onUpdateStatus: (areaId: string, newStatus: ReadinessStatus, notes: string) => void;
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: Task) => void;
  purchases: any[];
  onAddPurchase: (purchase: any) => void;
  documents: any[];
  onAddDocument: (doc: any) => void;
}

export default function Ready({ 
  userRole, 
  readinessAreas, 
  onUpdateStatus,
  tasks,
  onToggleTask,
  onAddTask,
  purchases,
  onAddPurchase,
  documents,
  onAddDocument
}: ReadyProps) {
  const [selectedArea, setSelectedArea] = useState<ReadinessArea | null>(null);
  const [modalTab, setModalTab] = useState<"checklist" | "notes" | "purchases" | "documents">("checklist");
  
  // Local form states
  const [personalInput, setPersonalInput] = useState("");
  const [localNotes, setLocalNotes] = useState("");
  const [isNotesSaved, setIsNotesSaved] = useState(false);

  // Purchase state
  const [modalPurchName, setModalPurchName] = useState("");
  const [modalPurchCost, setModalPurchCost] = useState("");
  const [modalPurchOwner, setModalPurchOwner] = useState<"student" | "parent" | "both">("both");

  // Document state
  const [modalDocName, setModalDocName] = useState("");
  const [modalDocType, setModalDocType] = useState("PDF Confirmation");

  // System-wide Preparedness Score Calculations
  const requiredTasks = tasks.filter((t) => t.type === "required");
  const totalRequired = requiredTasks.length;
  const completedRequired = requiredTasks.filter((t) => t.completed).length;
  const requiredScore = totalRequired > 0 ? Math.round((completedRequired / totalRequired) * 100) : 100;

  const personalTasks = tasks.filter((t) => t.type === "personal" || t.type === "family" || !t.type);
  const totalPersonal = personalTasks.length;
  const completedPersonal = personalTasks.filter((t) => t.completed).length;
  const personalScore = totalPersonal > 0 ? Math.round((completedPersonal / totalPersonal) * 100) : 100;

  // Blended Index: 60% Required + 40% Personal
  const weightedOverallScore = Math.round((requiredScore * 0.6) + (personalScore * 0.4));

  // Sync edit notes locally when area updates
  useEffect(() => {
    if (selectedArea) {
      setLocalNotes(selectedArea.notes || "");
      setIsNotesSaved(false);
    }
  }, [selectedArea?.id]);

  const getStatusConfig = (status: ReadinessStatus) => {
    switch (status) {
      case "complete":
        return {
          bg: "bg-green-50/50 border-green-150",
          text: "text-green-800",
          descColor: "text-green-700/80",
          badgeBg: "bg-green-100 text-green-800 border-green-200",
          icon: CheckCircle2,
          label: "Complete",
        };
      case "in_progress":
        return {
          bg: "bg-amber-50/50 border-amber-150",
          text: "text-amber-800",
          descColor: "text-amber-700/80",
          badgeBg: "bg-amber-100 text-amber-800 border-amber-200",
          icon: Clock,
          label: "In Progress",
        };
      case "needs_attention":
        return {
          bg: "bg-rose-50/50 border-rose-150",
          text: "text-rose-800",
          descColor: "text-rose-700/80",
          badgeBg: "bg-rose-100 text-rose-800 border-rose-200",
          icon: AlertTriangle,
          label: "Needs Attention",
        };
    }
  };

  // Safe handlers for adding items inside workspace drawers
  const handleAddPersonalItemLocal = () => {
    if (!personalInput.trim() || !selectedArea) return;
    const added: Task = {
      id: `task-personal-${Date.now()}`,
      category: selectedArea.id as any,
      title: personalInput,
      description: "Custom student-created plans",
      dueDate: "2026-08-15",
      completed: false,
      assignedTo: userRole,
      type: "personal"
    };
    onAddTask(added);
    setPersonalInput("");
  };

  const handleModalPurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalPurchName.trim() || !selectedArea) return;
    const added = {
      id: `purch-work-${Date.now()}`,
      name: modalPurchName,
      cost: Number(modalPurchCost) || 0,
      category: selectedArea.id,
      status: "allocated",
      notes: "Logged via Readiness details workspace",
      owner: modalPurchOwner
    };
    onAddPurchase(added);
    setModalPurchName("");
    setModalPurchCost("");
  };

  const handleModalDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalDocName.trim() || !selectedArea) return;
    const properName = modalDocName.toLowerCase().endsWith(".pdf") ? modalDocName : `${modalDocName}.pdf`;
    const randomSize = `${(Math.random() * 2 + 0.1).toFixed(1)} MB`;
    const added = {
      id: `doc-work-${Date.now()}`,
      name: properName,
      status: "APPROVED",
      size: randomSize,
      type: modalDocType,
      categoryId: selectedArea.id
    };
    onAddDocument(added);
    setModalDocName("");
  };

  // Derived arrays filtered by selected area
  const areaTasks = selectedArea ? tasks.filter(t => t.category === selectedArea.id) : [];
  const areaPurchases = selectedArea ? purchases.filter(p => p.category === selectedArea.id) : [];
  
  // Match documents to selected area by categoryId or keywords
  const areaDocs = selectedArea ? documents.filter(d => {
    if (d.categoryId === selectedArea.id) return true;
    const nameLow = d.name.toLowerCase();
    if (selectedArea.id === "travel" && nameLow.includes("flight")) return true;
    if (selectedArea.id === "health" && nameLow.includes("vaccine") || nameLow.includes("immunization")) return true;
    if (selectedArea.id === "student_accounts" && nameLow.includes("dining")) return true;
    if (selectedArea.id === "housing" && nameLow.includes("movein") || nameLow.includes("quad")) return true;
    return false;
  }) : [];

  return (
    <div id="ready-center" className="space-y-6">
      {/* Dynamic Advanced Preparedness Score HUD Card */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 shadow-sm relative overflow-hidden">
        {/* Subtle decorative background vector circles */}
        <div className="absolute -right-16 -bottom-16 w-48 h-48 rounded-full bg-slate-850 border border-slate-800/60 pointer-events-none" />
        <div className="absolute right-12 -top-12 w-32 h-32 rounded-full bg-slate-850 border border-slate-800/60 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-teal-400 uppercase tracking-widest bg-teal-950/70 px-3 py-1 rounded-full border border-teal-900/65">
                Unified STAI-D Preparedness Index
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">University Boundaries + Active Personal Goals</h2>
            <p className="text-xs text-slate-350 leading-relaxed md:max-w-lg">
              We separate university checklist requirements from student planning goals. Fill high-level administrative tasks and personal items concurrently to reach maximum operational preparedness.
            </p>
          </div>

          {/* Tri-Gauge Progress Indicators inside bento structure */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 grow xl:max-w-2xl bg-slate-850/60 border border-slate-800 p-4 rounded-xl">
            {/* Gauge 1: Required Ready */}
            <div className="flex flex-col justify-between p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Required Ready</div>
              <div className="flex items-baseline gap-1 mt-1.5">
                <span className="text-xl font-mono font-bold text-red-400">{requiredScore}%</span>
                <span className="text-[9px] text-gray-500 font-semibold uppercase">Penn-Driven</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div className="h-full bg-red-400 transition-all duration-500" style={{ width: `${requiredScore}%` }} />
              </div>
              <div className="text-[9px] text-slate-400 mt-1.5 font-medium leading-none">
                {requiredTasks.filter(t => t.completed).length} of {requiredTasks.length} tasks completed
              </div>
            </div>

            {/* Gauge 2: Personal Ready */}
            <div className="flex flex-col justify-between p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Personal Ready</div>
              <div className="flex items-baseline gap-1 mt-1.5">
                <span className="text-xl font-mono font-bold text-teal-400">{personalScore}%</span>
                <span className="text-[9px] text-gray-500 font-semibold uppercase">Student-Driven</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div className="h-full bg-teal-400 transition-all duration-500" style={{ width: `${personalScore}%` }} />
              </div>
              <div className="text-[9px] text-slate-400 mt-1.5 font-medium leading-none">
                {personalTasks.filter(t => t.completed).length} of {personalTasks.length} objectives met
              </div>
            </div>

            {/* Gauge 3: Blended Overall Score */}
            <div className="flex flex-col justify-between p-3 bg-slate-800 border border-slate-700 rounded-lg shadow-inner">
              <div className="text-[10px] text-slate-350 font-bold uppercase tracking-wider flex items-center justify-between">
                <span>Overall Ready</span>
                <span className="text-[8px] bg-slate-700 px-1 py-0.2 rounded text-slate-300 font-mono">60:40 Weight</span>
              </div>
              <div className="flex items-baseline gap-1 mt-1.5">
                <span className="text-2xl font-mono font-black text-white">{weightedOverallScore}%</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase">Preparedness</span>
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div className="h-full bg-slate-100 transition-all duration-700" style={{ width: `${weightedOverallScore}%` }} />
              </div>
              <div className="text-[9px] text-slate-300 mt-1.5 font-bold leading-none">
                {tasks.filter(t => t.completed).length} of {tasks.length} total steps completed
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {readinessAreas.map((area) => {
          const IconComp = iconMap[area.icon] || Home;
          const config = getStatusConfig(area.status);
          const StatusIcon = config.icon;

          // Local Area Counts
          const subTasks = tasks.filter(t => t.category === area.id);
          const doneSubTasks = subTasks.filter(t => t.completed).length;

          return (
            <div
              key={area.id}
              onClick={() => setSelectedArea(area)}
              className="bg-white rounded-xl border border-gray-150 p-5 cursor-pointer hover:shadow-xs hover:border-gray-300 active:bg-slate-50/40 transition flex flex-col justify-between h-52 group relative"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-800 bg-slate-100 border border-slate-200/50">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${config.badgeBg}`}>
                    <StatusIcon className="w-3 h-3" />
                    <span>{config.label}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-gray-900 tracking-tight group-hover:text-[#011F5B] transition-colors">{area.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{area.description}</p>
                </div>
              </div>

              {/* Task micro counting badge */}
              <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-[11px] text-gray-400">
                <span className="font-mono bg-slate-50 border px-1.5 py-0.5 rounded text-[10px] text-slate-600 font-bold">
                  🗂️ {doneSubTasks}/{subTasks.length} Checked
                </span>
                <span className="text-slate-600 font-bold flex items-center gap-0.5 hover:text-slate-900">
                  Manage Workspace <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Slider Modal Transition Workspace Drawer */}
      {selectedArea && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-gray-150 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-teal-400 border border-slate-700">
                  {React.createElement(iconMap[selectedArea.icon] || Home, { className: "w-5 h-5" })}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                    {selectedArea.title} • Workspace
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-none">
                    Multi-tier operating system and coordinator setup
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setSelectedArea(null);
                  setIsNotesSaved(false);
                }}
                className="text-slate-400 hover:text-white text-xs font-bold bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition"
              >
                Close Workspace
              </button>
            </div>

            {/* Modal Sub-Banner Area Description */}
            <div className="bg-[#011F5B]/5 border-b border-gray-100 px-6 py-3 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <span className="text-xs text-slate-600 italic leading-relaxed max-w-lg">
                "{selectedArea.description}"
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase shrink-0 font-mono">
                Updated {selectedArea.lastUpdated}
              </span>
            </div>

            {/* Modal Workspace Navigation Tabs */}
            <div className="px-6 border-b border-gray-200 bg-slate-50/50 flex gap-1 pt-2 overflow-x-auto scroller-hidden shrink-0">
              <button
                onClick={() => setModalTab("checklist")}
                className={`pb-2.5 px-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 shrink-0 ${
                  modalTab === "checklist" ? "border-[#011F5B] text-[#011F5B]" : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                📋 Checklists & Items
              </button>
              <button
                onClick={() => setModalTab("notes")}
                className={`pb-2.5 px-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 shrink-0 ${
                  modalTab === "notes" ? "border-[#011F5B] text-[#011F5B]" : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                📝 Notebook Log
              </button>
              <button
                onClick={() => setModalTab("purchases")}
                className={`pb-2.5 px-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 shrink-0 ${
                  modalTab === "purchases" ? "border-[#011F5B] text-[#011F5B]" : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                🛍️ Spend Ledger ({areaPurchases.length})
              </button>
              <button
                onClick={() => setModalTab("documents")}
                className={`pb-2.5 px-3 text-xs font-bold transition flex items-center gap-1.5 border-b-2 shrink-0 ${
                  modalTab === "documents" ? "border-[#011F5B] text-[#011F5B]" : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                📎 Secure Cabinet ({areaDocs.length})
              </button>
            </div>

            {/* Modal Core Contents */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5">
              
              {/* STATUS ADJUSTER (Integrated status controller) */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-gray-150 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-bold uppercase tracking-wider flex items-center gap-1">
                    <CheckSquare className="w-3.5 h-3.5 text-slate-500" />
                    Overall Readiness Tracker
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getStatusConfig(selectedArea.status).badgeBg}`}>
                    {getStatusConfig(selectedArea.status).label}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {(["complete", "in_progress", "needs_attention"] as ReadinessStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        onUpdateStatus(selectedArea.id, st, selectedArea.notes || "");
                        setSelectedArea(prev => prev ? { ...prev, status: st } : null);
                      }}
                      className={`py-1.5 px-2 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        selectedArea.status === st
                          ? st === "complete"
                            ? "bg-green-100 border-green-300 text-green-800"
                            : st === "in_progress"
                              ? "bg-amber-100 border-amber-300 text-amber-800"
                              : "bg-rose-100 border-rose-300 text-rose-800"
                          : "bg-white text-gray-500 border-gray-200 hover:bg-slate-50"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      <span>{st === "complete" ? "Complete" : st === "in_progress" ? "In Progress" : "Needs Attention"}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* TAB CONTENT 1: CHECKLISTS IN 3 SECTIONS */}
              {modalTab === "checklist" && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  
                  {/* UNIVERSITY TIER */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                      <span className="text-xs font-black text-[#990000] uppercase tracking-wider flex items-center gap-1.5">
                        🏛️ University Layer (Official Requirements)
                      </span>
                      <span className="text-[10px] bg-[#990000]/10 text-[#990000] px-2 py-0.5 rounded font-bold uppercase">Fixed</span>
                    </div>

                    <div className="space-y-1.5">
                      {areaTasks.filter(t => t.type === "required").map(t => (
                        <div 
                          key={t.id} 
                          onClick={() => onToggleTask(t.id)}
                          className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer hover:bg-slate-50/50 transition ${
                            t.completed 
                              ? "bg-slate-50/40 border-slate-200 text-slate-550" 
                              : "bg-white border-gray-200 text-slate-800 hover:border-gray-300"
                          }`}
                        >
                          <div className={`mt-0.5 w-4.5 h-4.5 rounded border-2 flex items-center justify-center shrink-0 transition ${
                            t.completed 
                              ? "bg-[#011F5B] border-[#011F5B] text-white" 
                              : "border-slate-300 bg-white"
                          }`}>
                            {t.completed && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div>
                            <span className={`text-xs font-bold block ${t.completed ? "line-through text-slate-400" : ""}`}>{t.title}</span>
                            <span className="text-[10px] text-gray-400 block mt-0.5 leading-relaxed">{t.description}</span>
                          </div>
                        </div>
                      ))}
                      {areaTasks.filter(t => t.type === "required").length === 0 && (
                        <p className="text-[11px] text-gray-400 italic">No University-driven required steps for this area.</p>
                      )}
                    </div>
                  </div>

                  {/* FAMILY TIER */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                      <span className="text-xs font-black text-slate-755 uppercase tracking-wider flex items-center gap-1.5">
                        👨‍👩‍👧 Family Layer (Adrian & Gabby Joint Coordination)
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold uppercase">Coordinated</span>
                    </div>

                    <div className="space-y-1.5">
                      {areaTasks.filter(t => t.type === "family").map(t => (
                        <div 
                          key={t.id} 
                          onClick={() => onToggleTask(t.id)}
                          className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer hover:bg-slate-50/50 transition ${
                            t.completed 
                              ? "bg-slate-50/40 border-slate-200 text-slate-550" 
                              : "bg-white border-gray-200 text-slate-800 hover:border-gray-300"
                          }`}
                        >
                          <div className={`mt-0.5 w-4.5 h-4.5 rounded border-2 flex items-center justify-center shrink-0 transition ${
                            t.completed 
                              ? "bg-slate-900 border-slate-900 text-white" 
                              : "border-slate-300 bg-white"
                          }`}>
                            {t.completed && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div>
                            <span className={`text-xs font-bold block ${t.completed ? "line-through text-slate-400" : ""}`}>{t.title}</span>
                            <span className="text-[10px] text-gray-400 block mt-0.5 leading-relaxed">{t.description}</span>
                          </div>
                        </div>
                      ))}
                      {areaTasks.filter(t => t.type === "family").length === 0 && (
                        <p className="text-[11px] text-gray-400 italic">No shared parental coordination items listed for this area.</p>
                      )}
                    </div>
                  </div>

                  {/* PERSONAL TIER */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                      <span className="text-xs font-black text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
                        🎒 Personal Plan Layer (Student-Created Objectives)
                      </span>
                      <span className="text-[10px] bg-teal-50 border border-teal-200 text-teal-800 px-2 py-0.5 rounded font-mono font-bold uppercase">Adaptive</span>
                    </div>

                    <div className="space-y-1.5 mt-2">
                      {areaTasks.filter(t => t.type === "personal" || !t.type).map(t => (
                        <div 
                          key={t.id} 
                          onClick={() => onToggleTask(t.id)}
                          className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer hover:bg-slate-50/50 transition ${
                            t.completed 
                              ? "bg-slate-50/40 border-slate-200 text-slate-550" 
                              : "bg-white border-gray-200 text-slate-800 hover:border-gray-300"
                          }`}
                        >
                          <div className={`mt-0.5 w-4.5 h-4.5 rounded border-2 flex items-center justify-center shrink-0 transition ${
                            t.completed 
                              ? "bg-teal-600 border-teal-600 text-white" 
                              : "border-slate-300 bg-white"
                          }`}>
                            {t.completed && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div className="flex-1">
                            <span className={`text-xs font-bold block ${t.completed ? "line-through text-slate-400" : ""}`}>{t.title}</span>
                            <span className="text-[10px] text-gray-400 block mt-0.5 leading-relaxed">{t.description}</span>
                          </div>
                          <span className="text-[9px] bg-slate-100 border px-1.5 py-0.5 rounded font-bold uppercase text-slate-500 shrink-0">
                            {t.assignedTo === "both" ? "Gabby + Adrian" : t.assignedTo === "student" ? "Gabby" : "Adrian"}
                          </span>
                        </div>
                      ))}
                      
                      {areaTasks.filter(t => t.type === "personal" || !t.type).length === 0 && (
                        <p className="text-[11px] text-gray-400 italic py-1">No custom student items configured yet.</p>
                      )}
                    </div>

                    {/* Inline Form to Add Personal Item */}
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Type personal goal (e.g. Order heavy boots / mini-fridge)..."
                          value={personalInput}
                          onChange={(e) => setPersonalInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddPersonalItemLocal();
                          }}
                          className="flex-1 text-xs px-3.5 py-2 border border-gray-250 bg-white rounded-lg outline-hidden text-gray-800"
                        />
                        <button
                          onClick={handleAddPersonalItemLocal}
                          className="text-xs bg-slate-900 border border-slate-900 font-bold hover:bg-slate-800 text-white px-4 py-2 rounded-lg transition"
                        >
                          + Add Item
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB CONTENT 2: SHARED NOTES SCRATCHPAD */}
              {modalTab === "notes" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      📝 Regional Notes & Logistics Log
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    This shared notepad allows Gabby and Adrian to pin arrival flight parameters, roommate sizes, contact notes, and direct questions to clear with UPenn advisors.
                  </p>
                  
                  <textarea
                    value={localNotes}
                    onChange={(e) => setLocalNotes(e.target.value)}
                    className="w-full text-xs p-3.5 border border-gray-250 bg-white rounded-xl focus:ring-1 focus:ring-slate-350 outline-hidden font-sans leading-relaxed text-slate-800"
                    rows={8}
                    placeholder="Write hotel booking receipts, roommate coordination details, custom reminders, or questions for advisors..."
                  />

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        onUpdateStatus(selectedArea.id, selectedArea.status, localNotes);
                        setIsNotesSaved(true);
                        setTimeout(() => setIsNotesSaved(false), 2000);
                      }}
                      className="text-xs bg-slate-900 font-bold hover:bg-slate-800 text-white px-5 py-2 rounded-lg transition"
                    >
                      {isNotesSaved ? "✓ Entries Saved" : "Save Shared Notes"}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB CONTENT 3: EXPENSE BUDGET LEDGER */}
              {modalTab === "purchases" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                    <div>
                      <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Category Expense Ledger</h5>
                      <p className="text-[11px] text-slate-400">Pre-allocated or logged items specific to {selectedArea.title}.</p>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] text-slate-450 uppercase font-bold">Category Total Spent</div>
                      <div className="text-base font-black text-[#011F5B] font-mono">
                        ${areaPurchases.reduce((sum, p) => sum + p.cost, 0).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                    {areaPurchases.map(p => (
                      <div key={p.id} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-gray-150 flex justify-between items-center text-xs">
                        <div>
                          <span className="font-bold text-slate-800 block">{p.name}</span>
                          <span className="text-[10px] text-slate-450 uppercase tracking-wide font-medium">
                            Paid By: {p.owner === "both" ? "Gabby + Adrian" : p.owner === "student" ? "Gabby" : "Adrian"} • Status: {p.status}
                          </span>
                        </div>
                        <div className="font-bold text-[#011F5B] font-mono text-xs leading-none bg-white border px-2 py-1 rounded">
                          ${p.cost.toLocaleString()}
                        </div>
                      </div>
                    ))}
                    {areaPurchases.length === 0 && (
                      <div className="text-center py-6 text-xs text-gray-400">
                        No financial ledger records linked to {selectedArea.title} yet. Add elements below!
                      </div>
                    )}
                  </div>

                  {/* Log purchase form inline */}
                  <form onSubmit={handleModalPurchaseSubmit} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <div className="text-[10px] font-black text-[#910000] uppercase tracking-wider">Log Category Expense</div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        required
                        type="text"
                        placeholder="Expense Item Name (e.g. Twin XL mattress topper)"
                        value={modalPurchName}
                        onChange={(e) => setModalPurchName(e.target.value)}
                        className="text-xs p-2.5 bg-white border border-gray-200 rounded-lg outline-hidden"
                      />
                      <input
                        required
                        type="number"
                        placeholder="Cost Amount ($)"
                        value={modalPurchCost}
                        onChange={(e) => setModalPurchCost(e.target.value)}
                        className="text-xs p-2.5 bg-[#ffffff] border border-gray-200 rounded-lg outline-hidden"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <select
                        value={modalPurchOwner}
                        onChange={(e) => setModalPurchOwner(e.target.value as any)}
                        className="p-1.5 border border-gray-250 bg-white rounded-lg text-slate-750 outline-hidden text-[11px]"
                      >
                        <option value="student">Coordinated By: Gabby (Student)</option>
                        <option value="parent">Coordinated By: Adrian (Parent)</option>
                        <option value="both">Split / Paid Jointly</option>
                      </select>
                      <button
                        type="submit"
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-1.5 rounded-lg text-xs"
                      >
                        Record Cost
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB CONTENT 4: FILE CABINET */}
              {modalTab === "documents" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div>
                    <h5 className="text-xs font-bold text-slate-700 uppercase tracking-widest block">
                      📎 Integrated Document Cabinet
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      Upload PDF flight tickets, immunization papers, or housing license agreements.
                    </p>
                  </div>

                  <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                    {areaDocs.map(doc => (
                      <div key={doc.id} className="p-3 bg-slate-50 rounded-xl border border-gray-150 flex justify-between items-center text-xs text-slate-800">
                        <div className="truncate pr-2">
                          <span className="font-bold block truncate text-slate-850">{doc.name}</span>
                          <span className="text-[9px] text-slate-400 uppercase tracking-wide">{doc.type} • {doc.size}</span>
                        </div>
                        <span className={`text-[9px] font-bold uppercase shrink-0 px-2.5 py-0.5 rounded-md border ${
                          doc.status === "APPROVED" || doc.status === "COMPLETED" 
                            ? "bg-green-50 border-green-200 text-green-800"
                            : "bg-amber-50 border-amber-200 text-amber-800"
                        }`}>
                          {doc.status}
                        </span>
                      </div>
                    ))}
                    {areaDocs.length === 0 && (
                      <div className="text-center py-6 text-xs text-gray-400">
                        No paperwork uploaded for this category yet. Save official documentation below.
                      </div>
                    )}
                  </div>

                  {/* Register document mockup form */}
                  <form onSubmit={handleModalDocSubmit} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <div className="text-[10px] font-bold text-[#011F5B] uppercase tracking-wider">Register Files / Receipts</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        required
                        type="text"
                        placeholder="File Name (e.g. Quad_Ware_Dorm_Floor_Plan.pdf)"
                        value={modalDocName}
                        onChange={(e) => setModalDocName(e.target.value)}
                        className="text-xs p-2.5 bg-white border border-gray-200 rounded-lg outline-hidden font-sans"
                      />
                      <select
                        value={modalDocType}
                        onChange={(e) => setModalDocType(e.target.value)}
                        className="text-xs p-2.5 bg-white border border-gray-200 rounded-lg outline-hidden"
                      >
                        <option value="PDF Waiver">PDF Waiver / Receipt</option>
                        <option value="Dorm Layout Plans">Dorm Layout / PDF Specs</option>
                        <option value="Airport Ticket">Amtrak / Air Confirmation</option>
                        <option value="Waiver Form">Consent / Financial waiver</option>
                      </select>
                    </div>
                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        className="bg-slate-900 border border-slate-900 font-bold hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-xs"
                      >
                        Register Log File
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
