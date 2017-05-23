const express = require('express')
const { link: Link, period: Period } = require('../database')
const respondWithError = require('../respond-with-error')

const router = express.Router()

router.delete('/:linkId', function (req, res) {
  Link.destroy({ where: { uuid: req.params.linkId } })
    .then(link => res.json({ success: true }))
    .catch(respondWithError(res))
})

router.get('/all', (req, res) => {
  Link.findAll({
    include: {
      model: Period,
      attributes: ['day', 'period', 'start', 'end']
    },
    attributes: [
      'college',
      'uuid',
      'repName',
      'scheduledDate',
      'periodId',
      'notesFromCollege',
      'notesFromCollegeSeen',
      'lastSignedIn'
    ]
  })
    .then(links => res.json({ success: true, links }))
    .catch(respondWithError(res))
})

router.post('/', (req, res) => {
  Link.create({
    college: req.body.college,
    repName: req.body.repName,
    tierPriority: req.body.tierPriority,
    notesToCollege: req.body.notesToCollege,
    notesFromCollegeSeen: true
  })
    .then(link => res.json({ success: true, uuid: link.uuid }))
    .catch(respondWithError(res))
})

router.get('/read-notes/:linkId', (req, res) => {
  Link.update({ notesFromCollegeSeen: true }, { where: { uuid: req.params.linkId } })
    .then(() => res.json({ success: true }))
    .catch(respondWithError(res))
})

const UPCOMING_QUERY = {
  scheduledDate: {
    $ne: null,
    $gt: new Date
  }
}
router.get('/upcoming/count', (req, res) => {
  Link.count({where: UPCOMING_QUERY})
    .then(count => res.json({success: true, count}))
    .catch(respondWithError(res))
})
router.get('/upcoming/:offset', (req, res) => {
  const offset = Number(req.params.offset)
  Link.findAll({
    include: {
      model: Period,
      attributes: ['start']
    },
    attributes: ['college', 'scheduledDate', 'uuid'],
    where: UPCOMING_QUERY,
    order: [
      'scheduledDate',
      [Period, 'start'],
      'college'
    ],
    offset,
    limit: 10
  })
    .then(visits => res.json({ success: true, visits }))
    .catch(respondWithError(res))
})

module.exports = router
