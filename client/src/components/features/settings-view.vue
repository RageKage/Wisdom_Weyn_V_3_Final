<template>
  <div class="max-w-3xl mx-auto">
    <div
      v-if="showSuccessPopup"
      class="fixed top-0 left-0 right-0 m-2 bg-green-400 text-white font-bold py-2 px-4 rounded-3xl max-w-3xl mx-auto"
    >
      <div class="flex flex-row items-center text-center justify-between">
        <span
          class="bg-green-600 rounded-full mr-3 flex items-center justify-center w-8 h-8"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </span>
        <p>Changes Saved Successfully</p>
      </div>
    </div>

    <div v-if="user" class="mt-4 bg-white rounded-2xl shadow max-w-3xl mx-auto">
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
            <p class="text-xs text-gray-500">
              Last Login: {{ lastLoginAt(user.lastLoginAt) }}
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

      <div class="p-4 border-b border-seashell-200">
        <label class="block font-bold mb-2">Bio</label>
        <div class="">
          <textarea
            v-model="user.bio"
            rows="4"
            placeholder="Write a short bio about yourself."
            class="w-full p-2 border bg-white border-seashell-200 rounded-xl"
            maxlength="200"
          ></textarea>
          <p
            class="text-xs text-gray-500 text-right mt-2 transition duration-300"
          >
            {{ user.bio.length }}/200
          </p>
        </div>
      </div>
      <!-- Intrests -->

      <div class="p-4 border-b border-seashell-200">
        <label class="block font-bold mb-2">Interests</label>
        <p class="text-gray-600 text-sm m-2">
          Select the categories you are interested in.
        </p>
        <div class="flex flex-wrap items-center mb-2">
          <div
            v-for="interest in categoryOfIntrests"
            :key="interest.name"
            class="flex items-center mr-4"
          >
            <input
              type="checkbox"
              :id="interest.name"
              :value="interest.name"
              class="hidden"
              :checked="selectedInterests.includes(interest.name)"
              @change="toggleIntrest(interest.name)"
            />
            <label
              :for="interest.name"
              class="cursor-pointer px-3 py-2 rounded-xl text-xs font-bold m-1 transition duration-300"
              :class="{
                'bg-orange-500 text-white': selectedInterests.includes(
                  interest.name,
                ),
                'bg-orange-100 text-orange-500': !selectedInterests.includes(
                  interest.name,
                ),
              }"
            >
              {{ interest.name }}
            </label>
          </div>
        </div>
      </div>

      <div>
        <div class="p-4 border-b border-seashell-200">
          <p class="font-bold">Contact Information</p>
          <p>
            Email: <span>{{ user.email }}</span>
          </p>
          <p>Email Verified: <span>No</span></p>
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
      <!-- 

       -->

      <div class="p-4 border-b border-seashell-200">
        <button
          class="bg-orange-500 text-white px-4 py-2 rounded-xl mt-2 hover:bg-orange-700 transition duration-300"
          @click="saveChanges"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { onMounted } from 'vue'
  import defaultPic from '@/assets/defaultprofilePic.svg'
  import useSettings from '../Composables/settingComposable.js'

  onMounted(async () => {
    // get the current user details
    await authStore.getCurrentUserDetails()

    // set the user value to the user details
    if (authStore.dbUser) {
      user.value = authStore.dbUser.dbData

      // update selectedInterests with the user's interests
      if (user.value.interests) {
        selectedInterests.value = user.value.interests
      }
    }
  })

  const {
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
  } = useSettings()
</script>
