const bcrypt = require("bcrypt"); // for password hashing
const jwt = require("jsonwebtoken"); // for token generation
const pool = require("../db");

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if user exists
    const user = await pool.query("SELECT * FROM Users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length === 0) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }

    // Check if password matches
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].hashed_pass
    );
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }

    // Create and assign a token
    const token = jwt.sign(
      { user_id: user.rows[0].user_id },
      process.env.JWT_SECRET,
      { expiresIn: "2 days" }
    );

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const signupUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log(req.body);
    // Check if user already exists
    const existingUser = await pool.query(
      "SELECT * FROM Users WHERE email = $1",
      [email]
    );
    console.log(existingUser);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert the new user into the database
    const newUser = await pool.query(
      "INSERT INTO Users (email, hashed_pass) VALUES ($1, $2) RETURNING *",
      [email, hashedPassword]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    console.error(err);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  loginUser,
  signupUser,
};
