// authService.js

import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { getDatabase, ref, onValue } from 'firebase/database'

// Get the current user
export function currentUser() {
  return new Promise((resolve, reject) => {
    // const startTime = performance.now()
    const auth = getAuth()

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          // Save user data in localStorage
          localStorage.setItem('user', JSON.stringify(user))
          resolve(user)
        } else {
          // Remove user data from localStorage
          localStorage.removeItem('user')
          resolve(null) // set to null if no user logged in
        }

        unsubscribe()
      },
      reject,
    )
    // var endTime = performance.now()
    // console.error('this query took ' + (endTime - startTime) + ' milliseconds.')
  })
}

// this is to get the current user from our db
export function getCurrentUser(Useruid) {
  return new Promise((resolve, reject) => {
    const db = getDatabase()
    const userLocation = ref(db, 'users/' + Useruid)

    try {
      onValue(
        userLocation,
        (snapshot) => {
          const data = snapshot.val()
          resolve(data) // return the data if the promise is resolved
        },
        (error) => {
          reject(error)
        },
      )
    } catch (error) {
      console.error('Error getting current user from database:', error)
      reject(error) // Reject the promise with the error
    }
  })
}

// Sign out the user
export async function signout() {
  const auth = getAuth()
  localStorage.removeItem('user')
  try {
    await signOut(auth)
  } catch (error) {
    console.error('Error signing out:', error)
    throw error
  }
}
