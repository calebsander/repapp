module.exports = function(sequelize, DataTypes) {
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
	    scheduledTime: DataTypes.RANGE(DataTypes.DATE),
	    notesToCollege: DataTypes.TEXT,
	    notesFromCollege: DataTypes.TEXT,
	    notesFromCollegeSeen: DataTypes.BOOLEAN,
	    lastSignedIn: DataTypes.DATE,
    	repName: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                // adds a tierPriority field to links table
                Link.belongsTo(models.tier)
            }
        }
    })

    return Link
}