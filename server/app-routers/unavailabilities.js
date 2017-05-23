const express = require('express')
const db = require('../database')
const respondWithError = require('../respond-with-error')
const router = express.Router()
const localDate = require('../local-date')

router.get('/:day', function (req, res) {
	const date = localDate(req.params.day)
	const nextWeek = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000)
	Promise.all([
		db.unavailable_day.findAll({
			where:
			{
				day:
				{
					$gte: date,
					$lt: nextWeek
				},
				tierPriority: {
					$lt: req.link.tierPriority
				}
			},
			order: '"day" ASC',
			attributes: ['day']
		}),
		db.unavailable_period.findAll({
			where:
			{
				tierPriority: {
					$lt: req.link.tierPriority
				},
				$or: [
					{
						day:
						{
							$gte: date,
							$lt: nextWeek
						}
					},
					{
						$and:
						{
							repeatWeekly: true,
							$or: [
								{
									repeatEnd:
									{
										$gte: date
									}
								},
								{ repeatEnd: null }
							]
						}
					}]
			},
			order: '"day" ASC',
			include: { model: db.period, attributes: ['day', 'period', 'start', 'end'] },
			attributes: ['day', 'periodId', 'repeatWeekly', 'repeatEnd']
		})
	]).then(function ([days, periods]) {
		res.json({ success: true, days, periods })
	})
		.catch(respondWithError(res))
})

module.exports = router
