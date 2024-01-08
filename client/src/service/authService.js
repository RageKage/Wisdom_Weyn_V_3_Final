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
      (user) => {
        if (user) {
          // Save user data in localStorage
          localStorage.setItem('isLoggedIn', 'true')
          localStorage.setItem('user', JSON.stringify(user))
          resolve(user)
        } else {
          // Remove user data from localStorage
          localStorage.removeItem('user')
          localStorage.removeItem('isLoggedIn')
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

// service
// .getUserDatabyuid(Useruid)
// .then((response) => {
//   if (response) {
//     resolve(response)
//   } else {
//     resolve(null) // set to null if no user logged in
//   }
// })
// .catch((error) => {
//   reject(error)
// })

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
