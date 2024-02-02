<template>
  <div
    class="min-h-screen w-screen flex items-center justify-center"
    v-if="user"
  >
    <div class="p-8 rounded-3xl shadow-md w-full max-w-md bg-seashell-50">
      <h2 class="text-2xl font-semibold text-seashell-900 mb-4">
        Welcome,
        <span class="text-seashell-600">
          {{ user.realName || userlocalStg.displayName }}
        </span>
      </h2>

      <p class="text-seashell-700 mb-6">
        To continue, please choose a username:
      </p>

      <div class="mb-4">
        <input
          type="text"
          v-model="chosenUsername"
          name="chosenUsername"
          id="chosenUsername"
          placeholder="Username"
          class="border border-seashell-300 text-seashell-900 rounded-lg focus:ring-saffron-500 focus:border-saffron-500 block w-full p-2.5"
          @blur="validateUsername"
        />
        <p v-if="usernameError" class="text-cinnabar-600 text-sm">
          {{ usernameError }}
        </p>
      </div>

      <button
        @click="submitUsername"
        class="w-full px-4 py-2 bg-carrotOrange-500 text-white font-bold rounded-md hover:bg-carrotOrange-600 transition-all duration-300"
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

  import { currentUser, getCurrentUser } from '@/service/authService.js'
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
      const { uid } = authUser

      if (authUser) {
        const dbUser = await getCurrentUser(authUser.user.uid)
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
