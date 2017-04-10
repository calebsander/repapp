#!/usr/bin/env node
/* start.js syncs the database then
 * starts the server.
 */

const app = require('./app')
const models = require('./models')

models.sequelize.sync().then(function() {
  app.listen(8000)
})