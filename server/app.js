const express = require('express')
const app = express()

// This address is relative to where the node process is started.
app.use(express.static('public'))

module.exports = app