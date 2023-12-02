var eventGuid;
var eventGuid;
(function () {
  if (typeof module === "object") {
    // CommonJS, where exports may be different each time.
    eventGuid = module.exports;
  } else if (
    typeof HTMLScriptElement !== "undefined" &&
    "noModule" in HTMLScriptElement.prototype
  ) {
    window.eventGuid = eventGuid = {};
  } else if (typeof eventGuid !== "object") {
    eventGuid = {};
  }
})();
/* jshint ignore:end */
eventGuid.ids = 2;
eventGuid.todayStr = new Date().toISOString().replace(/T.*$/, ""); // YYYY-MM-DD of today
eventGuid.createEventId = function () {
  eventGuid.ids = eventGuid.ids + 1;
  return String(eventGuid.ids);
};
eventGuid.INITIAL_EVENTS = [
  {
    id: eventGuid.createEventId,
    title: "All-day event",
    start: eventGuid.todayStr,
  },
  {
    id: eventGuid.createEventId,
    title: "Timed event",
    start: eventGuid.todayStr + "T12:00:00",
  },
];
