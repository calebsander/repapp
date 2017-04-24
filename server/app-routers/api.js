const express = require('express')
const restrictToLoggedIn = require('../restrict-to-logged-in')

const loginRouter = require('./login')

const router = express.Router()
router.use('/login', loginRouter)

module.exports = router