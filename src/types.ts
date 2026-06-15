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

export interface DiscoverItem {
  id: string;
  category: "dining" | "housing" | "maps" | "resources" | "safety";
  title: string;
  description: string;
  details: string[];
  location?: string;
  linkText?: string;
}
