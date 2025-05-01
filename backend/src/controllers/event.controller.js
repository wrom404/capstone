import pool from "../config/db.js";
import trimValue from "../utils/trim.js";
import moment from "moment-timezone";
import sendSms from "../utils/sendSms.js";
import { sendEmailNotification } from "../utils/sendEmailNotification .js";

// updated
export async function createEvent(req, res) {
  const {
    title,
    eventType,
    priestName,
    description,
    venue,
    expectedAttendance,
    clientEmail,
    date,
    startTime,
    endTime,
    isRecurring,
    recurringDays,
    hasEndDate,
    endDate,
    chapelName,
    sponsors = [], // [{ sponsor_name, sponsor_type }]
    organizers = [], // [{ name, position }]
  } = req.body;

  const timeZone = "Asia/Manila"; // or your local timezone

  const formattedDate = moment.tz(date, timeZone).format("MMMM D, YYYY");
  const formattedStartTime = moment
    .tz(`${date} ${startTime}`, "YYYY-MM-DD HH:mm", timeZone)
    .format("h:mm A");
  const formattedEndTime = moment
    .tz(`${date} ${endTime}`, "YYYY-MM-DD HH:mm", timeZone)
    .format("h:mm A");

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;">
      <h2 style="color: #2c3e50;">📅 Parish Event Scheduled</h2>
      <p>Hello Admin,</p>
      <p>An event has been successfully scheduled in the parish system:</p>
      <ul>
        <li><strong>Event Type:</strong> ${eventType}</li>
        <li><strong>Date:</strong> ${formattedDate}</li>
        <li><strong>Time:</strong> ${formattedStartTime} – ${formattedEndTime}</li>
        <li><strong>Venue:</strong> ${venue}</li>
      </ul>
      <p style="color: #888; font-size: 0.9em;">This is an automated email. Please do not reply.</p>
    </div>
  `;

  if (!title || !startTime || !endTime || !eventType || !date || !venue) {
    return res
      .status(400)
      .json({ success: false, error: "Missing required fields." });
  }

  try {
    // Capacity check
    const countResult = await pool.query(
      "SELECT COUNT(id) FROM events WHERE date = $1",
      [date]
    );
    if (countResult.rows[0].count >= 10) {
      return res.status(400).json({
        success: false,
        message: "Date is fully booked. Please choose another date.",
      });
    }

    if (clientEmail) {
      // send email notification
      await sendEmailNotification(
        clientEmail,
        `Your Event Request: ${eventType} on ${date}`,
        htmlContent
      );
    }

    // Time conflict check
    const existingEvents = await pool.query(
      "SELECT * FROM events WHERE date = $1",
      [date]
    );
    for (const row of existingEvents.rows) {
      const clientStart = new Date(`${date}T${startTime}`).getTime();
      const clientEnd = new Date(`${date}T${endTime}`).getTime();
      const serverStart = new Date(
        `${row.date.toISOString().split("T")[0]}T${row.start_time}`
      ).getTime();
      const serverEnd = new Date(
        `${row.date.toISOString().split("T")[0]}T${row.end_time}`
      ).getTime();
      if (clientStart <= serverEnd && clientEnd >= serverStart) {
        return res.status(400).json({
          success: false,
          message: "Time slot already occupied.",
        });
      }
    }

    // Insert event
    const eventInsert = await pool.query(
      `INSERT INTO events 
        (title, event_type, priest_name, description, venue, expected_attendance, client_email, 
         date, start_time, end_time, is_recurring, recurring_days, has_end_date, end_date, chapel_name)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       RETURNING id`,
      [
        title,
        eventType,
        priestName,
        description,
        venue,
        expectedAttendance,
        clientEmail,
        date,
        startTime,
        endTime,
        isRecurring,
        recurringDays,
        hasEndDate,
        endDate,
        chapelName,
      ]
    );

    const eventId = eventInsert.rows[0].id;

    // Insert sponsors
    for (const sponsor of sponsors) {
      const sponsorName = sponsor.sponsor_name?.trim();
      const sponsorType = sponsor.sponsor_type?.trim(); // Should be 'Principal' or 'Secondary'
      if (sponsorName && sponsorType) {
        await pool.query(
          `INSERT INTO event_sponsors (event_id, sponsor_name, sponsor_type)
           VALUES ($1, $2, $3)`,
          [eventId, sponsorName, sponsorType]
        );
      }
    }

    // Insert organizers
    for (const org of organizers) {
      const name = org.name?.trim();
      const position = org.position?.trim();
      if (!name || !position) continue;

      // Insert or retrieve organizer
      const orgResult = await pool.query(
        `INSERT INTO organizers (name)
         VALUES ($1)
         RETURNING id`,
        [name]
      );
      const organizerId = orgResult.rows[0].id;

      // Join with event
      await pool.query(
        `INSERT INTO event_organizers (event_id, organizer_id, position)
         VALUES ($1, $2, $3)`,
        [eventId, organizerId, position]
      );
    }

    return res.status(201).json({
      success: true,
      message: "Event created with sponsors and organizers",
      eventId,
    });
  } catch (error) {
    console.error("Error in createEvent:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create event",
      error: error.message,
    });
  }
}

// updated
export async function getEvents(req, res) {
  try {
    const result = await pool.query(`
      SELECT * 
      FROM events 
      WHERE status != 'canceled' AND is_canceled = false 
      ORDER BY id DESC
    `);

    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No Events Found." });
    }

    const events = await Promise.all(
      result.rows.map(async (event) => {
        // Format datetime fields
        if (event.start_time) {
          event.start_time = moment
            .utc(event.start_time)
            .tz("Asia/Manila")
            .format();
        }
        if (event.end_time) {
          event.end_time = moment
            .utc(event.end_time)
            .tz("Asia/Manila")
            .format();
        }

        // Fetch sponsors
        const sponsorResult = await pool.query(
          "SELECT sponsor_name, sponsor_type FROM event_sponsors WHERE event_id = $1",
          [event.id]
        );
        event.sponsors = sponsorResult.rows;

        // Fetch organizers
        const organizerResult = await pool.query(
          `SELECT o.name, eo.position 
           FROM event_organizers eo
           JOIN organizers o ON o.id = eo.organizer_id
           WHERE eo.event_id = $1`,
          [event.id]
        );
        event.organizers = organizerResult.rows;

        return event;
      })
    );

    return res.status(200).json({ success: true, data: events });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch events",
      error: error.message,
    });
  }
}

// updated
export async function getEventById(req, res) {
  const { id } = req.params;

  try {
    // Fetch the event
    const result = await pool.query("SELECT * FROM events WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res
        .status(204)
        .json({ success: true, message: "No Events Found." });
    }

    const event = result.rows[0];

    // Convert datetime fields
    if (event.start_time) {
      event.start_time = moment
        .utc(event.start_time)
        .tz("Asia/Manila")
        .format();
    }
    if (event.end_time) {
      event.end_time = moment.utc(event.end_time).tz("Asia/Manila").format();
    }

    // Fetch event sponsors
    const sponsorResult = await pool.query(
      "SELECT sponsor_name, sponsor_type FROM event_sponsors WHERE event_id = $1",
      [id]
    );
    event.sponsors = sponsorResult.rows;

    // Fetch event organizers (join with organizers)
    const organizerResult = await pool.query(
      `SELECT o.name, eo.position
       FROM event_organizers eo
       JOIN organizers o ON o.id = eo.organizer_id
       WHERE eo.event_id = $1`,
      [id]
    );
    event.organizers = organizerResult.rows;

    return res.status(200).json({ success: true, data: event });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch event",
      error: error.message,
    });
  }
}

export async function getUnavailableDates(req, res) {
  try {
    const result = await pool.query(
      "SELECT COUNT(id), date FROM events GROUP BY date"
    );

    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No events found" });
    }

    return res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch unavailable events.",
      error: error.message,
    });
  }
}

// updated
export async function updateEvent(req, res) {
  const { id } = req.params;
  const {
    title,
    eventType,
    priestName,
    description,
    venue,
    expectedAttendance,
    clientEmail,
    date,
    startTime,
    endTime,
    isRecurring,
    recurringDays,
    hasEndDate,
    endDate,
    sponsors = [], // Expecting: [{ sponsor_name, sponsor_type }]
    organizers = [], // Expecting: [{ name, position }]
  } = req.body;

  if (!title || !startTime || !endTime || !eventType || !date || !venue) {
    return res
      .status(400)
      .json({ success: false, message: "All required fields must be filled." });
  }

  const trimmedTitle = title && trimValue(title);
  const trimmedVenue = venue && trimValue(venue);
  const trimmedPriestName = priestName && trimValue(priestName);
  const trimmedDescription = description && trimValue(description);
  const trimmedClientEmail = clientEmail && trimValue(clientEmail);

  // const client = await pool.connect();
  try {
    await pool.query("BEGIN");

    // Update core event data
    const result = await pool.query(
      `UPDATE events
       SET title = $1, event_type = $2, priest_name = $3, description = $4,
           venue = $5, client_email = $6, date = $7, start_time = $8, end_time = $9,
           is_recurring = $10, recurring_days = $11, has_end_date = $12, end_date = $13,
           expected_attendance = $14
       WHERE id = $15
       RETURNING *`,
      [
        trimmedTitle,
        eventType,
        trimmedPriestName,
        trimmedDescription,
        trimmedVenue,
        trimmedClientEmail,
        date,
        startTime,
        endTime,
        isRecurring,
        recurringDays,
        hasEndDate,
        endDate,
        expectedAttendance,
        id,
      ]
    );

    const updatedEvent = result.rows[0];

    // Clear and re-insert sponsors
    await pool.query("DELETE FROM event_sponsors WHERE event_id = $1", [id]);
    for (const sponsor of sponsors) {
      const { sponsor_name, sponsor_type } = sponsor;
      await pool.query(
        `INSERT INTO event_sponsors (event_id, sponsor_name, sponsor_type)
         VALUES ($1, $2, $3)`,
        [id, sponsor_name, sponsor_type]
      );
    }

    // Clear and re-insert organizers
    await pool.query("DELETE FROM event_organizers WHERE event_id = $1", [id]);
    for (const organizer of organizers) {
      const { name, position } = organizer;

      // Insert or find existing organizer
      const orgResult = await pool.query(
        "SELECT id FROM organizers WHERE name = $1",
        [name]
      );

      let organizerId;
      if (orgResult.rows.length > 0) {
        organizerId = orgResult.rows[0].id;
      } else {
        const insertResult = await pool.query(
          "INSERT INTO organizers (name) VALUES ($1) RETURNING id",
          [name]
        );
        organizerId = insertResult.rows[0].id;
      }

      // Insert into event_organizers
      await pool.query(
        `INSERT INTO event_organizers (event_id, organizer_id, position)
         VALUES ($1, $2, $3)`,
        [id, organizerId, position]
      );
    }

    await pool.query("COMMIT");

    return res.status(200).json({
      success: true,
      data: updatedEvent,
      message: "Event updated successfully",
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Update error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update event",
      error: error.message,
    });
  }
}

// updated
export async function deleteEvent(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "ID parameter is missing",
    });
  }

  try {
    console.log(`ID received: ${id}`);

    await pool.query("BEGIN");

    // Check if event exists
    const eventCheck = await pool.query("SELECT * FROM events WHERE id = $1", [
      id,
    ]);

    if (eventCheck.rows.length === 0) {
      await pool.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Delete from event_sponsors
    await pool.query("DELETE FROM event_sponsors WHERE event_id = $1", [id]);

    // Delete from event_organizers
    await pool.query("DELETE FROM event_organizers WHERE event_id = $1", [id]);

    // Delete the event
    const deleteResult = await pool.query(
      "DELETE FROM events WHERE id = $1 RETURNING *",
      [id]
    );

    await pool.query("COMMIT");

    return res.status(200).json({
      success: true,
      message: "Event and related records deleted successfully",
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error deleting event:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the event",
      error: error.message,
    });
  }
}

// updated
export async function cancelEvent(req, res) {
  const { id } = req.params;
  const { cancelMessage } = req.body;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Event ID is required.",
    });
  }

  try {
    const updateQuery = `
      UPDATE events
      SET 
        is_canceled = TRUE,
        status = 'canceled',
        canceled_at = NOW(),
        cancel_reason = $1
      WHERE id = $2
      RETURNING *;
    `;

    const result = await pool.query(updateQuery, [cancelMessage, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Event not found or already canceled.",
      });
    }

    console.log(`Event ID ${id} successfully marked as canceled.`);
    return res.status(200).json({
      success: true,
      message: "Event canceled successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error canceling event:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel event.",
      error: error.message,
    });
  }
}

// updated
export async function getCanceledEvents(req, res) {
  try {
    const result = await pool.query(`
      SELECT 
        e.*, 
        COALESCE(json_agg(es) FILTER (WHERE es.event_id IS NOT NULL), '[]') AS sponsors,
        COALESCE(
          json_agg(
            json_build_object('id', o.id, 'name', o.name, 'position', eo.position)
          ) FILTER (WHERE o.id IS NOT NULL), '[]'
        ) AS organizers
      FROM events e
      LEFT JOIN event_sponsors es ON es.event_id = e.id
      LEFT JOIN event_organizers eo ON eo.event_id = e.id
      LEFT JOIN organizers o ON eo.organizer_id = o.id
      WHERE e.is_canceled = TRUE AND e.status='canceled'
      GROUP BY e.id
      ORDER BY e.canceled_at DESC
    `);

    return res.status(200).json({
      success: true,
      data: result.rows,
      message: result.rows.length
        ? "Successfully fetched canceled events with sponsors and organizers."
        : "No canceled events found.",
    });
  } catch (error) {
    console.error("Error fetching canceled events:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch canceled events.",
      error: error.message,
    });
  }
}

// updated
export async function restoreCanceledEvent(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Event ID is required.",
    });
  }

  try {
    await pool.query("BEGIN");

    // 1. Get the canceled event from the main events table
    const { rows: events } = await pool.query(
      "SELECT * FROM events WHERE id = $1 AND status = 'canceled'",
      [id]
    );

    if (events.length === 0) {
      await pool.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        message: "Event not found or is not canceled.",
      });
    }

    // 2. Restore the event
    await pool.query(
      `
      UPDATE events
      SET status = 'scheduled',
          restored_at = $1,
          is_canceled = 'false'
      WHERE id = $2
    `,
      [new Date(), id]
    );

    await pool.query("COMMIT");

    return res.status(200).json({
      success: true,
      message: "Event restored successfully.",
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error restoring event:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to restore event.",
      error: error.message,
    });
  }
}

export async function getEventsStatusCount(req, res) {
  try {
    const { rows } = await pool.query(
      "SELECT status, count(*) AS count FROM events GROUP BY status"
    );

    const eventCounts = rows.reduce((acc, row) => {
      acc[row.status] = parseInt(row.count, 10);
      // console.log("acc: ", acc);
      return acc;
    }, {});

    return res.status(200).json({ success: true, eventCounts });
  } catch (error) {
    console.error("Error fetching event counts:", error);
    return res
      .status(500)
      .json({ success: false, error, message: "Internal Server Error" });
  }
}

export async function getRecentEvents(req, res) {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM events WHERE date BETWEEN NOW() - INTERVAL '3 months' AND NOW()"
    );

    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error("Error fetching recent events:", error);
    return res
      .status(500)
      .json({ success: false, error, message: "Internal Server Error" });
  }
}

export const getEventsFromLastMonth = async (req, res) => {
  try {
    const query = `
      SELECT * FROM events
      WHERE date BETWEEN NOW() - INTERVAL '1 month' AND NOW();
    `;

    const { rows } = await pool.query(query);
    return res.status(200).json({ success: true, rows });
  } catch (error) {
    console.error("Error fetching events: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
