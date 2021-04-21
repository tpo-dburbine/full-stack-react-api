import React, { Component } from 'react'
import { Link } from 'react-router-dom'

/**
 * Renders user sign in form and handles sign in
 */
export default class UserSignIn extends Component {
  state = {
    emailAddress: '',
    password: '',
  }

  render() {
    const {
      emailAddress,
      password,
      errors,
    } = this.state

    return (
      <main>
      <div className='form--centered'>
          <h3>{errors}</h3>
          <h2>Sign In</h2>
          <form onSubmit={this.submit}>
              <label htmlFor='emailAddress'>Email Address</label>
              <input id='emailAddress' name='emailAddress' type='email' value={emailAddress} onChange={this.change} />
              <label htmlFor='password'>Password</label>
              <input id='password' name='password' type='password' value={password} onChange={this.change} />
              <button className='button' type='submit'>Sign In</button><button className='button button-secondary' onClick={this.cancel} type='button'>Cancel</button>
          </form>
          <p>Don't have a user account? Click here to <Link to='/signup'>sign up</Link>!</p>
      </div>
      </main>
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

  submit = (event) => {
    event.preventDefault()
    const { context }  = this.props
    const { emailAddress, password } = this.state

    // Calls signIn, passed in through context (function in Context.js)
    context.actions.signIn(emailAddress, password)
      .then((user) => {
        if (user === null) {
          this.setState(() => {
            return { errors: [ 'Sign-in was unsuccessful' ] }
          })
        } else {
          // Returns user to previous page, if applicable
          if (this.props.location.state) {
            this.props.history.push(this.props.location.state.from)
          } else {
            this.props.history.push('/')
          }
        }
      })
      .catch((error) => {
        this.setState({errors: [ 'Sign-in was unsuccessful' ]})
      })
  }

  cancel = () => {
    this.props.history.push('/')
  }
}
