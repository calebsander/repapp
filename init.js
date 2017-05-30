#!/usr/bin/env node

const {sequelize} = require('./server/database')

sequelize.sync().then(() => {
  require('./test-scripts/init-periods')
  require('./test-scripts/init-tiers')
  require('./test-scripts/make-admin')
})