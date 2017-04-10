module.exports = (sequelize, DataTypes) =>
  sequelize.define('period', {
    day: {
      type: DataTypes.ENUM(
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday'
      ),
      allowNull: false
    },
    period: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    start: {
      type: DataTypes.TIME,
      allowNull: false
    },
    end: {
      type: DataTypes.TIME,
      allowNull: false
    }
  })