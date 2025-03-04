import pool from "../config/db.js";
import trimValue from "../utils/trim.js";

export async function createEvent(req, res) {
  const {
    title,
    eventType,
    priestName,
    description,
    venue,
    clientNumber,
    date, //YY-MM-DD
    startTime, //HH:MI:SS
    endTime,
    isRecurring,
    recurringDays,
    hasEndDate,
    endDate,
  } = req.body;

  if (!title || !startTime || !endTime || !eventType || !date || !venue) {
    return res
      .status(400)
      .json({ success: false, message: "All required fields must be filled." });
  }

  const trimmedTitle = title && trimValue(title);
  const trimmedVenue = venue && trimValue(venue);
  const trimmedPriestName = priestName && trimValue(priestName);
  const trimmedDescription = priestName && trimValue(priestName);
  const trimmedClientNumber = clientNumber && trimValue(clientNumber);

  console.log(
    `title: ${trimmedTitle}, startTime: ${startTime}, endTime: ${endTime}, description: ${trimmedDescription}, venue: ${trimmedVenue}, clientNumber: ${trimmedClientNumber}, eventType: ${eventType}, priestName ${trimmedPriestName}, date:${date}, recurringDays:${recurringDays}, isRecurring:${isRecurring}, hasEndDate:${hasEndDate}, endDate: ${endDate}`
  );

  try {
    const result = await pool.query(
      "INSERT INTO events (title, event_type, priest_name, description, venue, client_number, date, start_time, end_time, is_recurring, recurring_days, has_end_date, end_date) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *",
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
      ]
    );

    return res.status(201).json({
      success: true,
      data: result.rows[0],
      message: "Event created successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getEvents(req, res) {
  try {
    const result = await pool.query("SELECT * FROM events ORDER BY id ASC");
    return res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getEventById(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM events WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid id" });
    }

    return res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
