import { getDatabase, ref, set, get } from 'firebase/database'

const db = getDatabase()

async function CreateUserInDatabase(userData, username) {
  const user = userData.user
  try {
    if (!user.uid || !user.email) {
      throw new Error('Invalid user data: UID or email is missing.')
    }
    await user?.reload()
    await set(ref(db, 'users/' + user.uid), {
      displayName: username,
      email: user.email,
      createdAt: user.metadata.creationTime || null,
      lastLoginAt: user.metadata.lastSignInTime || null,
      submissionCount: 0,
    })
    // return a success message
    return 'User data added successfully.'
  } catch (error) {
    console.error('Error adding user data:', error)
    throw error // throw error to be caught in the calling function
  }
}

async function syncGoogleUserData(user) {
  try {
    if (!user.uid || !user.email) {
      throw new Error('Invalid user data: UID or email is missing.')
    }
    const userData = {
      email: user.email,
      photoURL: user.photoURL,
      displayName: user.displayName,
      createdAt: user.metadata.creationTime || null,
      lastLoginAt: user.metadata.lastSignInTime || null,
      submissionCount: 0,
    }

    const userRef = ref(db, 'users/' + user.uid)

    // await userSubmissionRef.once("value");

    const snapshot = await get(userRef)

    if (!snapshot.exists()) {
      await set(ref(db, 'users/' + user.uid), userData)
    }
  } catch (error) {
    console.error('Error adding user data:', error)
    throw error
  }
}

export { CreateUserInDatabase, syncGoogleUserData }
