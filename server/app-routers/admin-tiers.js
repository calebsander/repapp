const express = require('express')
const {tier: Tier} = require('../database')
const respondWithError = require('../respond-with-error')
const validatePostParams = require('../validate-post-params')

const router = express.Router()

for (const tierType of ['college', 'unavailability']) {
  const columnName = tierType + 'Description'
  router.get('/' + tierType, (req, res) => {
    Tier.findAll({
      attributes: [
        'priority',
        columnName
      ],
      where: {
        [columnName]: {$ne: null}
      }
    })
      .then(tiers => res.json({success: true, tiers}))
      .catch(respondWithError(res))
  })
}
router.get('/all', (req, res) => {
  Tier.findAll({
    attributes: [
      'priority',
      'collegeDescription',
      'unavailabilityDescription'
    ]
  })
    .then(tiers => res.json({success: true, tiers}))
    .catch(respondWithError(res))
})

router.post('/',
  validatePostParams({
    priority: Number
  }),
  (req, res) => {
    const {priority, collegeDescription, unavailabilityDescription} = req.body
    Tier.findOne({
      where: {priority}
    })
      .then(tier => {
        if (tier) throw new Error('Priority already in use')

        return Tier.create({
          priority,
          collegeDescription,
          unavailabilityDescription
        })
      })
      .then(() => res.json({success: true}))
      .catch(respondWithError(res))
  }
)

router.delete('/:priority', (req, res) => {
  Tier.destroy({
    where: {priority: req.params.priority}
  })
    .then(() => res.json({success: true}))
    .catch(respondWithError(res))
})

module.exports = router
