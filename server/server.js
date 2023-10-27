const PORT = process.env.PORT || 8000;
const express = require("express");
const cors = require("cors");
const app = express();
const pool = require("./db");
const fetch = require("node-fetch");
const ICAL = require("ical.js");

app.use(cors());
app.use(express.json());

// get all tasks
app.get("/tasks/:user_id", async (req, res) => {
  // console.log(req)
  const { user_id } = req.params; // TESTING
  console.log("user: ", user_id);
  try {
    const tasks = await pool.query("SELECT * FROM tasks WHERE user_id = $1", [
      user_id,
    ]);
    res.json(tasks.rows);
  } catch (err) {
    console.error(err);
  }
});

app.post("/fetchCanvasEvents", async (req, res) => {
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
        start: event.startDate.toString(),
      };
    });

    res.send({ events });
  } catch (error) {
    console.error("Error fetching Canvas events:", error.message);
    res.status(500).send({ error: "Failed to fetch events." });
  }
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
