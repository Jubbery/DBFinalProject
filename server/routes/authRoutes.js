const express = require("express");
const { loginUser, signupUser } = require("../controllers/authController");
const router = express.Router();

// Define endpoints related to authentication
router.post("/login", loginUser);
router.post("/signup", signupUser);

// Export the router
module.exports = router;
