const express = require('express')
const db = require('../database')

const router = express.Router()

router.get('/', function (req, res) {
  res.json({success: true,
    data: {
      college: req.link.college,
      scheduledDate: req.link.scheduledDate,
      period: req.link.periodId,
      notesToCollege: req.link.notesToCollege,
      notesFromCollege: req.link.notesFromCollege,
      repname: req.link.repname,
      period: req.link.period}
  })
})

module.exports = router
