<template>
  <div class="p-4">
    <div
      v-if="showSuccessPopup"
      class="bg-green-100 text-green-700 p-2 rounded-2xl shadow mx-auto max-w-2xl text-center"
    >
      <span
        class="text-sm font-semibold text-green-700 hover:text-green-900 cursor-pointer"
      >
        Username updated successfully!
      </span>
    </div>

    <div v-if="user" class="mt-4 bg-white rounded-2xl shadow mx-auto max-w-2xl">
      <div class="p-4 border-b">
        <div class="flex items-center space-x-4">
          <div v-if="user.photoURL">
            <img
              :src="user.photoURL"
              alt="User Photo"
              class="w-12 h-12 rounded-full"
            />
          </div>
          <div v-else>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="bg-redDamask-600 p-1 rounded-full text-redDamask-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-redDamask-500"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </div>
          <div>
            <h2 class="font-bold">Hello, {{ user.username }}</h2>
            <p class="text-sm">
              Member Since: {{ isotimeValueConvert(user.createdAt) }}
            </p>
          </div>
        </div>
      </div>

      <div class="p-4 border-b">
        <label class="block font-bold mb-2">Username</label>
        <div class="flex items-center space-x-2">
          <input
            type="text"
            v-model="user.username"
            class="flex-grow p-2 border bg-white rounded-xl"
          />
          <div class="ml-2 hover:animate-spin">
            <svg
              @click="validateAndUpdateUsername"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-6 w-6 text-seashell-500 cursor-pointer hover:text-seashell-700"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </div>
        </div>
        <p v-if="usernameError" class="text-red-500">{{ usernameError }}</p>
      </div>
      <div class="cursor-not-allowed">
        <div class="p-4 border-b">
          <p class="font-bold">Contact Information</p>
          <p>
            Email: <span>{{ user.email }}</span>
          </p>
          <p>Email Verified: <span>No</span></p>
          <p v-if="user.lastLoginDate">
            Last Login: {{ isotimeValueConvert(user.lastLoginAt) }}
          </p>
        </div>

        <div class="p-4 border-b">
          <p class="text-sm font-semibold">Settings</p>

          <p>Recent Activity</p>
          <div class="mt-6">
            <div class="mt-2">
              <h2 class="text-lg">
                More settings options will be available soon
              </h2>
            </div>
          </div>
        </div>

        <div class="p-4 border-b">
          <p class="font-bold text-red-600">Danger Zone</p>
          <p>Delete all posts</p>
          <p>Delete your account</p>
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
        // Try to get user data from local storage
        const localUserData = localStorage.getItem('user-data')

        if (localUserData) {
          user.value = JSON.parse(localUserData)
        } else {
          const dbUser = await getCurrentUser(authUser.uid)

          // Save the data to local storage for future use
          localStorage.setItem('user-data', JSON.stringify(dbUser))

          user.value = dbUser
        }
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
        const updateuser = await updateUsername(user.value.username)

        if (updateuser) {
          // Show the success popup
          showSuccessPopup.value = true

          // localStorage.setItem('user-data')

          // this just makes a call to the API to get the updated user data in the local storage
          const authUser = await currentUser()
          const dbUser = await getCurrentUser(authUser.uid)

          // Save the data to local storage for future use
          localStorage.setItem('user-data', JSON.stringify(dbUser))

          // Hide the success popup after 3000 milliseconds (adjust as needed)
          setTimeout(() => {
            showSuccessPopup.value = false
          }, 2000)
        }
      } catch (error) {
        console.error('Error updating username:', error.message)
        // Handle errors during the update process
      }
    }
  }

  const { updateUsername } = Actions()
</script>
