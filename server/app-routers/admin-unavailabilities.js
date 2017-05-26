const express = require('express')
const {unavailable_day: UnavailableDay, unavailable_period: UnavailablePeriod} = require('../database')
const respondWithError = require('../respond-with-error')
const router = express.Router()
const validatePostParams = require('../validate-post-params')
const localDate = require('../local-date')

const MILLIS_PER_DAY = 24 * 60 * 60 * 1000

function destroyDay(day) {
  return UnavailableDay.destroy({
    where: {day}
  })
}
//[start,end] -- inclusive upper bound
router.post('/day',
  validatePostParams({
    start: String,
    end: String,
    tier: Number
  }),
  (req, res) => {
    let day = localDate(req.body.start)
    const end = localDate(req.body.end)
    const dateArray = []
    while (day <= end) {
      dateArray.push(day)
      day = new Date(day.getTime() + MILLIS_PER_DAY)
    }
    Promise.all(dateArray.map(day => {
      const createDay = UnavailableDay.create({
        day,
        tierPriority: req.body.tier,
        reason: req.body.reason
      })
      return destroyDay(day)
        .then(() => createDay)
    }))
      .then(() => res.json({success: true}))
      .catch(respondWithError(res))
  }
)
router.delete('/day/:day', (req, res) => {
  destroyDay(localDate(req.params.day))
    .then(() => res.json({success: true}))
    .catch(respondWithError(res))
})

function destroyPeriod(day, periodId) {
  return UnavailablePeriod.destroy({
    where: {
      day,
      periodId
    }
  })
}
router.post('/period',
  validatePostParams({
    repeatWeekly: Boolean,
    period: Number,
    day: String,
    tier: Number
  }),
  (req, res) => {
    const {day, period} = req.body
    destroyPeriod(day, period)
      .then(() =>
        UnavailablePeriod.create({
          repeatWeekly: req.body.repeatWeekly,
          repeatEnd: req.body.repeatEnd,
          periodId: period,
          day,
          tierPriority: req.body.tier,
          reason: req.body.reason
        })
      )
      .then(() => res.json({success: true}))
      .catch(respondWithError(res))
  }
)
router.delete('/period/:day/:period', (req, res) => {
  destroyPeriod(
    localDate(req.params.day),
    Number(req.params.period)
  )
    .then(() => res.json({success: true}))
    .catch(respondWithError(res))
})

module.exports = router
