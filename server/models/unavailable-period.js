module.exports = (sequelize, DataTypes) => {
  const UnavailablePeriod = sequelize.define('unavailable_period', {
    reason: DataTypes.STRING,
    day: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    repeatWeekly: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    repeatEnd: DataTypes.DATEONLY //inclusive
  },
  {
    classMethods: {
      associate({period, tier}) {
        UnavailablePeriod.belongsTo(period)
        UnavailablePeriod.belongsTo(tier)
      }
    }
  })
  return UnavailablePeriod
}