module.exports = (sequelize, DataTypes) => {
  const UnavailableDay = sequelize.define('unavailable_day', {
    reason: DataTypes.STRING,
    day: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  },
  {
    classMethods: {
      associate({tier}) {
        UnavailableDay.belongsTo(tier)
      }
    }
  })
  return UnavailableDay
}
