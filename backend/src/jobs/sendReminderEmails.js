import pool from "../config/db.js";
import cron from "node-cron";
import { sendEmailNotification } from "../utils/sendEmailNotification.js"; // Adjust the import path as necessary
import moment from "moment-timezone";

const sendReminderEmails = async () => {
  const now = moment();
  const inThreeMinutes = moment().add(3, "minutes");

  try {
    const reminderQuery = `
      SELECT id, title, client_email, start_time
      FROM events
      WHERE 
        send_reminder = TRUE
        AND reminder_sent = FALSE
        AND client_email IS NOT NULL
        AND start_time BETWEEN $1 AND $2
    `;

    const { rows: eventsToRemind } = await pool.query(reminderQuery, [
      now.toISOString(),
      inThreeMinutes.toISOString(),
    ]);

    console.log("eventsToRemind: ", eventsToRemind);

    for (const event of eventsToRemind) {
      const htmlContentReminder = `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;">
          <h2 style="color: #e67e22;">⏰ Event Reminder</h2>
          <p>Hello,</p>
          <p>This is a reminder from St. Isidore Parish. Please note that your scheduled event will begin soon:</p>
          <ul>
            <li><strong>Event:</strong> ${event.title}</li>
            <li><strong>Start Time:</strong> ${moment(event.start_time).format(
              "LLLL"
            )}</li>
          </ul>
          <p style="color: #888; font-size: 0.9em;">This is an automated reminder. Please do not reply.</p>
        </div>
      `;

      await sendEmailNotification(
        event.client_email,
        `⏰ Reminder: "${event.title}" is starting soon`,
        htmlContentReminder
      );

      await pool.query(`UPDATE events SET reminder_sent = TRUE WHERE id = $1`, [
        event.id,
      ]);

      console.log(`Reminder sent for event ID ${event.id}`);
    }
  } catch (error) {
    console.error("Error sending reminder emails:", error);
  }
};

// Schedule every minute
cron.schedule("* * * * *", sendReminderEmails);

console.log("Scheduled reminder email job is running every minute.");
