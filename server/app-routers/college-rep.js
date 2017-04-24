const express = require('express')
const db = require('../database')
const linkRouter = require('./link')
const linkUpdateRouter = require('./link-update')
const unavailabilitiesRouter = require('./unavailabilities')

const router = express.Router()
router.use((req, res, next) => {
    db.link.findOne({where: {
        uuid: req.params.linkId 
    }}).then(link => {
        if (link === null) {
            throw new Error('Requested link does not exist')
        }
        req.link = link
        next()
    }).catch(error => {
        res.json({success: false, message: error.message})
    })
})

router.use('/link', linkRouter)
router.use('/unavailabilities', unavailabilitiesRouter)
router.use('/update', linkUpdateRouter)

module.exports = router