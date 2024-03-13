<template>
  <div class="p-6 sm:px-5 max-w-full mx-auto sm:max-w-[1200px]">
    <div v-if="item">
      <!-- Post view -->
      <div
        class="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 mb-4 p-4"
      >
        <!-- Back button -->
        <div class="flex mt-4 mb-4">
          <button
            @click="goback"
            class="text-gray-700 hover:text-gray-500 focus:outline-none transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
        <div class="flex flex-col space-y-4">
          <div class="flex flex-col items-start">
            <h2
              class="text-2xl font-bold mb-2 text-gray-900 hover:text-gray-700 transition-all duration-300"
            >
              {{ item.title }}
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 py-4 w-full">
              <div class="text-gray-700 text-lg leading-relaxed md:mr-6">
                {{ item.content }}
              </div>
              <div class="mt-2 sm:mt-0 p-2 rounded bg-yellow-400 text-gray-900">
                {{ item.meaning }}
              </div>
            </div>
            <div class="text-sm text-gray-600 mb-4 mt-2">
              Submitted by
              <span
                @click="userdashboard(item.username)"
                class="text-indigo-600 hover:text-indigo-800 cursor-pointer"
                >{{ item.username }}</span
              >
              on <span>{{ formatDate(item.creationDate) }}</span>
            </div>
            <div
              class="flex items-center justify-between w-full border-t border-gray-200 pt-4"
            >
              <div class="flex items-center">
                <button
                  @click="upvoteSubmisson(item.id)"
                  class="focus:outline-none mr-2 hover:text-carrotOrange-500 transition-all duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    class="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </button>
                <span class="text-gray-700">{{ item.votes.upvote.count }}</span>
                <button
                  @click="downvoteSubmisson(item.id)"
                  class="focus:outline-none ml-4 hover:text-red-500 mr-2 transition-all duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    class="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <span class="text-gray-700">{{
                  item.votes.downvote.count
                }}</span>
              </div>
              <div>
                <button
                  @click="ShareToTwitter(item)"
                  class="rounded-lg text-blue-500 p-2 transition-all duration-300 mr-4"
                >
                  <svg
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
                      d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                    />
                  </svg>
                </button>
                <!-- Delete submission -->
                <div v-if="isLoggedIn">
                  <button
                    v-if="user.email === item.submittedBy"
                    @click="deletessubmission(item.id, user.uid)"
                    class="rounded-lg text-red-600 p-2 transition-all duration-300"
                  >
                    <svg
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
      <!-- Comments section -->
      <div>
        <div
          class="flex flex-col items-center justify-center text-center bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 mb-4 p-4"
        >
          <h2
            class="text-2xl font-bold mb-2 text-gray-900 hover:text-gray-700 transition-all duration-300"
          >
            Comments
          </h2>
          <p class="text-gray-700 text-lg leading-relaxed">
            Comments will be added soon.
          </p>
        </div>
      </div>
    </div>
    <!-- Submission not found -->
    <div v-if="submissionNotFound">
      <div
        class="flex flex-col items-center justify-center text-center bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 mb-4 p-4"
      >
        <h2
          class="text-2xl font-bold mb-2 text-gray-900 hover:text-gray-700 transition-all duration-300"
        >
          Submission Not Found
        </h2>
        <p class="text-gray-700 text-lg leading-relaxed">
          The submission you are looking for does not exist.
        </p>
      </div>
      <!-- Go back to collection button -->
      <div class="flex flex-col items-center justify-center text-center">
        <button
          @click="goback"
          class="bg-blue-500 text-white hover:bg-blue-700 transition-all duration-300 rounded-lg px-4 py-2 focus:outline-none"
        >
          Go Back to Collection
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import AppApiService from '../../service/index'
  import { Actions } from '../Composables/actions'
  import Swal from 'sweetalert2'
  import { useAuthStore } from '../../store/authStore' // Import useAuthStore
  const authStore = useAuthStore()

  const service = AppApiService()
  const router = useRouter()

  const user = ref(null)

  const itemId = computed(() => router.currentRoute.value.params.id)
  const item = ref(null)

  const goback = () => {
    router.go(-1) || router.push('/collections')
  }

  const isLoggedIn = ref(false)

  const submissionNotFound = ref(false)

  const fetchItem = async () => {
    try {
      item.value = await service.getSubmission(itemId.value)
    } catch (error) {
      submissionNotFound.value = true
      console.error('Error fetching item:', error)
    }
  }

  // Format the date
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(date).toLocaleDateString('en-US', options)
  }

  const isUserUpvoted = (item) => {
    // Check if user's UID is in the item's upvote user list

    if (user.value) {
      return item.votes.upvote.users && item.votes.upvote.users[user.value.uid]
    }
  }

  const isUserDownvoted = (item) => {
    // Check if user's UID is in the item's downvote user list
    if (user.value) {
      return (
        item.votes.downvote.users && item.votes.downvote.users[user.value.uid]
      )
    }
  }

  onMounted(async () => {
    try {
      // get the current user details
      await authStore.getCurrentUserDetails()

      // set the user value to the user details
      if (authStore.dbUser) {
        user.value = authStore.dbUser.dbData
        isLoggedIn.value = true
      }
    } catch (error) {
      console.error('Error getting current user:', error)
    }
  })

  const future_feature = ref(false)

  const requireLogin = () => {
    Swal.fire({
      title: 'Login Required',
      text: 'You must be logged in to vote on collections!',
      icon: 'warning',
      confirmButtonText: 'Login',
      cancelButtonText: 'Cancel',
      showCancelButton: true,
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = '/sign-in'
      }
    })
  }

  const upvoteSubmisson = (id) => {
    if (isLoggedIn.value) {
      upvote(id)
    } else {
      requireLogin()
    }
  }

  const downvoteSubmisson = (id) => {
    if (isLoggedIn.value) {
      downvote(id)
    } else {
      requireLogin()
    }
  }

  const deletessubmission = (id, uid) => {
    if (!isLoggedIn.value) {
      requireLogin()
      return
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this submission!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    })
      .then((result) => {
        if (result.isConfirmed) {
          deleteSubmission(id, uid)
          Swal.fire('Deleted!', 'Your submission has been deleted.', 'success')
        }
      })
      .catch((e) => console.error('Error deleting submission:', e))
  }

  // eslint-disable-next-line no-unused-vars
  const { upvote, downvote, ShareToTwitter, userdashboard, deleteSubmission } =
    Actions()

  onMounted(fetchItem)
</script>
