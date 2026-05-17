const express = require('express')
const Task = require('../models/Task')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/create', authMiddleware, async (req, res) => {

  try {

    const {
      title,
      description,
      dueDate,
      priority,
      status,
      assignedTo,
      project
    } = req.body

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      status,
      assignedTo,
      project
    })

    res.status(201).json({
      message: 'Task created',
      task
    })

  } catch (error) {

    res.status(500).json({
      message: error.message
    })
  }
})

router.get('/', authMiddleware, async (req, res) => {

  try {

    const tasks = await Task.find()
      .populate('assignedTo', 'name email')
      .populate('project', 'name')

    res.json(tasks)

  } catch (error) {

    res.status(500).json({
      message: error.message
    })
  }
})

router.put('/:id', authMiddleware, async (req, res) => {

  try {

    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({
        message: 'Task not found'
      })
    }

    if (task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'Only assigned user can update task'
      })
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.json(updatedTask)

  } catch (error) {

    res.status(500).json({
      message: error.message
    })
  }
})

module.exports = router