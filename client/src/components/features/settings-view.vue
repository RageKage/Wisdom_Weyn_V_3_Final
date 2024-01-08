<template>
  <div
    class="container p-6 sm:px-5 max-w-full mx-auto sm:max-w-[800px] py-4 m-4"
  >
    <div class="bg-white shadow rounded-lg p-6">
      <div
        v-if="showSuccessPopup"
        class="fixed top-10 left-1/2 transform -translate-x-1/2 w-full max-w-sm mx-auto animate-fadeIn"
      >
        <div
          class="rounded-lg bg-green-100 text-green-600 p-4 transition-all duration-300"
          role="alert"
        >
          <span class="font-medium">Username updated successfully!</span>
        </div>
      </div>

      <div v-if="user">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl font-semibold">Hello, {{ user.username }}</h2>

            <p class="text-gray-500">
              Member Since: {{ isotimeValueConvert(user.createdAt) }}
            </p>
          </div>
          <div
            v-if="user.photoURL"
            class="w-16 h-16 rounded-full overflow-hidden"
          >
            <img
              :src="user.photoURL"
              alt="User Photo"
              class="w-full h-full object-cover"
            />
          </div>
          <div v-else class="w-16 h-16 rounded-full overflow-hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              class="w-full h-full text-gray-300"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </div>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Update Username:</label
          >
          <div class="flex items-center space-x-4">
            <input
              type="text"
              class="flex-1 rounded-lg bg-slate-100 text-slate-700 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
              v-model="user.username"
            />
            <div
              class="flex flex-row rounded-lg bg-blue-100 text-blue-600 p-2 hover:bg-blue-200 hover:text-blue-700 transition-all duration-300 cursor-pointer"
            >
              <button @click="validateAndUpdateUsername">Update</button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6 ml-3"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </div>
          </div>
          <p v-if="usernameError" class="text-red-600 text-sm mt-2">
            {{ usernameError }}
          </p>
        </div>

        <div
          class="rounded-lg bg-gray-100 text-gray-700 p-4 hover:text-gray-900 transition-all duration-300"
        >
          <div class="mb-4">
            <p class="text-gray-500">Information</p>
            <p class="mb-2">
              <span class="font-semibold">Email:</span> {{ user.email }}
            </p>
            <p v-if="user.lastLoginDate" class="mb-2">
              <span class="font-semibold">Last Login:</span>
              {{ isotimeValueConvert(user.lastLoginAt) }}
            </p>
          </div>

          <div class="border-t pt-4">
            <p class="text-gray-500 mb-2">Recent Activity</p>
            <div class="flex justify-between items-center">
              <h2 class="text-md">
                More settings options will be available soon
              </h2>
            </div>
          </div>
        </div>
        <div class="flex justify-center items-center h-full">
          <div
            class="flex flex-row rounded-lg bg-red-100 text-red-600 p-2 hover:bg-red-200 hover:text-red-700 transition-all duration-300 py-2 m-4 cursor-pointer"
          >
            Delete Account
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { currentUser, getCurrentUser } from '@/service/authService.js'
  import { checkUsername } from '../authentication/UserDataManager'

  import { Actions } from '../Composables/actions'

  const user = ref(null)
  const userImage = ref(null)

  const usernameError = ref('')

  onMounted(async () => {
    try {
      const authUser = await currentUser()

      if (authUser) {
        // get the data in the user data, displayName is available in the authUser but not for if the account was created via email and password,
        // also this is better encase the provider doesn't provide that data
        const dbUser = await getCurrentUser(authUser.uid)
        user.value = dbUser
      }
    } catch (error) {
      console.error('Error getting current user:', error.message)
    }
  })

  const isotimeValueConvert = (value) => {
    const date = new Date(value)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const validateUsername = async () => {
    const username = user.value.username

    if (username.length <= 3) {
      usernameError.value = 'Username must be longer than 3 characters.'
      return
    }
    if (/\s/.test(username)) {
      usernameError.value =
        'Username cannot contain empty spaces between letters.'
      return
    }
    const authUser = await currentUser()

    const isUsernameAvailable = await checkUsername(username, authUser.uid)

    if (!isUsernameAvailable) {
      usernameError.value = 'Username already exists.'
      return
    }

    // Clear any previous error messages
    usernameError.value = ''
  }
  const showSuccessPopup = ref(false)

  const validateAndUpdateUsername = async () => {
    await validateUsername()

    if (!usernameError.value) {
      // If there are no validation errors, proceed with the username update
      try {
        console.log('Updating username', user.value.username)

        const updateuser = await updateUsername(user.value.username)

        if (updateuser) {
          // Show the success popup
          showSuccessPopup.value = true

          // Hide the success popup after 3000 milliseconds (adjust as needed)
          setTimeout(() => {
            showSuccessPopup.value = false
          }, 3000)
        }
      } catch (error) {
        console.error('Error updating username:', error.message)
        // Handle errors during the update process
      }
    }
  }

  const { updateUsername } = Actions()
</script>
