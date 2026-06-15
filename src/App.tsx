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
  ArrowRight,
  Bell,
  AlertTriangle,
  X,
  Home,
  Plane
} from "lucide-react";
import { 
  UserRole, 
  ReadinessArea, 
  ReadinessStatus, 
  Task, 
  CalendarEvent, 
  JourneyMilestone, 
  DiscoverItem,
  FamilyPlanningItem,
  TravelItem,
  ExpenseItem,
  ExpenseCategory
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
import CalendarView from "./components/CalendarView";
import HousingView from "./components/HousingView";

export default function App() {
  // Navigation State (READY center acts as the core dashboard)
  const [activeTab, setActiveTab] = useState<"ask" | "ready" | "plan" | "discover" | "journey" | "travel" | "finances" | "calendar" | "housing">("journey");
  
  // Chat Overlay State (STAI-C Stacey)
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Finances / Budgets & Expenses State
  const [totalBudget, setTotalBudget] = useState<number>(5000);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    {
      id: "exp1",
      name: "American Airlines ORD ➔ PHL Flight",
      category: "Travel",
      amount: 350,
      date: "2026-06-10",
      paidBy: "parent",
      milestoneId: "m3",
      requiredOrOptional: "required",
      status: "spent",
      notes: "Outbound flight paid by Adrian. Conf AA-99824X",
      receipt: "AA_Receipt_ORD_PHL.pdf"
    },
    {
      id: "exp2",
      name: "Sheraton University City - 2 Nights Stay",
      category: "Housing",
      amount: 450,
      date: "2026-06-12",
      paidBy: "parent",
      milestoneId: "m3",
      requiredOrOptional: "required",
      status: "spent",
      notes: "Move-In accommodation booked by parent.",
      receipt: "Sheraton_Booking_SH882415.pdf"
    },
    {
      id: "exp3",
      name: "Twin XL Mattress Topper",
      category: "Room Setup",
      amount: 85,
      date: "2026-07-20",
      paidBy: "both",
      milestoneId: "m4",
      requiredOrOptional: "optional",
      status: "planned",
      notes: "Target premium memory foam planned budget",
    },
    {
      id: "exp4",
      name: "Warm-Light Study Desk Lamp",
      category: "Room Setup",
      amount: 30,
      date: "2026-07-25",
      paidBy: "student",
      milestoneId: "m4",
      requiredOrOptional: "required",
      status: "planned",
      notes: "Gabby requested. Must fit Ware House desk size and be low-wattage",
    },
    {
      id: "exp5",
      name: "Penn Dining Meal Plan commitment (Blue Plan)",
      category: "Food",
      amount: 1250,
      date: "2026-05-30",
      paidBy: "parent",
      milestoneId: "m5",
      requiredOrOptional: "required",
      status: "spent",
      notes: "First term dining plan standard required commitment",
      receipt: "PennPay_Dining_F24.pdf"
    },
    {
      id: "exp6",
      name: "Heavy Duty Plastic Storage Bins",
      category: "Room Setup",
      amount: 45,
      date: "2026-07-28",
      paidBy: "student",
      milestoneId: "m4",
      requiredOrOptional: "required",
      status: "planned",
      notes: "3 bins from Target to organize layout under-bed in Ware House"
    },
    {
      id: "exp7",
      name: "UH-1 Laptop & Campus Tech Bundle",
      category: "Technology",
      amount: 1100,
      date: "2026-05-15",
      paidBy: "parent",
      milestoneId: "m1",
      requiredOrOptional: "required",
      status: "spent",
      notes: "Penn Computer Connection configuration package.",
      receipt: "PCC_TechBundle_Receipt.pdf"
    },
    {
      id: "exp8",
      name: "Textbooks & Syllabus Supplies",
      category: "School Supplies",
      amount: 220,
      date: "2026-08-20",
      paidBy: "student",
      milestoneId: "m5",
      requiredOrOptional: "required",
      status: "planned",
      notes: "Syllabus mandatory readings for courses"
    },
    {
      id: "exp9",
      name: "Uber/Lyft airport ground transport PHL -> Quad",
      category: "Travel",
      amount: 35,
      date: "2026-08-21",
      paidBy: "student",
      milestoneId: "m3",
      requiredOrOptional: "optional",
      status: "planned",
      notes: "Fallback if university bus shuttle is crowded"
    }
  ]);

  // Can I Afford This Form State
  const [affordItemName, setAffordItemName] = useState("");
  const [affordItemCost, setAffordItemCost] = useState("");
  const [affordGuidance, setAffordGuidance] = useState<{
    canAfford: boolean;
    recommendation: string;
    metricsText: string;
  } | null>(null);

  // Manual Expense Form State
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [expName, setExpName] = useState("");
  const [expCategory, setExpCategory] = useState<ExpenseCategory>("Room Setup");
  const [expAmount, setExpAmount] = useState("");
  const [expDate, setExpDate] = useState("2026-08-15");
  const [expPaidBy, setExpPaidBy] = useState<"student" | "parent" | "both">("both");
  const [expMilestoneId, setExpMilestoneId] = useState<string>("none");
  const [expRequiredOrOptional, setExpRequiredOrOptional] = useState<"required" | "optional">("required");
  const [expStatus, setExpStatus] = useState<"spent" | "planned">("planned");
  const [expNotes, setExpNotes] = useState("");
  const [expReceipt, setExpReceipt] = useState("");

  const handleAddExpense = () => {
    if (!expName.trim() || !expAmount) return;
    const newExp: ExpenseItem = {
      id: `exp-${Date.now()}`,
      name: expName,
      category: expCategory,
      amount: Number(expAmount),
      date: expDate,
      paidBy: expPaidBy,
      milestoneId: expMilestoneId === "none" ? undefined : expMilestoneId,
      requiredOrOptional: expRequiredOrOptional,
      status: expStatus,
      notes: expNotes ? expNotes : undefined,
      receipt: expReceipt ? expReceipt : undefined
    };

    setExpenses(prev => [...prev, newExp]);
    // Reset Form
    setExpName("");
    setExpCategory("Room Setup");
    setExpAmount("");
    setExpPaidBy("both");
    setExpMilestoneId("none");
    setExpRequiredOrOptional("required");
    setExpStatus("planned");
    setExpNotes("");
    setExpReceipt("");
    setIsAddingExpense(false);
  };

  const handleApplyAffordEvaluation = () => {
    if (!affordItemName.trim() || !affordItemCost) return;
    const cost = Number(affordItemCost);
    if (isNaN(cost) || cost <= 0) return;

    // We can evaluate:
    // Available Funds = Total Budget - Total Spent
    // Planned Expenses
    // Remaining = Available - Planned
    const totalSpent = expenses.filter(e => e.status === "spent").reduce((acc, curr) => acc + curr.amount, 0);
    const totalPlanned = expenses.filter(e => e.status === "planned").reduce((acc, curr) => acc + curr.amount, 0);
    const availableFunds = totalBudget - totalSpent;
    const remainingBudget = availableFunds - totalPlanned;

    let canAfford = false;
    let recommendation = "";
    
    if (cost > remainingBudget && cost <= availableFunds) {
      canAfford = true;
      recommendation = "You can technically afford this from currently available cash, but doing so will reduce your remaining buffer. This will cut into your planned expenses (like bedding, books, or storage). Consider waiting or cutting down on other upcoming costs.";
    } else if (cost > availableFunds) {
      canAfford = false;
      recommendation = "This item exceeds your current available cash balance. It is highly recommended to wait, consult your parent/co-planner, or find an alternative, as purchasing this would run you over your available funds.";
    } else if (cost <= remainingBudget) {
      canAfford = true;
      if (cost < 50) {
        recommendation = "You can comfortably afford this! This is a relatively micro purchase and fits perfectly within your remaining buffer without impacting any high-priority planned items.";
      } else {
        recommendation = "This purchase fits beautifully within your remaining transition buffer. No need to second-guess this purchase; spending remains fully on track and well-allocated!";
      }
    }

    setAffordGuidance({
      canAfford,
      recommendation,
      metricsText: `Cost: $${cost.toLocaleString()} | Current Available Cash: $${availableFunds.toLocaleString()} | Remaining Plan Buffer: $${remainingBudget.toLocaleString()}`
    });
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

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

  // Family and Student Planning Items inside Milestones State
  const [familyPlanningItems, setFamilyPlanningItems] = useState<FamilyPlanningItem[]>([
    {
      id: "fp1",
      milestoneId: "m4",
      title: "Order a warm-light study desk lamp",
      notes: "Gabby requested: 'I want a desk lamp.' Must fit Ware House desk size and be low-wattage.",
      purchaseNeeded: true,
      assignedTo: "student",
      dueDate: "2026-07-25",
      status: "pending"
    },
    {
      id: "fp2",
      milestoneId: "m4",
      title: "Obtain heavy-duty plastic storage bins",
      notes: "Gabby requested: 'I need storage bins.' To organize under-bed layout space in the Quad.",
      purchaseNeeded: true,
      assignedTo: "student",
      dueDate: "2026-07-28",
      status: "pending"
    },
    {
      id: "fp3",
      milestoneId: "m2",
      title: "Coordinate shared appliances with Quad roommate",
      notes: "Gabby requested: 'I want to coordinate with my roommate.' Shared Micro-Fridge and carpets agreed on.",
      purchaseNeeded: false,
      assignedTo: "student",
      dueDate: "2026-06-20",
      status: "completed"
    },
    {
      id: "fp4",
      milestoneId: "m3",
      title: "Book primary move-in flight to PHL",
      notes: "Adrian requested: 'Book flight.' Co-tracking ORD to PHL flights together.",
      purchaseNeeded: true,
      assignedTo: "parent",
      dueDate: "2026-06-30",
      status: "in_progress",
      attachment: "AA-99824X Check"
    },
    {
      id: "fp5",
      milestoneId: "m3",
      title: "Reserve hotel room adjacent to campus",
      notes: "Adrian requested: 'Reserve hotel.' Booked Sheraton University City Chestnut location.",
      purchaseNeeded: true,
      assignedTo: "parent",
      dueDate: "2026-07-01",
      status: "completed",
      attachment: "Sheraton Conf #882415"
    },
    {
      id: "fp6",
      milestoneId: "m3",
      title: "Confirm hotel late checkout limits",
      notes: "Adrian requested: 'Confirm checkout.' Sheraton desk confirms 1:00 PM standard.",
      purchaseNeeded: false,
      assignedTo: "parent",
      dueDate: "2026-07-15",
      status: "pending"
    },
    {
      id: "fp7",
      milestoneId: "m3",
      title: "Arrange PHL airport to Quad transportation",
      notes: "Adrian requested: 'Arrange airport transportation.' Pre-checking Lyft shuttle options.",
      purchaseNeeded: false,
      assignedTo: "both",
      dueDate: "2026-08-15",
      status: "pending"
    }
  ]);

  // Travel API / Planning Layer State
  const [travelItems, setTravelItems] = useState<TravelItem[]>([
    {
      id: "tr1",
      type: "flight",
      title: "American Airlines ORD ➔ PHL (Gabby & Adrian)",
      estimatedCost: 350,
      status: "booked",
      confirmationNumber: "AA-99824X",
      deadlineDate: "2026-08-21",
      startLocation: "Chicago O'Hare (ORD)",
      endLocation: "Philadelphia Intl (PHL)",
      mapDistanceTime: "740 miles • 2h 10m",
      notes: "Outbound flight together with 3 check-in bags of dorm essentials."
    },
    {
      id: "tr2",
      type: "flight",
      title: "United Airlines PHL ➔ ORD (Adrian Returning)",
      estimatedCost: 220,
      status: "booked",
      confirmationNumber: "UA-553140",
      deadlineDate: "2026-08-23",
      startLocation: "Philadelphia (PHL)",
      endLocation: "Chicago O'Hare (ORD)",
      mapDistanceTime: "740 miles • 2h 15m",
      notes: "Adrian returning home after freshman convocation and dorm assembly is completed."
    },
    {
      id: "tr3",
      type: "hotel",
      title: "Sheraton Philadelphia University City",
      estimatedCost: 450,
      status: "booked",
      confirmationNumber: "SH-882415",
      deadlineDate: "2026-08-21",
      startLocation: "3549 Chestnut St, Philadelphia",
      endLocation: "0.4 miles from Ware House",
      mapDistanceTime: "0.4 miles • 3m drive / 8m walk",
      notes: "Excellent position close to campus for unloading support storage boxes."
    },
    {
      id: "tr4",
      type: "train",
      title: "Amtrak Regional Route Comparison",
      estimatedCost: 95,
      status: "comparing",
      deadlineDate: "2026-07-20",
      startLocation: "Philadelphia 30th St Station",
      endLocation: "Trenton NJ",
      mapDistanceTime: "28 miles • 30m train transit",
      notes: "Comparing weekend trip options to check relative transit timing for early term."
    },
    {
      id: "tr5",
      type: "rideshare_transit",
      title: "Lyft airport rideshare PHL to The Quad",
      estimatedCost: 35,
      status: "planned",
      deadlineDate: "2026-08-21",
      startLocation: "PHL baggage claim Arrivals",
      endLocation: "3700 Spruce St (The Quadrangle)",
      mapDistanceTime: "7.5 miles • 15m minutes drive",
      notes: "Direct car from PHL to Ware House. Heavy luggage transit fallback."
    }
  ]);

  // STAI System Alerts State
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  // Dynamic live alert generator evaluating core transition attributes
  interface STAIAlert {
    id: string;
    level: "high" | "low";
    title: string;
    description: string;
    relatedDate: string;
    source: string;
    linkTab: "ask" | "ready" | "plan" | "discover" | "journey" | "travel" | "finances";
    linkId?: string;
  }

  const getActiveAlerts = (): STAIAlert[] => {
    const alerts: STAIAlert[] = [];
    const todayStr = "2026-06-15";

    const getDaysDiff = (dateStr: string) => {
      if (!dateStr) return 999;
      try {
        const itemDate = new Date(dateStr);
        const currDate = new Date(todayStr);
        const diffTime = itemDate.getTime() - currDate.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      } catch (e) {
        return 999;
      }
    };

    // 1. Evaluate Tasks list for overdue/approaching mandatory deadlines
    tasks.forEach(t => {
      if (t.completed) return;
      const daysDiff = getDaysDiff(t.dueDate);
      if (daysDiff < 0) {
        alerts.push({
          id: `task-od-${t.id}`,
          level: "high",
          title: `Overdue Checklist: ${t.title}`,
          description: `Required clearance milestone "${t.title}" is overdue since ${t.dueDate}. Immediate Penn portal submittal requested.`,
          relatedDate: t.dueDate,
          source: t.category.toUpperCase() + " HUB",
          linkTab: "plan",
          linkId: t.id
        });
      } else if (daysDiff === 0 || daysDiff === 1) {
        alerts.push({
          id: `task-urgent-${t.id}`,
          level: "high",
          title: `Clearance Imminent: ${t.title}`,
          description: `Checklist requirement is due ${daysDiff === 0 ? "TODAY" : "TOMORROW"}. Ensure files are transmitted.`,
          relatedDate: t.dueDate,
          source: t.category.toUpperCase() + " HUB",
          linkTab: "plan",
          linkId: t.id
        });
      } else if (daysDiff > 1 && daysDiff <= 10) {
        alerts.push({
          id: `task-low-${t.id}`,
          level: "low",
          title: `Checklist Milestone: ${t.title}`,
          description: `Clearance requirement is scheduled due in ${daysDiff} days.`,
          relatedDate: t.dueDate,
          source: t.category.toUpperCase() + " HUB",
          linkTab: "plan",
          linkId: t.id
        });
      }
    });

    // 2. Evaluate Expenses for impending planned payment deadlines
    expenses.forEach(e => {
      if (e.status === "spent") return;
      const daysDiff = getDaysDiff(e.date);
      if (daysDiff < 0) {
        alerts.push({
          id: `exp-od-${e.id}`,
          level: "high",
          title: `Overdue Payment: ${e.name}`,
          description: `Planned transition expense was set for ${e.date}. Please reconcile your finances dashboard.`,
          relatedDate: e.date,
          source: "FINANCES LEDGER",
          linkTab: "finances",
          linkId: e.id
        });
      } else if (daysDiff >= 0 && daysDiff <= 3) {
        alerts.push({
          id: `exp-urgent-${e.id}`,
          level: "high",
          title: `Imminent Ledger Deposit: ${e.name}`,
          description: `Allocated amount of $${e.amount} approaches payment threshold in ${daysDiff} days (${e.date}).`,
          relatedDate: e.date,
          source: "FINANCES LEDGER",
          linkTab: "finances",
          linkId: e.id
        });
      } else if (daysDiff > 3 && daysDiff <= 15) {
        alerts.push({
          id: `exp-low-${e.id}`,
          level: "low",
          title: `Upcoming Ledger Deposit: ${e.name}`,
          description: `Planned $${e.amount} deposit is set for ${e.date}. Previewing buffer clearances.`,
          relatedDate: e.date,
          source: "FINANCES LEDGER",
          linkTab: "finances",
          linkId: e.id
        });
      }
    });

    // 3. Evaluate Family Planning milestones in general
    familyPlanningItems.forEach(fp => {
      if (fp.status === "completed") return;
      const daysDiff = getDaysDiff(fp.dueDate);
      if (daysDiff < 0) {
        alerts.push({
          id: `fp-od-${fp.id}`,
          level: "high",
          title: `Overdue Family Action: ${fp.title}`,
          description: `Milestone coordinator task was due ${fp.dueDate}. Check details and update progress.`,
          relatedDate: fp.dueDate,
          source: fp.assignedTo.toUpperCase() + " ACTION",
          linkTab: "ready",
          linkId: fp.id
        });
      } else if (daysDiff >= 0 && daysDiff <= 3) {
        alerts.push({
          id: `fp-urgent-${fp.id}`,
          level: "high",
          title: `Imminent Family Action: ${fp.title}`,
          description: `Coordinated milestone assignment approaches due date in ${daysDiff} days.`,
          relatedDate: fp.dueDate,
          source: fp.assignedTo.toUpperCase() + " ACTION",
          linkTab: "ready",
          linkId: fp.id
        });
      } else if (daysDiff > 3 && daysDiff <= 14) {
        alerts.push({
          id: `fp-low-${fp.id}`,
          level: "low",
          title: `Future Milestone Planning: ${fp.title}`,
          description: `Pending milestone action approaching on ${fp.dueDate}.`,
          relatedDate: fp.dueDate,
          source: fp.assignedTo.toUpperCase() + " ACTION",
          linkTab: "ready",
          linkId: fp.id
        });
      }
    });

    // 4. Evaluate Travel bookings
    travelItems.forEach(tr => {
      const daysDiff = getDaysDiff(tr.deadlineDate);
      if (tr.status !== "booked") {
        if (daysDiff <= 5) {
          alerts.push({
            id: `tr-unbook-urgent-${tr.id}`,
            level: "high",
            title: `Reservation Required: ${tr.title}`,
            description: `Unconfirmed travel item requires manual booking! Scheduled deadline: ${tr.deadlineDate}.`,
            relatedDate: tr.deadlineDate,
            source: "TRAVEL COORDINATES",
            linkTab: "travel",
            linkId: tr.id
          });
        } else {
          alerts.push({
            id: `tr-unbook-low-${tr.id}`,
            level: "low",
            title: `Check Travel Segment: ${tr.title}`,
            description: `Review is required to lock in the reservation before ${tr.deadlineDate}.`,
            relatedDate: tr.deadlineDate,
            source: "TRAVEL COORDINATES",
            linkTab: "travel",
            linkId: tr.id
          });
        }
      } else if (daysDiff >= 0 && daysDiff <= 12) {
        alerts.push({
          id: `tr-booked-low-${tr.id}`,
          level: "low",
          title: `Approaching Travel: ${tr.title}`,
          description: `Confirmed ${tr.type === "flight" ? "flight" : "hotel"} arrives in ${daysDiff} days. Confirmation is active.`,
          relatedDate: tr.deadlineDate,
          source: "TRAVEL COORDINATES",
          linkTab: "travel",
          linkId: tr.id
        });
      }
    });

    // 5. Evaluate Calendar events
    calendarEvents.forEach(evt => {
      const daysDiff = getDaysDiff(evt.date);
      if (daysDiff >= 0 && daysDiff <= 2) {
        alerts.push({
          id: `calendar-urgent-${evt.title}`,
          level: "high",
          title: `Immediate Landmark: ${evt.title}`,
          description: `Mandatory session starting at ${evt.location || "campus"} in ${daysDiff === 0 ? "today" : daysDiff === 1 ? "tomorrow" : daysDiff + " days"}.`,
          relatedDate: evt.date,
          source: "CALENDAR SCHEDULER",
          linkTab: "journey"
        });
      } else if (daysDiff > 2 && daysDiff <= 14) {
        alerts.push({
          id: `calendar-low-${evt.title}`,
          level: "low",
          title: `Upcoming Event Landmark: ${evt.title}`,
          description: `Orientation/Transition schedule event on ${evt.date}. Location: ${evt.location || "campus"}.`,
          relatedDate: evt.date,
          source: "CALENDAR SCHEDULER",
          linkTab: "journey"
        });
      }
    });

    // Sorting protocol
    const highAlerts = alerts
      .filter(a => a.level === "high")
      .sort((a, b) => {
        const diffA = getDaysDiff(a.relatedDate);
        const diffB = getDaysDiff(b.relatedDate);
        if (diffA < 0 && diffB < 0) return diffA - diffB;
        if (diffA < 0) return -1;
        if (diffB < 0) return 1;
        return diffA - diffB;
      });

    const lowAlerts = alerts
      .filter(a => a.level === "low")
      .sort((a, b) => {
        const diffA = getDaysDiff(a.relatedDate);
        const diffB = getDaysDiff(b.relatedDate);
        return diffA - diffB;
      });

    return [...highAlerts, ...lowAlerts];
  };

  const currentAlerts = getActiveAlerts();
  const highAlertCount = currentAlerts.filter(a => a.level === "high").length;
  const lowAlertCount = currentAlerts.filter(a => a.level === "low").length;

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

  // State managers and handlers for Milestone level Family Planning layer (Second Priority)
  const [editingFamilyItemId, setEditingFamilyItemId] = useState<string | null>(null);
  const [addingFamilyItemMilestoneId, setAddingFamilyItemMilestoneId] = useState<string | null>(null);

  const [familyFormTitle, setFamilyFormTitle] = useState("");
  const [familyFormNotes, setFamilyFormNotes] = useState("");
  const [familyFormPurchaseNeeded, setFamilyFormPurchaseNeeded] = useState(false);
  const [familyFormAssignedTo, setFamilyFormAssignedTo] = useState<"student" | "parent" | "both">("both");
  const [familyFormDueDate, setFamilyFormDueDate] = useState("2026-08-15");
  const [familyFormStatus, setFamilyFormStatus] = useState<"completed" | "pending" | "in_progress">("pending");
  const [familyFormAttachment, setFamilyFormAttachment] = useState("");

  const handleAddFamilyItem = (milestoneId: string) => {
    if (!familyFormTitle.trim()) return;
    const newItem: FamilyPlanningItem = {
      id: `family-${Date.now()}`,
      milestoneId,
      title: familyFormTitle,
      notes: familyFormNotes ? familyFormNotes : undefined,
      purchaseNeeded: familyFormPurchaseNeeded,
      assignedTo: familyFormAssignedTo,
      dueDate: familyFormDueDate,
      status: familyFormStatus,
      attachment: familyFormAttachment ? familyFormAttachment : undefined
    };
    setFamilyPlanningItems(prev => [...prev, newItem]);
    resetFamilyForm();
  };

  const handleStartEditFamilyItem = (item: FamilyPlanningItem) => {
    setEditingFamilyItemId(item.id);
    setAddingFamilyItemMilestoneId(null);
    setFamilyFormTitle(item.title);
    setFamilyFormNotes(item.notes || "");
    setFamilyFormPurchaseNeeded(item.purchaseNeeded);
    setFamilyFormAssignedTo(item.assignedTo);
    setFamilyFormDueDate(item.dueDate);
    setFamilyFormStatus(item.status);
    setFamilyFormAttachment(item.attachment || "");
  };

  const handleSaveEditFamilyItem = (id: string) => {
    if (!familyFormTitle.trim()) return;
    setFamilyPlanningItems(prev => prev.map(item => item.id === id ? {
      ...item,
      title: familyFormTitle,
      notes: familyFormNotes ? familyFormNotes : undefined,
      purchaseNeeded: familyFormPurchaseNeeded,
      assignedTo: familyFormAssignedTo,
      dueDate: familyFormDueDate,
      status: familyFormStatus,
      attachment: familyFormAttachment ? familyFormAttachment : undefined
    } : item));
    resetFamilyForm();
  };

  const handleDeleteFamilyItem = (id: string) => {
    setFamilyPlanningItems(prev => prev.filter(item => item.id !== id));
  };

  const resetFamilyForm = () => {
    setEditingFamilyItemId(null);
    setAddingFamilyItemMilestoneId(null);
    setFamilyFormTitle("");
    setFamilyFormNotes("");
    setFamilyFormPurchaseNeeded(false);
    setFamilyFormAssignedTo("both");
    setFamilyFormDueDate("2026-08-15");
    setFamilyFormStatus("pending");
    setFamilyFormAttachment("");
  };

  // State managers and handlers for Travel Layer (Third Priority)
  const [addingTravelPlan, setAddingTravelPlan] = useState(false);
  const [editingTravelId, setEditingTravelId] = useState<string | null>(null);

  const [travelFormType, setTravelFormType] = useState<"flight" | "hotel" | "train" | "rideshare_transit">("flight");
  const [travelFormTitle, setTravelFormTitle] = useState("");
  const [travelFormEstCost, setTravelFormEstCost] = useState(150);
  const [travelFormStatus, setTravelFormStatus] = useState<"booked" | "comparing" | "planned">("planned");
  const [travelFormConfRef, setTravelFormConfRef] = useState("");
  const [travelFormDeadline, setTravelFormDeadline] = useState("2026-08-21");
  const [travelFormStart, setTravelFormStart] = useState("");
  const [travelFormEnd, setTravelFormEnd] = useState("");
  const [travelFormDistanceTime, setTravelFormDistanceTime] = useState("");
  const [travelFormNotes, setTravelFormNotes] = useState("");

  const handleAddTravelItem = () => {
    if (!travelFormTitle.trim()) return;
    const item: TravelItem = {
      id: `travel-${Date.now()}`,
      type: travelFormType,
      title: travelFormTitle,
      estimatedCost: Number(travelFormEstCost),
      status: travelFormStatus,
      confirmationNumber: travelFormConfRef ? travelFormConfRef : undefined,
      deadlineDate: travelFormDeadline,
      startLocation: travelFormStart ? travelFormStart : undefined,
      endLocation: travelFormEnd ? travelFormEnd : undefined,
      mapDistanceTime: travelFormDistanceTime ? travelFormDistanceTime : undefined,
      notes: travelFormNotes ? travelFormNotes : undefined
    };
    setTravelItems(prev => [...prev, item]);
    resetTravelForm();
  };

  const handleStartEditTravelItem = (item: TravelItem) => {
    setEditingTravelId(item.id);
    setAddingTravelPlan(true);
    setTravelFormType(item.type);
    setTravelFormTitle(item.title);
    setTravelFormEstCost(item.estimatedCost);
    setTravelFormStatus(item.status);
    setTravelFormConfRef(item.confirmationNumber || "");
    setTravelFormDeadline(item.deadlineDate);
    setTravelFormStart(item.startLocation || "");
    setTravelFormEnd(item.endLocation || "");
    setTravelFormDistanceTime(item.mapDistanceTime || "");
    setTravelFormNotes(item.notes || "");
  };

  const handleSaveEditTravelItem = (id: string) => {
    if (!travelFormTitle.trim()) return;
    setTravelItems(prev => prev.map(item => item.id === id ? {
      ...item,
      type: travelFormType,
      title: travelFormTitle,
      estimatedCost: Number(travelFormEstCost),
      status: travelFormStatus,
      confirmationNumber: travelFormConfRef ? travelFormConfRef : undefined,
      deadlineDate: travelFormDeadline,
      startLocation: travelFormStart ? travelFormStart : undefined,
      endLocation: travelFormEnd ? travelFormEnd : undefined,
      mapDistanceTime: travelFormDistanceTime ? travelFormDistanceTime : undefined,
      notes: travelFormNotes ? travelFormNotes : undefined
    } : item));
    resetTravelForm();
  };

  const handleDeleteTravelItem = (id: string) => {
    setTravelItems(prev => prev.filter(item => item.id !== id));
  };

  const resetTravelForm = () => {
    setAddingTravelPlan(false);
    setEditingTravelId(null);
    setTravelFormType("flight");
    setTravelFormTitle("");
    setTravelFormEstCost(150);
    setTravelFormStatus("planned");
    setTravelFormConfRef("");
    setTravelFormDeadline("2026-08-21");
    setTravelFormStart("");
    setTravelFormEnd("");
    setTravelFormDistanceTime("");
    setTravelFormNotes("");
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
    <div className="min-h-screen md:h-screen bg-[#F5F5F7] text-[#1D1D1F] flex flex-col md:flex-row font-sans selection:bg-[#011F5B] selection:text-white antialiased md:overflow-hidden">
      
      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-76 bg-white border-b md:border-b-0 md:border-r border-gray-200/85 flex flex-col shrink-0 md:h-full md:overflow-y-auto">
        
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

        {/* STAI Live Transition Alerts Widget */}
        <div id="stai-alert-indicator-box" className="px-4 py-3 mx-4 mt-2 bg-white rounded-xl border border-rose-150 shadow-3xs flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
              <Bell className="w-3.5 h-3.5 text-red-650 animate-bounce" />
              <span>STAI System Alerts</span>
            </div>
            <button 
              onClick={() => setIsAlertModalOpen(true)}
              className="text-[10px] text-[#011F5B] hover:underline font-bold"
            >
              View List
            </button>
          </div>
          <div 
            onClick={() => setIsAlertModalOpen(true)}
            className="grid grid-cols-2 gap-2 cursor-pointer pt-0.5"
            title="Open active alerts details"
          >
            <div className="bg-rose-50 border border-rose-100 rounded-lg p-2 flex flex-col items-center justify-center hover:bg-rose-100/50 transition duration-150">
              <span className="text-lg font-black font-sans text-red-750 leading-none">{highAlertCount}</span>
              <span className="text-[9px] font-bold text-red-700 uppercase tracking-tight mt-1">High Alert</span>
            </div>
            <div className="bg-[#011F5B]/5 border border-blue-105 rounded-lg p-2 flex flex-col items-center justify-center hover:bg-[#011F5B]/10 transition duration-150">
              <span className="text-lg font-black font-sans text-[#011F5B] leading-none">{lowAlertCount}</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight mt-1 font-sans">Low Alert</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex-1 p-4 space-y-1.5">
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
              <span>Journey Timeline</span>
            </div>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
              STAI-D
            </span>
          </button>

          <button
            onClick={() => setActiveTab("calendar")}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === "calendar"
                ? "bg-[#011F5B] text-white shadow-xs"
                : "text-gray-600 hover:bg-slate-50 hover:text-slate-950"
            }`}
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 shrink-0" />
              <span>Calendar</span>
            </div>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
              Month
            </span>
          </button>

          <button
            onClick={() => setActiveTab("finances")}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === "finances"
                ? "bg-[#011F5B] text-white shadow-xs"
                : "text-gray-600 hover:bg-slate-50 hover:text-slate-950"
            }`}
          >
            <div className="flex items-center gap-3">
              <DollarSign className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>Finances</span>
            </div>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
              Ledger
            </span>
          </button>

          <button
            onClick={() => setActiveTab("travel")}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === "travel"
                ? "bg-[#011F5B] text-white shadow-xs"
                : "text-gray-600 hover:bg-slate-50 hover:text-slate-950"
            }`}
          >
            <div className="flex items-center gap-3">
              <Plane className="w-4 h-4 shrink-0 text-blue-500" />
              <span>Travel</span>
            </div>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
              Logs
            </span>
          </button>

          <button
            onClick={() => setActiveTab("housing")}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === "housing"
                ? "bg-[#011F5B] text-white shadow-xs"
                : "text-gray-600 hover:bg-slate-50 hover:text-slate-950"
            }`}
          >
            <div className="flex items-center gap-3">
              <Home className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Housing</span>
            </div>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">
              Dorm
            </span>
          </button>

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
              <Sparkles className="w-4 h-4 shrink-0 text-red-500" />
              <span>Ask STAI-C</span>
            </div>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/25 text-red-700 font-bold">
              Active
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
      <main className="flex-1 flex flex-col min-w-0 md:h-full overflow-hidden">
        
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
              <div 
                onClick={() => setIsAlertModalOpen(true)}
                className="mt-2.5 inline-flex items-center gap-2.5 bg-rose-50/70 hover:bg-rose-100 hover:scale-[1.01] active:scale-99 border border-rose-100 transition duration-155 rounded-xl px-3 py-1.5 cursor-pointer text-[11px] font-bold text-slate-700 shadow-3xs"
                title="Review transition alerts detailed checklist"
              >
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-650"></span>
                  </span>
                  <span className="text-red-700">High: {highAlertCount}</span>
                </div>
                <div className="h-3 w-[1px] bg-rose-200" />
                <div className="flex items-center gap-1">
                  <span className="text-[#011F5B]">Low: {lowAlertCount}</span>
                </div>
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

                  <div className="flex flex-wrap gap-2.5">
                    {[
                      { key: "all", label: "✨ All Portal" },
                      { key: "admissions", label: "🎓 Admissions" },
                      { key: "housing", label: "🏠 Housing" },
                      { key: "pennkey", label: "🔑 PennKey/2FA" },
                      { key: "pennpay", label: "💳 PennPay" },
                      { key: "dining", label: "🍽️ Dining Plan" },
                      { key: "orientation", label: "🎯 NSO Mandates" },
                      { key: "movein", label: "📦 Move-In Logistics" },
                      { key: "health", label: "🩺 Health Profile" },
                      { key: "penncard", label: "🎫 PennCard Pass" },
                      { key: "safety", label: "🛡️ Safety" },
                      { key: "packages", label: "📦 Mail/Packages" },
                      { key: "transportation", label: "🚇 Campus Transit" },
                      { key: "resources", label: "🏛️ Academic Advisors / Hubs" }
                    ].map(cat => (
                      <button
                        key={cat.key}
                        onClick={() => setDiscoverCat(cat.key)}
                        className={`text-xs px-3.5 py-1.8 rounded-full border font-semibold tracking-tight transition duration-150 cursor-pointer ${
                          discoverCat === cat.key
                            ? "bg-[#011F5B] text-white border-[#011F5B] shadow-sm scale-102"
                            : "border-gray-250 bg-slate-50 hover:bg-slate-100 text-slate-700"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
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

                            {/* Family & Student Planning Layer (Second Priority) */}
                            <div className="mt-4 pt-4 border-t border-gray-150">
                              <div className="flex justify-between items-center mb-2.5">
                                <span className="text-[10px] text-indigo-750 font-black uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                                  <span>👥 Family Planning Ledger ({familyPlanningItems.filter(f => f.milestoneId === ms.id).length})</span>
                                </span>
                                {addingFamilyItemMilestoneId !== ms.id && editingFamilyItemId === null && (
                                  <button
                                    onClick={() => {
                                      resetFamilyForm();
                                      setAddingFamilyItemMilestoneId(ms.id);
                                    }}
                                    className="text-[10px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-2 py-1 rounded-md transition duration-150 flex items-center gap-1 cursor-pointer"
                                  >
                                    <Plus className="w-3 h-3" /> Add Item
                                  </button>
                                )}
                              </div>

                              {/* Form to Add New Planning Item */}
                              {addingFamilyItemMilestoneId === ms.id && (
                                <div className="p-4 bg-slate-50 border border-indigo-150 rounded-xl mb-3 space-y-3 animate-in slide-in-from-top-1 duration-200">
                                  <h5 className="text-[11px] font-bold text-slate-800 uppercase tracking-tight">Create Custom Family Plan Element</h5>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                      <label className="text-[10px] font-bold text-gray-500 block mb-1">Title / Action Item *</label>
                                      <input
                                        type="text"
                                        placeholder="e.g. Purchase study lamp, coord roommate..."
                                        value={familyFormTitle}
                                        onChange={(e) => setFamilyFormTitle(e.target.value)}
                                        className="text-xs p-2 border border-gray-250 bg-white rounded-lg w-full text-slate-850"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-bold text-gray-500 block mb-1">Assigned To</label>
                                      <select
                                        value={familyFormAssignedTo}
                                        onChange={(e) => setFamilyFormAssignedTo(e.target.value as any)}
                                        className="text-xs p-2 border border-gray-250 bg-white rounded-lg w-full text-slate-850"
                                      >
                                        <option value="student">Gabby (Student)</option>
                                        <option value="parent">Adrian (Parent)</option>
                                        <option value="both">Both (Shared)</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                      <label className="text-[10px] font-bold text-gray-500 block mb-1">Due Date</label>
                                      <input
                                        type="date"
                                        value={familyFormDueDate}
                                        onChange={(e) => setFamilyFormDueDate(e.target.value)}
                                        className="text-xs p-2 border border-gray-250 bg-white rounded-lg w-full text-slate-850 font-mono"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-bold text-gray-500 block mb-1">Status</label>
                                      <select
                                        value={familyFormStatus}
                                        onChange={(e) => setFamilyFormStatus(e.target.value as any)}
                                        className="text-xs p-2 border border-gray-250 bg-white rounded-lg w-full text-slate-850"
                                      >
                                        <option value="pending">Pending</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                      </select>
                                    </div>
                                    <div className="flex items-center pt-5 h-full">
                                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-750 cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={familyFormPurchaseNeeded}
                                          onChange={(e) => setFamilyFormPurchaseNeeded(e.target.checked)}
                                          className="rounded text-indigo-600 focus:ring-indigo-505 w-4 h-4"
                                        />
                                        <span>Purchase Needed ($)</span>
                                      </label>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                      <label className="text-[10px] font-bold text-gray-500 block mb-1">Notes / Specifications</label>
                                      <input
                                        type="text"
                                        placeholder="Add notes, links or specs..."
                                        value={familyFormNotes}
                                        onChange={(e) => setFamilyFormNotes(e.target.value)}
                                        className="text-xs p-2 border border-gray-250 bg-white rounded-lg w-full text-slate-850"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-bold text-gray-500 block mb-1">Attachment / Booking Confirmation No.</label>
                                      <input
                                        type="text"
                                        placeholder="e.g. DL-1142, Confirmation #XYZ..."
                                        value={familyFormAttachment}
                                        onChange={(e) => setFamilyFormAttachment(e.target.value)}
                                        className="text-xs p-2 border border-gray-250 bg-white rounded-lg w-full text-slate-850"
                                      />
                                    </div>
                                  </div>

                                  <div className="flex justify-end gap-2 pt-1 border-t border-slate-200">
                                    <button
                                      type="button"
                                      onClick={resetFamilyForm}
                                      className="text-[11px] font-bold px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleAddFamilyItem(ms.id)}
                                      disabled={!familyFormTitle.trim()}
                                      className="text-[11px] font-bold px-3 py-1.5 bg-[#011F5B] text-white rounded-lg hover:bg-[#001743] disabled:opacity-50 cursor-pointer transition"
                                    >
                                      Save New Element
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Listing Milestone Specific Family Planning Items */}
                              <div className="space-y-2">
                                {familyPlanningItems.filter(f => f.milestoneId === ms.id).map(item => {
                                  const isEditingThis = editingFamilyItemId === item.id;
                                  return (
                                    <div key={item.id} className={`p-3 rounded-xl border text-xs ${
                                      item.status === "completed"
                                        ? "bg-slate-50/70 border-gray-150 text-slate-500"
                                        : item.status === "in_progress"
                                          ? "bg-amber-50/10 border-amber-200"
                                          : "bg-white border-gray-200 shadow-2xs"
                                    }`}>
                                      {isEditingThis ? (
                                        // EDIT FORM MODE INLINE
                                        <div className="space-y-3 p-1">
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <div>
                                              <label className="text-[9px] font-bold text-gray-500 block">Edit Title</label>
                                              <input
                                                type="text"
                                                value={familyFormTitle}
                                                onChange={(e) => setFamilyFormTitle(e.target.value)}
                                                className="text-xs p-1.5 border border-gray-200 rounded-md w-full"
                                              />
                                            </div>
                                            <div>
                                              <label className="text-[9px] font-bold text-gray-500 block">Assigned To</label>
                                              <select
                                                value={familyFormAssignedTo}
                                                onChange={(e) => setFamilyFormAssignedTo(e.target.value as any)}
                                                className="text-xs p-1.5 border border-gray-200 rounded-md w-full"
                                              >
                                                <option value="student">Gabby (Student)</option>
                                                <option value="parent">Adrian (Parent)</option>
                                                <option value="both">Both (Shared)</option>
                                              </select>
                                            </div>
                                          </div>
                                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                            <div>
                                              <label className="text-[9px] font-bold text-gray-500 block">Due Date</label>
                                              <input
                                                type="date"
                                                value={familyFormDueDate}
                                                onChange={(e) => setFamilyFormDueDate(e.target.value)}
                                                className="text-xs p-1.5 border border-gray-200 rounded-md w-full font-mono"
                                              />
                                            </div>
                                            <div>
                                              <label className="text-[9px] font-bold text-gray-500 block font-sans">Status</label>
                                              <select
                                                value={familyFormStatus}
                                                onChange={(e) => setFamilyFormStatus(e.target.value as any)}
                                                className="text-xs p-1.5 border border-gray-200 rounded-md w-full"
                                              >
                                                <option value="pending">Pending</option>
                                                <option value="in_progress">In Progress</option>
                                                <option value="completed">Completed</option>
                                              </select>
                                            </div>
                                            <div className="flex items-center pt-3.5">
                                              <label className="flex items-center gap-1.5 font-bold text-[11px] text-slate-700 cursor-pointer">
                                                <input
                                                  type="checkbox"
                                                  checked={familyFormPurchaseNeeded}
                                                  onChange={(e) => setFamilyFormPurchaseNeeded(e.target.checked)}
                                                  className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-0"
                                                />
                                                <span>Purchase?</span>
                                              </label>
                                            </div>
                                          </div>
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <div>
                                              <label className="text-[9px] font-bold text-gray-500 block">Notes</label>
                                              <input
                                                type="text"
                                                value={familyFormNotes}
                                                onChange={(e) => setFamilyFormNotes(e.target.value)}
                                                className="text-xs p-1.5 border border-gray-200 rounded-md w-full"
                                              />
                                            </div>
                                            <div>
                                              <label className="text-[9px] font-bold text-gray-500 block">Attachment Ref</label>
                                              <input
                                                type="text"
                                                value={familyFormAttachment}
                                                onChange={(e) => setFamilyFormAttachment(e.target.value)}
                                                className="text-xs p-1.5 border border-gray-200 rounded-md w-full"
                                              />
                                            </div>
                                          </div>
                                          <div className="flex justify-end gap-1.5 pt-2 border-t border-slate-100">
                                            <button
                                              type="button"
                                              onClick={resetFamilyForm}
                                              className="text-[10px] px-2 py-1 border border-gray-200 rounded-md hover:bg-slate-150"
                                            >
                                              Cancel
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => handleSaveEditFamilyItem(item.id)}
                                              className="text-[10px] px-2 py-1 bg-[#011F5B] hover:bg-slate-900 text-white rounded-md font-bold transition"
                                            >
                                              Save Changes
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        // DISPLAY MODE
                                        <div className="space-y-1.5">
                                          <div className="flex justify-between items-start gap-3">
                                            <div className="flex items-start gap-2 min-w-0">
                                              <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${
                                                item.status === "completed"
                                                  ? "bg-green-500"
                                                  : item.status === "in_progress"
                                                    ? "bg-amber-500 animate-pulse"
                                                    : "bg-slate-300"
                                              }`} />
                                              <div className="min-w-0">
                                                <p className={`font-bold text-slate-800 ${item.status === "completed" ? "line-through text-slate-400" : ""}`}>
                                                  {item.title}
                                                </p>
                                                <div className="flex flex-wrap items-center gap-2 mt-1 text-[10px] text-gray-550">
                                                  <span className="bg-indigo-50 text-indigo-750 px-1.5 py-0.2 rounded-md font-semibold text-[9px] uppercase border border-indigo-100">
                                                    👤 {item.assignedTo === "both" ? "Shared Goal" : item.assignedTo === "student" ? "Gabby" : "Adrian"}
                                                  </span>
                                                  <span>📅 Target: {item.dueDate}</span>
                                                  {item.purchaseNeeded && (
                                                    <span className="bg-amber-50 text-amber-800 px-1.5 py-0.2 rounded-md font-bold text-[9px] uppercase border border-amber-200">
                                                      🛒 Purchase Req
                                                    </span>
                                                  )}
                                                  {item.attachment && (
                                                    <span className="bg-slate-100 text-slate-800 px-1.5 py-0.2 rounded-md font-semibold text-[9px] flex items-center gap-0.5 border border-slate-200">
                                                      📎 {item.attachment}
                                                    </span>
                                                  )}
                                                </div>
                                              </div>
                                            </div>

                                            {/* Action item buttons */}
                                            <div className="flex gap-1 shrink-0">
                                              <button
                                                onClick={() => handleStartEditFamilyItem(item)}
                                                className="p-1 hover:bg-slate-100 rounded text-slate-500 transition cursor-pointer"
                                                title="Edit Element"
                                              >
                                                ✏️
                                              </button>
                                              <button
                                                onClick={() => handleDeleteFamilyItem(item.id)}
                                                className="p-1 hover:bg-red-50 rounded text-red-500 transition cursor-pointer"
                                                title="Delete Element"
                                              >
                                                🗑️
                                              </button>
                                            </div>
                                          </div>
                                          {item.notes && (
                                            <p className="pl-4 text-[10px] text-gray-500 italic bg-gray-50/70 p-1.5 rounded-lg border border-dashed border-gray-150">
                                              📝 {item.notes}
                                            </p>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                                {familyPlanningItems.filter(f => f.milestoneId === ms.id).length === 0 && (
                                  <p className="text-[10px] text-gray-400 italic text-center p-2.5 bg-slate-50 rounded-xl border border-dashed border-gray-150">
                                    No custom student or parent planning objectives set.
                                  </p>
                                )}
                              </div>
                            </div>

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

          {activeTab === "travel" && (
            <div className="space-y-6 animate-in fade-in duration-250">
              
              {/* Header Title Section */}
              <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2 font-sans">
                      🚇 STAI-D ⇒ Travel Coordination Hub
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5 font-sans">
                      Coordinate outbound trips, hotel reservations, trains, rideshares, maps, estimated budgets, and confirmations.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-amber-50 text-amber-800 font-bold px-2.5 py-1 rounded-lg border border-amber-200">
                      🛡️ Advisor Guard Active
                    </span>
                    {!addingTravelPlan && (
                      <button
                        onClick={() => {
                          resetTravelForm();
                          setAddingTravelPlan(true);
                        }}
                        className="text-xs font-bold px-4 py-2.5 bg-[#011F5B] hover:bg-[#001743] hover:scale-[1.02] text-white rounded-xl shadow-xs transition duration-150 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Log Travel Item
                      </button>
                    )}
                  </div>
                </div>

                {/* Important constraint banner */}
                <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-650 flex items-start gap-2.5 leading-relaxed font-sans">
                  <span className="text-sm">🛡️</span>
                  <div>
                    <span className="font-bold text-slate-800">STAI-D Advisor Constraint Guidance:</span> Autopay or direct automated ticket purchases remain restricted. Use this dashboard node to cross-evaluate flight dates, coordinate joint parent/student ground transit estimates, lock in confirmation codes, and store calendar deadlines.
                  </div>
                </div>
              </div>

              {/* Stats & Aggregators */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans">
                <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-3xs flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center font-bold text-blue-700">
                    💰
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide block">Total Outbound Cost</span>
                    <span className="font-extrabold text-[#011F5B] text-lg font-mono">
                      ${travelItems.reduce((sum, item) => sum + item.estimatedCost, 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-3xs flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center font-bold text-green-700">
                    ✅
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide block">Tickets Booked</span>
                    <span className="font-extrabold text-green-700 text-lg font-sans">
                      {travelItems.filter(item => item.status === "booked").length} Scheduled
                    </span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-3xs flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center font-bold text-amber-700">
                    🔍
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide block">Active Comparisons</span>
                    <span className="font-extrabold text-amber-700 text-lg font-sans">
                      {travelItems.filter(item => item.status !== "booked").length} Under Review
                    </span>
                  </div>
                </div>
              </div>

              {/* Add & Edit Form Component */}
              {addingTravelPlan && (
                <div className="bg-white rounded-2xl border border-indigo-200 p-6 shadow-sm animate-in slide-in-from-top-2 duration-200">
                  <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide mb-4 font-sans">
                    {editingTravelId ? "📝 Modify Travel Arrangement Element" : "🛫 Outline Outbound Travel Arrangement Element"}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Arrangement Type *</label>
                      <select
                        value={travelFormType}
                        onChange={(e) => setTravelFormType(e.target.value as any)}
                        className="w-full text-xs p-2.5 border border-gray-250 bg-white rounded-xl text-slate-800"
                      >
                        <option value="flight">✈️ Outbound Flight</option>
                        <option value="hotel">🏨 Lodge / Hotel Staying</option>
                        <option value="train">🚆 Train Amtrak Route</option>
                        <option value="rideshare_transit">🚘 Rental Car / Rideshare / Taxi</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Title Description Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. United flight ORD to PHL (Gabby & Adrian)"
                        value={travelFormTitle}
                        onChange={(e) => setTravelFormTitle(e.target.value)}
                        className="w-full text-xs p-2.5 border border-gray-250 rounded-xl bg-white text-slate-850"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Estimated Cost ($) *</label>
                      <input
                        type="number"
                        value={travelFormEstCost}
                        onChange={(e) => setTravelFormEstCost(Number(e.target.value))}
                        className="w-full text-xs p-2.5 border border-gray-250 rounded-xl bg-white text-slate-850 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Status Class</label>
                      <select
                        value={travelFormStatus}
                        onChange={(e) => setTravelFormStatus(e.target.value as any)}
                        className="w-full text-xs p-2.5 border border-gray-250 bg-white rounded-xl text-slate-850"
                      >
                        <option value="planned">Planned (Unbooked)</option>
                        <option value="comparing">Comparing Rates</option>
                        <option value="booked">Booked (Confirmed)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Confirmation / Reference #</label>
                      <input
                        type="text"
                        placeholder="e.g. SH-882415, AA-998"
                        value={travelFormConfRef}
                        onChange={(e) => setTravelFormConfRef(e.target.value)}
                        className="w-full text-xs p-2.5 border border-gray-250 rounded-xl bg-white text-slate-850"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Deadline Date</label>
                      <input
                        type="date"
                        value={travelFormDeadline}
                        onChange={(e) => setTravelFormDeadline(e.target.value)}
                        className="w-full text-xs p-2.5 border border-gray-250 rounded-xl bg-white text-slate-850 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Departure / Start Location</label>
                      <input
                        type="text"
                        placeholder="e.g. Chicago O'Hare (ORD)"
                        value={travelFormStart}
                        onChange={(e) => setTravelFormStart(e.target.value)}
                        className="w-full text-xs p-2.5 border border-gray-250 rounded-xl bg-white text-slate-850"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Arrival / Destination Location</label>
                      <input
                        type="text"
                        placeholder="e.g. Philadelphia Intl (PHL)"
                        value={travelFormEnd}
                        onChange={(e) => setTravelFormEnd(e.target.value)}
                        className="w-full text-xs p-2.5 border border-gray-250 rounded-xl bg-white text-slate-850"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Distance & Time Metrics</label>
                      <input
                        type="text"
                        placeholder="e.g. 740 miles • 2h 10m"
                        value={travelFormDistanceTime}
                        onChange={(e) => setTravelFormDistanceTime(e.target.value)}
                        className="w-full text-xs p-2.5 border border-gray-250 rounded-xl bg-white text-slate-850"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1 font-sans">Itinerary Notes & Special Requests</label>
                    <textarea
                      placeholder="e.g. Flight booked for Adrian and Gabby together. Carry 3 baggage containers..."
                      value={travelFormNotes}
                      onChange={(e) => setTravelFormNotes(e.target.value)}
                      rows={2}
                      className="w-full text-xs p-2.5 border border-gray-250 rounded-xl bg-white text-slate-850"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-150">
                    <button
                      type="button"
                      onClick={resetTravelForm}
                      className="text-xs font-bold px-4 py-2 border border-slate-200 text-slate-650 hover:bg-slate-50 rounded-xl transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (editingTravelId) {
                          handleSaveEditTravelItem(editingTravelId);
                        } else {
                          handleAddTravelItem();
                        }
                      }}
                      disabled={!travelFormTitle.trim()}
                      className="text-xs font-bold px-4 py-2 bg-[#011F5B] hover:bg-slate-900 text-white rounded-xl shadow-xs transition duration-150 disabled:opacity-50 cursor-pointer text-center"
                    >
                      {editingTravelId ? "Save Changes" : "Create Travel Outline"}
                    </button>
                  </div>
                </div>
              )}

              {/* Travel Filter Bar */}
              <div className="bg-white rounded-2xl border border-gray-150 p-4.5 shadow-3xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1.5 font-sans">
                  {[
                    { key: "all", label: "🌍 All Outbound Plan" },
                    { key: "flight", label: "✈️ Flights" },
                    { key: "hotel", label: "🏨 Accommodations" },
                    { key: "train", label: "🚆 Train Lines" },
                    { key: "rideshare_transit", label: "🚘 Rent/Ground" }
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setTravelFormType(tab.key as any)}
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                        travelFormType === tab.key
                          ? "bg-[#011F5B] text-white border-[#011F5B]"
                          : "border-gray-200 hover:bg-slate-50 text-slate-750 font-sans"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="text-[10px] text-gray-500 font-mono font-bold uppercase tracking-wider">
                  Matches: {travelItems.filter(t => travelFormType === "all" || t.type === travelFormType).length} records
                </div>
              </div>

              {/* Outbound Travel Directory Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {travelItems
                  .filter(item => travelFormType === "all" || item.type === travelFormType)
                  .map(item => {
                    const isBooked = item.status === "booked";
                    const isComparing = item.status === "comparing";
                    return (
                      <div 
                        key={item.id} 
                        className={`bg-white rounded-2xl border p-5 shadow-3xs hover:border-slate-350 hover:shadow-xs transition duration-200 relative group flex flex-col justify-between ${
                          isBooked 
                            ? "border-green-200 ring-2 ring-green-50/20" 
                            : isComparing 
                              ? "border-amber-250 ring-2 ring-amber-50/15" 
                              : "border-gray-150"
                        }`}
                      >
                        <div>
                          {/* Card context badge and status */}
                          <div className="flex justify-between items-start gap-2 mb-3.5">
                            <span className="text-[9px] uppercase font-black tracking-widest text-[#011F5B] bg-blue-50/50 px-2 py-0.5 rounded border border-blue-105">
                              {item.type.replace("_", " & ")}
                            </span>

                            <div className="flex items-center gap-1.5">
                              <span className={`text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 rounded tracking-wide ${
                                isBooked 
                                  ? "bg-green-100 text-green-800" 
                                  : isComparing 
                                    ? "bg-amber-100/80 text-amber-800" 
                                    : "bg-slate-100 text-slate-705"
                              }`}>
                                {item.status.toUpperCase()}
                              </span>
                            </div>
                          </div>

                          <h4 className="font-bold text-slate-905 text-sm">{item.title}</h4>

                          {/* Location coordinates tracker */}
                          <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-gray-150 space-y-2 text-xs">
                            {item.startLocation && (
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-gray-400 text-[10px] block font-mono font-semibold">FROM / DEPART</span>
                                <span className="font-bold text-slate-800 text-[11px] truncate">{item.startLocation}</span>
                              </div>
                            )}

                            {item.endLocation && (
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-gray-400 text-[10px] block font-mono font-semibold">TO / ARRIVAL</span>
                                <span className="font-bold text-slate-800 text-[11px] truncate">{item.endLocation}</span>
                              </div>
                            )}

                            {item.mapDistanceTime && (
                              <div className="pt-1.5 border-t border-dashed border-gray-200 flex items-center gap-1 text-[10px] text-gray-550 font-semibold">
                                <span>🗺️ Route Metrics:</span>
                                <span className="font-bold text-slate-800 font-mono">{item.mapDistanceTime}</span>
                              </div>
                            )}
                          </div>

                          {item.notes && (
                            <p className="mt-3 pl-2.5 text-[11px] text-gray-500 italic border-l-2 border-slate-200 leading-relaxed font-sans">
                              {item.notes}
                            </p>
                          )}
                        </div>

                        {/* Cost, attachments and action controls */}
                        <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center justify-between gap-2">
                          <div>
                            <span className="text-[9px] text-gray-400 block font-mono font-bold uppercase tracking-wider">Est Cost</span>
                            <span className="font-extrabold text-[#011F5B] text-base font-mono">${item.estimatedCost.toLocaleString()}</span>
                          </div>

                          <div className="flex flex-col items-end text-right">
                            <span className="text-[9px] text-gray-400 block font-mono font-bold">DEADLINE</span>
                            <span className="text-[10px] font-bold text-slate-850 font-mono">{item.deadlineDate}</span>
                          </div>
                        </div>

                        {/* Confirmation number tracker */}
                        {item.confirmationNumber && (
                          <div className="mt-2.5 p-2 bg-green-50/30 border border-green-150 rounded-lg text-[10px] text-green-900 flex items-center justify-between font-semibold">
                            <span>📎 Confirmation / Code:</span>
                            <span className="font-extrabold font-mono tracking-tight text-green-950 text-[10px] bg-white px-1.5 py-0.2 rounded border border-green-200">
                              {item.confirmationNumber}
                            </span>
                          </div>
                        )}

                        {/* Action buttons list */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition duration-150 flex gap-1 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                          <button
                            onClick={() => handleStartEditTravelItem(item)}
                            className="p-1 hover:bg-slate-50 rounded text-[11px] transition cursor-pointer"
                            title="Edit Plan"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteTravelItem(item.id)}
                            className="p-1 hover:bg-red-50 rounded text-[11px] text-red-500 transition cursor-pointer"
                            title="Delete Plan"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    );
                  })}
                {travelItems.filter(item => travelFormType === "all" || item.type === travelFormType).length === 0 && (
                  <div className="sm:col-span-2 bg-slate-50 rounded-2xl border border-dashed border-gray-250 p-12 text-center text-gray-450 italic">
                    💡 No travel coordinates fit this category filter. Log a new travel estimate above!
                  </div>
                )}
              </div>

            </div>
          )}

          {activeTab === "finances" && (
            <div className="space-y-6 animate-in fade-in duration-250">
              
              {/* Header Title Section */}
              <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-sans">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                      💰 STAI-D ⇒ Transition Finances Hub
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Co-evaluate upcoming school supplies, lodging comparisons, available cash buffer, and student budget awareness.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-lg border border-emerald-200">
                      🛡️ Security Mode: Active
                    </span>
                    {!isAddingExpense && (
                      <button
                        onClick={() => setIsAddingExpense(true)}
                        className="text-xs font-bold px-4 py-2.5 bg-[#011F5B] hover:bg-[#001743] hover:scale-[1.02] text-white rounded-xl shadow-xs transition duration-150 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Log Transition Cost
                      </button>
                    )}
                  </div>
                </div>

                {/* Important constraint banner */}
                <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-650 flex items-start gap-2.5 leading-relaxed">
                  <span className="text-sm">🛡️</span>
                  <div>
                    <span className="font-bold text-slate-800">STAI-D Security Protection Constraint:</span> No bank links, credit card connections, cryptocurrency nodes, or direct payment processes are active or supported. This module operates strictly as a co-planning budgeting dashboard for student responsibility and parent visibility.
                  </div>
                </div>
              </div>

              {/* Dynamic Financial Overview Calculations */}
              {(() => {
                const totalSpent = expenses.filter(e => e.status === "spent").reduce((acc, curr) => acc + curr.amount, 0);
                const totalPlanned = expenses.filter(e => e.status === "planned").reduce((acc, curr) => acc + curr.amount, 0);
                const availableFunds = totalBudget - totalSpent;
                const remainingFundsComp = availableFunds - totalPlanned;
                const allocatedPct = Math.min(Math.round(((totalSpent + totalPlanned) / totalBudget) * 100), 100);

                let budgetStatusLabel = "On Track";
                let budgetStatusColor = "bg-emerald-50 text-emerald-800 border-emerald-150";
                
                if (totalSpent + totalPlanned > totalBudget) {
                  budgetStatusLabel = "Over Budget Buffer";
                  budgetStatusColor = "bg-rose-50 text-rose-800 border-rose-200";
                } else if (totalSpent + totalPlanned > totalBudget * 0.9) {
                  budgetStatusLabel = "Near Budget Limit";
                  budgetStatusColor = "bg-amber-50 text-amber-800 border-amber-200";
                } else {
                  budgetStatusLabel = "On Track & Balanced";
                  budgetStatusColor = "bg-emerald-50 text-emerald-800 border-emerald-250";
                }

                // Dynamic Categories analysis sorted by highest expenses
                const categoryTotals = expenses.reduce((acc, curr) => {
                  acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
                  return acc;
                }, {} as Record<string, number>);

                const sortedCategories = Object.entries(categoryTotals)
                  .map(([name, val]) => ({ name, value: Number(val) }))
                  .sort((a, b) => b.value - a.value);

                return (
                  <>
                    {/* Primary Cash/Planning Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-sans">
                      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-3xs flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-sm">
                            💳
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Fund Goal</span>
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-[#011F5B] text-base font-mono">${totalBudget.toLocaleString()}</span>
                              <button 
                                onClick={() => {
                                  const newAmt = prompt("Enter replacement total transition fund budget goal ($):", totalBudget.toString());
                                  if (newAmt && !isNaN(Number(newAmt))) setTotalBudget(Number(newAmt));
                                }}
                                className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-1 py-0.5 rounded border border-slate-200 cursor-pointer"
                              >
                                Edit
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-3xs flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-sm">
                          💵
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Available Cash</span>
                          <span className="font-extrabold text-[#011F5B] text-base font-mono">${availableFunds.toLocaleString()}</span>
                          <span className="text-[9px] text-gray-400 block font-sans">Fund minus Spent</span>
                        </div>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-3xs flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-sm font-bold">
                          ⏱️
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block font-sans">Planned (Upcoming)</span>
                          <span className="font-extrabold text-amber-700 text-base font-mono">${totalPlanned.toLocaleString()}</span>
                          <span className="text-[9px] text-gray-400 block">Future allocations</span>
                        </div>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-3xs flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-sm">
                          💼
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Remaining Buffer</span>
                          <span className="font-extrabold text-blue-800 text-base font-mono">${remainingFundsComp.toLocaleString()}</span>
                          <span className="text-[9px] text-gray-400 block">Available minus Planned</span>
                        </div>
                      </div>
                    </div>

                    {/* Budget Status and Allocated Progress Indicator */}
                    <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-3xs font-sans">
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-800 text-xs uppercase tracking-wider block">Budget Allocation Metrics:</span>
                          <span className={`text-[10px] font-black font-mono uppercase px-2 py-0.5 rounded border ${budgetStatusColor}`}>
                            {budgetStatusLabel}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold text-right">
                          Estimated Outlay: ${(totalSpent + totalPlanned).toLocaleString()} OF ${totalBudget.toLocaleString()} ({allocatedPct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-350 ${
                            allocatedPct > 100 
                              ? "bg-rose-500" 
                              : allocatedPct > 90 
                                ? "bg-amber-500" 
                                : "bg-emerald-500"
                          }`}
                          style={{ width: `${allocatedPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Dynamic Parent Dashboard (Emphasizing Visibility & Preparedness) */}
                    {userRole === "parent" ? (
                      <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-6 shadow-md font-sans">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                          <div>
                            <h4 className="font-extrabold text-sm text-amber-400 tracking-wide uppercase flex items-center gap-1.5">
                              🛡️ Co-planner Adrian's Executive Summary
                            </h4>
                            <p className="text-[10px] text-slate-400">
                              Direct visibility tracking tool designed for family financial preparedness and reduced uncertainty.
                            </p>
                          </div>
                          <span className="text-[9px] bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                            Parent Overview
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-5 text-slate-200">
                          <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-800">
                            <span className="text-[9px] uppercase font-bold text-slate-400 block">Total Joint Budget</span>
                            <span className="text-lg font-bold font-mono text-white">${totalBudget.toLocaleString()}</span>
                          </div>

                          <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-800">
                            <span className="text-[9px] uppercase font-bold text-slate-400 block">Completed Costs (Spent)</span>
                            <span className="text-lg font-bold font-mono text-emerald-400">${totalSpent.toLocaleString()}</span>
                          </div>

                          <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-800">
                            <span className="text-[9px] uppercase font-bold text-slate-400 block">Upcoming Costs (Planned)</span>
                            <span className="text-lg font-bold font-mono text-amber-400">${totalPlanned.toLocaleString()}</span>
                          </div>

                          <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-800">
                            <span className="text-[9px] uppercase font-bold text-slate-400 block">Remaining Funds Buffer</span>
                            <span className="text-lg font-bold font-mono text-blue-400">${remainingFundsComp.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Top Expense Categories Visual progress bars */}
                        <div>
                          <h5 className="text-[10px] uppercase font-black tracking-widest text-[#990000] mb-3">
                            Largest Transition Expense Categories:
                          </h5>
                          <div className="space-y-3.5">
                            {sortedCategories.length === 0 ? (
                              <p className="text-xs text-slate-400 italic">No historical expense transactions logged yet.</p>
                            ) : (
                              sortedCategories.map((cat, idx) => {
                                const catPct = totalBudget > 0 ? Math.round((cat.value / totalBudget) * 100) : 0;
                                return (
                                  <div key={idx} className="space-y-1">
                                    <div className="flex justify-between items-center text-xs text-slate-300">
                                      <span className="font-extrabold flex items-center gap-1.5 font-sans">
                                        <span>⚙️</span>
                                        {cat.name}
                                      </span>
                                      <span className="font-mono text-slate-200">
                                        ${cat.value.toLocaleString()} ({catPct}%)
                                      </span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-indigo-500 rounded-full" 
                                        style={{ width: `${catPct}%` }}
                                      />
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Student Friendly Responsibilities Reminders */
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-3 text-xs leading-relaxed text-slate-650 font-sans font-medium">
                        <span className="text-base shrink-0">🎓</span>
                        <div>
                          <span className="font-bold text-slate-850">Gabby's Transition Learning Node:</span> Budget tracking builds early adult ownership. Cross-registering room setup accessories, checking whether optional items fit is a powerful tool to prevent last-minute cost surprises. Double-check item necessities before purchase.
                        </div>
                      </div>
                    )}

                    {/* Simple "Can I Afford This" helper (Student financial awareness) */}
                    <div className="bg-white rounded-2xl border border-indigo-150 p-6 shadow-3xs font-sans">
                      <div className="flex items-center gap-2 mb-3.5 pb-2.5 border-b border-slate-100">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-700">
                          ❓
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-sm tracking-wide uppercase">
                            Student Financial Copilot ⇒ Can I Afford This?
                          </h4>
                          <p className="text-[10px] text-gray-400">
                            Evaluate whether an item cost fits comfortably within your current available cash buffer.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end mb-4">
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Item Title / Name</label>
                          <input
                            type="text"
                            placeholder="e.g., Ergonomic study seat cushion"
                            value={affordItemName}
                            onChange={(e) => setAffordItemName(e.target.value)}
                            className="w-full text-xs p-2.5 border border-gray-250 bg-white rounded-xl text-slate-800 font-sans"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Price Estimate ($)</label>
                          <input
                            type="number"
                            placeholder="e.g. 45"
                            value={affordItemCost}
                            onChange={(e) => setAffordItemCost(e.target.value)}
                            className="w-full text-xs p-2.5 border border-gray-250 bg-white rounded-xl text-slate-800 font-mono font-bold"
                          />
                        </div>

                        <div>
                          <button
                            onClick={handleApplyAffordEvaluation}
                            disabled={!affordItemName.trim() || !affordItemCost}
                            className="w-full text-xs font-semibold py-2.5 bg-indigo-650 hover:bg-indigo-750 text-white rounded-xl transition disabled:opacity-50 cursor-pointer"
                          >
                            Analyze Affordability
                          </button>
                        </div>
                      </div>

                      {affordGuidance && (
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 animate-in fade-in duration-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm border-none bg-transparent">
                              {affordGuidance.canAfford ? "✅" : "⚠️"}
                            </span>
                            <span className="font-black text-xs uppercase tracking-wider text-slate-800">
                              {affordGuidance.canAfford ? "Affordable Outcome" : "Cautionary Outcome"}
                            </span>
                          </div>
                          
                          <p className="text-xs text-slate-650 leading-relaxed font-sans mb-3 font-medium">
                            {affordGuidance.recommendation}
                          </p>

                          <div className="text-[10px] text-slate-400 font-mono font-bold flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-150">
                            <span>{affordGuidance.metricsText}</span>
                            <button
                              onClick={() => {
                                setAffordItemName("");
                                setAffordItemCost("");
                                setAffordGuidance(null);
                              }}
                              className="text-[9px] font-bold text-red-500 hover:underline shrink-0 cursor-pointer"
                            >
                              Reset
                            </button>
                          </div>
                          
                          <p className="mt-2 text-[9px] text-slate-400 italic">
                            *Note: This is budgeted awareness metrics only, and does not serve as professional financial or banking guidance. Use responsibly.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Contextual Smart Guidance Corner */}
                    <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-3xs font-sans">
                      <h4 className="font-extrabold text-[10px] uppercase tracking-widest text-[#990000] mb-3">
                        🛡️ Advisor Smart Budget Guidance Corner
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs text-gray-650 leading-relaxed font-sans">
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium">
                          <span className="font-bold text-slate-800 block mb-1">⏱️ General Reassurance</span>
                          {remainingFundsComp > 400 ? (
                            <span>You remain well within your planned budget. No need to second-guess pre-approved deposits; travel and hotel estimates were already outlined in the parent handbook.</span>
                          ) : (
                            <span>Remaining cushion is compact ($ {remainingFundsComp.toLocaleString()}). Try delaying optional room accessories or clothing items until moving into the Quad House.</span>
                          )}
                        </div>

                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium font-sans">
                          <span className="font-bold text-slate-850 block mb-1">💡 Normalcy Check</span>
                          Most incoming students experience similar micro-costs during this coordinate phase. Shared logging between Adrian and Gabby allows visual alignment and prevents unexpected surprise events. No banking exposure exists.
                        </div>
                      </div>
                    </div>

                    {/* Add manual expense element card */}
                    {isAddingExpense && (
                      <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-sm animate-in slide-in-from-top-2 duration-200 font-sans">
                        <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide mb-4">
                          ➕ Log Transition Expenditure
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Item Title Description *</label>
                            <input
                              type="text"
                              value={expName}
                              onChange={(e) => setExpName(e.target.value)}
                              placeholder="e.g., Bedding Sheets Twin XL"
                              className="w-full text-xs p-2.5 border border-gray-250 bg-white rounded-xl text-slate-800"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Category Category *</label>
                            <select
                              value={expCategory}
                              onChange={(e) => setExpCategory(e.target.value as ExpenseCategory)}
                              className="w-full text-xs p-2.5 border border-gray-250 bg-white rounded-xl text-slate-800"
                            >
                              <option value="Travel">✈️ Travel</option>
                              <option value="Housing">🏨 Housing</option>
                              <option value="Food">🍽️ Food</option>
                              <option value="Room Setup">🛌 Room Setup</option>
                              <option value="School Supplies">🎒 School Supplies</option>
                              <option value="Technology">💻 Technology</option>
                              <option value="Clothing">👕 Clothing</option>
                              <option value="Social / Lifestyle">🎉 Social / Lifestyle</option>
                              <option value="Gifts">🎁 Gifts</option>
                              <option value="Emergency">🚨 Emergency</option>
                              <option value="Other">❓ Other</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Amount ($) *</label>
                            <input
                              type="number"
                              value={expAmount}
                              onChange={(e) => setExpAmount(e.target.value)}
                              placeholder="e.g., 40"
                              className="w-full text-xs p-2.5 border border-gray-250 bg-white rounded-xl text-slate-900 font-mono font-bold"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Transaction Status</label>
                            <select
                              value={expStatus}
                              onChange={(e) => setExpStatus(e.target.value as "spent" | "planned")}
                              className="w-full text-xs p-2.5 border border-gray-250 bg-white rounded-xl text-slate-800"
                            >
                              <option value="planned">Planned (Upcoming Cost)</option>
                              <option value="spent">Spent (Completed Transaction)</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Scheduled / Paid Date</label>
                            <input
                              type="date"
                              value={expDate}
                              onChange={(e) => setExpDate(e.target.value)}
                              className="w-full text-xs p-2.5 border border-gray-250 bg-white rounded-xl text-slate-800 font-mono"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Expense Paid By</label>
                            <select
                              value={expPaidBy}
                              onChange={(e) => setExpPaidBy(e.target.value as any)}
                              className="w-full text-xs p-2.5 border border-gray-250 bg-white rounded-xl text-slate-800"
                            >
                              <option value="student">Gabby (Student)</option>
                              <option value="parent">Adrian (Parent)</option>
                              <option value="both">Co-divided / Joint Both</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Necessity Weight</label>
                            <select
                              value={expRequiredOrOptional}
                              onChange={(e) => setExpRequiredOrOptional(e.target.value as any)}
                              className="w-full text-xs p-2.5 border border-gray-250 bg-white rounded-xl text-slate-800"
                            >
                              <option value="required">Required Cost Node</option>
                              <option value="optional">Optional / Discretionary</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Related STAI Milestone</label>
                            <select
                              value={expMilestoneId}
                              onChange={(e) => setExpMilestoneId(e.target.value)}
                              className="w-full text-xs p-2.5 border border-gray-250 bg-white rounded-xl text-slate-800"
                            >
                              <option value="none font-sans">Independent (No Milestone)</option>
                              <option value="m1 font-sans">Milestone 1: Accepted & Welcome</option>
                              <option value="m2 font-sans">Milestone 2: Housing & Dorm Room</option>
                              <option value="m3 font-sans">Milestone 3: Travel Plans</option>
                              <option value="m4 font-sans">Milestone 4: Packing</option>
                              <option value="m5 font-sans font-medium">Milestone 5: Move-In & Orientation</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Virtual Receipt Proof / File</label>
                            <input
                              type="text"
                              value={expReceipt}
                              onChange={(e) => setExpReceipt(e.target.value)}
                              placeholder="e.g., target_sheets_receipt.pdf"
                              className="w-full text-xs p-2.5 border border-gray-250 bg-white rounded-xl text-slate-800 font-mono"
                            />
                          </div>
                        </div>

                        <div className="mb-4 col-span-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">Itinerary Notes & Context</label>
                          <textarea
                            value={expNotes}
                            onChange={(e) => setExpNotes(e.target.value)}
                            rows={2}
                            placeholder="e.g. Purchased Twin XL bedding. Adrian pre-approved budget alignment."
                            className="w-full text-xs p-2.5 border border-gray-250 bg-white rounded-xl text-slate-800"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-3 border-t border-slate-150">
                          <button
                            type="button"
                            onClick={() => setIsAddingExpense(false)}
                            className="text-xs font-bold px-4 py-2 border border-slate-200 text-slate-650 hover:bg-slate-50 rounded-xl transition cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleAddExpense}
                            disabled={!expName.trim() || !expAmount}
                            className="text-xs font-bold px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition duration-150 disabled:opacity-50 cursor-pointer text-center"
                          >
                            Add Financial Entry
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Shared Ledger Directory Cards Grid */}
                    <div className="space-y-3.5">
                      <div className="flex justify-between items-center text-xs font-sans">
                        <h4 className="font-extrabold text-slate-900 tracking-wide uppercase">
                          📂 Unified Transition Financial Ledger
                        </h4>
                        <span className="text-slate-400 font-bold font-mono uppercase tracking-wider text-[10px]">
                          Matched: {expenses.length} Records
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {expenses.map((item) => {
                          const isSpent = item.status === "spent";
                          return (
                            <div 
                              key={item.id}
                              className={`bg-white rounded-2xl border p-5 shadow-3xs relative group flex flex-col justify-between hover:border-slate-350 transition duration-150 ${
                                isSpent 
                                  ? "border-emerald-200 ring-1 ring-emerald-50" 
                                  : "border-gray-150"
                              }`}
                            >
                              <div>
                                <div className="flex justify-between items-start gap-2 mb-3">
                                  <span className="text-[9px] uppercase font-black tracking-widest text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                    {item.category}
                                  </span>

                                  <div className="flex items-center gap-1.5">
                                    <span className={`text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 rounded tracking-wide ${
                                      isSpent 
                                        ? "bg-emerald-100 text-emerald-800" 
                                        : "bg-amber-100 text-amber-800"
                                    }`}>
                                      {item.status.toUpperCase()}
                                    </span>
                                    <span className={`text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 rounded tracking-wide ${
                                      item.requiredOrOptional === "required" 
                                        ? "bg-rose-100 text-rose-800" 
                                        : "bg-slate-100 text-slate-600"
                                    }`}>
                                      {item.requiredOrOptional}
                                    </span>
                                  </div>
                                </div>

                                <h4 className="font-extrabold text-slate-900 text-sm leading-snug">{item.name}</h4>

                                {item.notes && (
                                  <p className="mt-2.5 text-xs text-slate-500 italic border-l-2 border-slate-200 pl-2 leading-relaxed font-sans">
                                    {item.notes}
                                  </p>
                                )}

                                <div className="mt-3.5 grid grid-cols-3 gap-2 bg-slate-50 p-2 rounded-xl border border-gray-150 text-[10px] text-gray-550 font-medium">
                                  <div>
                                    <span className="text-[8px] text-gray-400 uppercase block font-mono">Paid By</span>
                                    <span className="font-bold text-slate-800 font-sans">{item.paidBy === "both" ? "Co-divided" : item.paidBy}</span>
                                  </div>
                                  <div>
                                    <span className="text-[8px] text-gray-400 uppercase block font-mono">STAI Milestone</span>
                                    <span className="font-bold text-slate-800 font-sans">{item.milestoneId ? `Milestone ${item.milestoneId.replace("m", "")}` : "General"}</span>
                                  </div>
                                  <div>
                                    <span className="text-[8px] text-gray-400 uppercase block font-mono">Logged Date</span>
                                    <span className="font-bold text-slate-800 font-mono">{item.date}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-4 pt-3 border-t border-slate-150 flex items-center justify-between font-sans">
                                <div>
                                  <span className="text-[9px] text-gray-400 font-mono block uppercase">Amount</span>
                                  <span className="font-black text-[#011F5B] text-base font-mono">${item.amount.toLocaleString()}</span>
                                </div>

                                {item.receipt ? (
                                  <div className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50/50 px-2 py-0.5 rounded border border-emerald-200">
                                    <span>📎</span>
                                    <span className="font-mono truncate max-w-[100px]">{item.receipt}</span>
                                  </div>
                                ) : (
                                  <span className="text-[9px] text-gray-400 italic font-sans font-medium">No receipt loaded</span>
                                )}
                              </div>

                              {/* Deletion controls */}
                              <button
                                onClick={() => handleDeleteExpense(item.id)}
                                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition duration-150 p-1 bg-white hover:bg-rose-50 border border-slate-200 rounded text-[11px] text-red-500 cursor-pointer shadow-3xs"
                                title="Delete Entry"
                              >
                                🗑️
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                );
              })()}

            </div>
          )}

          {activeTab === "calendar" && (
            <CalendarView 
              calendarEvents={calendarEvents}
              tasks={tasks}
              familyPlanningItems={familyPlanningItems}
              expenses={expenses}
              travelItems={[]}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "housing" && (
            <HousingView 
              userRole={userRole}
              tasks={tasks}
              onToggleTask={toggleTaskCompletion}
              purchases={purchases}
              onAddPurchase={handleAddPurchaseDirect}
              documents={documents}
              onAddDocument={handleAddDocumentDirect}
            />
          )}

        </div>

        {/* BOTTOM GLOBAL FLOATING DOCKET (Reduced Uncertainty Assistant Trigger) */}
        <section className="bg-white border-t border-gray-150 p-4 shrink-0 shadow-lg sticky bottom-0 z-40">
          <div className="max-w-xl mx-auto flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#011F5B] flex items-center justify-center text-[#990000] shrink-0 border border-red-200 bg-red-50">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            
            <div className="flex-1 text-xs">
              <span className="text-[9px] text-[#990000] font-black uppercase tracking-wider block">
                Quick Ask (Instant Ask Layer)
              </span>
              <p className="text-gray-500 line-clamp-1 font-medium">
                Query STAI-C instantly regarding any transition parameters.
              </p>
            </div>

            <button
              onClick={() => {
                setIsChatOpen(true);
              }}
              className="px-4 py-2 bg-[#011F5B] hover:bg-[#001743] hover:scale-[1.02] active:scale-98 text-white rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer shadow-xs"
            >
              Ask STAI-C
            </button>
          </div>
        </section>

      </main>

      {/* FLOATABLE RESPONSIVE STAI-C CHAT OVERLAY (Centering massive modal popup with backdrop blur) */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full h-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-155">
            <Ask userRole={userRole} onSelectAction={() => {}} onClose={() => setIsChatOpen(false)} />
          </div>
        </div>
      )}

      {/* SYSTEM ALERTS MODAL OVERLAY */}
      {isAlertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-155 border border-slate-100 max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="bg-[#011F5B] border-b border-blue-900 px-6 py-4 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <Bell className="w-5 h-5 text-amber-300 animate-pulse" />
                <div>
                  <h3 className="font-extrabold text-white text-base tracking-tight">Active Transition Alerts</h3>
                  <p className="text-[11px] text-blue-200 mt-0.5">Real-time milestones, deadlines, and action indicators</p>
                </div>
              </div>
              <button
                onClick={() => setIsAlertModalOpen(false)}
                className="p-1 text-white/80 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition text-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Area */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              
              {/* HIGH ALERTS */}
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-rose-100 mb-3.5">
                  <span className="text-xs font-black text-red-700 uppercase tracking-widest flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-650" />
                    High Alerts ({currentAlerts.filter(a => a.level === "high").length})
                  </span>
                  <span className="text-[10px] text-red-500 font-bold bg-rose-50 px-2 py-0.5 rounded">Action Required</span>
                </div>

                {currentAlerts.filter(a => a.level === "high").length === 0 ? (
                  <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl text-xs text-center text-slate-500 italic">
                    🎉 Excellent! No active High Alerts require immediate coordination.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentAlerts.filter(a => a.level === "high").map((alert) => (
                      <div 
                        key={alert.id}
                        onClick={() => {
                          setActiveTab(alert.linkTab);
                          setIsAlertModalOpen(false);
                        }}
                        className="group p-4 bg-rose-50/45 hover:bg-rose-50/90 border border-rose-100 rounded-xl cursor-pointer transition duration-150 relative flex items-start gap-3.5 shadow-3xs"
                      >
                        <div className="w-2.5 h-2.5 rounded-full bg-red-650 mt-1.5 shrink-0 group-hover:scale-125 transition" />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-bold text-xs text-slate-850 group-hover:text-red-750 transition">{alert.title}</h4>
                            <span className="text-[9px] font-bold text-red-650 bg-red-100/60 px-2.5 py-0.5 rounded-lg shrink-0 font-sans tracking-wide">{alert.source}</span>
                          </div>
                          <p className="text-[11px] text-gray-650 mt-1 leading-normal font-sans font-medium">{alert.description}</p>
                          <div className="flex items-center justify-between mt-3 text-[10px] text-red-650 font-bold font-mono">
                            <span>Deadline/Date: {alert.relatedDate}</span>
                            <span className="underline group-hover:text-red-800 flex items-center gap-0.5 font-sans">
                              Navigate to {alert.linkTab.toUpperCase()} tab <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* LOW ALERTS */}
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-blue-100 mb-3.5">
                  <span className="text-xs font-black text-[#011F5B] uppercase tracking-widest flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-[#011F5B]" />
                    Low Alerts ({currentAlerts.filter(a => a.level === "low").length})
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded">Awareness Only</span>
                </div>

                {currentAlerts.filter(a => a.level === "low").length === 0 ? (
                  <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl text-xs text-center text-slate-500 italic">
                    No active Low Alerts mapped. All other systems nominal.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentAlerts.filter(a => a.level === "low").map((alert) => (
                      <div 
                        key={alert.id}
                        onClick={() => {
                          setActiveTab(alert.linkTab);
                          setIsAlertModalOpen(false);
                        }}
                        className="group p-4 bg-slate-50/30 hover:bg-slate-50/70 border border-slate-200/90 rounded-xl cursor-pointer transition duration-150 flex items-start gap-3.5 shadow-3xs"
                      >
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-400 mt-1.5 shrink-0 group-hover:bg-[#011F5B] transition" />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-bold text-xs text-slate-750 group-hover:text-[#011F5B] transition">{alert.title}</h4>
                            <span className="text-[9px] font-bold text-gray-500 bg-slate-100 px-2.5 py-0.5 rounded-lg shrink-0 font-sans tracking-wide">{alert.source}</span>
                          </div>
                          <p className="text-[11px] text-gray-550 mt-1 leading-normal font-sans font-medium">{alert.description}</p>
                          <div className="flex items-center justify-between mt-3 text-[10px] text-slate-500 font-bold font-mono">
                            <span>Impending Date: {alert.relatedDate}</span>
                            <span className="underline group-hover:text-[#011F5B] flex items-center gap-0.5 font-sans">
                              Review in {alert.linkTab.toUpperCase()} <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex justify-between items-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                STAI Active Awareness Protocol
              </span>
              <button
                onClick={() => setIsAlertModalOpen(false)}
                className="px-4 py-2 bg-[#011F5B] hover:bg-[#001743] hover:scale-[1.02] active:scale-98 text-white rounded-xl text-xs font-bold transition duration-150 cursor-pointer shadow-xs"
              >
                Dismiss
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
