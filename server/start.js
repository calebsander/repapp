#!/usr/bin/env node
/* start.js syncs the database then
 * starts the server.
 */

const app = require('./app')
const database = require('./database')

database.sequelize.sync().then(function() {
  app.listen(8000)
  console.log('Listening on port 8000')
})
