const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

// Define endpoints related to tasks
router.get("/:user_id", taskController.getAllTasksForUser);
router.get("/order/deadline", taskController.orderTasksByDeadline);
router.get("/courses", taskController.showTasksAssociatedWithCourses);
router.get("/order/priority", taskController.orderByTaskPriorityLevel);
router.get("/type/:taskType", taskController.showTasksByAssignmentType);
router.post("/", taskController.createTask);

// Export the router
module.exports = router;
