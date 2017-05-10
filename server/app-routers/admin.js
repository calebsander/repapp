const express = require('express')
const adminLinksRouter = require('./admin-links')
const adminSettingsRouter = require('./admin-settings')
const adminUnavailabilitiesRouter = require('./admin-unavailabilities')
const restrictToLoggedIn = require('../restrict-to-logged-in')

const router = express.Router()
router.use(restrictToLoggedIn)
router.use('/link', adminLinksRouter)
router.use(adminSettingsRouter)
router.use(adminUnavailabilitiesRouter)

module.exports = router
