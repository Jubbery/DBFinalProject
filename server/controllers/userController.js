const pool = require("../db");

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await pool.query("SELECT * FROM Users");
    res.json(allUsers.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const createNewUser = async (req, res) => {
  const { fname, lname, email, hashed_pass } = req.body;
  try {
    const newUser = await db.query(
      "INSERT INTO Users (fname, lname, email, hashed_pass) VALUES ($1, $2, $3, $4) RETURNING *",
      [fname, lname, email, hashed_pass]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  getAllUsers,
  createNewUser,
};
