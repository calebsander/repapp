const passwordHash = require('password-hash-and-salt')

function hashPassword(admin) {
  if (!admin.changed('password')) return
  return new Promise((resolve, reject) => {
    passwordHash(admin.password).hash((err, hash) => {
      if (err) reject(err)
      else resolve(hash)
    })
  })
    .then(hash => admin.passwordHash = hash)
}

module.exports = (sequelize, DataTypes) =>
  sequelize.define('admin', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    password: DataTypes.VIRTUAL,
    passwordHash: {
      type: DataTypes.STRING(270),
      allowNull: false
    },
    emailOnPeriodChoice: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    emailOnCancellation: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    emailOnNoteChange: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    emailDailyDigest: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  },
  {
    hooks: {
      beforeValidate: hashPassword
    }
  })