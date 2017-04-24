const crypto = require('crypto')
const {sequelize} = require('./database')
const express = require('express')
const session = require('express-session')
const SequelizeStore = require('connect-session-sequelize')(session.Store)

const apiRouter = require('./app-routers/api')

const app = express()

app.use(session({
  secret: crypto.randomBytes(64).toString('hex'),
  resave: false,
  saveUninitialized: false,
  store: new SequelizeStore({db: sequelize})
}))

app.use('/api', apiRouter)

// This address is relative to where the node process is started.
app.use(express.static('public'))

module.exports = app