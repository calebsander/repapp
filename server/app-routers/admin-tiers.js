const express = require('express')
const db = require('../database')
const respondWithError = require('../respond-with-error')
const router = express.Router()

router.get('/', function (req, res){
  db.tier.findAll({attributes: ['priority','description']}).then(tiers => {
      res.json({success: true, tiers: tiers})
  }).catch(respondWithError(res))
})

router.post('/', function (req, res){
	db.tier.create({
		priority:req.body.priority,
    description:req.body.description
	}).then ( tier => {
		res.json({success : true})
	}).catch(respondWithError(res))
})

router.delete('/:priority', function (req, res) {
  db.tier.destroy({where: {priority:req.params.priority} }).then(tier => {
      res.json({success: true})
  }).catch(respondWithError(res))
})

module.exports = router
