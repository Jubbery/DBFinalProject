const db = require("../db");
const fetch = require("node-fetch");
const ICAL = require("ical.js");
const jwt = require("jsonwebtoken");

const convertJCalToJSON = (jCal) => {
  const jsonEvent = {};
  jCal[1].forEach((prop) => {
    const propName = prop[0];
    const propValue = prop[3];
    jsonEvent[propName] = propValue;
  });
  return jsonEvent;
};

const storeCanvasEvents = async (req, res) => {
  const user_id = jwt.verify(
    req.header("Authorization").split(" ")[1],
    process.env.JWT_SECRET
  ).user_id;

  try {
    // Get the Canvas URL for the user
    const userUrlResult = await db.query(
      "SELECT canvasurl FROM Users WHERE user_id = $1",
      [user_id]
    );
    console.log("User URL result:", userUrlResult.rows);
    const canvasUrl = userUrlResult.rows[0].canvasurl;

    if (!canvasUrl) {
      return res.status(404).send("Canvas URL not found for the user");
    }

    // Fetch events from the Canvas URL
    const response = await fetch(canvasUrl);
    const data = await response.text();
    const jcalData = ICAL.parse(data);
    const comp = new ICAL.Component(jcalData);
    const events = comp.getAllSubcomponents("vevent").map((vevent) => {
      const event = new ICAL.Event(vevent);
      const eventJson = convertJCalToJSON(event.component.jCal);
      return eventJson;
    });

    // Begin the transaction
    await db.query("BEGIN");

    // Insert each event into the CanvasEvents table
    for (const event of events) {
      // console.log("Inserting event:", Object.keys(event.component.jCal));
      // Modify this query to match your Canvas event object structure
      await db.query(
        `
        INSERT INTO CanvasEvents 
        (event_id, dtstamp, user_id, dtstart, description, summary, url)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (event_id) DO UPDATE 
        SET dtstamp = EXCLUDED.dtstamp,
            user_id = EXCLUDED.user_id,
            dtstart = EXCLUDED.dtstart,
            description = EXCLUDED.description,
            summary = EXCLUDED.summary,
            url = EXCLUDED.url
      `,
        [
          event.uid,
          event.dtstamp,
          user_id,
          event.dtstart,
          event.description,
          event.summary,
          event.url,
        ]
      );
    }

    // Commit the transaction
    await db.query("COMMIT");

    res.status(200).send("Events stored successfully");
    console.log("Events stored successfully");
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
    const user_id = jwt.verify(
      req.header("Authorization").split(" ")[1],
      process.env.JWT_SECRET
    ).user_id;
    await updateUserCanvasUrl(user_id, canvasURL);

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

    res.send({ events });
  } catch (error) {
    console.error("Error fetching Canvas events:", error.message);
    res.status(500).send({ error: "Failed to fetch events." });
  }
};

const updateUserCanvasUrl = async (userId, canvasUrl) => {
  try {
    const query = `
      UPDATE Users
      SET canvasurl = $1
      WHERE user_id = $2;
    `;
    const values = [canvasUrl, userId];
    await db.query(query, values);
    console.log("Canvas URL updated successfully");
  } catch (err) {
    console.error("Error updating Canvas URL:", err);
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
