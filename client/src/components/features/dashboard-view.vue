<template>
  <div>
    <Loader v-if="!data" />

    <div
      v-else
      class="mx-auto max-w-3xl px-4 sm:px-6 md:px-8 py-10 bg-white shadow rounded-3xl"
    >
      <h1
        class="text-xl font-semibold pb-12 flex flex-col items-center justify-center"
      >
        {{ data.username }}'s Contributions
      </h1>
      
      <!-- User's Contributions Section -->
      <section class="pb-4">
        <div class="grid grid-cols-3 gap-4 border-b border-gray-200 pb-4">
          <div
            class="text-center border-r border-gray-200 pr-4 flex flex-col justify-center"
          >
            <p class="text-2xl font-bold text-indigo-600">
              {{ data.userStats ? data.userStats.totalSubmissions || 0 : 0 }}
            </p>
            <p class="text-sm text-gray-600">Submissions</p>
          </div>

          <div
            class="text-center border-r border-gray-200 pr-4 flex flex-col justify-center"
          >
            <p class="text-2xl font-bold text-indigo-600">
              {{
                data.userStats && data.userStats.proverbs
                  ? data.userStats.proverbs
                  : 0
              }}
            </p>
            <p class="text-sm text-gray-600">Proverbs</p>
          </div>

          <div class="text-center">
            <p class="text-2xl font-bold text-indigo-600">
              {{
                data.userStats && data.userStats.Poetrys
                  ? data.userStats.Poetrys
                  : 0
              }}
            </p>
            <p class="text-sm text-gray-600">Poetry</p>
          </div>
        </div>
      </section>

      <!-- Top Contributions Section -->
      <section v-if="!noSubmissions" class="mt-10">
        <h2 class="font-semibold text-lg">Top Contributions</h2>
        <div v-if="data.mostVotes.length > 0" class="mt-6">
          <div
            v-for="submission in data.mostVotes"
            :key="submission.id"
            class="p-2 border-b border-gray-200"
          >
            <p>
              {{ truncateText(submission.title || submission.content, 10) }}
            </p>
            <div class="flex justify-between items-center mt-2">
              <div class="flex items-center">
                <span class="text-sm font-semibold mr-2">{{
                  submission.votes.upvote.count
                }}</span>
                <span class="text-sm text-gray-600">Upvotes</span>
              </div>
              <button
                @click="showFullText(submission.id)"
                class="text-indigo-600 hover:text-indigo-800 text-sm"
              >
                Read More
              </button>
            </div>
          </div>
        </div>
        <div v-else class="text-center mt-6">
          <h2 class="text-lg font-semibold">
            {{ data.username }} has not received any upvotes yet. Be the first
            to upvote their submissions.
          </h2>
        </div>
      </section>

      <!-- Recent Activity Section -->
      <section class="mt-10">
        <h2 class="font-semibold text-lg">Recent Activity</h2>
        <div v-if="data.mostRecent.length > 0" class="mt-6">
          <div
            v-for="submission in data.mostRecent"
            :key="submission.id"
            class="p-2 border-b border-gray-200"
          >
            <p>
              {{ truncateText(submission.title || submission.content, 10) }}
            </p>
            <p class="text-sm text-gray-600">
              {{ readableDate(submission.creationDate) }}
            </p>
            <div class="text-right">
              <button
                @click="showFullText(submission.id)"
                class="text-indigo-600 hover:text-indigo-800 text-sm"
              >
                Read More
              </button>
            </div>
          </div>
        </div>
        <div v-else class="text-center mt-6">
          <h2 class="text-lg font-semibold">
            {{ data.username }} has not made any submissions yet.
          </h2>
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

  // Service
  const service = AppApiService()
  const router = useRouter()

  const noSubmissions = ref(false)
  const id = computed(() => router.currentRoute.value.params.id)
  const data = ref(null)

  const fetchData = async () => {
    try {
      data.value = await service.getuserDashBoardAPI(id.value)

      // Check if there are any submissions
      if (!data.value.mostRecent) {
        noSubmissions.value = true
      }
    } catch (error) {
      console.error('Error fetching item:', error)
    }
  }

  // Truncate text by words not characters
  const truncateText = (text, limit) => {
    text = text.trim()
    const words = text.split(' ')

    if (words.length <= limit) {
      return text
    }

    const truncatedText = words.slice(0, limit).join(' ')

    return truncatedText + '...'
  }

  // Format the date
  const readableDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(date).toLocaleDateString('en-US', options)
  }

  // Fetch data when the id changes, which happens when the route changes
  watch(id, () => {
    fetchData()
  })

  const { showFullText } = Actions()
  onMounted(fetchData)
</script>
