import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

/**
 * Renders input form and handles creation of user in database
 */
export default class UserSignUp extends Component {
  
  state = {
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: '',
    confirmPassword: '',
    errors: []
  }
  
  change = (event) => {
    const name = event.target.name
    const value = event.target.value
    
    const dict = {}
    dict[name] = value

    this.setState(dict)
  }

  submit = async (event) => {
    event.preventDefault()

    const { context }  = this.props
    const {firstName, lastName, emailAddress, password, confirmPassword } = this.state

    if (password === confirmPassword){
      this.setState({errors: []}) 
    } else {
      this.setState({errors: ['Passwords must match']})
      return 
    }
  
    try {
      await axios.post('http://localhost:5000/api/users', { firstName, lastName, emailAddress, password })
      context.actions.signIn(emailAddress, password)
      console.log('This user has been created and is signed in!')
      this.props.history.push('/');
    } catch (error) {
      this.setState({errors: error.response.data.validationErrors})
    }
  }  

  cancel = (event) => {
    event.preventDefault()
    this.props.history.push('/')
  }

  render() {
    const errors = this.state.errors.map((message, index) => {
      return <li key={index}>{message}</li>
    })

    return (
      <div className='form--centered'>
      <ul>{errors}</ul>
      <form onSubmit={this.submit}>
      <label htmlFor="firstName">First Name</label>
      <input id="firstName" name="firstName" type="text" onChange={this.change} />
      <label htmlFor="lastName">Last Name</label>
      <input id="lastName" name="lastName" type="text" onChange={this.change} />
      <label htmlFor="emailAddress">Email Address</label>
      <input id="emailAddress" name="emailAddress" type="email" onChange={this.change} />
      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password" onChange={this.change}/>
      <label htmlFor="confirmPassword">Confirm Password</label>
      <input id="confirmPassword" name="confirmPassword" type="password" onChange={this.change} />
      <button className="button" type="submit">Sign Up</button><button className="button button-secondary" onClick={this.cancel}>Cancel</button>
    </form>
    <p>Already have a user account? Click here to <Link to="/signin">sign in</Link></p>
    </div>
    )
  }

  
}
