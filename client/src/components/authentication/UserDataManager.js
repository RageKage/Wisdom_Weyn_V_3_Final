import { getDatabase, ref, set, get, update } from 'firebase/database'

const db = getDatabase()

async function CreateUserInDatabase(userData, realName, username) {
  // console.log("Creating user in database", displayName, name)
  // Creating user in database CoolMaster Niman Ahmed
  const user = userData.user
  try {
    if (!user.uid || !user.email) {
      throw new Error('Invalid user data: UID or email is missing.')
    }
    await user?.reload()
    await set(ref(db, 'users/' + user.uid), {
      realName: realName,
      username: username,
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

async function updatesyncGoogleUserData(uid, realName, username) {
  try {
    if (!uid) {
      throw new Error('Invalid user data: UID is missing.')
    }

    const usernamesRef = ref(db, 'usernames/' + username)

    // check that the username is not taken
    const usernamesSnapshot = await get(usernamesRef)
    if (usernamesSnapshot.exists()) {
      throw new Error('Username already taken.')
    } else {
      // Create the usernames collection if it doesn't exist
      await set(usernamesRef, { uid: uid })
    }

    // Update user data
    const userData = {
      realName: realName,
      username: username,
    }
    const userRef = ref(db, 'users/' + uid)
    await update(userRef, userData)
  } catch (error) {
    console.error('Error adding user data:', error)
    throw error
  }
}

async function UsernameInDB(uid) {
  try {
    const usernamesRef = ref(db, 'usernames')
    let exists = false

    const usernamesSnapshot = await get(usernamesRef)
    if (usernamesSnapshot.exists()) {
      const usernamesData = usernamesSnapshot.val()
      for (const username in usernamesData) {
        if (usernamesData[username].uid === uid) {
          exists = true
          break
        }
      }
    }

    return exists
  } catch (error) {
    console.error('Error checking username:', error)
    throw error
  }
}

export {
  CreateUserInDatabase,
  syncGoogleUserData,
  updatesyncGoogleUserData,
  UsernameInDB,
}
