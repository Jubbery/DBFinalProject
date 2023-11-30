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

const categorizeTaskType = (title, description) => {
  const taskKeywords = {
    Exam: ["exam", "test", "quiz"],
    Assignment: ["assignment", "homework", "worksheet"],
    Project: ["project", "presentation", "group work"],
  };

  // Function to check if the text contains any of the keywords
  const containsKeyword = (text, keywords) => {
    return keywords.some((keyword) => text.toLowerCase().includes(keyword));
  };

  // Check title and description for each type
  for (const [type, keywords] of Object.entries(taskKeywords)) {
    if (
      containsKeyword(title, keywords) ||
      containsKeyword(description, keywords)
    ) {
      return type;
    }
  }

  // Default type if no keywords found
  return "Assignment";
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
      // const taskType = categorizeTaskType(event.summary, event.description);
      // Modify this query to match your Canvas event object structure
      await db.query(
        `
        INSERT INTO CanvasEvents 
          (event_id, dtstamp, user_id, dtstart, description, summary, url, task_type)
            VALUES ($1, $2, $3, $4, $5, $6, $7, 
              CASE 
                WHEN LOWER($6) LIKE '%exam%' OR LOWER($5) LIKE '%exam%' THEN 'Exam'
                WHEN LOWER($6) LIKE '%test%' OR LOWER($5) LIKE '%test%' THEN 'Exam'
                WHEN LOWER($6) LIKE '%quiz%' OR LOWER($5) LIKE '%quiz%' THEN 'Exam'
                WHEN LOWER($6) LIKE '%assignment%' OR LOWER($5) LIKE '%assignment%' THEN 'Assignment'
                WHEN LOWER($6) LIKE '%homework%' OR LOWER($5) LIKE '%homework%' THEN 'Assignment'
                WHEN LOWER($6) LIKE '%worksheet%' OR LOWER($5) LIKE '%worksheet%' THEN 'Assignment'
                WHEN LOWER($6) LIKE '%project%' OR LOWER($5) LIKE '%project%' THEN 'Project'
                WHEN LOWER($6) LIKE '%presentation%' OR LOWER($5) LIKE '%presentation%' THEN 'Project'
                WHEN LOWER($6) LIKE '%group work%' OR LOWER($5) LIKE '%group work%' THEN 'Project'
                ELSE 'Assignment' -- Default type if no keywords found
              END::task_type_enum)
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
