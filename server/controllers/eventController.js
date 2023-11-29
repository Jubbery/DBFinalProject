const db = require("../db");
const fetch = require("node-fetch");
const ICAL = require("ical.js");
const jwt = require("jsonwebtoken");

const storeCanvasEvents = async (req, res) => {
  // Assuming the Canvas events data is sent in the request body
  const token = req.header("Authorization").split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user_id = decoded.user_id;

  const events = req.body.events;
  console.log(events);

  try {
    // Begin a transaction
    await db.query("BEGIN");

    // Insert each event into the CanvasEvents table
    for (const event of events) {
      await db.query(
        `
                INSERT INTO CanvasEvents 
                (dtstamp, user_id, dtstart, class, description, sequence, summary, url, x_alt_desc)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                ON CONFLICT (user_id) DO UPDATE 
                SET dtstamp = EXCLUDED.dtstamp,
                    dtstart = EXCLUDED.dtstart,
                    class = EXCLUDED.class,
                    description = EXCLUDED.description,
                    sequence = EXCLUDED.sequence,
                    summary = EXCLUDED.summary,
                    url = EXCLUDED.url,
                    x_alt_desc = EXCLUDED.x_alt_desc;
            `,
        [
          event.dtstamp,
          user_id,
          event.dtstart,
          event.class,
          event.description,
          event.sequence,
          event.summary,
          event.url,
          event.x_alt_desc,
        ]
      );
    }

    // Commit the transaction
    await db.query("COMMIT");

    res.status(200).send("Events stored successfully");
  } catch (error) {
    // Rollback the transaction on error
    await db.query("ROLLBACK");
    console.error("Error storing events:", error);
    res.status(500).send("Failed to store events");
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
  storeCanvasEvents,
  fetchCanvasEvents,
  fetchAllCanvasEvents,
};
