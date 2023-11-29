const pool = require("../db");
const fetch = require("node-fetch");
const ICAL = require("ical.js");

const processCanvasEvent = async (req, res) => {
  const eventData = req.body; // The mapped event object sent in the request body

  try {
    // Check if the event with the same uid already exists
    const existingEvent = await pool.query(
      "SELECT * FROM events WHERE uid = $1",
      [eventData.uid]
    );

    if (existingEvent.rows.length > 0) {
      // If the event exists, update the existing record
      await db.query(
        "UPDATE events SET dtstamp = $1, dtstart = $2, class = $3, description = $4, sequence = $5, summary = $6, url = $7, x_alt_desc = $8 WHERE uid = $9",
        [
          eventData.dtstamp,
          eventData.dtstart,
          eventData.class,
          eventData.description,
          eventData.sequence,
          eventData.summary,
          eventData.url,
          eventData.xAltDesc,
          eventData.uid,
        ]
      );
    } else {
      // If the event does not exist, insert a new record
      await db.query(
        "INSERT INTO events (dtstamp, uid, dtstart, class, description, sequence, summary, url, x_alt_desc) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
        [
          eventData.dtstamp,
          eventData.uid,
          eventData.dtstart,
          eventData.class,
          eventData.description,
          eventData.sequence,
          eventData.summary,
          eventData.url,
          eventData.xAltDesc,
        ]
      );
    }

    res.status(200).json({ message: "Event processed successfully." });
  } catch (error) {
    console.error("Database operation failed", error);
    res.status(500).json({ error: "Database operation failed" });
  }
};

const fetchCanvasEvents = async (req, res) => {
  const { canvasURL } = req.body;

  if (!canvasURL) {
    return res.status(400).send({ error: "Canvas URL is required." });
  }

  try {
    const response = await fetch(canvasURL);
    const data = await response.text();

    const jcalData = ICAL.parse(data);
    const comp = new ICAL.Component(jcalData);
    const events = comp.getAllSubcomponents("vevent").map((vevent) => {
      const event = new ICAL.Event(vevent);
      return {
        title: event.summary,
        description: event.description,
        start: event.startDate.toString(),
      };
    });
    console.log(events);

    res.send({ events });
  } catch (error) {
    console.error("Error fetching Canvas events:", error.message);
    res.status(500).send({ error: "Failed to fetch events." });
  }
};

const fetchAllCanvasEvents = async (req, res) => {
  const { canvasURL } = req.body;

  if (!canvasURL) {
    return res.status(400).send({ error: "Canvas URL is required." });
  }

  try {
    const response = await fetch(canvasURL);
    const data = await response.text();

    const jcalData = ICAL.parse(data);
    const comp = new ICAL.Component(jcalData);
    const events = comp.getAllSubcomponents("vevent").map((vevent) => {
      const event = new ICAL.Event(vevent);
      return {
        event: event,
      };
    });

    res.send({ events });
  } catch (error) {
    console.error("Error fetching all Canvas events:", error.message);
    res.status(500).send({ error: "Failed to fetch events." });
  }
};

module.exports = {
  processCanvasEvent,
  fetchCanvasEvents,
  fetchAllCanvasEvents,
};
