const express = require('express')

const router = express.Router()
router.get('/', (req, res) => {
  const loggedIn = !!req.session.admin
  res.json({success: true, loggedIn})
})

module.exports = router