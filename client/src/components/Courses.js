import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import axios from 'axios'

/**
 * Gets courses from database and populates onto page
 */
function Courses () {
  const [dataState, setDataState] = useState([])
  const history = useHistory()

  useEffect(() => {
    axios('http://localhost:5000/api/courses')
      .then(response => setDataState(response.data))
      .catch((error) => {
        if (error.status !== 500) {
          history.push('/notfound')
        } else {
          history.push('/error')
        }
      })
    return () => {
      setDataState([])
    }
  }, [history])

  const courses = dataState.map((data, index) => {
    return (
      <Link className='course--module course--link' key={data.id} to={`/courses/${data.id}`}>
        <h2 className='course--label'>Course</h2>
        <h3 className='course--title'>{JSON.stringify(data.title)}</h3>
      </Link>
    )
  })

  return (
    <div className='wrap main--grid'>
      {courses}
      <Link className='course--module course--add--module' to='/courses/create'>
        <span className='course--add--title'>
          <svg
            version='1.1'
            xmlns='http://www.w3.org/2000/svg'
            x='0px'
            y='0px'
            viewBox='0 0 13 13'
            className='add'>
            <polygon points='7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 ' />
          </svg>
          New Course
        </span>
      </Link>
    </div>
  )
}

export default Courses
