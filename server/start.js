#!/usr/bin/env node
/* start.js syncs the database then
 * starts the server.
 */

const app = require('./app')
const {sequelize} = require('./database')

sequelize.sync().then(() => {
  app.listen(8000)
  console.log('Listening on port 8000')
})
