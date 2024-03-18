import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getDatabase, ref as dbRef, onValue } from 'firebase/database'

export const useAuthStore = defineStore('auth', () => {
  const authUser = ref(null)
  const token = ref(null)
  const dbUser = ref(null)

  // Check localStorage for user data
  const storedAuthUser = JSON.parse(localStorage.getItem('authUser'))
  const storedToken = JSON.parse(localStorage.getItem('token'))
  const storedDbUser = JSON.parse(localStorage.getItem('dbUser'))

  const getCurrentUserDetails = async () => {
    try {
      if (storedAuthUser && storedToken && storedDbUser) {
        // If user data is found in localStorage, use it to set authUser, token, and dbUser
        authUser.value = storedAuthUser
        token.value = storedToken
        dbUser.value = storedDbUser
        return dbUser.value // Return the user details
      }

      const auth = getAuth()
      const authUserValue = await new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            user
              .getIdToken()
              .then((token) => {
                resolve({ user, token }) // Resolve with user and token
              })
              .catch(reject) // Reject if there's an error getting the token
          }
          // else if the user session is expired then sign them out automatically
          else if (user === null) {
            signout()
          }

          resolve(null) // Resolve with null if no user is signed in
        })
      })

      if (!authUserValue) {
        authUser.value = null
        token.value = null
        dbUser.value = null
        return null // Return null if no user is signed in
      }

      const db = getDatabase()
      const userLocation = dbRef(db, 'users/' + authUserValue.user.uid)
      const dbUserValue = await new Promise((resolve, reject) => {
        onValue(
          userLocation,
          (snapshot) => {
            if (snapshot.exists()) {
              const userData = {
                dbData: {
                  createdAt: snapshot.val().createdAt,
                  email: snapshot.val().email,
                  lastLoginAt: snapshot.val().lastLoginAt,
                  photoURL: snapshot.val().photoURL,
                  personalName: snapshot.val().personalName,
                  submissionCount: snapshot.val().submissionCount,
                  username: snapshot.val().username,
                },
              }
              resolve(userData)
            } else {
              resolve(null) // Resolve with null if no data found
            }
          },
          reject,
        ) // Reject if there's an error reading from the database
      })

      if (!dbUserValue) {
        authUser.value = null
        token.value = null
        dbUser.value = null
      } else {
        authUser.value = authUserValue.user
        token.value = authUserValue.token
        dbUser.value = dbUserValue
        // and also save to localStorage
        localStorage.setItem('authUser', JSON.stringify(authUserValue.user))
        localStorage.setItem('token', JSON.stringify(authUserValue.token))
        localStorage.setItem('dbUser', JSON.stringify(dbUserValue))
      }
    } catch (error) {
      console.error('Error getting current user details:', error)
      throw error // Rethrow the error to be handled by the caller
    }
  }

  const getAuthHeaders = async () => {
    if (storedToken) {
      return {
        Authorization: `Bearer ${storedToken}`,
        user: dbUser.value,
      }
    }
    const auth = getAuth()
    const authUser = auth.currentUser
    if (!authUser) {
      return {}
    }
    const token = await authUser.getIdToken()

    return {
      Authorization: `Bearer ${token}`,
      user: dbUser.value,
    }
  }

  const signout = async () => {
    const auth = getAuth()
    await auth.signOut()
    authUser.value = null
    token.value = null
    dbUser.value = null

    // clear hard clear all local storage
    localStorage.clear()
  }

  return {
    authUser,
    token,
    dbUser,
    getCurrentUserDetails,
    getAuthHeaders,
    signout,
  }
})
