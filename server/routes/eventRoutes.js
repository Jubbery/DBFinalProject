const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");

// Define endpoints related to events
router.post("/CanvasEvents", eventController.processCanvasEvent);
router.post("/fetchCanvasEvents", eventController.fetchCanvasEvents);
router.post("/fetchAllCanvasEvents", eventController.fetchAllCanvasEvents);

// Export the router
module.exports = router;
