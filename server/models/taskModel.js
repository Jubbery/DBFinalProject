const pool = require("../config/dbConfig");

const getAllTasksForUser = async (userId) => {
  const tasks = await pool.query("SELECT * FROM Tasks WHERE user_id = $1", [
    userId,
  ]);
  return tasks.rows;
};

// Add more task-related database operations here...

module.exports = {
  getAllTasksForUser,
  // other exports...
};
