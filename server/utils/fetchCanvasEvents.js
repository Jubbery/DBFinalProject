const fetch = require("node-fetch");
const ICAL = require("ical.js");

const fetchCanvasEvents = async (canvasURL) => {
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
  return events;
};

module.exports = fetchCanvasEvents;
