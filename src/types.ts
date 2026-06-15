export type UserRole = "student" | "parent";

export type ReadinessStatus = "complete" | "in_progress" | "needs_attention";

export interface ReadinessArea {
  id: string;
  title: string;
  status: ReadinessStatus;
  description: string;
  icon: string; // lucide icon name
  lastUpdated: string;
  notes?: string;
}

export interface Task {
  id: string;
  category: "travel" | "housing" | "technology" | "orientation" | "health" | "packing" | "student_accounts" | "custom";
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  assignedTo: UserRole | "both";
  cost?: number;
  purchases?: string[];
  documents?: string[];
  type?: "required" | "personal" | "family";
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  assignedTo: "student" | "parent" | "both";
  isMandatory?: boolean;
}

export interface JourneyMilestone {
  id: string;
  title: string;
  status: "completed" | "current" | "upcoming";
  description: string;
  dateText: string;
  actions: string[];
  personalActions?: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  createdAt: string;
}

export interface FamilyPlanningItem {
  id: string;
  milestoneId: string;
  title: string;
  notes?: string;
  purchaseNeeded: boolean;
  assignedTo: "student" | "parent" | "both";
  dueDate: string;
  status: "completed" | "pending" | "in_progress";
  attachment?: string;
}

export interface TravelItem {
  id: string;
  type: "flight" | "hotel" | "train" | "rental_car" | "rideshare_transit";
  title: string;
  estimatedCost: number;
  status: "comparing" | "planned" | "booked";
  confirmationNumber?: string;
  deadlineDate?: string;
  notes?: string;
  startLocation?: string;
  endLocation?: string;
  mapDistanceTime?: string;
}

export interface DiscoverItem {
  id: string;
  category: string;
  title: string;
  description: string;
  details: string[];
  location?: string;
  linkText?: string;
}

export type ExpenseCategory = 
  | "Travel"
  | "Housing"
  | "Food"
  | "Room Setup"
  | "School Supplies"
  | "Technology"
  | "Clothing"
  | "Social / Lifestyle"
  | "Gifts"
  | "Emergency"
  | "Other";

export interface ExpenseItem {
  id: string;
  name: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  paidBy: "student" | "parent" | "both";
  milestoneId?: string;
  requiredOrOptional: "required" | "optional";
  status: "spent" | "planned";
  notes?: string;
  receipt?: string;
}

