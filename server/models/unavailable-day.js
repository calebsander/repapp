module.exports = (sequelize, DataTypes) => {
  const UnavailableDay = sequelize.define('unavailable_day', {
    reason: DataTypes.STRING,
    days: {
      type: DataTypes.RANGE(DataTypes.DATE),
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