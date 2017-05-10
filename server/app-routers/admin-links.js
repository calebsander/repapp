const express = require('express')
const {link: Link, period: Period} = require('../database')
const respondWithError = require('../respond-with-error')

const router = express.Router()

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
    .then(links => res.json({success: true, links}))
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
    .then(link => res.json({success: true, uuid: link.uuid}))
    .catch(respondWithError(res))
})

router.delete('/:linkId', (req, res) => {
  Link.findOne({where: {uuid: req.params.linkId}})
    .then(link => link.destroy())
    .then(() => res.json({success: true}))
    .catch(respondWithError(res))
})

router.get('/read-notes/:linkId', (req, res) => {
  Link.findOne({where: {uuid: req.params.linkId}})
    .then(link => {
      link.notesFromCollegeSeen = true
      return link.save()
    })
    .then(() => res.json({success: true}))
    .catch(respondWithError(res))
})

router.get('/upcoming', (req, res) => {
  Link.findAll({
    include: {
      model: Period,
      attributes: ['start', 'end']
    },
    attributes: ['college', 'scheduledDate', 'uuid'],
    where: {
      scheduledDate: {
        $ne: null,
        $gt: new Date
      }
    },
    order: [
      'scheduledDate',
      [Period, 'start']
    ]
  })
    .then(visits => res.json({success: true, visits}))
    .catch(respondWithError(res))
})

module.exports = router
