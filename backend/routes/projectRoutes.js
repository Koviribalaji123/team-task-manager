const express = require('express')
const Project = require('../models/Project')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/create', authMiddleware, async (req, res) => {
  try {

    const { name, description } = req.body

    const project = await Project.create({
      name,
      description,
      admin: req.user.id,
      members: [req.user.id]
    })

    res.status(201).json({
      message: 'Project created',
      project
    })

  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
})

router.get('/', authMiddleware, async (req, res) => {
  try {

    const projects = await Project.find({
      members: req.user.id
    })

    res.json(projects)

  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
})

module.exports = router