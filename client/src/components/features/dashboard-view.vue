<template>
  <div>
    <div
      class="min-h-full mx-auto flex items-center justify-center px-0 sm:rounded-lg sm:p-6 sm:max-w-[1100px] py-4"
      v-if="data"
    >
      <div class="p-6 w-full">
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-indigo-700">
            {{ data.displayName }} Contributions
          </h1>
        </div>

        <div class="grid grid-cols-3 gap-4 mb-6">
          <div class="p-4 bg-teal-200 rounded-md text-center">
            <p class="text-xl font-bold text-teal-800">
              {{ data.userStats ? data.userStats.totalSubmissions || 0 : 0 }}
            </p>
            <p class="text-sm text-teal-500">Submissions</p>
          </div>

          <div class="p-4 bg-purple-200 rounded-md text-center">
            <p class="text-xl font-bold text-purple-800">
              {{ data.userStats && data.userStats.proverbs ? data.userStats.proverbs : 0 }}
            </p>
            <p class="text-sm text-purple-500">Proverbs</p>
          </div>

          <div class="p-4 bg-yellow-200 rounded-md text-center">
            <p class="text-xl font-bold text-yellow-800">
              {{ data.userStats && data.userStats.Poetrys ? data.userStats.Poetrys : 0 }}
            </p>
            <p class="text-sm text-yellow-500">Poetry</p>
          </div>
        </div>
        <!-- check that  -->
        <div v-if="noSubmissions">
          <div class="mb-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold text-blue-600">
                Most Popular Submissions
              </h2>
              <!-- <span class="text-sm text-indigo-500 cursor-pointer">See All</span> -->
            </div>

            <div v-if="data.mostVotes.length > 0">
              <div
                v-for="submission in data.mostVotes"
                :key="submission.id"
                class="mb-4"
              >
                <div
                  class="rounded-lg bg-gray-100 text-gray-700 p-4 hover:text-gray-900 transition-all duration-300"
                >
                  <p class="text-sm mb-2">
                    {{
                      truncateText(submission.title || submission.content, 10)
                    }}
                  </p>

                  <div class="flex gap-2">
                    <div
                      class="py-1.5 px-3 text-custom-purple-500 text-center border rounded-md border-custom-purple-400 h-8 text-sm flex items-center gap-1 lg:gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        class="w-5 h-5 mr-1"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                        />
                      </svg>
                      <span>{{ submission.upvotes }}</span>
                    </div>
                  </div>

                  <div class="flex justify-between mt-2">
                    <button
                      class="text-sm text-gray-500 hover:text-gray-700 transition-all duration-300"
                      @click="showFullText(submission.id)"
                    >
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <p v-else class="text-sm text-gray-500">No submissions yet.</p>
          </div>

          <div>
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold text-blue-600">
                Most Recent Submissions
              </h2>
              <!-- <span class="text-sm text-indigo-500 cursor-pointer">See All</span> -->
            </div>

            <div v-if="data.mostRecent.length > 0">
              <div
                v-for="submission in data.mostRecent"
                :key="submission.id"
                class="mb-4"
              >
                <div
                  class="rounded-lg bg-gray-100 text-gray-700 p-4 hover:text-gray-900 transition-all duration-300"
                >
                  <p class="text-sm mb-2">
                    {{
                      truncateText(submission.title || submission.content, 10)
                    }}
                  </p>
                  <p class="text-xs text-gray-500">
                    Submitted on: {{ readableDate(submission.creationDate) }}
                  </p>
                  <div class="flex justify-between mt-2">
                    <button
                      class="text-sm text-gray-500 hover:text-gray-700 transition-all duration-300"
                      @click="showFullText(submission.id)"
                    >
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <p v-else class="text-sm text-gray-500">No submissions yet.</p>
          </div>
        </div>
        <div
          v-else
          class="rounded-lg bg-gray-100 text-gray-700 p-4 hover:text-gray-900 transition-all duration-300"
        >
          <div class="flex justify-center items-center">
            <p class="text-sm text-gray-500">No submissions yet.</p>
          </div>
        </div>
      </div>
      <!-- if the user uid makes that of the current user then we can show like 
      their submissions or maybe redirect them to a page that will just show that , 
      also I need to mode this current dashboard so if users uid matches it says Thank you -->
    </div>
    <div v-else>
      <Loader
        class="fixed top-0 left-0 w-full h-full flex justify-center items-center"
      ></Loader>
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

  const noSubmissions = ref(true)
  const id = computed(() => router.currentRoute.value.params.id)
  const data = ref(null)

  const fetchData = async () => {
    try {
      data.value = await service.getuserDashBoardAPI(id.value)

      // Check if there are any submissions
      if (!data.value.mostRecent) {
        noSubmissions.value = false
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
