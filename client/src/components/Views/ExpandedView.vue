<template>
  <div
    class="container p-6 sm:px-5 max-w-full mx-auto sm:max-w-[800px] py-4 m-4"
  >
    <div v-if="item">
      <!-- back button  -->
      <div class="flex mt-4">
        <button
          @click="goback"
          class="rounded-lg bg-custom-purple-100 text-custom-purple-600 p-2 hover:bg-custom-purple-200 hover:text-custom-purple-700 transition-all duration-300 mr-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
            />
          </svg>
        </button>
      </div>
      <div
        class="container px-4 bg-white shadow rounded-lg p-6 sm:px-5 max-w-full mx-auto sm:max-w-[800px] py-4 m-4"
      >
        <div class="flex flex-col space-y-4">
          <div class="flex flex-col items-start">
            <h2 class="text-xl font-bold text-custom-purple-600 mb-2">
              {{ item.title }}
            </h2>

            <div class="text-gray-700 text-lg leading-relaxed">
              {{ item.content }}
            </div>

            <div
              role="alert"
              class="mt-2 p-2 bg-custom-purple-100 text-custom-purple-600 rounded"
            >
              <span>{{ item.meaning }}</span>
            </div>

            <p class="text-sm text-gray-500 mt-2">
              Submitted by:
              <span
                class="font-medium hover:underline hover:cursor-pointer"
                @click="userdashboard(item.submittedBy)"
                >{{ item.username }}</span
              >
            </p>

            <p class="text-sm text-gray-500">
              Date Added:
              <span class="font-medium">{{
                formatDate(item.creationDate)
              }}</span>
            </p>

            <div class="flex mt-4 w-full justify-between items-baseline">
              <div class="flex items-center mt-4">
                <button
                  @click="upvoteSubmisson(item.id)"
                  class="rounded-lg bg-custom-purple-100 text-custom-purple-600 p-2 hover:bg-custom-purple-200 hover:text-custom-purple-700 transition-all duration-300 mr-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-5 h-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </button>
                <span class="text-gray-700">{{ item.upvotes }}</span>
                <button
                  @click="downvoteSubmisson(item.id)"
                  class="rounded-lg bg-custom-gold-100 text-custom-gold-600 p-2 hover:bg-custom-gold-200 hover:text-custom-gold-700 transition-all duration-300 ml-2 mr-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-5 h-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </button>
                <span class="text-gray-700">{{ item.downvotes }}</span>
              </div>
              <div>
                <button
                  @click="ShareToTwitter(item)"
                  class="text-custom-gold-600 hover:text-custom-gold-700 transition p-2 rounded-full bg-custom-gold-100 ml-4 mr-4"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-5 h-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                    />
                  </svg>
                </button>
                <!-- TODO soon to be added -->

                <button
                  class="rounded-lg bg-custom-purple-100 text-custom-purple-600 p-2 hover:bg-custom-purple-200 hover:text-custom-purple-700 transition-all duration-300 mr-4"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-5 h-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                    />
                  </svg>
                </button>
                <!-- TODO soon to be added -->
                <button
                  class="rounded-lg bg-red-100 text-red-600 p-2 hover:bg-red-200 hover:text-red-700 transition-all duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-5 h-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import AppApiService from '../../service/index'
  import { Actions } from '../Composables/actions'
  import { currentUser } from '@/service/authService.js'
  import Swal from 'sweetalert2'

  const service = AppApiService()
  const router = useRouter()

  const itemId = computed(() => router.currentRoute.value.params.id)
  const item = ref(null)

  const isLoggedIn = ref(false)

  const fetchItem = async () => {
    try {
      item.value = await service.getSubmission(itemId.value)
      console.log(item.value)
    } catch (error) {
      console.error('Error fetching item:', error)
    }
  }

  // Format the date
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(date).toLocaleDateString('en-US', options)
  }

  onMounted(async () => {
    try {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        isLoggedIn.value = true
      } else {
        isLoggedIn.value = (await currentUser()) !== null
        if (isLoggedIn.value) {
          localStorage.setItem('user', 'true')
        }
      }
    } catch (error) {
      console.error('Error getting current user:', error)
    }
  })

  const goback = () => {
    router.go(-1)
  }

  const upvoteSubmisson = (id) => {
    if (isLoggedIn.value) {
      upvote(id)
    } else {
      Swal.fire({
        title: 'Login Required',
        text: 'You must be logged in to vote on collections!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Login',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
        customClass: {
          popup: 'flex flex-col space-y-4',
          header: 'flex items-center justify-between w-full',
          closeButton: 'text-gray-400 hover:text-gray-500 ml-auto',
          content: 'text-gray-700 prose',
          actions: 'flex justify-end gap-4 mt-4',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          // Redirect to login page
          window.location.href = '/sign-in'
        }
      })
    }
  }

  const downvoteSubmisson = (id) => {
    if (isLoggedIn.value) {
      upvote(id)
    } else {
      Swal.fire({
        title: 'Login Required',
        text: 'You must be logged in to vote on collections!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Login',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
        customClass: {
          popup: 'flex flex-col space-y-4',
          header: 'flex items-center justify-between w-full',
          closeButton: 'text-gray-400 hover:text-gray-500 ml-auto',
          content: 'text-gray-700 prose',
          actions: 'flex justify-end gap-4 mt-4',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          // Redirect to login page
          window.location.href = '/sign-in'
        }
      })
    }
  }

  // eslint-disable-next-line no-unused-vars
  const { upvote, downvote, ShareToTwitter, userdashboard } = Actions()

  onMounted(fetchItem)
</script>
