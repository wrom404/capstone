import { SetStateAction } from "react";

export type Event = {
  id?: number;
  title?: string;
  description?: string;
  venue?: string;
  event_type?: string;
  priest_name?: string | null;
  client_number?: string | null;
  date?: string; // ISO string (e.g., "2025-04-04T16:00:00.000Z")
  start_time?: string; // "HH:MM:SS" format
  end_time?: string; // "HH:MM:SS" format
  status?: string;
  is_recurring?: boolean | null;
  recurring_days?: string[] | null;
  has_end_date?: boolean | null;
  end_date?: string | null;
  created_at?: string;

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

  start: Date;
  end: Date;
};


export type LoginValue = {
  email: string | undefined,
  password: string | undefined
}

export type TableEventProps = {
  events: Event[];
  handleClickEvent: (id: number) => void;
  handleClickDelete: (id: number) => void;
};

export type ModalProps = {
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

// export type FormDataProps = {
//   title: string;
//   eventType: string;
//   priestName?: string;
//   description: string;
//   venue: string;
//   clientNumber?: string;
//   date: string | null;
//   startTime: string | null;
//   endTime: string | null;
//   isRecurring?: boolean;
//   recurringDays?: string[];
//   hasEndDate?: boolean;
//   endDate?: string | null;
// }

export type FormDataProps = {
  title: string;
  eventType: string;
  priestName?: string;
  description: string;
  venue: string;
  clientNumber?: string;
  date: string | null; // You will store the date as a string (ISO 8601 formatted)
  startTime: string | null; // You store the time in HH:mm format as a string
  endTime: string | null; // You store the time in HH:mm format as a string
  isRecurring?: boolean;
  recurringDays?: string[]; // Array of days like ["Monday", "Tuesday"]
  hasEndDate?: boolean;
  endDate?: string | null; // You store the endDate as ISO 8601 formatted string or null
};
