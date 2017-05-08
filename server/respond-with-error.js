module.exports = res =>
  err => res.json({success: false, message: err.message})