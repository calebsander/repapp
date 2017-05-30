const {tier: Tier} = require('../server/database')

const TIERS = new Map()
  .set(0, {college: null, unavailability: 'Unavailable'})
  .set(1, {college: 'High priority', unavailability: 'Available if necessary'})
  .set(2, {college: 'Low priority', unavailability: null})

Tier.destroy({where: {}})
  .then(() => {
    for (const [priority, {college, unavailability}] of TIERS) {
      Tier.create({
        priority, 
        collegeDescription: college,
        unavailabilityDescription: unavailability
      })
    }
  })