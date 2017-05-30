const {
  link: Link,
  period: Period,
  unavailable_day: UnavailableDay,
  unavailable_period: UnavailablePeriod
} = require('./database')
const localDate = require('./local-date')
const respondWithError = require('./respond-with-error')

const MILLIS_PER_WEEK = 7 * 24 * 60 * 60 * 1000

module.exports = admin =>
  (req, res) => { //expects req to have a weekStart param
    const date = localDate(req.params.weekStart)
    const nextWeek = new Date(date.getTime() + MILLIS_PER_WEEK)
    const dayInWeek = {
      $gte: date,
      $lt: nextWeek
    }
    const restrictTier = (() => {
      if (admin) return {}
      else {
        return {
          tierPriority: {
            $lt: req.link.tierPriority
          }
        }
      }
    })()
    const unavailabilityAttributes = ['day']
    if (admin) unavailabilityAttributes.push('reason', 'tierPriority')
    const unavailableDays = UnavailableDay.findAll({
      where: Object.assign(
        {day: dayInWeek},
        restrictTier
      ),
      attributes: unavailabilityAttributes
    })
    const unavailablePeriods = UnavailablePeriod.findAll({
      where: Object.assign(
        {
          $or: [
            {day: dayInWeek},
            {
              repeatWeekly: true,
              repeatEnd: {
                $or: {
                  $gte: date,
                  $eq: null
                }
              }
            }
          ]
        },
        restrictTier
      ),
      attributes: unavailabilityAttributes,
      include: {
        model: Period,
        attributes: ['period']
      }
    })
    const linkAttributes = ['scheduledDate']
    if (admin) linkAttributes.push('college')
    const visits = Link.findAll({
      where: {scheduledDate: dayInWeek},
      attributes: linkAttributes,
      include: {
        model: Period,
        attributes: ['period']
      }
    })
    Promise.all([unavailableDays, unavailablePeriods, visits])
      .then(([days, periods, visits]) => {
        res.json({success: true, days, periods, visits})
      })
      .catch(respondWithError(res))
  }