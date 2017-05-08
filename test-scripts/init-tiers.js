const {tier: Tier} = require('../server/database')

const TIERS = new Map()
  .set('Impossible', 0)
  .set('High', 1)
  .set('Low', 2)

Tier.destroy({where: {}})
  .then(() => {
    for (const [description, priority] of TIERS) {
      Tier.create({priority, description})
    }
  })