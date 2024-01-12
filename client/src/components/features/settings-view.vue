<template>
  <div
    class="container sm:px-5 max-w-full sm:max-w-[800px] py-4 m-4 flex flex-col justify-center items-center"
  >
    <div
      v-if="showSuccessPopup"
      class="rounded-lg bg-green-200 text-green-700 p-2 transition-all duration-300 m-4 animate-fadeIn"
    >
      <div class="flex justify-between">
        <span class="font-medium">Username updated successfully!</span>
      </div>
    </div>
    <div class="bg-white shadow rounded-lg p-6">
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
              stroke-width="1.5"
              stroke="currentColor"
              class="bg-custom-purple-600 p-1 rounded-full text-custom-gold-500 dark:bg-custom-purple-500 dark:text-custom-gold-400 w-full h-full"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </div>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Username</label
          >
          <div class="flex items-center space-x-4">
            <input
              type="text"
              class="p-2 leading-normal block w-full text-gray-800 border-none rounded-lg text-left appearance-none outline-none border bg-gray-200 focus:bg-white"
              v-model="user.username"
            />
            <div
              class="flex flex-row rounded-lg bg-blue-100 text-blue-600 p-2 group hover:bg-blue-200 hover:text-blue-700 transition-all duration-300 cursor-pointer"
            >
              <svg
                @click="validateAndUpdateUsername"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6 hover-spin"
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
            class="flex flex-row rounded-lg bg-red-100 text-red-600 p-2 hover:bg-red-200 hover:text-red-700 transition-all duration-300 py-2 m-4 cursor-none"
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
        // console.log('Updating username', user.value.username)

        const updateuser = await updateUsername(user.value.username)
        console.log(updateuser)

        if (updateuser) {
          // Show the success popup
          showSuccessPopup.value = true

          console.log('Username updated successfully!')

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
