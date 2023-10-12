const PORT = process.env.PORT ?? 8000
const express = require('express')
const cors = require('cors')
const app = express()
const pool = require('./db')

app.use(cors())
// get all tasks
app.get('/tasks/:user_id', async (req, res) => {
    // console.log(req)
    const {user_id} = req.params // TESTING 
    // console.log(user_id)
    try {
        const tasks = await pool.query('SELECT * FROM tasks WHERE user_id = $1', [user_id])
        res.json(tasks.rows)
    } catch (err) {
        console.error(err)
    }
})

app.listen(PORT, ( )=> console.log(`Server running on PORT ${PORT}`)  )