export type Event = {
  id: number;
  title: string;
  description: string;
  venue: string;
  event_type: string;
  priest_name: string | null;
  client_number: string | null;
  date: string; // ISO string (e.g., "2025-04-04T16:00:00.000Z")
  start_time: string; // "HH:MM:SS" format
  end_time: string; // "HH:MM:SS" format
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

export type TableEventProps = {
  events: Event[];
};