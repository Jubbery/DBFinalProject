// ./server/config/dbConfig.js
require("dotenv").config();

const dbConfig = {
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME || "todoapp",
};

module.exports = dbConfig;
