module.exports = (sequelize, Sequelize) =>
  sequelize.define('admin', {
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    passwordHash: {
      type: Sequelize.STRING,
      allowNull: false
    },
    emailOnPeriodChoice: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    emailOnCancellation: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    emailOnNoteChange: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    emailDailyDigest: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    }
  })