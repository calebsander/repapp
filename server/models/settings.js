module.exports = (sequelize, DataTypes) =>
  sequelize.define('setting', {
    dateRange: {
      type: DataTypes.RANGE(DataTypes.DATE),
      allowNull: false
    }
  })