<template>
  <div class="text-center">
    <div v-if="activeFilter" class="text-seashell-900 leading-relaxed mb-4">
      <div v-if="displayedItems.length > 0">
        <div
          class="flex flex-row justify-center items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse"
        >
          <div class="flex items-center">
            <div>
              <div
                v-if="displayedItems.length > 0"
                class="rounded-lg text-seashell-900 p-2 hover:text-seashell-900 transition-all duration-300 mr-3"
              >
                {{ displayedItems.length }}
              </div>
            </div>
          </div>
          <div>
            <span
              class="rounded-lg bg-saffron-400 p-3 transition-all duration-300 text-seashell-900"
            >
              {{ activeFilter }}
            </span>
          </div>
        </div>
      </div>

      <div
        v-else
        class="flex flex-row justify-center items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse"
      >
        <div class="flex items-center">
          <div>
            <div
              class="rounded-lg text-seashell-900 p-2 hover:text-seashell-900 transition-all duration-300 mr-3"
            >
              No data available for
            </div>
          </div>
        </div>
        <div>
          <span
            class="rounded-lg bg-saffron-400 p-3 transition-all duration-300 text-seashell-900"
          >
            {{ activeFilter }}
          </span>
        </div>
      </div>
    </div>

    <div v-else class="text-seashell-900 text-md leading-relaxed">
      <div v-if="displayedItems.length <= 0">
        There are no submissions that match your search criteria.
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
    <div v-for="item in displayedItems" :key="item.id">
      <!-- Flex Container -->
      <div
        class="flex flex-row md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6 shadow-lg rounded-lg p-6 bg-seashell-50 "
      >
        <div class="flex-1">
          <div class="pr-2">
            <div>
              <div class="flex flex-col items-start text-md">
                <h2 class="font-bold  mb-2">
                  {{ item.title || item.proverb }}
                </h2>
              </div>

              <div
                class="text-seashell-900 leading-relaxed flex justify-between items-center"
              >
                {{ item.content }}
              </div>
            </div>
          </div>

          <div
            role="alert"
            v-show="item.showMeaning"
            class="mt-2 p-2 bg-saffron-300 text-seashell-900 rounded text-sm"
          >
            <span>{{ item.meaning }}</span>
          </div>

          <!-- toggle meaning -->
          <button
            @click="toggleMeaning(item)"
            class="mt-2 text-cinnabar-500 hover:text-cinnabar-600 transition text-sm"
          >
            {{ item.showMeaning ? 'Hide Meaning' : 'See Meaning' }}
          </button>
          <p class="text-seashell-900 mt-2">
            <span class="flex justify-between items-center text-sm">
              <span
                >Submitted by:
                <span
                  class="font-medium text-cinnabar-500 hover:text-cinnabar-600 transition-all duration-300 cursor-pointer"
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
                    class="w-5 h-5 text-seashell-500 hover:text-seashell-600 transition-all duration-300"
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

          <p class="text-seashell-900 text-sm">
            Date Added:
            <span class="font-medium">{{ formatDate(item.creationDate) }}</span>
          </p>

          <!-- voting -->
          <div class="flex items-center justify-between text-sm">
            <div class="flex items-center mt-4">
              <button
                @click="upvoteSubmisson(item.id)"
                class="rounded-lg bg-carrotOrange-300 text-seashell-900 p-2 hover:bg-carrotOrange-400 transition-all duration-300 mr-3"
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
                class="rounded-lg bg-seashell-100 text-seashell-600 p-2 hover:bg-seashell-200 hover:text-seashell-700 transition-all duration-300 ml-2 mr-3"
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
            <div class="flex items-center mt-4 text-sm">
              <button
                @click="showFullText(item.id)"
                class="rounded-lg bg-redDamask-100 text-redDamask-600 p-2 hover:bg-redDamask-200 hover:text-redDamask-700 transition-all duration-300"
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
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </button>
              <button
                v-if="isLoggedIn && user.email === item.submittedBy"
                @click="deletessubmission(item.id, user.uid)"
                class="rounded-lg bg-cinnabar-100 text-cinnabar-600 p-2 hover:bg-cinnabar-200 hover:text-cinnabar-700 transition-all duration-300 ml-4"
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
          // localStorage.setItem('user', JSON.stringify(currentUserData))
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
