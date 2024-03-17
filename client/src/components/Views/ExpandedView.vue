<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="item" class="max-w-3xl mx-auto">
      <!-- Post view -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <!-- Back button -->
        <div class="flex items-center p-4 justify-between">
          <button
            @click="goback"
            class="text-gray-700 hover:text-gray-500 focus:outline-none"
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
          <span
            v-if="item.type === 'Poetry'"
            class="bg-yellow-100 text-yellow-800 rounded-md px-2 py-1 text-xs font-medium"
            >Poetry</span
          >
          <span
            v-if="item.type === 'Proverb'"
            class="bg-orange-100 text-orange-500 rounded-md px-2 py-1 text-xs font-medium"
            >Proverb</span
          >
        </div>
        <div class="px-4 py-6">
          <h2 class="text-lg">
            {{ item.title }}
          </h2>
          <div class="mt-4">
            <div class="text-md leading-relaxed">
              {{ item.content }}
            </div>
            <div class="mt-6 border-t border-gray-300 pt-4">
              <div class="text-md leading-relaxed text-yellow-500">
                {{ item.meaning }}
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-600 flex flex-col">
                <span
                  >Contributor:
                  <span
                    @click="userdashboard(item.username)"
                    class="text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    >{{ item.username }}
                  </span>
                </span>
                <span
                  >Date: <span>{{ formatDate(item.creationDate) }}</span></span
                >
              </div>

              <div class="flex items-center space-x-2"></div>
            </div>
          </div>
          <!-- Action buttons -->
          <div class="flex items-center space-x-4 text-sm text-gray-700">
            <div class="flex items-center space-x-2">
              <button
                @click="upvoteSubmisson(item.id)"
                class="focus:outline-none hover:text-orange-500 transition-all mr-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </button>
              <span class="text-gray-700">{{
                item.votes.upvote.count || 0
              }}</span>
            </div>

            <div class="flex items-center space-x-2">
              <button
                @click="downvoteSubmisson(item.id)"
                class="focus:outline-none hover:text-red-500 mr-2 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <span class="text-gray-700">{{
                item.votes.downvote.count || 0
              }}</span>
            </div>

            <div class="flex-grow"></div>

            <div class="flex items-center space-x-2">
              <button
                @click="ShareToTwitter(item)"
                class="hover:text-blue-600 p-2"
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
            </div>

            <div v-if="isLoggedIn && user.email === item.submittedBy">
              <button
                @click="deletessubmission(item.id, user.uid)"
                class="hover:text-red-600 p-2"
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
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="submissionNotFound">
      <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div class="px-4 py-6">
          <h2>Submission Not Found</h2>
          <p class="text-gray-700 text-lg leading-relaxed">
            The submission you are looking for does not exist.
          </p>
        </div>
      </div>
      <div class="text-center">
        <button
          @click="goback"
          class="bg-blue-500 text-white hover:bg-blue-700 transition-all rounded-lg px-4 py-2 focus:outline-none"
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
