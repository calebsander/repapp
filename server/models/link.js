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
      associate({tier, period}) {
        Link.belongsTo(tier)
        Link.belongsTo(period)
      }
    }
  })

  return Link
}
