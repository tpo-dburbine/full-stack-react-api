import React, { useEffect } from 'react'
import { Redirect } from 'react-router-dom'

/**
 * Calls signOut, passed in through context (function in Context.js)
 * useEffect used to prevent conflicts before page is finished rendering
 */
function UserSignOut ({ context }) {
  useEffect(() => {
    context.actions.signOut()
  })
  return (
    <Redirect to='/' />
  )
}
export default UserSignOut
