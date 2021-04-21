/**
 * Creates HTTP auth header
 * @param {*} username 
 * @param {*} password 
 * @param {*} url 
 * @param {*} method 
 * @param {*} data 
 */
function createConfig (username, password, url, method, data) {
  const token = `${username}:${password}`
  const encodedToken = Buffer.from(token).toString('base64')
  return { method, url, data, headers: { 'Authorization': 'Basic ' + encodedToken } }
}

export default createConfig
