const Admin = require('../server/database').admin

Admin.create({
  email: 'tpaul@commschool.org',
  password: 'password',
  emailOnPeriodChoice: true,
  emailOnCancellation: true,
  emailOnNoteChange: true,
  emailDailyDigest: true
})