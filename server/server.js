const PORT = process.env.PORT || 8000;
const express = require("express");
const cors = require("cors");
const app = express();

require("dotenv").config();

app.use(cors());
app.use(express.json());

const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const eventRoutes = require("./routes/eventRoutes");
const authRoutes = require("./routes/authRoutes");

// Use routers
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
app.use("/events", eventRoutes);

// Catch the 404 and forward to an error handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log error stack for debugging
  res.status(500).json({ error: "Server Error" }); // Respond with 500 status code
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
