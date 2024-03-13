<template>
  <div class="flex flex-col items-center justify-center">
    <Loader v-if="!data" />

    <div v-else class="w-full max-w-6xl">
      <!-- User Profile Section -->
      <section class="bg-white p-4 md:p-6 rounded-lg shadow-md mb-8">
        <div class="flex items-center mb-4 md:mb-0">
          <img
            :src="defaultPic"
            alt="Profile Picture"
            class="w-20 h-20 rounded-full mr-4"
          />
          <div
            class="flex flex-col justify-center md:items-start md:justify-start md:ml-4"
          >
            <h2 class="text-2xl font-bold md:text-3xl md:mb-2">
              {{ data.username }}
            </h2>
            <p
              class="text-gray-500 text-sm md:text-base font-light max-w-xs md:max-w-none"
            >
              <!-- BIO SOON -->
            </p>
          </div>
        </div>
      </section>

      <!-- User's Contributions Section -->
      <section class="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 class="text-xl font-bold mb-4 md:mb-6">Contributions Overview</h2>
        <div
          class="grid grid-cols-1 md:grid-cols-3 gap-6 md:grid-rows-1 md:grid-flow-col"
        >
          <div class="bg-white p-6 rounded-lg shadow-md">
            <p class="text-xl">
              {{ data.userStats ? data.userStats.totalSubmissions || 0 : 0 }}
            </p>
            <p class="text-md text-gray-500">Submissions</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-md">
            <p class="text-xl">
              {{ data.userStats ? data.userStats.proverbs || 0 : 0 }}
            </p>
            <p class="text-md text-gray-500">Proverbs</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-md">
            <p class="text-xl">
              {{ data.userStats ? data.userStats.poetrys || 0 : 0 }}
            </p>
            <p class="text-md text-gray-500">Poetry</p>
          </div>
        </div>
      </section>

      <!-- Top Contributions Section -->
      <section
        v-if="!noSubmissions"
        class="bg-white p-6 rounded-lg shadow-md mb-8"
      >
        <h2 class="text-xl font-bold mb-4 md:mb-6">Top Contributions</h2>
        <div
          v-if="data.mostVotes.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="submission in data.mostVotes"
            :key="submission.id"
            class="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between"
          >
            <p class="text-lg font-bold">
              {{ truncateString(submission.title || submission.content, 10) }}
            </p>
            <div class="flex justify-between items-center mt-2">
              <p class="text-gray-500">
                {{ submission.votes.upvote.count }} Upvotes
              </p>
              <button
                @click="showFullText(submission.id)"
                class="text-blue-500 hover:text-blue-600"
              >
                Read More
              </button>
            </div>
          </div>
        </div>
        <div v-else>
          <p class="text-md text-gray-500">
            No upvotes yet. Be the first to upvote their submissions.
          </p>
        </div>
      </section>

      <!-- Recent Activity Section -->
      <section class="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 class="text-xl font-bold mb-4 md:mb-6">Recent Activity</h2>
        <div
          v-if="data.mostRecent.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="submission in data.mostRecent"
            :key="submission.id"
            class="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between"
          >
            <p class="text-lg font-bold">
              {{ truncateString(submission.title || submission.content, 10) }}
            </p>
            <div class="flex justify-between items-center mt-2">
              <p class="text-gray-500">
                {{ readableDate(submission.creationDate) }}
              </p>
              <button
                @click="showFullText(submission.id)"
                class="text-blue-500 hover:text-blue-600"
              >
                Read More
              </button>
            </div>
          </div>
        </div>
        <div v-else>
          <p class="text-md text-gray-500">
            {{ data.username }} has not made any submissions yet.
          </p>
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

  const fetchData = async () => {
    try {
      data.value = await service.getuserDashBoardAPI(username.value)

      // Check if there are any submissions
      if (!data.value.mostRecent) {
        noSubmissions.value = true
      }
    } catch (error) {
      console.error('Error fetching item:', error)
    }
  }

  // Truncate text by words not characters
  const truncateString = (text, limit) => {
    if (!text) return '' // Return empty string if text is undefined

    if (text.length > limit) {
      return text.slice(0, limit) + '...'
    }
    return text
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
