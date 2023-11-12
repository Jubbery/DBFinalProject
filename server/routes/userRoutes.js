const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Define endpoints related to users
router.get("/", userController.getAllUsers);
router.post("/", userController.createNewUser);

// Export the router
module.exports = router;
