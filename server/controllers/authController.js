const bcrypt = require("bcrypt"); // for password hashing
const jwt = require("jsonwebtoken"); // for token generation
const db = require("../db");

const checkDbConnection = async () => {
  console.log(db);
  try {
    await db.query("SELECT NOW()");
    console.log("Database connection successful");

    const tables = await db.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public'"
    );
    console.log("Tables in database:", tables.rows);

    const users = await db.query("SELECT * FROM users");
    console.log("Users in database:", users.rows);
  } catch (error) {
    console.error("Database connection error", error);
  }
};

// Check database connection on startup
checkDbConnection();

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await db.query(`SELECT * FROM users WHERE email = $1`, [
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

    res.json({ token: token });
  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).send("Server Error");
  }
};

const signupUser = async (req, res) => {
  const { fname, lname, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await db.query(
      "SELECT * FROM Users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert the new user into the database
    const newUser = await db.query(
      `INSERT INTO Users 
      (fname, lname, email, hashed_pass) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
      `,
      [fname, lname, email, hashedPassword]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error("Error during signup:", err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  loginUser,
  signupUser,
  checkDbConnection,
};
