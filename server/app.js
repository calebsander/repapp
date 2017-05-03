const crypto = require('crypto')
const {sequelize} = require('./database')
const express = require('express')
const session = require('express-session')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const path = require('path')
const apiRouter = require('./app-routers/api')

const app = express()
const restrictToLoggedIn = require('./restrict-to-logged-in')

app.use(session({
  secret: crypto.randomBytes(64).toString('hex'),
  resave: false,
  saveUninitialized: false,
  store: new SequelizeStore({db: sequelize})
}))

// This address is relative to where the node process is started.
app.use(express.static('public'))

app.use('/api', apiRouter)

app.use('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin.html'))
})
app.use('/:linkId', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/link.html'))
})


module.exports = app
