const express = require('express')
const {admin: Admin} = require('../database')
const respondWithError = require('../respond-with-error')
const validatePostParams = require('../validate-post-params')

const SETTINGS_COLUMNS = [
  'emailOnPeriodChoice',
  'emailOnCancellation',
  'emailOnNoteChange',
  'emailDailyDigest'
]
const SETTINGS_COLUMNS_SET = new Set(SETTINGS_COLUMNS)

const router = express.Router()
router.get('/all', (req, res) => {
  Admin.findOne({
    attributes: SETTINGS_COLUMNS,
    where: {
      email: req.session.admin.email
    }
  })
    .then(admin => {
      const settings = {}
      for (const setting of SETTINGS_COLUMNS) settings[setting] = admin[setting]
      res.json({success: true, settings})
    })
    .catch(respondWithError(res))
})
router.post('/set',
  validatePostParams({
    setting: String,
    on: Boolean
  }),
  (req, res) => {
    if (!SETTINGS_COLUMNS_SET.has(req.body.setting)) {
      res.json({success: false, message: 'Invalid setting: ' + req.body.setting})
      return
    }
    Admin.update(
      {[req.body.setting]: req.body.on},
      {
        where: {
          email: req.session.admin.email
        }
      }
    )
      .then(() => res.json({success: true}))
      .catch(respondWithError(res))
  }
)
router.post('/new-admin',
  validatePostParams({
    email: String,
    password: String
  }),
  (req, res) => {
    const {email, password} = req.body
    Admin.findOne({
      where: {
        email
      }
    })
      .then(admin => {
        if (admin) throw new Error('Email already in use')

        return Admin.create({
          email,
          password,
          emailOnPeriodChoice: true,
          emailOnCancellation: true,
          emailOnNoteChange: true,
          emailDailyDigest: true
        })
          .then(() => res.json({success: true}))
      })
      .catch(respondWithError(res))
  }
)
router.get('/admins', (req, res) => {
  Admin.findAll({
    attributes: ['email'],
    where: {
      email: {
        $ne: req.session.admin.email //so admins don't accidentally delete themselves
      }
    }
  })
    .then(admins => {
      admins = admins.map(admin => admin.email)
      res.json({success: true, admins})
    })
    .catch(respondWithError(res))
})
router.delete('/admin/:email', (req, res) => {
  Admin.destroy({
    where: {email: req.params.email}
  })
    .then(() => res.json({success: true}))
    .catch(respondWithError(res))
})

module.exports = router