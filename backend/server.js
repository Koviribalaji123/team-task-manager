const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

const authRoutes = require('./routes/authRoutes')
const authMiddleware = require('./middleware/authMiddleware')
const projectRoutes = require('./routes/projectRoutes')
const taskRoutes = require('./routes/taskRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')

app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.get('/api/auth/test', (req, res) => {
  res.send('DIRECT ROUTE WORKING')
})

app.get('/protected', authMiddleware, (req, res) => {
  res.json({
    message: 'Protected route accessed',
    user: req.user
  })
})

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('API Running')
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})