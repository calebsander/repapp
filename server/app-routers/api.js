const express = require('express')
const restrictToLoggedIn = require('../restrict-to-logged-in')
const bodyParser = require('body-parser')
const loginRouter = require('./login')
const adminRouter = require('./admin')
const collegeRepRouter = require('./college-rep')

const router = express.Router()
router.use(bodyParser.json())

router.use('/login', loginRouter)
router.use('/admin', restrictToLoggedIn, adminRouter)

// API calls college reps need
router.use('/:linkId', collegeRepRouter)

module.exports = router