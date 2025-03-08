// export type Event = {
//   id: number;
//   title: string;
//   event_type: string;
//   priest_name: string;
//   description: string;
//   venue: string;
//   client_number: string;
//   date: string; // ISO string (e.g., "2025-04-04T16:00:00.000Z")
//   start_time: string; // "HH:MM:SS" format
//   end_time: string; // "HH:MM:SS" format
//   status: "scheduled" | "completed"; // Add more statuses if needed
//   is_recurring?: boolean;
//   recurring_days?: string[]; // Consider using a union type like ("monday" | "tuesday" | ...)[] for better type safety
//   has_end_date?: boolean;
//   end_date?: string; // Optional since not all events may have an end date
//   created_at?: string; // ISO string
// };

export type Event = {
  id: number;
  title: string;
  description: string;
  venue: string;
  event_type: string;
  priest_name: string | null;
  client_number: string | null;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  is_recurring: boolean | null;
  recurring_days: string[] | null;
  has_end_date: boolean | null;
  end_date: string | null;
  created_at?: string;

  // Required for React Big Calendar
  start: Date;
  end: Date;
};

export type CalendarEvent = {
  id: number;
  title: string;
  description: string;
  venue: string;
  event_type: string;
  priest_name: string | null;
  client_number: string | null;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  is_recurring: boolean | null;
  recurring_days: string[] | null;
  has_end_date: boolean | null;
  end_date: string | null;
  created_at?: string;
  
  start: Date;
  end: Date;
};


export type LoginValue = {
  email: string | undefined,
  password: string | undefined
}