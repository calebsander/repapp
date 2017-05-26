const express = require('express')
const {period: Period} = require('../database')
const respondWithError = require('../respond-with-error')

const router = express.Router()
router.get('/', (req, res) => {
  Period.findAll({
    attributes: ['id', 'day', 'period', 'start', 'end'],
    order: ['id']
  })
    .then(periods => res.json({success: true, periods}))
    .catch(respondWithError(res))
})

module.exports = router