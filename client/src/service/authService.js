// authService.js

import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { getDatabase, ref, onValue } from 'firebase/database'

// import AppApiService from './index'

// const service = AppApiService()

// Get the current user
export function currentUser() {
  return new Promise((resolve, reject) => {
    // const startTime = performance.now()
    const auth = getAuth()

    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (user) {
          const token = await user.getIdToken()

          // Save user data in localStorage
          localStorage.setItem('isLoggedIn', 'true')
          localStorage.setItem('user', JSON.stringify(user))

          resolve({ user, token })
        } else {
          // Remove user data from localStorage
          localStorage.clear()
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

// This function will return the headers with the token if the user is logged in, otherwise it will return an empty object

export async function getAuthHeaders() {
  const authResult = await currentUser()
  if (authResult && authResult.token) {
    return {
      Authorization: `Bearer ${authResult.token}`,
      user: authResult.user,
    }
  } else {
    return {}
  }
}

// this is to get the current user from our db, this should be return only the needed data so no submissions or votes data will be returned
export function getCurrentUser(Useruid) {
  return new Promise((resolve, reject) => {
    const db = getDatabase()
    const userLocation = ref(db, 'users/' + Useruid)

    try {
      onValue(
        userLocation,
        (snapshot) => {
          const userData = {
            createdAt: snapshot.val().createdAt,
            email: snapshot.val().email,
            lastLoginAt: snapshot.val().lastLoginAt,
            photoURL: snapshot.val().photoURL,
            realName: snapshot.val().realName,
            submissionCount: snapshot.val().submissionCount,
            username: snapshot.val().username,
          }

          resolve(userData)
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

  try {
    await signOut(auth)
    localStorage.clear()
  } catch (error) {
    console.error('Error signing out:', error)
    throw error
  }
}
