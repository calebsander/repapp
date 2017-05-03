module.exports = (sequelize, DataTypes) => {
  const Link = sequelize.define('link', {
    college: {
      type: DataTypes.STRING,
      allowNull: false
    },
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    scheduledDate: DataTypes.DATEONLY,
    notesToCollege: DataTypes.TEXT,
    notesFromCollege: DataTypes.TEXT,
    notesFromCollegeSeen: DataTypes.BOOLEAN,
    lastSignedIn: DataTypes.DATE,
    repName: DataTypes.STRING
  },
  {
    classMethods: {
      associate: function(models) {
        Link.belongsTo(models.tier)
        Link.belongsTo(models.period)
      }
    }
  })

  return Link
}
