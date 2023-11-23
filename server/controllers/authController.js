const bcrypt = require("bcrypt"); // for password hashing
const jwt = require("jsonwebtoken"); // for token generation
const pool = require("../db");

const checkDbConnection = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('Database connection successful');

    const tables = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
    console.log('Tables in database:', tables.rows);

    const users = await pool.query('SELECT * FROM users');
    console.log('Users in database:', users.rows);
  } catch (error) {
    console.error('Database connection error', error);
  }
};
// Call the function when your application starts
checkDbConnection();

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log('Received login request:', { email, password }); // Log the received login request

  try {
    // Check if user exists
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    console.log('User query result:', user.rows); // Log the result of the user query

    if (user.rows.length === 0) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }

    // // Check if password matches, Comment out to skip password verification // THIS IS NOT WORKING: there is some problem where the hashed password has spaces added to the end of it, check the console log for example.
    // const validPassword = await bcrypt.compare(password, user.rows[0].hashed_pass);
    // console.log('Password validation result:', validPassword); // Log the result of the password validation

    // if (!validPassword) {
    //   return res.status(400).json({ error: "Invalid Credentials" });
    // }

    // Create and assign a token
    const token = jwt.sign({ user_id: user.rows[0].user_id }, process.env.JWT_SECRET, { expiresIn: "2 days" });
    console.log('Generated token:', token); // Log the generated token

    res.json({ token });
  } catch (err) {
    console.error('Error during login:', err.message); // Log any errors that occur
    res.status(500).send("Server Error");
  }
};

const signupUser = async (req, res) => {
  const { email, password } = req.body;
  console.log('Received signup request:', { email, password }); // Log the received signup request

  try {
    // Check if user already exists
    const existingUser = await pool.query("SELECT * FROM Users WHERE email = $1", [email]);
    console.log('Existing user query result:', existingUser.rows); // Log the result of the existing user query

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Hashed password:', hashedPassword); // Log the hashed password

    // Insert the new user into the database
    const newUser = await pool.query("INSERT INTO Users (email, hashed_pass) VALUES ($1, $2) RETURNING *", [email, hashedPassword]);
    console.log('New user:', newUser.rows[0]); // Log the new user

    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error('Error during signup:', err.message); // Log any errors that occur
    res.status(500).send("Server Error");
  }
};



module.exports = {
  loginUser,
  signupUser,
  checkDbConnection,
};
