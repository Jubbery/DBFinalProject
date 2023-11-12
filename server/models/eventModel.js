const pool = require("../config/dbConfig");

const getEventByUid = async (uid) => {
  const event = await pool.query("SELECT * FROM events WHERE uid = $1", [uid]);
  return event.rows[0];
};

const createOrUpdateEvent = async (eventData) => {
  // Logic to create or update a Canvas event
};

module.exports = {
  getEventByUid,
  createOrUpdateEvent,
};
