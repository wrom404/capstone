import pool from "../config/db.js";
import cron from "node-cron";

const updateEventStatus = async () => {
  const now = new Date().toISOString(); // Current timestamp
  const threeDaysLater = new Date();
  threeDaysLater.setDate(threeDaysLater.getDate() + 3); // 3 days from now
  const threeDaysLaterISO = threeDaysLater.toISOString();

  try {
    // 1️⃣ Update events to "upcoming" if they are 3 days away
    const upcomingQuery = `
        UPDATE events
        SET status = 'upcoming'
        WHERE status = 'scheduled' AND date <= $1
        RETURNING id;
      `;
    const upcomingResult = await pool.query(upcomingQuery, [threeDaysLaterISO]);
    console.log(`Updated ${upcomingResult.rowCount} events to "upcoming".`);

    // 2️⃣ Update events to "completed" if they have ended
    const completedQuery = `
        UPDATE events
        SET status = 'completed'
        WHERE status = 'upcoming' AND end_time < $1
        RETURNING id;
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
