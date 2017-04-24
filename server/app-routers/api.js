const express = require('express')
const restrictToLoggedIn = require('../restrict-to-logged-in')

const loginRouter = require('./login')

const router = express.Router()
router.use('/login', loginRouter)
router.get(
  '/restricted',
  restrictToLoggedIn,
  (req, res) => res.json({success: true, response: "You're in!"})
)

module.exports = router