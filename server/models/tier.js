module.exports = (sequelize, DataTypes) =>
  sequelize.define('tier', {
    // Lower is more important. Colleges with lower tiers
    // have access to more dates; dates with lower tiers
    // let fewer colleges in. College tier must be <= date tier
    // to sign up.
    priority: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    // e.g. NULL, "High priority", "Low priority"
    collegeDescription: DataTypes.STRING,
    // e.g. "Unavailable", "Available if necessary", NULL
    unavailabilityDescription: DataTypes.STRING
  })