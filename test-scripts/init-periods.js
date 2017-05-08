const {period: Period} = require('../server/database')

const now = new Date
function makeTime(hour, minute) {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute)
}

const MWF_PERIODS = new Map()
  .set('1', [makeTime(8, 30), makeTime(9, 10)])
  .set('2', [makeTime(9, 15), makeTime(9, 55)])
  .set('3', [makeTime(10, 25), makeTime(11, 5)])
  .set('4', [makeTime(11, 10), makeTime(11, 50)])
  .set('5', [makeTime(11, 55), makeTime(12, 35)])
  .set('6', [makeTime(13, 20), makeTime(14, 0)])
  .set('7', [makeTime(14, 5), makeTime(14, 45)])
const SCHEDULE = new Map()
  .set('Monday', MWF_PERIODS)
  .set('Tuesday', new Map()
    .set('1', [makeTime(8, 30), makeTime(9, 10)])
    .set('2', [makeTime(9, 15), makeTime(9, 55)])
    .set('3', [makeTime(10, 35), makeTime(11, 30)])
    .set('4', [makeTime(11, 35), makeTime(12, 15)])
    .set('5', [makeTime(12, 20), makeTime(13, 0)])
    .set('6', [makeTime(13, 45), makeTime(14, 25)])
    .set('7', [makeTime(14, 30), makeTime(15, 10)])
  )
  .set('Wednesday', MWF_PERIODS)
  .set('Thursday', new Map()
    .set('1', [makeTime(8, 30), makeTime(9, 10)])
    .set('2', [makeTime(9, 15), makeTime(9, 55)])
    .set('3', [makeTime(10, 25), makeTime(11, 15)])
    .set('4', [makeTime(11, 20), makeTime(12, 0)])
    .set('5', [makeTime(13, 55), makeTime(14, 35)])
    .set('6', [makeTime(14, 40), makeTime(15, 20)])
    .set('7', [makeTime(15, 25), makeTime(16, 5)])
  )
  .set('Friday', MWF_PERIODS)

Period.destroy({where: {}})
  .then(() => {
    for (const [day, periods] of SCHEDULE) {
      for (const [periodName, [start, end]] of periods) {
        Period.create({
          day,
          period: periodName,
          start,
          end
        })
          .catch(err => {
            throw err
          })
      }
    }
  })
  .catch(err => {
    throw err
  })