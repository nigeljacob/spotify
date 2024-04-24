import React from 'react'
import { signOut } from '../utils/firebaseUser'

const Account = (props) => {
  return (
    <div>
      <button onClick={event => {
        signOut()
        props.setUser(null)
      }}>SignOut</button>
    </div>
  )
}

export default Account
