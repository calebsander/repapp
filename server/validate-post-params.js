module.exports = params => {
  return (req, res, next) => {
    const {body} = req
    let valid = true
    for (const param in params) {
      const value = body[param]
      const valueExists = !(value === null || value === undefined)
      if (!(valueExists && value.constructor === params[param])) {
        valid = false
        break
      }
    }
    if (valid) next()
    else res.json({success: false, message: 'Invalid parameters'})
  }
}