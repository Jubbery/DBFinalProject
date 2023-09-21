const express = require('express');
const cors = require('cors');
const db = require("./db");
require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());

// app.post()
// app.get()
// app.put()

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
