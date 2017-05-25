const db = require('../server/database')
const request = require('request')

//db.link.create({college: "UMass"})

//db.tier.create({priority:0, description:"Base unavailability"})

/*request.post(
  'http://localhost:8000/api/admin/unavailabilities/period',
  { json: {
		repeatWeekly:false,
		period:1,
		day:new Date(),
		tier:0,
		reason:"Test period entry"
	} },
  function (error, response, body) {
      if (!error && response.statusCode == 200) {
          console.log(body)
      }
      else {console.log(error)}
  }
)*/


request.post(
  'http://localhost:8000/api/admin/unavailabilities/day',
  { json: {
		start:new Date(),
    end: new Date("5-27-2017"),
		tier:0,
		reason:"Test days entry"
	} },
  function (error, response, body) {
      if (!error && response.statusCode == 200) {
          console.log(body)
      }
      else {console.log(error)}
  }
)
