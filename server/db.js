const { Pool } = require("pg");
const dbConfig = require("./config/dbConfig");
const pool = new Pool(dbConfig);

// Test the database connection TESTING
pool.query('SELECT NOW()', (error, results) => {
    if (error) {
      console.error('Error connecting to the database:', error);
    } else {
      console.log('Successfully connected to the database. Current time:', results.rows[0].now);
  
      // Query for the current database name
      pool.query('SELECT current_database()', (error, results) => {
        if (error) {
          console.error('Error fetching database name:', error);
        } else {
          console.log('Connected to database:', results.rows[0].current_database);
  
          // Query for the list of tables
          pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'", (error, results) => {
            if (error) {
              console.error('Error fetching tables:', error);
            } else {
              console.log('Tables:', results.rows.map(row => row.table_name));
            }
          });
        }
      });
    }
  });
  
module.exports = pool;