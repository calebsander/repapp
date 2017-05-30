const {sequelize} = require('../server/database')

sequelize.sync({force: true})