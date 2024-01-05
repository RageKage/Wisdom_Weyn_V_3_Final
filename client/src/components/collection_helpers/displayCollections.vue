<template>
  <div class="text-center">
    <h2
      class="text-2xl font-bold text-custom-purple-600 mb-2"
      v-if="displayedItems.length > 0"
    >
      {{ displayedItems.length }} Submissions Found
    </h2>

    <h2 class="text-2xl font-bold text-custom-purple-600 mb-2" v-else>
      No Submissions Found
    </h2>

    <div v-if="activeFilter" class="text-sm text-gray-600">
      <div v-if="displayedItems.length > 0">
        Showing results for {{ activeFilter }}.
      </div>

      <div v-else>No data available for {{ activeFilter }}.</div>
    </div>

    <div v-else class="text-gray-700 text-md leading-relaxed">
      <div v-if="displayedItems.length > 0">Showing all submissions.</div>

      <div v-else>
        There are no submissions that match your search criteria.
      </div>
    </div>
  </div>

  <div
    class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start max-w-[1200px] mx-auto md:px-0"
  >
    <div v-for="item in displayedItems" :key="item.id">
      <!-- Flex Container -->
      <div
        class="flex flex-row md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6 bg-white shadow-lg rounded-lg p-6"
      >
        <div class="flex-1">
          <div class="pr-2">
            <div>
              <div class="flex flex-col items-start">
                <h2 class="text-lg font-bold text-custom-purple-600 mb-2">
                  {{ item.title || item.proverb }}
                </h2>
              </div>

              <div
                class="text-gray-700 text-md leading-relaxed flex justify-between items-center"
              >
                {{ item.content }}
              </div>
            </div>
          </div>

          <div
            role="alert"
            v-show="item.showMeaning"
            class="mt-2 p-2 bg-custom-purple-100 text-custom-purple-600 rounded"
          >
            <span>{{ item.meaning }}</span>
          </div>

          <!-- toggle meaning -->
          <button
            @click="toggleMeaning(item)"
            class="mt-2 text-custom-purple-600 text-md hover:text-custom-purple-700 transition"
          >
            {{ item.showMeaning ? 'Hide Meaning' : 'See Meaning' }}
          </button>
          <p class="text-sm text-gray-500 mt-2">
            <span class="flex justify-between items-center">
              <span
                >Submitted by:
                <span
                  class="font-medium text-custom-purple-600 hover:text-custom-purple-700 transition-all duration-300 cursor-pointer"
                  @click="userdashboard(item.submittedBy)"
                >
                  {{ item.username }}
                </span>
              </span>
              <span>
                <div v-if="isLoggedIn && user.email === item.submittedBy">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6 text-custom-purple-600 hover:text-custom-purple-700 transition-all duration-300"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                    />
                  </svg>
                </div>
              </span>
            </span>
          </p>

          <p class="text-sm text-gray-500">
            Date Added:
            <span class="font-medium">{{ formatDate(item.creationDate) }}</span>
          </p>

          <!-- voting -->
          <div class="flex items-center justify-between">
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

            <!-- sharing and full text -->
            <div class="flex items-center mt-4">
              <button
                @click="showFullText(item.id)"
                class="rounded-lg bg-blue-100 text-blue-600 p-2 hover:bg-blue200 hover:text-blue-700 transition-all duration-300"
              >
                Read
              </button>
              <button
                v-if="isLoggedIn && user.email === item.submittedBy"
                @click="deletessubmission(item.id, user.uid)"
                class="rounded-lg bg-red-100 text-red-600 p-2 hover:bg-red-200 hover:text-red-700 transition-all duration-300 ml-4"
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
            <!-- wanna add a edit, delete -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { currentUser } from '@/service/authService.js'
  import { Actions } from '../Composables/actions'
  import Swal from 'sweetalert2'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const isLoggedIn = ref(false)
  const user = ref(null)

  const props = defineProps({
    displayedItems: {
      type: Array,
      required: true,
    },
    activeFilter: {
      type: String,
      default: '',
    },
    isLoading: Boolean,
  })

  // TODO only users that are logged in can see the @click="deleteSubmission(item)" no other users should see this

  const toggleMeaning = (item) => {
    item.showMeaning = !item.showMeaning
  }

  // Format the date
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(date).toLocaleDateString('en-US', options)
  }

  onMounted(async () => {
    // window.scrollTo(0,500);

    try {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        user.value = JSON.parse(storedUser)
        isLoggedIn.value = true
      } else {
        const currentUserData = await currentUser()
        if (currentUserData) {
          user.value = currentUserData
          isLoggedIn.value = true
          localStorage.setItem('user', JSON.stringify(currentUserData))
        }
      }
    } catch (error) {
      console.error('Error getting current user:', error)
    }
  })

  // we will now define what we are emitting to the parent
  const emits = defineEmits(['loginRequired'])

  const upvoteSubmisson = (id) => {
    if (isLoggedIn.value) {
      upvote(id)
    } else {
      emits('loginRequired', id)
    }
  }

  const downvoteSubmisson = (id) => {
    if (isLoggedIn.value) {
      downvote(id)
    } else {
      emits('loginRequired', id)
    }
  }

  const deletessubmission = (id, uid) => {
    if (isLoggedIn.value) {
      // swal fire to delete
      Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this submission!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
        customClass: {
          popup: 'flex flex-col space-y-4',
          header: 'flex items-center justify-between w-full',
          closeButton: 'text-gray-400 hover:text-gray-500 ml-auto',
          content: 'text-gray-700 prose',
          actions: 'flex justify-end gap-4 mt-4',
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            Swal.fire({
              title: 'Deleted!',
              text: 'Your submission has been deleted.',
              icon: 'success',
              customClass: {
                popup: 'flex flex-col space-y-4',
                header: 'flex items-center justify-between w-full',
                closeButton: 'text-gray-400 hover:text-gray-500 ml-auto',
                content: 'text-gray-700 prose',
                actions: 'flex justify-end gap-4 mt-4',
              },
            }).then((result) => {
              if (result.isConfirmed) {
                deleteSubmission(id, uid)
                router.push('/collections')
              }
            })
          } catch (e) {
            console.error('Error deleting submission:', e)
          }
        }
      })
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
          router.push('/sign-in')
        }
      })
    }
  }

  const { userdashboard, showFullText, upvote, downvote, deleteSubmission } =
    Actions()
</script>
