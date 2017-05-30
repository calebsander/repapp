const MILLIS_PER_MINUTE = 60 * 1000

module.exports = dateString => {
  const utcDate = new Date(dateString)
  return new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * MILLIS_PER_MINUTE)
}