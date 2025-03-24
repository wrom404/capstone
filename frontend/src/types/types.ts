import { SetStateAction } from "react";

export type Event = {
  success?: boolean;
  id?: number;
  title?: string;
  description?: string;
  venue?: string;
  event_type?: string;
  expected_attendance?: string | null;
  priest_name?: string | null;
  client_number?: string | null;
  date?: string | null; // ISO string (e.g., "2025-04-04T16:00:00.000Z")
  start_time?: string; // "HH:MM:SS" format
  end_time?: string; // "HH:MM:SS" format
  status?: string;
  is_recurring?: boolean | null;
  recurring_days?: string[] | null;
  has_end_date?: boolean | null;
  end_date?: string | null;
  created_at?: string;
  canceled_at?: string | null;

  // Required for React Big Calendar
  start?: Date;
  end?: Date;
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

  start?: Date;
  end?: Date;
};


export type LoginValue = {
  email: string | undefined,
  password: string | undefined
}

export type TableEventProps = {
  events: Event[];
  handleClickEvent: (id: number) => void;
  handleClickDelete: (id: number) => void;
  handleClickEdit: (id: number) => void;
};

export type ModalProps = {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export type MyEvent = {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
}

export type FormProps = {
  startDate: Date,
  setStartDate: React.Dispatch<SetStateAction<Date>>
}

export type FormDataProps = {
  title: string;
  eventType: string;
  priestName?: string;
  description: string;
  venue: string;
  expectedAttendance: string;
  clientNumber?: string;
  date: string | null; // You will store the date as a string (ISO 8601 formatted)
  startTime: string | null; // You store the time in HH:mm format as a string
  endTime: string | null; // You store the time in HH:mm format as a string
  isRecurring?: boolean;
  recurringDays?: string[]; // Array of days like ["Monday", "Tuesday"]
  hasEndDate?: boolean;
  endDate?: string | null; // You store the endDate as ISO 8601 formatted string or null

  start?: Date | null;
  end?: Date | null;
};

export type UserProps = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
  create_at: Date;
}

export type UnAvailableDateProps = {
  count: string,
  date: string
}

export interface CanceledEvent {
  id: number;
  title: string;
  event_type: string;
  priest_name: null;
  description: string;
  venue: string;
  client_number: null;
  date: Date;
  start_time: Date;
  end_time: Date;
  status: string;
  is_recurring: boolean;
  recurring_days: [];
  has_end_date: boolean;
  end_date: null;
  canceled_at: Date;
  reason: string;
}

export interface EventCountProps {
  upcoming: number | null;
  completed: number | null;
  scheduled: number | null;
}