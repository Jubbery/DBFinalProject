const pool = require("../db");

const getAllTasksForUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const userTasks = await pool.query(
      "SELECT * FROM Tasks WHERE user_id = $1",
      [user_id]
    );
    res.json(userTasks.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const orderTasksByDeadline = async (req, res) => {
  const { user_id } = req.params; // Extract the user_id from the request parameters
  try {
    // Query table for tasks associated with the user_id, ordered by the deadline
    const tasks = await pool.query(
      "SELECT * FROM Tasks WHERE user_id = $1 ORDER BY deadline",
      [user_id]
    );
    res.json(tasks.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const showTasksAssociatedWithCourses = async (req, res) => {
  try {
    const tasks = await pool.query(
      "SELECT t.* FROM Tasks t JOIN TaskTag tt ON t.task_id = tt.task_id JOIN Tag ta ON tt.tag_name = ta.tag_name JOIN Courses c ON ta.course_id = c.course_id"
    );
    res.json(tasks.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const orderByTaskPriorityLevel = async (req, res) => {
  try {
    const tasks = await pool.query(
      "SELECT * FROM Tasks ORDER BY priority_level"
    );
    res.json(tasks.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const showTasksByAssignmentType = async (req, res) => {
  const { taskType } = req.params;
  try {
    const tasks = await pool.query("SELECT * FROM Tasks WHERE task_type = $1", [
      taskType,
    ]);
    res.json(tasks.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const createTask = async (req, res) => {
  const {
    user_id,
    task_name,
    start_date,
    deadline,
    priority_level,
    status,
    note,
    task_type,
  } = req.body;
  try {
    const newTask = await pool.query(
      "INSERT INTO Tasks (user_id, task_name, start_date, deadline, priority_level, status, created_at, note, task_type) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, $7, $8) RETURNING *",
      [
        user_id,
        task_name,
        start_date,
        deadline,
        priority_level,
        status,
        note,
        task_type,
      ]
    );
    res.json(newTask.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  getAllTasksForUser,
  orderTasksByDeadline,
  showTasksAssociatedWithCourses,
  orderByTaskPriorityLevel,
  showTasksByAssignmentType,
  createTask,
};
