<template>
  <div class="p-4 lg:w-2/4">
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

    <div v-if="user" class="mt-4 bg-white rounded-2xl shadow">
      <div
        class="p-4 border-b border-seashell-200 flex items-center justify-between"
      >
        <div class="flex items-center space-x-4">
          <div>
            <img
              v-if="user.photoURL"
              :src="user.photoURL"
              alt="User Photo"
              class="w-12 h-12 rounded-full"
            />

            <img
              v-else
              :src="defaultPic"
              alt="User Photo"
              class="w-12 h-12 rounded-full"
            />
          </div>
          <div>
            <h2 class="font-bold">Hello, {{ user.username }}</h2>
            <p class="text-sm">
              Member Since: {{ isotimeValueConvert(user.createdAt) }}
            </p>
          </div>
        </div>
      </div>

      <div class="p-4 border-b border-seashell-200">
        <label class="block font-bold mb-2">Username</label>
        <div class="flex items-center space-x-2">
          <input
            type="text"
            v-model="user.username"
            class="flex-grow p-2 border bg-white border-seashell-200 rounded-xl"
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

      <!-- <div class="p-4 border-b border-seashell-200">
        <label class="block font-bold mb-2">Bio</label>

        <div>
          <textarea
            v-model="user.bio"
            rows="4"
            class="w-full p-2 border bg-white border-seashell-200 rounded-xl"
            placeholder="Tell us something about yourself..."
          ></textarea>
          <button class="bg-blue-500 text-white px-4 py-2 rounded-xl mt-2">
            Save
          </button>
        </div>
      </div> -->

      <div>
        <div class="p-4 border-b border-seashell-200">
          <p class="font-bold">Contact Information</p>
          <p>
            Email: <span>{{ user.email }}</span>
          </p>
          <p>Email Verified: <span>No</span></p>
          <p v-if="user.lastLoginAt">
            Last Login: {{ isotimeValueConvert(user.lastLoginAt) }}
          </p>
        </div>
      </div>

      <!-- <div>
        <div class="p-4 border-b border-seashell-200">
          <p class="font-bold">Update Password</p>
          <button
            class="bg-blue-300 text-white px-4 py-2 rounded-xl mt-2 hover:bg-blue-500 transition duration-300"
          >
            Request Password Reset
          </button>
        </div>
      </div>


      <div>
        <div class="p-4 border-b border-seashell-200">
          <p class="font-bold text-red-500">Danger Zone</p>
          <div class="flex items-center space-x-2 mt-2">
            <button
              class="bg-red-300 text-white px-4 py-2 rounded-xl mt-2 hover:bg-red-500 transition duration-300"
            >
              Delete Account
            </button>

            <button
              class="bg-red-300 text-white px-4 py-2 rounded-xl mt-2 hover:bg-red-500 transition duration-300"
            >
              Delete All Posts
            </button>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { Actions } from '../Composables/actions'
  import AppApiService from '../../service/index.js'
  import defaultPic from '@/assets/defaultprofilePic.svg'

  import { useAuthStore } from '../../store/authStore' // Import useAuthStore
  const authStore = useAuthStore()

  const service = AppApiService()
  const user = ref(null)

  const usernameError = ref('')

  onMounted(async () => {
    // get the current user details

    // get the current user details
    await authStore.getCurrentUserDetails()

    // set the user value to the user details
    if (authStore.dbUser) {
      user.value = authStore.dbUser.dbData
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

    usernameError.value = ''
  }
  const showSuccessPopup = ref(false)

  const validateAndUpdateUsername = async () => {
    await validateUsername()

    if (!usernameError.value) {
      try {
        // const updateuser = await updateUsername(user.value.username)

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

  const { updateUsername } = Actions()
</script>
