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
    // e.g. "Unavailable", "Available if necessary", "Available"
    // In link UI, we can ask: "Allow rep to sign up for slots labeled: ..."
    description: DataTypes.STRING
  })