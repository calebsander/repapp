const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development'
const config = require('./config/config')[env]
const sequelize = new Sequelize(config.uri, {timezone: 'America/New_York'})

const db = {sequelize, Sequelize}
const modelsToAssociate = new Set
const modelsDirectory = path.join(__dirname, 'models')
const modelFiles = fs.readdirSync(modelsDirectory)
for (const file of modelFiles) {
  const model = sequelize.import(path.join(modelsDirectory, file))
  db[model.name] = model
  if (model.associate) modelsToAssociate.add(model)
}
for (const model of modelsToAssociate) model.associate(db)

module.exports = db