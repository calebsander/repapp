module.exports = (req, res, next) => {
  if (req.session.admin) next()
  else res.json({success: false, message: 'Must be logged in'})
}