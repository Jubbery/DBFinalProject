const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "pass1234",
    host: "localhost",
    port: 5432,
    database: "taskapp"
  });
  
  module.exports = pool;