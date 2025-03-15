// utils/validateEventTime.ts

const validateEventTime = (startTime: string, endTime: string, date: string): string | null => {
  if (startTime && endTime) {
    const currentDate = date ? new Date(date) : new Date();
    
    // Parsing the start and end times into Date objects
    const startDateTime = new Date(`${currentDate.toISOString().split("T")[0]}T${startTime}:00`);
    const endDateTime = new Date(`${currentDate.toISOString().split("T")[0]}T${endTime}:00`);

    if (endDateTime <= startDateTime) {
      return "End time must be greater than start time";
    }
  }
  return null; // No error if valid
};

export default validateEventTime;
