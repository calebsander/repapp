const express = require('express')
const db = require('../database')
const respondWithError = require('../respond-with-error')
const router = express.Router()
const validatePostParams = require('../validate-post-params')
const localDate = require('../local-date')

//[start,end] -- inclusive upper bound
router.post('/day',
	validatePostParams({start: String, end: String, tier: Number}),
	function (req, res) {
		let day = localDate(req.body.start)
		const end = localDate(req.body.end)
		const dateArray = []
		while (day <= end) {
			dateArray.push(day)
			day = new Date(day.getTime() + 24 * 60 * 60 * 1000)
		}
		Promise.all(dateArray.map(function (day) {
			db.unavailable_day.create({
				day,
				tierPriority: req.body.tier,
				reason: req.body.reason
			})
		})).then(() => res.json({ success: true }))
			.catch(respondWithError(res))
	}
)

router.post('/period', function (req, res) {
	db.unavailable_period.create({
		repeatWeekly: req.body.repeatWeekly,
		repeatEnd: req.body.repeatEnd,
		periodId: req.body.period,
		day: req.body.day,
		tierPriority: req.body.tier,
		reason: req.body.reason
	})
		.then(() => res.json({ success: true }))
		.catch(respondWithError(res))
})

module.exports = router
