<template>
  <div
    class="min-h-screen w-screen flex items-center justify-center"
    v-if="user"
  >
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-semibold text-gray-900 mb-4">
        Welcome,
        <!-- {{ user }} -->
        <span class="text-gray-600">
          {{ user.realName || userlocalStg.displayName }}
        </span>
      </h2>

      <p class="text-gray-700 mb-6">To continue, please choose a username:</p>

      <div class="mb-4">
        <input
          type="text"
          v-model="chosenUsername"
          name="chosenUsername"
          id="chosenUsername"
          placeholder="Username"
          class="border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 rounded-md"
          @blur="validateUsername"
        />
        <p v-if="usernameError" class="text-red-600 text-sm">
          {{ usernameError }}
        </p>
      </div>

      <button
        @click="submitUsername"
        class="w-full px-4 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition-all duration-300"
      >
        Continue
      </button>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import {
    updatesyncGoogleUserData,
    updatesyncUserData,
  } from './UserDataManager'

  import {
    currentUser,
    getCurrentUser,
  } from '@/service/authService.js'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const user = ref(null)
  const userlocalStg = ref(null)
  const chosenUsername = ref('')
  const usernameError = ref('')

  const validateUsername = () => {
    // username validation
    usernameError.value =
      chosenUsername.value.length < 4
        ? 'Username must be at least 3 characters long.'
        : ''
  }

  onMounted(async () => {
    try {
      const authUser = await currentUser()

      if (authUser) {
        const dbUser = await getCurrentUser(authUser.uid)
        user.value = dbUser
      }
    } catch (error) {
      console.error('Error getting current user:', error.message)
    }
  })

  userlocalStg.value = JSON.parse(localStorage.getItem('user'))

  const submitUsername = async () => {
    // Logging the cleaned JSON
    validateUsername()

    if (usernameError.value) {
      return // if there are any errors then return the error
    }

    const uid = userlocalStg.value.uid
    const realName = userlocalStg.value.displayName
    const username = chosenUsername.value

    try {
      // Check if the user is a Google user
      const isGoogleUser =
        userlocalStg.value.displayName &&
        userlocalStg.value.providerData.some(
          (provider) => provider.providerId === 'google.com',
        )

      if (isGoogleUser) {
        await updatesyncGoogleUserData(uid, realName, username)
      } else {
        await updatesyncUserData(uid, username)
      }

      router.push('/')
    } catch (error) {
      usernameError.value = error.message
    }
  }
</script>
