const db = require("../db");
const jwt = require("jsonwebtoken");

const getAllTasksForUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const userTasks = await db.query("SELECT * FROM Tasks WHERE user_id = $1", [
      user_id,
    ]);
    res.json(userTasks.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const orderTasksByDeadline = async (req, res) => {
  const token = req.header("Authorization").split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user_id = decoded.user_id;

  try {
    // Query table for tasks associated with the user_id, ordered by the deadline
    const tasks = await db.query(
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
    const tasks = await db.query(
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
    const tasks = await db.query("SELECT * FROM Tasks ORDER BY priority_level");
    res.json(tasks.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const showTasksByAssignmentType = async (req, res) => {
  const { taskType } = req.params;
  try {
    const tasks = await db.query("SELECT * FROM Tasks WHERE task_type = $1", [
      taskType,
    ]);
    res.json(tasks.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const createTask = async (req, res) => {
  let {
    user_id,
    task_name,
    start_date,
    deadline,
    priority_level,
    status,
    note,
    task_type,
  } = req.body;

  // If deadline is not provided, set it to today's date
  if (!deadline) {
    let today = new Date();
    deadline = today.toISOString().split("T")[0];
  }

  // If task_status is not provided or is an integer, set it to "Not-Started"
  if (!status || typeof status === "number") {
    status = "Not-Started";
  }

  try {
    const newTask = await db.query(
      `INSERT INTO Tasks (user_id, task_name, start_date, deadline, priority_level, task_status, created_at, note, task_type) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, $7, $8) RETURNING *`,
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

const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { task_name, deadline, note, priority_level, task_status, task_type } =
    req.body;

  // If deadline is not provided, set it to today's date
  if (!deadline) {
    let today = new Date();
    deadline = today.toISOString().split("T")[0];
  }

  try {
    const updatedTask = await db.query(
      "UPDATE Tasks SET task_name = $1, deadline = $2, note = $3, priority_level = $4, task_status = $5, task_type = $6 WHERE task_id = $7 RETURNING *",
      [
        task_name,
        deadline,
        note,
        priority_level,
        task_status,
        task_type,
        taskId,
      ]
    );

    res.json(updatedTask.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(`Server Error: ${err.message}`);
  }
};

const deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    await db.query("DELETE FROM Tasks WHERE task_id = $1", [taskId]);

    res.json({ message: "Task deleted successfully" });
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
  updateTask,
  deleteTask,
};
