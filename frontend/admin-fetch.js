export default ({url, method, data, handler, router}) => {
  const options = {credentials: 'include'}
  if (data) {
    options.method = 'POST'
    options.headers = {
      'content-type': 'application/json'
    }
    options.body = JSON.stringify(data)
  }
  else if (method) options.method = method
  fetch(url, options)
    .then(response => response.json())
    .then(response => {
      const {success, message} = response
      if (success) {
        if (handler) handler(response)
      }
      else {
        console.error(message)
        if (message === 'Must be logged in') router.push('/admin/login')
        else alert('Error occurred: ' + message)
      }
    })
}