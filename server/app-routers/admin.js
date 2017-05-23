const express = require('express')
const adminLinksRouter = require('./admin-links')
const adminSettingsRouter = require('./admin-settings')
const adminUnavailabilitiesRouter = require('./admin-unavailabilities')
const restrictToLoggedIn = require('../restrict-to-logged-in')

const router = express.Router()
router.use(restrictToLoggedIn)
router.use('/link', adminLinksRouter)
router.use('/settings', adminSettingsRouter)
router.use('/unavailabilities', adminUnavailabilitiesRouter)

//Catch any failed admin requests to avoid them being treated as link requests with uuid "admin"
router.use((req, res) => {
  res.json({success: false, message: 'Unmatched admin API: ' + req.url})
})

module.exports = router
