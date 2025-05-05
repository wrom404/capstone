import pool from "../config/db.js";
import cron from "node-cron";

const updateEventStatus = async () => {
  const now = new Date().toISOString(); // Current timestamp
  const threeDaysLater = new Date();
  threeDaysLater.setDate(threeDaysLater.getDate() + 3);
  const threeDaysLaterISO = threeDaysLater.toISOString();

  try {
    // 1️⃣ Update non-recurring events and recurring events with an end date to "upcoming" if they are 3 days away
    const upcomingQuery = `
      UPDATE events
      SET status = 'upcoming'
      WHERE status = 'scheduled' 
        AND date <= $1
        AND (recurring_days IS NULL OR recurring_days = '{}') -- Non-recurring events
      RETURNING id;
    `;
    const upcomingResult = await pool.query(upcomingQuery, [threeDaysLaterISO]);
    console.log(`Updated ${upcomingResult.rowCount} events to "upcoming".`);

    // 2️⃣ Update events to "completed" based on conditions
    const completedQuery = `
      UPDATE events
      SET status = 'completed'
      WHERE status = 'upcoming'
        AND (
          -- Non-recurring events that have ended
          (recurring_days IS NULL OR recurring_days = '{}') AND end_time < $1
          OR
          -- Recurring events that have an end date and the end date has passed
          (recurring_days IS NOT NULL AND end_date IS NOT NULL AND end_date < $1)
        )
      RETURNING *;
    `;
    const completedResult = await pool.query(completedQuery, [now]);
    console.log(`Updated ${completedResult.rowCount} events to "completed".`);
  } catch (error) {
    console.error("Error updating event statuses:", error);
  }
};

// Schedule the job to run every minute
cron.schedule("* * * * *", updateEventStatus);

console.log("Scheduled event status update job is running every minute.");

// Non-recurring events: Updates to "completed" if end_time has passed.
// Recurring events without an end date: Remains "scheduled", even if the current date has passed.
// Recurring events with an end date: Updates to "completed" only if the end date has passed.
