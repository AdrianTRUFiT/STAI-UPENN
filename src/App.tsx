import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  User, 
  CheckSquare, 
  Check,
  Calendar, 
  BookOpen, 
  Compass, 
  TrendingUp, 
  UserCheck, 
  Plus, 
  CheckCircle, 
  Circle, 
  Paperclip, 
  DollarSign, 
  Info,
  CalendarCheck,
  Award,
  ChevronRight,
  Shield,
  HelpCircle,
  Clock,
  ArrowRight
} from "lucide-react";
import { 
  UserRole, 
  ReadinessArea, 
  ReadinessStatus, 
  Task, 
  CalendarEvent, 
  JourneyMilestone, 
  DiscoverItem 
} from "./types";
import { 
  initialReadinessAreas, 
  initialTasks, 
  initialCalendarEvents, 
  initialJourneyMilestones, 
  discoverItems 
} from "./data";
import Ask from "./components/Ask";
import Ready from "./components/Ready";

export default function App() {
  // Navigation State (READY center acts as the core dashboard)
  const [activeTab, setActiveTab] = useState<"ask" | "ready" | "plan" | "discover" | "journey">("ready");
  
  // Chat Overlay State (STAI-C Stacey)
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Milestone Budgets Map
  const milestoneBudgets: Record<string, number> = {
    m1: 150,   // Accepted
    m2: 300,   // Housing
    m3: 800,   // Travel
    m4: 600,   // Packing
    m5: 1800,  // Move-In
    m6: 150,   // Orientation
    m7: 100,   // First Week
    m8: 400,   // First Semester
    m9: 1000   // Thriving
  };

  // User Persona State (Gabby is the Student, Adrian is the Parent)
  const [userRole, setUserRole] = useState<UserRole>("student");

  // App Unified Coordinates / State
  const [readinessAreas, setReadinessAreas] = useState<ReadinessArea[]>(initialReadinessAreas);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(initialCalendarEvents);
  const [journeyMilestones, setJourneyMilestones] = useState<JourneyMilestone[]>(initialJourneyMilestones);

  // Dynamic status-backed purchases ledger pre-linked to journey milestone stages
  const [purchases, setPurchases] = useState<any[]>([
    { id: "p1", name: "15-inch Laptop (Penn Connection)", cost: 1450, category: "technology", status: "allocated", notes: "Pre-configured for engineering humanities", owner: "both", milestoneId: "m5" },
    { id: "p2", name: "Twin XL Mattress Sheet set & foam top", cost: 85, category: "packing", status: "purchased", notes: "Target/Amazon", owner: "parent", milestoneId: "m4" },
    { id: "p3", name: "Dorm Refrigerator & Micro", cost: 180, category: "housing", status: "allocated", notes: "Shared with Quad Roommate", owner: "both", milestoneId: "m2" }
  ]);

  // Dynamic Document Cabinet
  const [documents, setDocuments] = useState<any[]>([
    { id: "d1", name: "Gabby_Immunization_Advisors.pdf", status: "APPROVED", size: "1.4 MB", type: "PDF Waiver" },
    { id: "d2", name: "August_Quad_MoveInParams.pdf", status: "PENDING", size: "1.2 MB", type: "Dorm Layout Plans" },
    { id: "d3", name: "UPenn_Dining_Agreement_F24.pdf", status: "COMPLETED", size: "430 KB", type: "Dining Agreement Form" }
  ]);

  // Search & Filters state
  const [taskFilter, setTaskFilter] = useState<"all" | "student" | "parent" | "both">("all");
  const [taskCategoryFilter, setTaskCategoryFilter] = useState<string>("all");
  const [discoverSearch, setDiscoverSearch] = useState("");
  const [discoverCat, setDiscoverCat] = useState<string>("all");

  // New Custom Task creation state
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCat, setNewTaskCat] = useState<Task["category"]>("custom");
  const [newTaskAssignee, setNewTaskAssignee] = useState<Task["assignedTo"]>("both");
  const [newTaskDueDate, setNewTaskDueDate] = useState("2026-07-20");
  const [newTaskDesc, setNewTaskDesc] = useState("");

  // New Purchase state
  const [isAddingPurchase, setIsAddingPurchase] = useState(false);
  const [newPurchaseName, setNewPurchaseName] = useState("");
  const [newPurchaseCost, setNewPurchaseCost] = useState("");
  const [newPurchaseCat, setNewPurchaseCat] = useState("packing");
  const [newPurchaseStatus, setNewPurchaseStatus] = useState("allocated");
  const [newPurchaseOwner, setNewPurchaseOwner] = useState<"student" | "parent" | "both">("both");
  const [newPurchaseNotes, setNewPurchaseNotes] = useState("");
  const [newPurchaseMilestone, setNewPurchaseMilestone] = useState("none");

  // New Document state
  const [isAddingDoc, setIsAddingDoc] = useState(false);
  const [newDocName, setNewDocName] = useState("");
  const [newDocType, setNewDocType] = useState("PDF Agreement");
  const [newDocStatus, setNewDocStatus] = useState("PENDING");

  // New Calendar Event state
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState("2026-08-21");
  const [newEventTime, setNewEventTime] = useState("10:00 AM EST");
  const [newEventLocation, setNewEventLocation] = useState("");
  const [newEventDesc, setNewEventDesc] = useState("");
  const [newEventOwner, setNewEventOwner] = useState<"student" | "parent" | "both">("both");
  const [newEventMandatory, setNewEventMandatory] = useState(false);

  // Quick prompt integration
  const [quickAskText, setQuickAskText] = useState("");

  // Interactive Journey timeline state
  const [completedJourneyActions, setCompletedJourneyActions] = useState<string[]>([
    "Activate PennKey", 
    "Submit Class of 2030 Photos", 
    "Agree on roommate rules", 
    "Submit immunization forms"
  ]);

  const toggleJourneyAction = (actionName: string) => {
    setCompletedJourneyActions(prev => 
      prev.includes(actionName) 
        ? prev.filter(x => x !== actionName) 
        : [...prev, actionName]
    );
  };

  const cycleMilestoneStatus = (id: string) => {
    setJourneyMilestones(prev => prev.map(m => {
      if (m.id === id) {
        const nextStatus: "completed" | "current" | "upcoming" = 
          m.status === "upcoming" ? "current" : m.status === "current" ? "completed" : "upcoming";
        return { ...m, status: nextStatus };
      }
      return m;
    }));
  };

  // Calculate system-wide task counts for official vs personal scores
  const requiredTasks = tasks.filter(t => t.type === "required");
  const totalRequired = requiredTasks.length;
  const completedRequired = requiredTasks.filter(t => t.completed).length;
  const requiredScore = totalRequired > 0 ? Math.round((completedRequired / totalRequired) * 100) : 100;

  const personalTasks = tasks.filter(t => t.type === "personal" || t.type === "family" || !t.type);
  const totalPersonal = personalTasks.length;
  const completedPersonal = personalTasks.filter(t => t.completed).length;
  const personalScore = totalPersonal > 0 ? Math.round((completedPersonal / totalPersonal) * 100) : 100;

  // Blended Index: 60% Required + 40% Personal
  const overallReadyScore = Math.round((requiredScore * 0.6) + (personalScore * 0.4));

  // Handle task status changes
  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  // Create a new task
  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const added: Task = {
      id: `task-custom-${Date.now()}`,
      category: newTaskCat,
      title: newTaskTitle,
      description: newTaskDesc,
      dueDate: newTaskDueDate,
      completed: false,
      assignedTo: newTaskAssignee,
    };

    setTasks(prev => [added, ...prev]);
    
    // Reset Form
    setNewTaskTitle("");
    setNewTaskDesc("");
    setIsAddingTask(false);
  };

  // Create a new purchase
  const handleAddPurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPurchaseName.trim()) return;

    const added = {
      id: `purch-${Date.now()}`,
      name: newPurchaseName,
      cost: Number(newPurchaseCost) || 0,
      category: newPurchaseCat,
      status: newPurchaseStatus,
      notes: newPurchaseNotes,
      owner: newPurchaseOwner,
      milestoneId: newPurchaseMilestone !== "none" ? newPurchaseMilestone : undefined
    };

    setPurchases(prev => [...prev, added]);

    // Reset Form
    setNewPurchaseName("");
    setNewPurchaseCost("");
    setNewPurchaseNotes("");
    setNewPurchaseMilestone("none");
    setIsAddingPurchase(false);
  };

  // Create a new document
  const handleAddDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;

    // generate a reasonable size
    const randomSize = `${(Math.random() * 2 + 0.1).toFixed(1)} MB`;

    const added = {
      id: `doc-${Date.now()}`,
      name: newDocName.endsWith(".pdf") ? newDocName : `${newDocName}.pdf`,
      status: newDocStatus,
      size: randomSize,
      type: newDocType
    };

    setDocuments(prev => [added, ...prev]);

    // Reset Form
    setNewDocName("");
    setIsAddingDoc(false);
  };

  // Create a new calendar milestone event
  const handleAddEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const added: CalendarEvent = {
      id: `event-${Date.now()}`,
      title: newEventTitle,
      date: newEventDate,
      time: newEventTime,
      location: newEventLocation,
      description: newEventDesc,
      assignedTo: newEventOwner,
      isMandatory: newEventMandatory
    };

    setCalendarEvents(prev => {
      const updated = [...prev, added];
      // Sort chronologically
      return updated.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });

    // Reset Form
    setNewEventTitle("");
    setNewEventDesc("");
    setNewEventLocation("");
    setIsAddingEvent(false);
  };

  // Manage readiness notes & status updates
  const handleUpdateReadinessArea = (id: string, newStatus: ReadinessStatus, notes: string) => {
    setReadinessAreas(prev => prev.map(area => 
      area.id === id ? { ...area, status: newStatus, notes, lastUpdated: "Today" } : area
    ));
  };

  // Direct list modifications within workspaces
  const handleAddTaskDirect = (task: Task) => {
    setTasks(prev => [...prev, task]);
  };

  const handleAddPurchaseDirect = (purch: any) => {
    setPurchases(prev => [...prev, purch]);
  };

  const handleAddDocumentDirect = (doc: any) => {
    setDocuments(prev => [...prev, doc]);
  };

  // Dynamic next milestone check based on calendar events
  const nextMilestone = calendarEvents.find(e => !e.description.includes("Completed")) || calendarEvents[0];

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] flex flex-col md:flex-row font-sans selection:bg-[#011F5B] selection:text-white antialiased">
      
      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-76 bg-white border-b md:border-b-0 md:border-r border-gray-200/85 flex flex-col shrink-0">
        
        {/* Banner with UPenn colors */}
        <div className="p-5 border-b border-gray-100 flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#990000] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-xs ring-2 ring-[#011F5B]/10">
              U
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-[#011F5B] flex items-center gap-1.5">
                STAI <span className="text-gray-400 font-light">⇒</span> UPENN
              </h1>
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                Transition Intelligence
              </p>
            </div>
          </div>
          
          <div className="mt-2 text-xs text-gray-500 leading-normal flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg border border-gray-100">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </div>
            <span>Class of 2030 • Ware College House</span>
          </div>
        </div>

        {/* Dynamic Persona Selection Trigger (Parent / Student switch) */}
        <div className="p-4 border-b border-gray-50 bg-slate-50/40">
          <span className="text-[9px] font-bold text-gray-450 tracking-widest uppercase block mb-2 px-1">
            Toggle Perspective
          </span>
          <div className="flex bg-gray-200/80 p-0.5 rounded-lg border border-gray-300/40">
            <button
              onClick={() => setUserRole("student")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-md transition ${
                userRole === "student"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <User className="w-3.5 h-3.5 text-purple-650" />
              <span>Gabby (Student)</span>
            </button>
            <button
              onClick={() => setUserRole("parent")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-md transition ${
                userRole === "parent"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-teal-650" />
              <span>Adrian (Parent)</span>
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-1.5 text-center italic">
            {userRole === "student" 
              ? "🎯 Managing independence & lecture locations" 
              : "🗺️ Distance coaching & administrative protection"}
          </p>
        </div>

        {/* Tab Navigation */}
        <nav className="flex-1 p-4 space-y-1.5">
          <button
            onClick={() => {
              setActiveTab("ask");
              setIsChatOpen(true);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === "ask"
                ? "bg-[#011F5B] text-white shadow-xs"
                : "text-gray-600 hover:bg-slate-50 hover:text-slate-950"
            }`}
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>ASK STAI-C / Stacey</span>
            </div>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/25 text-white/90">
              Active
            </span>
          </button>

          <button
            onClick={() => setActiveTab("ready")}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === "ready"
                ? "bg-[#011F5B] text-white shadow-xs"
                : "text-gray-600 hover:bg-slate-50 hover:text-slate-950"
            }`}
          >
            <div className="flex items-center gap-3">
              <CheckSquare className="w-4 h-4 shrink-0" />
              <span>READY Center</span>
            </div>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
              activeTab === "ready" ? "bg-white/25 text-white" : "bg-teal-50 text-teal-900 border border-teal-100"
            }`}>
              {overallReadyScore}%
            </span>
          </button>

          <button
            onClick={() => setActiveTab("plan")}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === "plan"
                ? "bg-[#011F5B] text-white shadow-xs"
                : "text-gray-600 hover:bg-slate-50 hover:text-slate-950"
            }`}
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 shrink-0" />
              <span>PLAN Coordination</span>
            </div>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
              Tasks
            </span>
          </button>

          <button
            onClick={() => setActiveTab("discover")}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === "discover"
                ? "bg-[#011F5B] text-white shadow-xs"
                : "text-gray-600 hover:bg-slate-50 hover:text-slate-950"
            }`}
          >
            <div className="flex items-center gap-3">
              <Compass className="w-4 h-4 shrink-0" />
              <span>DISCOVER UPenn</span>
            </div>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
              Guide
            </span>
          </button>

          <button
            onClick={() => setActiveTab("journey")}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === "journey"
                ? "bg-[#011F5B] text-white shadow-xs"
                : "text-gray-600 hover:bg-slate-50 hover:text-slate-950"
            }`}
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="w-4 h-4 shrink-0" />
              <span>JOURNEY Timeline</span>
            </div>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
              STAI-D
            </span>
          </button>
        </nav>

        {/* Interactive Coordination Badge at bottom of sidebar */}
        <div className="p-4 m-4 bg-slate-900 text-white rounded-2xl shadow-md border border-slate-800">
          <div className="text-[9px] font-bold text-[#990000] uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            STAI-D Status Sync
          </div>
          <div className="space-y-1.5">
            <div className="font-bold text-xs tracking-tight">Parent + Student Linked</div>
            <p className="text-[10px] text-slate-300 leading-normal">
              Shared workspace is currently active. Adrian's financial inputs and Gabby's scheduling milestones are co-synchronized.
            </p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* TOP STATUS HERO BAR (Progress tracking across the transition) */}
        <section className="bg-white border-b border-gray-200/85 p-6 md:p-8 flex flex-col justify-center shrink-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] bg-[#990000]/10 text-[#990000] font-bold uppercase tracking-widest px-2 py-0.5 rounded">
                  UPenn Transition Intelligence
                </span>
                <span className="text-[10px] bg-[#011F5B]/10 text-[#011F5B] font-bold uppercase tracking-widest px-2 py-0.5 rounded">
                  STAI-D Ecosystem
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Are we ready?</h2>
              <p className="text-sm text-gray-500 mt-1">
                Next Landmark: <span className="text-[#011F5B] font-bold">{nextMilestone ? nextMilestone.title : "Move-in and NSO"}</span> ({nextMilestone ? nextMilestone.date : ""})
              </p>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-4xl font-black text-[#011F5B] font-mono leading-none flex items-baseline sm:justify-end gap-1">
                {overallReadyScore}%
                <span className="text-xs text-gray-400 font-bold uppercase">Ready</span>
              </div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                Based on 7 crucial preparation hubs
              </div>
            </div>
          </div>
          
          {/* Timeline Bar representation inside Hero */}
          <div className="relative w-full h-2 bg-gray-100 rounded-full flex overflow-hidden">
            <div className="h-full bg-green-500" style={{ width: `${Math.min(overallReadyScore, 33)}%` }} />
            <div className="h-full bg-emerald-500 border-l border-white" style={{ width: `${Math.min(Math.max(overallReadyScore - 33, 0), 33)}%` }} />
            <div className="h-full bg-teal-500 border-l border-white" style={{ width: `${Math.min(Math.max(overallReadyScore - 66, 0), 34)}%` }} />
          </div>
          <div className="flex justify-between mt-2 text-[10px] font-semibold text-gray-405 uppercase tracking-wider">
            <span className="text-green-600">Accepted</span>
            <span className={overallReadyScore >= 50 ? "text-emerald-600" : ""}>Housing Secured</span>
            <span className={overallReadyScore >= 75 ? "text-teal-600" : ""}>Packing Logs</span>
            <span className={overallReadyScore >= 100 ? "text-[#011F5B]" : ""}>Thriving NSO</span>
          </div>
        </section>

        {/* ACTIVE MODULE CONTAINER */}
        <div id="module-content" className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
          
          {/* TAB 1: ASK STAI-C (Interactive Assistant Layer) */}
          {activeTab === "ask" && (
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-gray-150 shadow-xs h-[calc(100vh-270px)] min-h-[500px]">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-105 mb-4">
                <Sparkles className="w-8 h-8 text-blue-600 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">STAI-C Copilot Enabled</h3>
              <p className="text-gray-500 text-xs max-w-sm mt-2 leading-relaxed text-center">
                Your Student Transition Adaptive Intelligence Chatbot is ready! We have launched her as a floating panel (on Desktop) and an expanded transition interface (on Mobile) so you can navigate logs, checklists, and costs simultaneously.
              </p>
              <button
                onClick={() => setIsChatOpen(true)}
                className="mt-6 px-5 py-2.5 bg-[#011F5B] hover:bg-[#001743] hover:scale-105 active:scale-95 text-white rounded-xl text-xs font-bold transition duration-150 flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                Open Interactive STAI-C Chat
              </button>
            </div>
          )}

          {/* TAB 2: READY CENTER */}
          {activeTab === "ready" && (
            <div className="animate-in fade-in duration-250">
              <Ready 
                userRole={userRole} 
                readinessAreas={readinessAreas} 
                onUpdateStatus={handleUpdateReadinessArea} 
                tasks={tasks}
                onToggleTask={toggleTaskCompletion}
                onAddTask={handleAddTaskDirect}
                purchases={purchases}
                onAddPurchase={handleAddPurchaseDirect}
                documents={documents}
                onAddDocument={handleAddDocumentDirect}
              />
            </div>
          )}

          {/* TAB 3: PLAN COORDINATION */}
          {activeTab === "plan" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-250">
              
              {/* Left Column: Shared Checklist */}
              <div className="col-span-1 lg:col-span-8 space-y-6">
                
                {/* Checklist Panel */}
                <div className="bg-white rounded-2xl border border-gray-150 shadow-xs flex flex-col overflow-hidden animate-in fade-in duration-200">
                  <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-slate-50/50">
                    <div>
                      <h3 className="font-bold flex items-center gap-2 text-gray-900 text-base">
                        <span className="w-2.5 h-2.5 bg-[#990000] rounded-full"></span>
                        Active Coordination Tasks
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">Dual checklist: Gabby checks student steps, Adrian checks parental support.</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <select 
                        value={taskFilter}
                        onChange={(e) => setTaskFilter(e.target.value as any)}
                        className="text-xs font-semibold px-2.5 py-1.5 border border-gray-250 bg-white rounded-lg text-slate-750 outline-hidden"
                      >
                        <option value="all">Everyone's Tasks</option>
                        <option value="student">Gabby's Tasks</option>
                        <option value="parent">Adrian's Tasks</option>
                        <option value="both">Shared Tasks</option>
                      </select>

                      <select
                        value={taskCategoryFilter}
                        onChange={(e) => setTaskCategoryFilter(e.target.value)}
                        className="text-xs font-semibold px-2.5 py-1.5 border border-gray-250 bg-white rounded-lg text-slate-750 outline-hidden"
                      >
                        <option value="all">All Categories</option>
                        <option value="travel">Travel</option>
                        <option value="housing">Housing</option>
                        <option value="technology">Technology</option>
                        <option value="orientation">Orientation</option>
                        <option value="health">Health</option>
                        <option value="packing">Packing</option>
                        <option value="move_in">Move-In</option>
                        <option value="student_accounts">Student Accounts</option>
                      </select>

                      <button
                        onClick={() => setIsAddingTask(true)}
                        className="bg-slate-900 border border-slate-900 text-white rounded-lg text-xs font-bold px-3 py-1.5 hover:bg-slate-855 transition flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Task</span>
                      </button>
                    </div>
                  </div>

                  {/* Task Addition Overlay Form */}
                  {isAddingTask && (
                    <form onSubmit={handleAddTaskSubmit} className="p-5 bg-blue-50/50 border-b border-gray-200 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-150">
                      <div className="text-xs font-bold text-[#011F5B] uppercase tracking-wider">Create Custom Checklist Item</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Task Title <span className="text-red-500">*</span></label>
                          <input 
                            required
                            type="text" 
                            placeholder="e.g. Set up communal printer with roommate"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            className="w-full text-xs p-2 bg-white border border-gray-250 rounded-lg outline-hidden focus:border-slate-350"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Category</label>
                          <select
                            value={newTaskCat}
                            onChange={(e) => setNewTaskCat(e.target.value as any)}
                            className="w-full text-xs p-2 bg-white border border-gray-250 rounded-lg outline-hidden"
                          >
                            <option value="custom">Custom Milestone</option>
                            <option value="travel">Travel</option>
                            <option value="housing">Housing</option>
                            <option value="technology">Technology</option>
                            <option value="orientation">Orientation</option>
                            <option value="health">Health</option>
                            <option value="packing">Packing</option>
                            <option value="move_in">Move-In</option>
                            <option value="student_accounts">Financial Account</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Assignee</label>
                          <select
                            value={newTaskAssignee}
                            onChange={(e) => setNewTaskAssignee(e.target.value as any)}
                            className="w-full text-xs p-2 bg-white border border-gray-250 rounded-lg outline-hidden"
                          >
                            <option value="student">Gabby (Student Only)</option>
                            <option value="parent">Adrian (Parent Only)</option>
                            <option value="both">Both / Collaborative</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Due Date</label>
                          <input 
                            type="date" 
                            value={newTaskDueDate}
                            onChange={(e) => setNewTaskDueDate(e.target.value)}
                            className="w-full text-xs p-1.5 bg-white border border-gray-250 rounded-lg outline-hidden"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Description / Notes</label>
                        <textarea 
                          rows={2}
                          value={newTaskDesc}
                          onChange={(e) => setNewTaskDesc(e.target.value)}
                          placeholder="Provide specific notes (e.g. stores, cost, target numbers)..."
                          className="w-full text-xs p-2 bg-white border border-gray-250 rounded-lg outline-hidden focus:border-slate-350"
                        />
                      </div>

                      <div className="flex justify-end gap-2 text-xs">
                        <button 
                          type="button" 
                          onClick={() => setIsAddingTask(false)}
                          className="px-3.5 py-1.5 border border-gray-250 text-slate-700 bg-white rounded-lg hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit"
                          className="px-4 py-1.5 bg-[#011F5B] text-white rounded-lg font-bold hover:bg-slate-800"
                        >
                          Save Task
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Task list container */}
                  <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                    {tasks.filter(t => {
                      // Apply task assignee filter
                      if (taskFilter === "student") {
                        if (t.assignedTo !== "student") return false;
                      } else if (taskFilter === "parent") {
                        if (t.assignedTo !== "parent") return false;
                      } else if (taskFilter === "both") {
                        if (t.assignedTo !== "both") return false;
                      }

                      // Apply task category filter
                      if (taskCategoryFilter !== "all" && t.category !== taskCategoryFilter) {
                        return false;
                      }

                      return true;
                    }).map((task) => (
                      <div 
                        key={task.id} 
                        className={`p-4 flex items-start justify-between gap-4 transition hover:bg-slate-50/50 ${
                          task.completed ? "bg-slate-50/30" : ""
                        }`}
                      >
                        <div className="flex gap-3">
                          <button 
                            type="button"
                            onClick={() => toggleTaskCompletion(task.id)}
                            className="text-slate-400 hover:text-slate-900 mt-1"
                          >
                            {task.completed ? (
                              <CheckCircle className="w-5 h-5 text-green-600 fill-green-50" />
                            ) : (
                              <Circle className="w-5 h-5" />
                            )}
                          </button>
                          
                          <div>
                            <p className={`text-sm font-semibold tracking-tight ${task.completed ? "text-gray-400 line-through font-normal" : "text-gray-900"}`}>
                              {task.title}
                            </p>
                            
                            {task.description && (
                              <p className={`text-xs mt-0.5 max-w-xl ${task.completed ? "text-gray-400" : "text-gray-500"}`}>
                                {task.description}
                              </p>
                            )}

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="text-[9px] bg-slate-100 text-slate-700 border border-slate-200 font-bold uppercase px-1.5 py-0.5 rounded-sm">
                                {task.category.replace("_", " ")}
                              </span>
                              
                              <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-sm ${
                                task.assignedTo === "student" 
                                  ? "bg-purple-50 text-purple-750 border border-purple-100" 
                                  : task.assignedTo === "parent" 
                                    ? "bg-teal-50 text-teal-755 border border-teal-100" 
                                    : "bg-amber-50 text-amber-700 border border-amber-100"
                              }`}>
                                ASSIGNED: {task.assignedTo === "both" ? "STUDENT + PARENT" : task.assignedTo.toUpperCase()}
                              </span>

                              {task.cost && (
                                <span className="text-[9px] bg-rose-50 text-rose-700 font-bold border border-rose-100 px-1.5 py-0.5 rounded-sm flex items-center gap-0.5">
                                  <DollarSign className="w-2.5 h-2.5" />
                                  Estimate: ${task.cost}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0 flex flex-col items-end justify-between h-full min-h-[50px]">
                          <span className="text-[10px] text-gray-400 font-semibold uppercase">{task.dueDate}</span>
                        </div>
                      </div>
                    ))}
                    {tasks.filter(t => {
                      if (taskFilter === "student" && t.assignedTo !== "student") return false;
                      if (taskFilter === "parent" && t.assignedTo !== "parent") return false;
                      if (taskFilter === "both" && t.assignedTo !== "both") return false;
                      if (taskCategoryFilter !== "all" && t.category !== taskCategoryFilter) return false;
                      return true;
                    }).length === 0 && (
                      <div className="p-8 text-center text-sm text-gray-400 font-medium">
                        No active coordination tasks match selected filters.
                      </div>
                    )}
                  </div>
                </div>

                {/* Shared Purchases Ledger widget */}
                <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-xs transition duration-200 animate-in fade-in">
                  <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-3">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">🎒 Shared Ledger & Purchases Tracking</h4>
                      <p className="text-xs text-gray-500">Estimates and status for technical components and Quad dorm inventory.</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400 font-medium font-mono uppercase">Calculated Total</div>
                      <div className="text-xl font-bold text-[#011F5B] font-mono">
                        ${purchases.reduce((sum, p) => sum + p.cost, 0).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Add Purchase button and collapsible form */}
                  <div className="mb-4">
                    {!isAddingPurchase ? (
                      <button
                        onClick={() => setIsAddingPurchase(true)}
                        className="text-xs bg-slate-100 hover:bg-slate-200 border text-slate-850 px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Log New Purchase / Cost Event</span>
                      </button>
                    ) : (
                      <form onSubmit={handleAddPurchaseSubmit} className="p-4 bg-slate-50 border border-gray-200 rounded-xl space-y-3 animate-in slide-in-from-top-2 duration-150">
                        <div className="text-xs font-bold text-[#990000] uppercase tracking-wider">Log Purchase details</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <input 
                              required
                              type="text"
                              value={newPurchaseName}
                              onChange={(e) => setNewPurchaseName(e.target.value)}
                              placeholder="Purchase Item (e.g. Bed Bath Rug)"
                              className="w-full text-xs p-2 bg-white border border-gray-250 rounded-lg outline-hidden"
                            />
                          </div>
                          <div>
                            <input 
                              required
                              type="number"
                              value={newPurchaseCost}
                              onChange={(e) => setNewPurchaseCost(e.target.value)}
                              placeholder="Estimated/Actual Cost ($)"
                              className="w-full text-xs p-2 bg-white border border-gray-250 rounded-lg outline-hidden"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <select
                              value={newPurchaseCat}
                              onChange={(e) => setNewPurchaseCat(e.target.value)}
                              className="w-full text-xs p-2 bg-white border border-gray-250 rounded-lg outline-hidden"
                            >
                              <option value="packing">Packing/Bedding</option>
                              <option value="technology">Technology Setup</option>
                              <option value="housing">Housing/Dorm</option>
                              <option value="health">Health & Medical</option>
                            </select>
                          </div>
                          <div>
                            <select
                              value={newPurchaseStatus}
                              onChange={(e) => setNewPurchaseStatus(e.target.value)}
                              className="w-full text-xs p-2 bg-white border border-gray-250 rounded-lg outline-hidden"
                            >
                              <option value="allocated">Allocated/Planned</option>
                              <option value="purchased">Completed Purchase</option>
                            </select>
                          </div>
                          <div>
                            <select
                              value={newPurchaseOwner}
                              onChange={(e) => setNewPurchaseOwner(e.target.value as any)}
                              className="w-full text-xs p-2 bg-white border border-gray-250 rounded-lg outline-hidden"
                            >
                              <option value="student">Gabby (Student)</option>
                              <option value="parent">Adrian (Parent)</option>
                              <option value="both">Both / Shared</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <input 
                              type="text"
                              value={newPurchaseNotes}
                              onChange={(e) => setNewPurchaseNotes(e.target.value)}
                              placeholder="Store notes or roommate splitting info..."
                              className="w-full text-xs p-2 bg-white border border-gray-250 rounded-lg outline-hidden"
                            />
                          </div>
                          <div>
                            <select
                              value={newPurchaseMilestone}
                              onChange={(e) => setNewPurchaseMilestone(e.target.value)}
                              className="w-full text-xs p-2 bg-white border border-gray-250 rounded-lg outline-hidden text-slate-800"
                            >
                              <option value="none">✨ Link to Journey Milestone (Optional)</option>
                              {journeyMilestones.map(ms => (
                                <option key={ms.id} value={ms.id}>Milestone Stage: {ms.title}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 text-xs">
                          <button 
                            type="button"
                            onClick={() => setIsAddingPurchase(false)}
                            className="px-3 py-1 border border-gray-250 bg-white text-gray-700 rounded-lg"
                          >
                            Cancel
                          </button>
                          <button 
                            type="submit"
                            className="px-4 py-1.5 bg-slate-900 text-white rounded-lg font-bold"
                          >
                            Save Purchase
                          </button>
                        </div>
                      </form>
                    )}
                  </div>

                  {/* List of active purchases */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {purchases.map((p) => (
                      <div key={p.id} className="p-3 bg-slate-50 rounded-xl border border-gray-100 flex flex-col justify-between hover:border-gray-200 transition">
                        <div>
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] text-gray-450 uppercase font-bold tracking-tight block">
                              {p.category}
                            </span>
                            <span className={`text-[8px] font-bold uppercase px-1 rounded-sm ${
                              p.status === "purchased" ? "bg-green-150 text-green-800" : "bg-amber-100 text-amber-800"
                            }`}>
                              {p.status}
                            </span>
                          </div>
                          <span className="text-sm font-bold text-slate-800 block mt-1">
                            ${p.cost.toLocaleString()}
                          </span>
                          <span className="text-xs font-semibold text-slate-900 mt-1 block leading-tight truncate">
                            {p.name}
                          </span>
                        </div>
                        <div className="mt-2 pt-1.5 border-t border-gray-105 flex flex-col gap-1">
                          <p className="text-[10px] text-gray-500 italic leading-normal">
                            {p.notes || "No custom store notes added."} • <span className="font-semibold uppercase">{p.owner}</span>
                          </p>
                          <div className="flex items-center gap-1 bg-white p-1 rounded-md border border-gray-100 mt-1">
                            <span className="text-[9px] text-gray-400 font-bold uppercase shrink-0">Stage:</span>
                            <select
                              value={p.milestoneId || "none"}
                              onChange={(e) => {
                                const msId = e.target.value;
                                setPurchases(prev => prev.map(item => item.id === p.id ? { ...item, milestoneId: msId !== "none" ? msId : undefined } : item));
                              }}
                              className="text-[9px] w-full py-0.5 px-1 bg-slate-50 border-0 rounded font-semibold text-slate-700 outline-hidden cursor-pointer"
                            >
                              <option value="none">-- Unlinked Stage --</option>
                              {journeyMilestones.map(ms => (
                                <option key={ms.id} value={ms.id}>{ms.title}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Shared Calendar Events */}
              <div className="col-span-1 lg:col-span-4 space-y-6 animate-in fade-in">
                
                {/* Event timeline widget */}
                <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-xs flex flex-col">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <CalendarCheck className="w-4 h-4 text-[#990000]" />
                      NSO & Milestone Calendar
                    </h3>
                    <button
                      onClick={() => setIsAddingEvent(true)}
                      className="text-[10px] bg-slate-900 text-white rounded px-2.5 py-1 font-bold hover:bg-slate-800 transition"
                    >
                      + Milestone
                    </button>
                  </div>

                  {/* New Event Form Overlay */}
                  {isAddingEvent && (
                    <form onSubmit={handleAddEventSubmit} className="mb-4 p-3 bg-blue-50/50 rounded-xl border border-blue-200 space-y-3 text-xs animate-in slide-in-from-top-2 duration-150">
                      <div className="font-bold text-[#011F5B] uppercase block">Register New Milestone / Deadline</div>
                      <input 
                        required
                        type="text"
                        placeholder="Milestone Title (e.g. Placement Exam)"
                        value={newEventTitle}
                        onChange={(e) => setNewEventTitle(e.target.value)}
                        className="w-full p-2 bg-white border border-gray-250 rounded-md"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          type="date"
                          value={newEventDate}
                          onChange={(e) => setNewEventDate(e.target.value)}
                          className="w-full p-1 border border-gray-250 rounded-md"
                        />
                        <input 
                          type="text"
                          value={newEventTime}
                          onChange={(e) => setNewEventTime(e.target.value)}
                          placeholder="e.g. 5:00 PM EST"
                          className="w-full p-1 border border-gray-250 rounded-md"
                        />
                      </div>
                      <input 
                        type="text"
                        placeholder="Location (e.g. Canvas Portal / Quad)"
                        value={newEventLocation}
                        onChange={(e) => setNewEventLocation(e.target.value)}
                        className="w-full p-2 bg-white border border-gray-250 rounded-md"
                      />
                      <input 
                        type="text"
                        placeholder="Brief instruction notes..."
                        value={newEventDesc}
                        onChange={(e) => setNewEventDesc(e.target.value)}
                        className="w-full p-2 bg-white border border-gray-250 rounded-md"
                      />
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-1.5 font-semibold text-slate-700">
                          <input 
                            type="checkbox"
                            checked={newEventMandatory}
                            onChange={(e) => setNewEventMandatory(e.target.checked)}
                          />
                          <span>Mandatory?</span>
                        </label>
                        <select
                          value={newEventOwner}
                          onChange={(e) => setNewEventOwner(e.target.value as any)}
                          className="p-1 text-xs border border-gray-250 bg-white rounded-md"
                        >
                          <option value="student">Gabby (Student)</option>
                          <option value="parent">Adrian (Parent)</option>
                          <option value="both">Both</option>
                        </select>
                      </div>
                      <div className="flex justify-end gap-2 text-[11px] pt-1.5 border-t border-gray-200">
                        <button type="button" onClick={() => setIsAddingEvent(false)} className="px-2.5 py-1 border border-gray-250 bg-white text-gray-700 rounded">
                          Cancel
                        </button>
                        <button type="submit" className="px-3.5 py-1 bg-[#011F5B] text-white rounded font-bold">
                          Save Date
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                    {calendarEvents.map((evt) => (
                      <div key={evt.id} className="relative pl-4.5 border-l-2 border-slate-200 hover:border-slate-450 transition py-1">
                        {/* Interactive Dot marker */}
                        <div className={`absolute -left-[6px] top-2.5 w-2.5 h-2.5 rounded-full ${
                          evt.isMandatory ? "bg-[#990000] ring-4 ring-red-50" : "bg-slate-400"
                        }`} />
                        
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-[10px] font-bold text-[#011F5B] uppercase block">
                            {evt.date} • {evt.time}
                          </span>
                          {evt.isMandatory && (
                            <span className="text-[8px] bg-red-100 text-red-850 font-bold px-1 rounded uppercase">
                              Required
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 mt-0.5">{evt.title}</h4>
                        <p className="text-[11px] text-gray-500 mt-1 leading-normal">{evt.description}</p>
                        
                        {evt.location && (
                          <div className="text-[10px] text-gray-400 mt-1 italic flex items-center gap-1.5">
                            <Compass className="w-3 h-3 text-slate-300" />
                            <span>Location: {evt.location}</span>
                          </div>
                        )}
                        
                        <div className="mt-1.5 text-[9px] font-bold text-slate-455 uppercase">
                          👤 Owner: {evt.assignedTo === "both" ? "Gabby + Adrian" : evt.assignedTo === "student" ? "Gabby" : "Adrian"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Important Document Locker */}
                <div className="bg-slate-900 rounded-2xl p-5 text-white border border-slate-800 shadow-sm animate-in fade-in">
                  <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <Paperclip className="w-4 h-4 text-teal-400" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400">Document Locker</h4>
                    </div>
                    
                    <button
                      onClick={() => setIsAddingDoc(true)}
                      className="text-[9px] bg-teal-950 text-teal-350 border border-teal-850 hover:bg-teal-900 font-bold px-2 py-0.5 rounded transition"
                    >
                      + Save Document
                    </button>
                  </div>

                  {/* Add Doc inline mini-form */}
                  {isAddingDoc && (
                    <form onSubmit={handleAddDocSubmit} className="mb-4 p-3 bg-slate-850 border border-slate-750 rounded-xl space-y-3 text-xs animate-in slide-in-from-top-2">
                      <div className="font-bold text-teal-400 uppercase tracking-widest text-[10px]">Add Locker Reference</div>
                      <input 
                        required
                        type="text"
                        value={newDocName}
                        onChange={(e) => setNewDocName(e.target.value)}
                        placeholder="File Name (e.g. Health_Records.pdf)"
                        className="w-full p-2 bg-slate-900 border border-slate-750 text-white rounded"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={newDocType}
                          onChange={(e) => setNewDocType(e.target.value)}
                          className="w-full p-1 bg-slate-900 border border-slate-750 text-white rounded"
                        >
                          <option value="PDF Waiver">PDF Waiver</option>
                          <option value="Waiver Form">Waiver Form</option>
                          <option value="Dorm Layout Plans">Dorm Layout Plans</option>
                          <option value="Dining Contract">Dining Contract</option>
                        </select>
                        <select
                          value={newDocStatus}
                          onChange={(e) => setNewDocStatus(e.target.value)}
                          className="w-full p-1 bg-slate-900 border border-slate-750 text-white rounded"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="APPROVED">APPROVED</option>
                          <option value="COMPLETED">COMPLETED</option>
                        </select>
                      </div>
                      <div className="flex justify-end gap-2 text-[10px] pt-1">
                        <button type="button" onClick={() => setIsAddingDoc(false)} className="px-2 py-0.5 border border-slate-750 bg-slate-900 text-slate-300 rounded">
                          Cancel
                        </button>
                        <button type="submit" className="px-3 py-0.5 bg-teal-500 text-slate-950 rounded font-bold">
                          Register File
                        </button>
                      </div>
                    </form>
                  )}

                  <p className="text-[11px] text-slate-350 leading-relaxed mb-3">
                    Secure shared credentials cabinet: medical PDF records, dining waivers, NSO schedules, and on-premises approvals.
                  </p>
                  
                  <div className="space-y-2 text-xs">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-2.5 bg-slate-850 hover:bg-slate-800 rounded-lg border border-slate-800/80 transition text-slate-100">
                        <div className="flex flex-col truncate pr-2">
                          <span className="font-semibold block truncate text-slate-150">{doc.name}</span>
                          <span className="text-[9px] text-slate-505 uppercase tracking-wide">{doc.type} • {doc.size}</span>
                        </div>
                        <span className={`text-[9px] font-bold uppercase shrink-0 px-2.5 py-0.5 rounded-md ${
                          doc.status === "APPROVED" || doc.status === "COMPLETED" 
                            ? "bg-green-950/80 text-green-400 border border-green-900" 
                            : "bg-amber-955 text-amber-400 border border-amber-900"
                        }`}>
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: DISCOVER THE UNIVERSITY */}
          {activeTab === "discover" && (
            <div className="space-y-6 animate-in fade-in duration-250">
              
              {/* Filter controls */}
              <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">🏫 STAI ⇒ Discover UPenn Knowledge Base</h3>
                    <p className="text-xs text-gray-500">Curated logistical profiles for freshers. Type questions below or search parameters.</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setDiscoverCat("all")}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
                        discoverCat === "all" ? "bg-[#011F5B] text-white" : "border-gray-250 bg-white"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setDiscoverCat("dining")}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
                        discoverCat === "dining" ? "bg-[#011F5B] text-white" : "border-gray-250 bg-white"
                      }`}
                    >
                      Dining
                    </button>
                    <button
                      onClick={() => setDiscoverCat("housing")}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
                        discoverCat === "housing" ? "bg-[#011F5B] text-white" : "border-gray-250 bg-white"
                      }`}
                    >
                      Housing
                    </button>
                    <button
                      onClick={() => setDiscoverCat("resources")}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
                        discoverCat === "resources" ? "bg-[#011F5B] text-white" : "border-gray-250 bg-white"
                      }`}
                    >
                      Core Resources
                    </button>
                    <button
                      onClick={() => setDiscoverCat("safety")}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
                        discoverCat === "safety" ? "bg-[#011F5B] text-white" : "border-gray-250 bg-white"
                      }`}
                    >
                      Transit & Safety
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <input
                    type="text"
                    value={discoverSearch}
                    onChange={(e) => setDiscoverSearch(e.target.value)}
                    placeholder="Search package rooms, blue light phones, 1920 Commons menus, Student Health..."
                    className="w-full text-sm p-3 border border-gray-200 focus:border-slate-350 focus:ring-1 focus:ring-slate-350 rounded-xl outline-hidden text-gray-800"
                  />
                </div>
              </div>

              {/* Grid content card display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {discoverItems
                  .filter(item => {
                    if (discoverCat !== "all" && item.category !== discoverCat) return false;
                    if (discoverSearch.trim()) {
                      const s = discoverSearch.toLowerCase();
                      return item.title.toLowerCase().includes(s) || 
                             item.description.toLowerCase().includes(s) || 
                             item.details.some(d => d.toLowerCase().includes(s));
                    }
                    return true;
                  })
                  .map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl border border-gray-150 p-6 shadow-xs space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className="text-[9px] bg-[#011F5B]/10 text-[#011F5B] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                            {item.category.toUpperCase()}
                          </span>
                          <h4 className="text-base font-bold text-slate-900 mt-1.5">{item.title}</h4>
                          <p className="text-xs text-gray-500">{item.description}</p>
                        </div>
                        
                        <button
                          onClick={() => {
                            setActiveTab("ask");
                          }}
                          className="text-[10px] border border-[#011F5B] text-[#011F5B] font-bold py-1 px-2.5 rounded-lg hover:bg-slate-50 transition"
                        >
                          Ask STAI-C
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                          Verified Reference Parameters
                        </span>
                        
                        <div className="space-y-2">
                          {item.details.map((detail, dIdx) => (
                            <div key={dIdx} className="flex gap-2 text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-gray-100">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#990000] shrink-0 mt-2" />
                              <span>{detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {item.location && (
                        <div className="border-t border-gray-100 pt-3.5 mt-2 flex items-center justify-between text-xs text-gray-400 italic">
                          <span>📍 Location Reference:</span>
                          <span className="text-[#011F5B] font-semibold">{item.location}</span>
                        </div>
                      )}
                    </div>
                  ))}
              </div>

            </div>
          )}

           {/* TAB 5: JOURNEY TRANSITION STORY TIMELINE (STAI-D) */}
          {activeTab === "journey" && (
            <div className="space-y-6 animate-in fade-in duration-250">
              
              <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-gray-100 pb-4 mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">📈 Gabby's Progressive Milestone Path</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Visual proof of the transition. The progression is memorable: STAI (Get Stay-ready) ➔ STAI-C (Interact & Ask) ➔ STAI-D (You have successfully Stayed).
                    </p>
                  </div>
                  <div className="shrink-0 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    💡 <span className="font-semibold text-slate-700">UX Tip:</span> Click status badges to push or pull milestones, or check off the micro-actions!
                  </div>
                </div>
                
                <div className="mt-8 relative border-l border-dashed border-slate-300 pl-6 space-y-8 ml-3.5">
                  {journeyMilestones.map((ms, idx) => {
                    const isCompleted = ms.status === "completed";
                    const isCurrent = ms.status === "current";

                    return (
                      <div key={ms.id} className="relative group">
                        
                        {/* Dynamic status nodes */}
                        <button 
                          onClick={() => cycleMilestoneStatus(ms.id)}
                          title="Click to cycle status"
                          className={`absolute -left-[35px] top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 cursor-pointer transition-transform hover:scale-110 ${
                            isCompleted
                              ? "bg-green-600 border-green-600 text-white shadow-xs"
                              : isCurrent
                                ? "bg-amber-100 border-amber-600 text-amber-800 scale-110 shadow-md ring-4 ring-amber-50"
                                : "bg-white border-slate-350 text-slate-400"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckSquare className="w-3.5 h-3.5" />
                          ) : isCurrent ? (
                            <Clock className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <span className="text-[10px] font-bold">{idx + 1}</span>
                          )}
                        </button>

                        {/* Card frame */}
                        <div className={`rounded-2xl border p-5 transition ${
                          isCurrent 
                            ? "bg-amber-50/20 border-amber-350 ring-1 ring-amber-300"
                            : "bg-white border-gray-150 group-hover:border-slate-300"
                        }`}>
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-slate-900">{ms.title}</h4>
                                <button
                                  onClick={() => cycleMilestoneStatus(ms.id)}
                                  title="Click to cycle milestone status"
                                  className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-sm hover:-translate-y-0.5 active:translate-y-0 transition-transform ${
                                    isCompleted 
                                      ? "bg-green-100 text-green-800" 
                                      : isCurrent 
                                        ? "bg-amber-100 text-amber-800 animate-pulse" 
                                        : "bg-gray-100 text-gray-400"
                                  }`}
                                >
                                  {ms.status.replace("_", " ")} 🔄
                                </button>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{ms.description}</p>
                            </div>
                            
                            <span className="text-xs font-semibold text-slate-500 bg-slate-50 border px-2 py-1 rounded">
                              {ms.dateText}
                            </span>
                          </div>

                          <div className="mt-4 pt-3.5 border-t border-gray-100 space-y-4">
                            
                            {/* University Actions Layer */}
                            <div>
                              <div className="flex items-center gap-1.5 mb-2">
                                <span className="text-[10px] text-[#990000] font-black uppercase tracking-wider">
                                  🏛️ Required Actions (University-Driven)
                                </span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {ms.actions.map((action, actIdx) => {
                                  const actionDone = completedJourneyActions.includes(action);
                                  return (
                                    <button
                                      key={`req-${actIdx}`} 
                                      onClick={() => toggleJourneyAction(action)}
                                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-xs text-slate-755 text-left transition ${
                                        actionDone 
                                          ? "bg-green-50/50 border-green-200 text-green-905" 
                                          : "bg-slate-50 hover:bg-slate-100 border-gray-100/70"
                                      }`}
                                    >
                                      <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                                        actionDone 
                                          ? "bg-green-600 border-green-600 text-white" 
                                          : "bg-white border-slate-300"
                                      }`}>
                                        {actionDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                      </div>
                                      <span className={`${actionDone ? "line-through text-slate-450" : ""}`}>{action}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Student Actions Layer (Adaptive / My Plan) */}
                            {ms.personalActions && ms.personalActions.length > 0 && (
                              <div>
                                <div className="flex items-center gap-1.5 mb-2">
                                  <span className="text-[10px] text-teal-700 font-black uppercase tracking-wider">
                                    🎒 My Plan (Student-Driven Transition)
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {ms.personalActions.map((action, actIdx) => {
                                    const actionDone = completedJourneyActions.includes(action);
                                    return (
                                      <button
                                        key={`pers-${actIdx}`} 
                                        onClick={() => toggleJourneyAction(action)}
                                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-xs text-teal-950 text-left transition ${
                                          actionDone 
                                            ? "bg-green-50/50 border-green-200 text-green-905" 
                                            : "bg-slate-50 hover:bg-slate-100 border-gray-100/70"
                                        }`}
                                      >
                                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                                          actionDone 
                                            ? "bg-teal-600 border-teal-600 text-white" 
                                            : "bg-white border-slate-300"
                                        }`}>
                                          {actionDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                        </div>
                                        <span className={`${actionDone ? "line-through text-slate-450" : ""}`}>{action}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Milestone Stage Cost Tracking Ledger */}
                            <div className="mt-5 pt-4.5 border-t border-slate-150 space-y-3 bg-slate-50/70 p-4.5 rounded-2xl border border-slate-200/50">
                              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1.5">
                                <span className="text-[10px] text-[#011F5B] font-black uppercase tracking-wider flex items-center gap-1">
                                  📊 Cost-Tracking Progress
                                </span>
                                <span className="text-[10px] font-mono font-bold text-slate-700 bg-white border border-gray-200 px-2 py-0.5 rounded shadow-2xs">
                                  Spent: ${purchases.filter(p => p.milestoneId === ms.id).reduce((sum, p) => sum + p.cost, 0).toLocaleString()} / Target: ${(milestoneBudgets[ms.id] || 500).toLocaleString()}
                                </span>
                              </div>

                              {/* Progress bar */}
                              {(() => {
                                const linked = purchases.filter(p => p.milestoneId === ms.id);
                                const total = linked.reduce((sum, p) => sum + p.cost, 0);
                                const target = milestoneBudgets[ms.id] || 500;
                                const pct = Math.min(Math.round((total / target) * 100), 100);
                                return (
                                  <div className="space-y-2">
                                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden relative">
                                      <div 
                                        className={`h-full transition-all duration-500 ease-out ${total > target ? "bg-red-500" : "bg-[#011F5B]"}`} 
                                        style={{ width: `${pct}%` }} 
                                      />
                                    </div>
                                    
                                    {/* Linked items */}
                                    {linked.length > 0 ? (
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                        {linked.map(p => (
                                          <div key={p.id} className="flex justify-between items-center p-2.5 bg-white rounded-xl border border-gray-150 text-[11px] shadow-2xs">
                                            <div className="truncate pr-1">
                                              <span className="font-semibold text-slate-800 truncate block">{p.name}</span>
                                              <span className="text-[9px] text-gray-400 capitalize">{p.owner} • {p.status}</span>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                              <span className="font-bold text-[#011F5B] font-mono">${p.cost.toLocaleString()}</span>
                                              <button
                                                onClick={() => {
                                                  setPurchases(prev => prev.map(item => item.id === p.id ? { ...item, milestoneId: undefined } : item));
                                                }}
                                                className="text-[9px] font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded px-1.5 py-0.5 cursor-pointer transition"
                                                title="Unlink from milestone"
                                              >
                                                Unlink
                                              </button>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-[10px] text-gray-400 italic">No ledger purchases currently linked to this transition stage.</p>
                                    )}
                                  </div>
                                );
                              })()}

                              {/* Action to link an existing unlinked purchase */}
                              <div className="flex items-center gap-1.5 pt-2 border-t border-dashed border-gray-200">
                                <span className="text-[9px] text-gray-500 font-bold uppercase shrink-0">Link Ledger Cost:</span>
                                <select
                                  value=""
                                  onChange={(e) => {
                                    const pId = e.target.value;
                                    if (pId) {
                                      setPurchases(prev => prev.map(item => item.id === pId ? { ...item, milestoneId: ms.id } : item));
                                    }
                                  }}
                                  className="text-[10px] py-1 px-2 border border-gray-200 rounded-lg bg-white text-slate-700 font-medium outline-hidden cursor-pointer shadow-3xs hover:border-slate-300 transition"
                                >
                                  <option value="">-- Choose unlinked expense --</option>
                                  {purchases.filter(p => !p.milestoneId).map(p => (
                                    <option key={p.id} value={p.id}>
                                      ${p.cost.toLocaleString()} - {p.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>

            </div>
          )}

        </div>

        {/* BOTTOM GLOBAL FLOATING DOCKET (Reduced Uncertainty Assistant Trigger) */}
        <section className="bg-white border-t border-gray-150 p-4 shrink-0 shadow-lg relative">
          <div className="max-w-xl mx-auto flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#011F5B] flex items-center justify-center text-white shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            
            <div className="flex-1 text-xs">
              <span className="text-[9px] text-[#990000] font-black uppercase tracking-wider block">
                Quick Ask (Instant Ask Layer)
              </span>
              <p className="text-gray-500 line-clamp-1">
                Query STAI-C instantly regarding any logistical parameters.
              </p>
            </div>

            <button
              onClick={() => {
                setActiveTab("ask");
                setIsChatOpen(true);
              }}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold transition hover:bg-slate-800 cursor-pointer"
            >
              Ask STAI-C
            </button>
          </div>
        </section>

      </main>

      {/* FLOATABLE RESPONSIVE STAI-C CHAT OVERLAY */}
      {isChatOpen && (
        <div className="fixed z-50 flex flex-col bg-white border border-slate-250 shadow-2xl transition-all duration-300
          inset-0 rounded-none md:inset-auto md:bottom-24 md:right-6 md:w-[440px] md:h-[620px] md:rounded-2xl overflow-hidden"
        >
          <Ask userRole={userRole} onSelectAction={() => {}} onClose={() => setIsChatOpen(false)} />
        </div>
      )}

      {/* FLOATING ACTION TRIGGER BUBBLE (Elevated slightly to float clearly above sticky docket) */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-24 right-6 z-40 flex items-center justify-center w-12 h-12 bg-[#011F5B] text-white rounded-full shadow-2xl hover:bg-[#001743] hover:scale-110 active:scale-95 transition-all duration-150 cursor-pointer border-2 border-white/20"
          id="floating-stai-c-btn"
          title="Ask STAI-C Chatbot (Pronounced Stacey)"
        >
          <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
        </button>
      )}
    </div>
  );
}
