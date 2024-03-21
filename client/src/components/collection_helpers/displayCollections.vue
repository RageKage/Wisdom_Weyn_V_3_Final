<template>
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
      class="mb-6 p-4 bg-white rounded-lg shadow-md transition-all duration-300"
    >
      <div class="border-b pb-2 border-gray-200">
        <div class="mb-2 flex justify-between">
          <span v-if="item.title" class="font-light">{{ item.title }}</span>
          <span v-else>{{ item.content }}</span>
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

        <div>
          <span v-if="item.title"></span>

          <span class="font-medium text-seashell-900">
            {{ item.Proverb }}
          </span>
        </div>

        <div
          v-if="item.showMeaning"
          class="mt-2 bg-gray-100 p-2 rounded-md transition-all duration-300 text-sm text-gray-600 flex flex-col items-start justify-start"
        >
          {{ item.meaning }}
        </div>

        <button
          @click="toggleMeaning(item)"
          class="text-blue-500 hover:text-blue-700 transition-all"
        >
          {{ item.showMeaning ? 'Hide Meaning' : 'See Meaning' }}
        </button>

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
            <span class="text-xs"
              >Date: <span>{{ formatDate(item.creationDate) }}</span></span
            >
          </div>
        </div>
      </div>

      <!-- Action Buttons -->

      <div class="flex items-center space-x-4 text-sm text-gray-700">
        <div class="flex items-center space-x-2">
          <button
            @click="upvoteSubmisson(item.id)"
            class="focus:outline-none hover:text-orange-500 transition-all mr-2"
            :class="{
              'text-carrotOrange-400':
                item.userVote === 'upvote' || isUserUpvoted(item),
            }"
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
          <span class="text-gray-700">{{ item.votes.upvote.count || 0 }}</span>
        </div>

        <div class="flex items-center space-x-2">
          <button
            @click="downvoteSubmisson(item.id)"

            :class="{
              'text-red-400':
                item.userVote === 'downvote' || isUserDownvoted(item),
            }"
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

        <button @click="showFullText(item.id)" class="hover:text-blue-500 p-2">
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
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </button>

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
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { Actions } from '../Composables/actions'
  import Swal from 'sweetalert2'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '../../store/authStore' // Import useAuthStore
  const authStore = useAuthStore()

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
  // ! user local Storage instead
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
        }
      })
      .catch((e) => console.error('Error deleting submission:', e))
  }

  const { userdashboard, showFullText, upvote, downvote, deleteSubmission } =
    Actions()
</script>
