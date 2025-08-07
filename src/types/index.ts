export interface Goal {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  isDefault: boolean;
  goalType: 'quantitative' | 'checklist';
  unit?: string;
  targetPerDay?: number;
  checklistItems?: string[];
  completionLogic: 'all' | 'any';
  createdAt: Date;
  updatedAt: Date;
  components: Component[];
  entries: Entry[];
  streak?: Streak;
}

export interface Component {
  id: string;
  goalId: string;
  name: string;
  type: "boolean" | "number" | "text" | "select";
  config: string; // JSON string
  order: number;
  createdAt: Date;
}

export interface Entry {
  id: string;
  goalId: string;
  date: Date;
  data: string; // JSON string
  createdAt: Date;
  updatedAt: Date;
}

export interface Streak {
  id: string;
  goalId: string;
  currentStreak: number;
  longestStreak: number;
  lastEntryDate?: Date;
  updatedAt: Date;
}

export interface EntryData {
  [componentId: string]: boolean | number | string;
}

export interface CalendarDay {
  date: Date;
  hasEntry: boolean;
  entry?: Entry;
}