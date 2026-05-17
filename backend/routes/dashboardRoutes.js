const express = require('express')
const Task = require('../models/Task')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/', authMiddleware, async (req, res) => {

  try {

    const totalTasks = await Task.countDocuments()

    const todo = await Task.countDocuments({
      status: 'To Do'
    })

    const inProgress = await Task.countDocuments({
      status: 'In Progress'
    })

    const done = await Task.countDocuments({
      status: 'Done'
    })

    const overdue = await Task.countDocuments({
      dueDate: { $lt: new Date() },
      status: { $ne: 'Done' }
    })

    const tasksPerUser = await Task.aggregate([
      {
        $group: {
          _id: '$assignedTo',
          totalTasks: { $sum: 1 }
        }
      }
    ])

    res.json({
      totalTasks,
      todo,
      inProgress,
      done,
      overdue,
      tasksPerUser
    })

  } catch (error) {

    res.status(500).json({
      message: error.message
    })
  }
})

module.exports = router