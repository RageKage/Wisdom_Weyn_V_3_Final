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
  </div>

  <div v-if="errorMessage" class="py-2">
    <div
      class="bg-red-100 text-red-800 font-medium py-2 px-4 rounded-3xl flex items-center text-center justify-between"
    >
      <div class="flex flex-row items-center text-center justify-between">
        <span
          class="bg-red-500 text-white rounded-full mr-3 flex items-center justify-center w-8 h-8"
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
              d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
            />
          </svg>
        </span>
        {{ errorMessage }}
      </div>

      <span
        class="bg-red-500 text-white rounded-full cursor-pointer hover:bg-red-600 transition-all duration-300 p-2"
        @click="closeError"
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
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </span>
    </div>
  </div>

  <div
    class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start"
  >
    <div
    v-motion
    :initial="{
      x: 0,
      y: -200,
      scale: 0.5,
      opacity: 0,
    }"
    :enter="{
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      transition: { duration: 1, delay: 0.5 },
    }"
      v-for="item in displayedItems"
      :key="item.id"
      class="bg-seashell-50 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 justify-between items-start p-4 mb-4"
    >
      <div class="flex-1">
        <div class="pr-2">
          <div class="flex flex-row-reverse justify-between text-md">
            <div>
              <span
                v-if="item.title"
                class="bg-red-500 w-2 h-2 rounded-full inline-block ml-1"
              ></span>

              <span class="font-medium text-seashell-900">
                {{ item.proverb }}
              </span>
            </div>

            <div class="text-seashell-900 py-1 font-medium">
              {{ item.content }}
            </div>
          </div>
        </div>

        <div v-show="item.showMeaning" class="mt-2">
          <span class="text-indigo-600">{{ item.meaning }}</span>
        </div>

        <button
          @click="toggleMeaning(item)"
          class="mt-4 text-indigo-600 hover:text-indigo-800 focus:outline-none text-sm transition-all duration-300"
        >
          {{ item.showMeaning ? 'Hide Meaning' : 'See Meaning' }}
        </button>
        <div class="text-sm text-gray-600 mb-4 mt-2">
          Submitted by
          <span
            @click="userdashboard(item.submittedBy)"
            class="text-indigo-600 hover:text-indigo-800 cursor-pointer"
            >{{ item.username }}</span
          >
          on <span>{{ formatDate(item.creationDate) }}</span>
        </div>

        <!-- voting -->
        <div
          class="flex flex-row justify-between items-center text-sm text-gray-600"
        >
          <div class="flex items-center">
            <button
              @click="upvoteSubmisson(item.id)"
              :class="{
                'text-carrotOrange-400':
                  item.userVote === 'upvote' || isUserUpvoted(item),
              }"
              class="focus:outline-none mr-2 hover:text-carrotOrange-600 transition-all duration-300"
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
                  d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
                />
              </svg>
            </button>
            <span>{{ item.votes.upvote.count || 0 }}</span>
            <button
              @click="downvoteSubmisson(item.id)"
              :class="{
                'text-red-400':
                  item.userVote === 'downvote' || isUserDownvoted(item),
              }"
              class="focus:outline-none ml-2 mr-2 hover:text-cinnabar-500 transition-all duration-300"
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
                  d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
                />
              </svg>
            </button>
            <span>{{ item.votes.downvote.count || 0 }}</span>
          </div>
          <div
            class="flex flex-row justify-between items-center text-sm text-gray-600"
          >
            <button
              @click="showFullText(item.id)"
              class="focus:outline-none p-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6 hover:text-carrotOrange-600 transition-all duration-300"
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
              class="focus:outline-none ml-2 p-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6 hover:text-cinnabar-500 tansition-all duration-300"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
            <!-- wanna add a edit -->
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
    errorMessage: String,
  })

  // TODO only users that are logged in can see the @click="deleteSubmission(item)" no other users should see this

  const toggleMeaning = (item) => {
    item.showMeaning = !item.showMeaning
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

  // Format the date
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(date).toLocaleDateString('en-US', options)
  }

  onMounted(async () => {
    try {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        user.value = JSON.parse(storedUser)
        isLoggedIn.value = true
      } else {
        const currentUserData = await currentUser()
        const { uid } = currentUserData

        if (currentUserData.user) {
          user.value = currentUserData.user
          isLoggedIn.value = true
          // localStorage.setItem('user', JSON.stringify(currentUserData))
        }
      }
    } catch (error) {
      console.error('Error getting current user:', error)
    }
  })

  const closeError = () => {
    // emit the close to the parent
    emits('closeErrorMessage')
  }

  // we will now define what we are emitting to the parent
  const emits = defineEmits(['loginRequired', 'closeErrorMessage'])

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
    if (!isLoggedIn.value) {
      Swal.fire(
        'Login Required',
        'You must be logged in to delete submissions!',
        'warning',
      )
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
          router.push('/collections')
        }
      })
      .catch((e) => console.error('Error deleting submission:', e))
  }

  const { userdashboard, showFullText, upvote, downvote, deleteSubmission } =
    Actions()
</script>
