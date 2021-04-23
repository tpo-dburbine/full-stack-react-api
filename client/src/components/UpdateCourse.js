import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import Forbidden from './Forbidden'

/**
 * Gets and renders course
 * Then handles input value changes/submit for updates to the course
 * @param {*} props
 */
function UpdateCourse (props) {
  const { id } = useParams()
  const [dataState, setDataState] = useState([])
  const [user, setUser] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    axios.get(`http://localhost:5000/api/courses/${id}`)
      .then((response) => {
        setDataState(response.data)
        setUser(`${response.data.User.firstName} ${response.data.User.lastName}`)
      })
      .catch((error) => {
        if (error.status !== 500) {
          props.history.push('/notfound')
        } else {
          props.history.push('/error')
        }
      })
  }, [id, props.history])

  // Ensures that only authenticated user can navigate to /update route
  // (even if appended in url)
  const { context } = props
  const authUser = context.authenticatedUser
  if (authUser && dataState.User && authUser.data.emailAddress !== dataState.User.emailAddress) {
    return (
      <Forbidden />
    )
  }

  const change = (event) => {
    const name = event.target.name
    const value = event.target.value
    setDataState({ ...dataState, [name]: value })
  }

  const submit = async (event) => {
    event.preventDefault()

    const course = {
      id: dataState.id,
      title: dataState.title,
      description: dataState.description,
      estimatedTime: dataState.estimatedTime,
      materialsNeeded: dataState.materialsNeeded
    }

    const authCreds = {
      emailAddress: authUser.data.emailAddress,
      password: authUser.password
    }

    // Calls updateCourse, passed in through context (function in Data.js)
    context.data.updateCourse(id, course, authCreds.emailAddress, authCreds.password)
      .then(() => {
        console.log('This course has been updated!')
        props.history.push(`/courses/${id}`)
      })
      .catch((error) => {
        const validationErrors = error.response.data.validationErrors
        const validationErrorMessages = validationErrors.map((err, index) => <li key={index}>{err}</li>)
        setError(<p>{validationErrorMessages}</p>)
      })
  }

  const cancel = (event) => {
    event.preventDefault()
    props.history.push(`/courses/${id}`)
  }

  return (
    <div className='wrap'>
      <h2>Update Course</h2>
      <ul>{error}</ul>
      <form onSubmit={submit}>
        <div className='main--flex'>
          <div>
            <label htmlFor='courseTitle'>Course Title</label>
            <input id='courseTitle' name='title' type='text' onChange={change} value={dataState.title || ''} />

            <label htmlFor='courseAuthor'>Course Author</label>
            <input id='courseAuthor' name='courseAuthor' type='text' readOnly value={user || ''} />

            <label htmlFor='courseDescription'>Course Description</label>
            <textarea id='courseDescription' name='description' onChange={change} value={dataState.description || ''} />
          </div>
          <div>
            <label htmlFor='estimatedTime'>Estimated Time</label>
            <input id='estimatedTime' name='estimatedTime' type='text' onChange={change} value={dataState.estimatedTime || ''} />

            <label htmlFor='materialsNeeded'>Materials Needed</label>
            <textarea id='materialsNeeded' name='materialsNeeded' onChange={change} value={dataState.materialsNeeded || ''} /> 
          </div>
        </div>
        <button className='button' type='submit'>Update Course</button><button className='button button-secondary' onClick={cancel}>Cancel</button>
      </form>
    </div>
  )
}

export default UpdateCourse
