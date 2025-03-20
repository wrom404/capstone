import pool from "../config/db.js";
import trimValue from "../utils/trim.js";
import moment from "moment-timezone";

export async function createEvent(req, res) {
  const {
    title,
    eventType,
    priestName,
    description,
    venue,
    expectedAttendance,
    clientNumber,
    date, //YY-MM-DD
    startTime, //HH:MI:SS
    endTime,
    isRecurring,
    recurringDays,
    hasEndDate,
    endDate,
  } = req.body;

  console.log(
    `title: ${title}, startTime: ${startTime}, endTime: ${endTime}, description: ${description}, venue: ${venue}, expectedAttendance: ${expectedAttendance}, clientNumber: ${clientNumber}, eventType: ${eventType}, priestName ${priestName}, date:${date}, recurringDays:${recurringDays}, isRecurring:${isRecurring}, hasEndDate:${hasEndDate}, endDate: ${endDate}`
  );

  if (!title || !startTime || !endTime || !eventType || !date || !venue) {
    return res
      .status(400)
      .json({ success: false, error: "All required fields must be filled." });
  }

  const trimmedTitle = title && trimValue(title);
  const trimmedVenue = venue && trimValue(venue);
  const trimmedPriestName = priestName && trimValue(priestName);
  const trimmedDescription = description && trimValue(description);
  const trimmedClientNumber = clientNumber && trimValue(clientNumber);

  console.log(
    `TRIMMED VALUES = title: ${trimmedTitle}, startTime: ${startTime}, endTime: ${endTime}, description: ${trimmedDescription}, venue: ${trimmedVenue}, expectedAttendance: ${expectedAttendance}, clientNumber: ${trimmedClientNumber}, eventType: ${eventType}, priestName ${trimmedPriestName}, date:${date}, recurringDays:${recurringDays}, isRecurring:${isRecurring}, hasEndDate:${hasEndDate}, endDate: ${endDate}`
  );

  try {
    const countResult = await pool.query(
      "SELECT COUNT(id) FROM events WHERE date = $1",
      [date]
    );

    if (countResult.rows[0].count >= 3) {
      const errorResponse = {
        success: false,
        count: countResult.rows[0],
        message: "Date is fully booked. Please choose another date.",
      };

      console.log("Error Response:", errorResponse); // Add console.log here

      return res.status(400).json(errorResponse);
    }

    const result = await pool.query(
      "INSERT INTO events (title, event_type, priest_name, description, venue, expected_attendance, client_number, date, start_time, end_time, is_recurring, recurring_days, has_end_date, end_date) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *",
      [
        trimmedTitle,
        eventType,
        trimmedPriestName,
        trimmedDescription,
        trimmedVenue,
        expectedAttendance,
        trimmedClientNumber,
        date,
        startTime,
        endTime,
        isRecurring,
        recurringDays,
        hasEndDate,
        endDate,
      ]
    );

    return res.status(201).json({
      success: true,
      data: result.rows[0],
      message: "Event created successfully",
      count: countResult.rows,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to created event",
      error: error.message,
    });
  }
}

export async function getEvents(req, res) {
  try {
    const result = await pool.query("SELECT * FROM events ORDER BY id DESC");
    const events = result.rows.map((event) => {
      if (event.start_time) {
        event.start_time = moment
          .utc(event.start_time)
          .tz("Asia/Manila")
          .format();
      }
      if (event.end_time) {
        event.end_time = moment.utc(event.end_time).tz("Asia/Manila").format();
      }
      return event;
    });

    // console.log(events); // Now shows the correct time in PH timezone
    return res.status(200).json({ success: true, data: events });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch events",
      error: error.message,
    });
  }
}

export async function getEventById(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM events WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid id" });
    }

    const events = result.rows.map((event) => {
      if (event.start_time) {
        event.start_time = moment
          .utc(event.start_time)
          .tz("Asia/Manila")
          .format();
      }
      if (event.end_time) {
        event.end_time = moment.utc(event.end_time).tz("Asia/Manila").format();
      }
    });

    return res.status(200).json({ success: true, data: result.rows });
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

export async function updateEvent(req, res) {
  const { id } = req.params;
  const {
    title,
    eventType,
    priestName,
    description,
    venue,
    expectedAttendance,
    clientNumber,
    date, //YY-MM-DD
    startTime, //HH:MI:SS
    endTime,
    isRecurring,
    recurringDays,
    hasEndDate,
    endDate,
  } = req.body;

  console.log(
    `title: ${title}, startTime: ${startTime}, endTime: ${endTime}, description: ${description}, venue: ${venue}, expectedAttendance: ${expectedAttendance}, clientNumber: ${clientNumber}, eventType: ${eventType}, priestName ${priestName}, date:${date}, recurringDays:${recurringDays}, isRecurring:${isRecurring}, hasEndDate:${hasEndDate}, endDate: ${endDate}`
  ); // it logs like this title: sample event, startTime: 2025-03-26T09:00:00.000Z, endTime: 2025-03-26T11:00:00.000Z, description: sample event, venue: ormoc, expectedAttendance: 100, clientNumber: , eventType: confession, priestName priest 1, date:2025-03-26T16:00:00.000Z, recurringDays:, isRecurring:false, hasEndDate:false, endDate: null

  if (!title || !startTime || !endTime || !eventType || !date || !venue) {
    console.log("All required fields must be filled.");
    return res
      .status(400)
      .json({ success: false, message: "All required fields must be filled." });
  }
  const trimmedTitle = title && trimValue(title);
  const trimmedVenue = venue && trimValue(venue);
  const trimmedPriestName = priestName && trimValue(priestName);
  const trimmedDescription = description && trimValue(description);
  const trimmedClientNumber = clientNumber && trimValue(clientNumber);

  try {
    const result = await pool.query(
      "UPDATE events SET title = $1, event_type = $2, priest_name = $3, description = $4, venue = $5, client_number = $6, date = $7, start_time = $8, end_time = $9, is_recurring = $10, recurring_days = $11, has_end_date = $12, end_date = $13, expected_attendance = $14 WHERE id = $15 RETURNING *",
      [
        trimmedTitle,
        eventType,
        trimmedPriestName,
        trimmedDescription,
        trimmedVenue,
        trimmedClientNumber,
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

    return res.status(200).json({
      success: true,
      data: result.rows[0],
      message: "Event updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update event",
      error: error.message,
    });
  }
}

export async function deleteEvent(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "ID parameter is missing",
    });
  }

  console.log(`ID received: ${id}`);

  try {
    // Check if the event exists
    const eventCheck = await pool.query("SELECT * FROM events WHERE id = $1", [
      id,
    ]);

    if (eventCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Delete the event
    const result = await pool.query(
      "DELETE FROM events WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Event deleted successfully" });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to delete event",
      });
    }
  } catch (error) {
    console.error("Error deleting event:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the event",
      error: error.message,
    });
  }
}

export async function cancelEvent(req, res) {
  const { id } = req.params;
  const { cancelMessage } = req.body; // Extract from request body

  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Event ID is required." });
  }

  try {
    await pool.query("BEGIN");

    // Move event to canceled_events
    const insertQuery = `
      INSERT INTO canceled_events (title, event_type, description, venue, date, start_time, end_time, recurring_days, end_date, status, canceled_at, reason)
      SELECT title, event_type, description, venue, date, start_time, end_time, recurring_days, end_date, 'canceled', NOW(), $1
      FROM events WHERE id = $2;
    `;
    await pool.query(insertQuery, [cancelMessage, id]);
    
    // Delete from events
    const deleteQuery = `DELETE FROM events WHERE id = $1;`;
    await pool.query(deleteQuery, [id]);

    await pool.query("COMMIT");

    console.log(`Event ID ${id} successfully canceled.`);
    return res
      .status(200)
      .json({ success: true, message: "Event canceled successfully." });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error canceling event:", error);
    console.error("Error message:", error?.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to cancel event." });
  }
}
