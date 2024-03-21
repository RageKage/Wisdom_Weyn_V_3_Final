<template>
  <div class="container mx-auto p-4">
    <div>
      <!-- Error page ErrorMsg -->
      <div v-if="ErrorMsg" class="text-red-500 text-center">
        <div>
          <h1 class="text-4xl font-semibold text-center text-red-500 mt-8 mb-4">
            User not found
          </h1>
          <p class="text-lg text-center text-gray-600 mb-4">
            The user you are looking for does not exist or has been deleted.
          </p>
          <!-- go back to collections page -->
          <div class="flex justify-center">
            <router-link
              to="/collections"
              class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Go back to collections
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <Loader v-if="!data && !ErrorMsg" />
    <div v-else-if="data" class="max-w-3xl mx-auto mb-6">
      <section class="mb-6 p-4 bg-white rounded-lg shadow-md">
        <div class="flex items-center space-x-4">
          <div>
          
            <img
              v-if="data.photoURL"
              :src="data.photoURL"
              alt="User Photo"
              class="w-18 h-20 rounded-full object-cover border-2"
            />

            <img
              v-else
              :src="defaultPic"
              alt="User Photo"
              class="w-18 h-20 rounded-full object-cover border-2"
            />
          </div>
          <div>
            <h2 class="text-lg font-semibold">{{ data.username }}</h2>
            <p class="text-gray-600 text-sm">
              {{ data.bio }}
            </p>
            <!-- user Intrests -->
            <div class="mt-4">
              <div
                class="flex items-center justify-start flex-wrap text-gray-600"
              >
                <div
                  v-for="interest in data.interests"
                  :key="interest"
                  class="bg-orange-100 rounded-md text-center mr-2"
                >
                  <p class="text-orange-500 text-sm p-2">{{ interest }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="mb-6 p-4 bg-white rounded-lg shadow-md">
        <h2 class="text-lg font-semibold mb-4">Contributions Overview</h2>
        <div
          class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-center justify-between"
        >
          <div class="text-center border border-gray-300 rounded-md p-4">
            <p class="text-xl font-medium">
              {{ data.userStats ? data.userStats.totalSubmissions || 0 : 0 }}
            </p>
            <p class="text-gray-600">Submissions</p>
          </div>
          <div class="text-center border border-gray-300 rounded-md p-4">
            <p class="text-xl font-medium">
              {{ data.userStats ? data.userStats.proverbs || 0 : 0 }}
            </p>
            <p class="text-gray-600">Proverbs</p>
          </div>
          <div class="text-center border border-gray-300 rounded-md p-4">
            <p class="text-xl font-medium">
              {{ data.userStats ? data.userStats.poetrys || 0 : 0 }}
            </p>
            <p class="text-gray-600">Poetry</p>
          </div>
        </div>
      </section>

      <section
        v-if="!noSubmissions"
        class="mb-6 p-4 bg-white rounded-lg shadow-md"
      >
        <h2>Top Contributions</h2>
        <div v-if="data.mostVotes.length > 0" class="mt-4">
          <div
            v-for="submission in data.mostVotes"
            :key="submission.id"
            class="mb-6 border-b-2 p-2"
          >
            <p class="text-gray-600">
              {{ truncateString(submission.title || submission.content, 8) }}
            </p>

            <div
              class="flex items-center justify-between mt-2 text-gray-600 space-x-4"
            >
              <p>{{ submission.votes.upvote.count }} Upvotes</p>
              <button
                @click="showFullText(submission.id)"
                class="text-blue-500 hover:underline"
              >
                Read More
              </button>
            </div>
          </div>
        </div>
        <div v-else>
          <p>No top contributions yet.</p>
        </div>
      </section>

      <section class="mb-6 p-4 bg-white rounded-lg shadow-md">
        <h2>Recent Activity</h2>
        <div v-if="data.mostRecent.length > 0" class="mt-4">
          <div
            v-for="submission in data.mostRecent"
            :key="submission.id"
            class="mb-6 border-b-2 p-2"
          >
            <p class="text-gray-600">
              {{ truncateString(submission.title || submission.content, 8) }}
            </p>
            <div
              class="flex items-center justify-between mt-2 text-gray-600 space-x-4"
            >
              <p>{{ readableDate(submission.creationDate) }}</p>
              <button
                @click="showFullText(submission.id)"
                class="text-blue-500 hover:underline"
              >
                Read More
              </button>
            </div>
          </div>
        </div>
        <div v-else>
          <p>No recent activity yet.</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
  import { ref, watch, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import AppApiService from '../../service/index'
  import { Actions } from '../Composables/actions'
  import Loader from '@/assets/app-loader.vue'
  import defaultPic from '@/assets/defaultprofilePic.svg'

  // Service
  const service = AppApiService()
  const router = useRouter()

  const noSubmissions = ref(false)
  const username = computed(() => router.currentRoute.value.params.username)
  const data = ref(null)

  const ErrorMsg = ref('')

  const fetchData = async () => {
    try {
      data.value = await service.getuserDashBoardAPI(username.value)

      // Check if there are any submissions
      if (!data.value.mostRecent) {
        noSubmissions.value = true
      }
    } catch (error) {
      console.error('Error fetching item:', error)
      ErrorMsg.value = error
    }
  }

  // Truncate the text by words
  const truncateString = (text, limit) => {
    const normalizedText = text.replace(/\s+/g, ' ')

    const words = normalizedText.split(' ')

    if (words.length <= limit) {
      return words.join(' ')
    }

    const truncatedWords = words.slice(0, limit)

    return truncatedWords.join(' ') + '...'
  }

  // Format the date
  const readableDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(date).toLocaleDateString('en-US', options)
  }

  // Fetch data when the username changes, which happens when the route changes
  watch(username, () => {
    fetchData()
  })

  const { showFullText } = Actions()
  onMounted(fetchData)
</script>
