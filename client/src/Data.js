import axios from 'axios'
import createConfig from './CreateConfig'
import apiBaseUrl from './apiBaseUrl'

export default class Data {
  api (path, method, body = null, requiresAuth = false, credentials = null) {
    const url = apiBaseUrl + path

    const options = {
      method,

      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }

    if (body !== null) {
      options.body = JSON.stringify(body)
    }

    if (requiresAuth) {
      const encodedCredentials = Buffer.from(`${credentials.emailAddress}:${credentials.password}`).toString('base64')
      options.headers.Authorization = `Basic ${encodedCredentials}`
    }
    return axios(url, options)
  }

  // Gets/sets user auth header with above api function
  async getUser (emailAddress, password) {
    const response = await this.api('/users', 'GET', null, true, { emailAddress, password })
    if (response.status === 200) {
      return response
    } else if (response.status === 401) {
      return null
    } else {
      throw new Error()
    }
  }

  // Creates course using createConfig function to create HTTP auth header
  async createCourse (course, emailAddress, password) {
    const url = apiBaseUrl + '/courses'
    const config = createConfig(emailAddress, password, url, 'POST', course)
    await axios(config)
  }

  // Updates course using createConfig function to create HTTP auth header
  async updateCourse (courseId, course, emailAddress, password) {
    const url = apiBaseUrl + '/courses/' + courseId
    const config = createConfig(emailAddress, password, url, 'PUT', course)
    await axios(config)
  }

  // Deletes course using createConfig function to create HTTP auth header
  async deleteCourse (courseId, emailAddress, password) {
    const url = apiBaseUrl + '/courses/' + courseId
    const config = createConfig(emailAddress, password, url, 'DELETE')
    await axios(config)
  }
}
