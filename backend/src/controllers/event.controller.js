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
    // query for count event
    const countResult = await pool.query(
      "SELECT COUNT(id) FROM events WHERE date = $1",
      [date]
    );

    // Check if the date already has 3 or more events
    if (countResult.rows[0].count >= 10) {
      const errorResponse = {
        success: false,
        count: countResult.rows[0],
        message: "Date is fully booked. Please choose another date.",
      };

      console.log("Error Response:", errorResponse); // Add console.log here

      return res.status(400).json(errorResponse);
    }

    // query for specific date
    const dateQuery = await pool.query("SELECT * FROM events WHERE date = $1", [
      date,
    ]);

    const selectedDate = dateQuery.rows;

    for (const selectDate of selectedDate) {
      const clientStart = new Date(startTime).getTime(); // Convert to timestamp
      const clientEnd = new Date(endTime).getTime();

      const serverStart = new Date(selectDate.start_time).getTime();
      const serverEnd = new Date(selectDate.end_time).getTime();

      console.log("Comparing times:");
      console.log("Client Start:", clientStart);
      console.log("Client End:", clientEnd);
      console.log("Server Start:", serverStart);
      console.log("Server End:", serverEnd);

      if (clientStart <= serverEnd && clientEnd >= serverStart) {
        console.log("Time slot already occupied, please choose another time.");
        return res.status(400).json({
          success: false,
          message: "Time slot already occupied, please choose another time.",
        });
      }
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

    if (result.rows.length === 0) {
      res.status(400).json({ success: false, message: "No Events Found." });
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
      return res
        .status(204)
        .json({ success: true, message: "No Events Found." });
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
      INSERT INTO canceled_events (title, event_type, priest_name, description, venue, client_number, date, start_time, end_time, is_recurring, recurring_days, has_end_date, end_date, expected_attendance, status, canceled_at, reason)
      SELECT title, event_type, priest_name, description, venue, client_number, date, start_time, end_time, is_recurring, recurring_days, has_end_date, end_date, expected_attendance, 'canceled', NOW(), $1
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

export async function getCanceledEvents(req, res) {
  try {
    const result = await pool.query(
      "SELECT * FROM canceled_events ORDER BY id DESC"
    );

    if (result.rows.length === 0) {
      console.log("No canceled events found in the database.");
      return res
        .status(204) // Or 204 (No Content)
        .json({ success: true, message: "No canceled events found." });
    }

    return res.status(200).json({
      success: true,
      data: result.rows,
      message: "Successfully fetched canceled events.",
    });
  } catch (error) {
    console.error("Error fetching canceled events:", error); // More specific error log
    return res.status(500).json({
      success: false,
      message: "Failed to fetch canceled events: " + error.message, // Include error message
    });
  }
}

export async function restoreCanceledEvent(req, res) {
  const { id } = req.params;
  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Event ID is required." });
  }

  try {
    await pool.query("BEGIN");

    const selectEvents = await pool.query(
      "SELECT * FROM canceled_events WHERE id = $1",
      [id]
    );

    if (selectEvents.rows.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const selectedEvent = selectEvents.rows[0];
    console.log("Selected event: ", selectedEvent);

    // Move event from canceled_events to events
    const insertQuery = `
      INSERT INTO events (title, event_type, priest_name, description, venue, client_number, date, start_time, end_time, status, is_recurring, recurring_days, has_end_date, end_date, expected_attendance, restored_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`;

    const insertQueryResult = await pool.query(insertQuery, [
      selectedEvent.title,
      selectedEvent.event_type,
      selectedEvent.priest_name,
      selectedEvent.description,
      selectedEvent.venue,
      selectedEvent.client_number,
      selectedEvent.date,
      selectedEvent.start_time,
      selectedEvent.end_time,
      "scheduled",
      selectedEvent.is_recurring,
      selectedEvent.recurring_days,
      selectedEvent.has_end_date,
      selectedEvent.end_date,
      selectedEvent.expected_attendance,
      "NOW()",
    ]);

    if (insertQueryResult.rows.length === 0) {
      await pool.query("ROLLBACK");
      console.error("Error: Failed to insert event into events table.");
      return res.status(500).json({
        success: false,
        message: "Failed to restore event.",
      });
    }

    // Delete from canceled_events
    const deleteQuery = `DELETE FROM canceled_events WHERE id = $1;`;
    await pool.query(deleteQuery, [id]);

    await pool.query("COMMIT");

    console.log(`Event ID ${id} successfully restored.`);

    return res.status(200).json({
      success: true,
      message: "Event restored successfully.",
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error restoring event:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to restore event." });
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
