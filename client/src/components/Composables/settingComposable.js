import { ref } from 'vue'

import AppApiService from '../../service/index.js'
import userIntrests from '../Composables/categoryOfIntrests.js'
import { useAuthStore } from '../../store/authStore' // Import useAuthStore

export default function useSettings() {
  const selectedInterests = ref([])
  const usernameError = ref('')
  const showSuccessPopup = ref(false)
  const user = ref(null)

  const { categoryOfIntrests } = userIntrests()
  const authStore = useAuthStore()
  const service = AppApiService()

  const isotimeValueConvert = (value) => {
    const date = new Date(value)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // last login at time by hour and minutes
  const lastLoginAt = (value) => {
    const date = new Date(value)
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
    })
  }

  const validateUsername = async () => {
    const username = user.value.username

    const usernameRegex = /^[a-zA-Z0-9][a-zA-Z0-9_-]*$/
    const minLength = 3
    const maxLength = 20

    // Check if username is empty
    if (username.length === 0) {
      return 'Username cannot be empty.'
    }

    // Check length requirements
    if (username.length < minLength || username.length > maxLength) {
      return `Username must be between ${minLength} and ${maxLength} characters long.`
    }

    // Check for allowed characters
    if (!usernameRegex.test(username)) {
      return 'Username can only contain letters, numbers, underscores (_), and hyphens (-). It cannot begin with an underscore or hyphen.'
    }

    return ''
  }

  const validateAndUpdateUsername = async () => {
    usernameError.value = await validateUsername()

    if (!usernameError.value) {
      try {
        const updateuser = await service.usernameUpdate(user.value.username)

        if (updateuser && updateuser.message) {
          showSuccessPopup.value = true

          const userDetails = await authStore.getCurrentUserDetails()

          localStorage.setItem('dbUser', JSON.stringify(userDetails))
        }
      } catch (error) {
        usernameError.value = error
      } finally {
        setTimeout(() => {
          showSuccessPopup.value = false
        }, 3000)
      }
    }
  }

  const toggleIntrest = (intrest) => {
    const index = selectedInterests.value.indexOf(intrest)
    if (index === -1) {
      selectedInterests.value.push(intrest)
    } else {
      selectedInterests.value.splice(index, 1)
    }
  }

  const validateBio = () => {
    const bio = user.value.bio

    if (bio.length > 200) {
      return 'Bio cannot be more than 200 characters.'
    }
  }

  //   save changes made in the settings, including the selectedInterests and also bio
  const saveChanges = async () => {
    try {
      validateBio()
      const updateuser = await service.updateUserDetails({
        bio: user.value.bio,
        interests: selectedInterests.value,
      })

      if (updateuser) {
        showSuccessPopup.value = true

        const UserData = await authStore.getCurrentUserDetails()

        localStorage.removeItem('dbUser')
        // and also save to localStorage
        localStorage.setItem('dbUser', JSON.stringify(UserData))
      }
    } catch (error) {
      usernameError.value = error
    } finally {
      setTimeout(() => {
        showSuccessPopup.value = false
      }, 3000)
    }
  }

  return {
    selectedInterests,
    usernameError,
    showSuccessPopup,
    categoryOfIntrests,
    isotimeValueConvert,
    lastLoginAt,
    validateAndUpdateUsername,
    toggleIntrest,
    authStore,
    user,
    saveChanges,
  }
}
