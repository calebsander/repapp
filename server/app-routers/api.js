const express = require('express')
const bodyParser = require('body-parser')
const loginRouter = require('./login')
const db = require('../database')
const adminRouter = require('./admin')
const collegeRepRouter = require('./college-rep')
const loggedInRouter = require('./logged-in')
const periodsRouter = require('./periods')

const router = express.Router()
router.use(bodyParser.json())

router.use('/login', loginRouter)
router.use('/admin', adminRouter)
router.use('/logged-in', loggedInRouter)
router.use('/periods', periodsRouter)

// API calls college reps need
router.use('/:linkId', (req, res, next) => {
  req.linkId = req.params.linkId
  next()
}, collegeRepRouter)

module.exports = router
