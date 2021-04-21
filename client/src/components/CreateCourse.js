import React, { Component } from 'react'

/**
 * Renders course input form, and creates a new course on submit
 */
export default class CreateCourse extends Component {
  state = {
    courseTitle: '',
    courseDescription: '',
    estimatedTime: '',
    materialsNeeded: '',
    userId: '',
    errors: null
  }
  
  render() {
    const {errors} = this.state

    return (
      <div className="wrap">
      <h2>Create Course</h2>
      <ul>{errors}</ul>
      <form onSubmit={this.submit}>
        <div className="main--flex">
            <div>
              <label htmlFor="courseTitle">Course Title</label>
              <input id="courseTitle" name="courseTitle" ref={this.courseTitle} onChange={this.change} type="text" />
              <label htmlFor="courseDescription">Course Description</label>
              <textarea id="courseDescription" name="courseDescription" ref={this.courseDescription} onChange={this.change}></textarea>
            </div>
            <div>
              <label htmlFor="estimatedTime">Estimated Time</label>
              <input id="estimatedTime" name="estimatedTime" ref={this.estimatedTime} onChange={this.change} type="text" />

              <label htmlFor="materialsNeeded">Materials Needed</label>
              <textarea id="materialsNeeded" name="materialsNeeded" ref={this.materialsNeeded} onChange={this.change}></textarea>
            </div>
          </div>
          <button className="button" type="submit">Create Course</button><button className="button button-secondary" onClick={this.cancel}>Cancel</button>
      </form>    
    </div>
    )
  }

  change = (event) => {
    const name = event.target.name
    const value = event.target.value

    this.setState(() => {
      return {
        [name]: value
      }
    })
  }


  submit = async (event) => {
    event.preventDefault()
    const { context }  = this.props
    const {courseTitle, courseDescription, estimatedTime, materialsNeeded} = this.state
    const authUser = context.authenticatedUser

    const course = {
      title: courseTitle,
      description: courseDescription,
      estimatedTime,
      materialsNeeded,
      userId: authUser.data.userId
    }

    const authCreds = {
      emailAddress: authUser.data.emailAddress,
      password: authUser.password
    }
    
    context.data.createCourse(course, authCreds.emailAddress, authCreds.password)
      .then(() => {
        console.log('This course has been created!')
        this.props.history.push('/')
      })
      .catch((error) =>{
        const validationErrors = error.response.data.validationErrors
        const validationErrorMessages = validationErrors.map((err, index) => <li key={index}>{err}</li>)
        this.setState({errors: <p>{validationErrorMessages}</p>})
      })       
    }
  
  cancel = (event) => {
    event.preventDefault()
    this.props.history.push('/')
  }
}



