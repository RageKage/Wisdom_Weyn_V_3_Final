<template>
  <div v-if="displayedItems.length === 0" class="text-center">
    No results found.
  </div>
  <div
    v-if="!isLoading"
    class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start max-w-[1200px] mx-auto md:px-0"
  >
    <div
      v-for="item in displayedItems"
      :key="item.id"
      class="bg-white shadow-lg rounded-lg p-6"
    >
      <!-- Flex Container -->
      <div
        class="flex flex-row md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6"
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
            {{ item.showMeaning ? "Hide Meaning" : "See Meaning" }}
          </button>
          <p class="text-sm text-gray-500 mt-2">
            Submitted by:
            <span
              class="font-medium hover:underline hover:cursor-pointer"
              @click="userdashboard(item.submittedBy)"
              >{{ item.username }}</span
            >
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
                class="rounded-lg bg-blue-100 text-blue-600 p-2 hover:bg-blue200 hover:text-blue-700 transition-all duration-300 ml-2 mr-3"

              >
                Read
              </button>
              <!-- TODO ADD DELETE LOGIC -->
              <button
              @click="deleteSubmission(item)"
              class="rounded-lg bg-red-100 text-red-600 p-2 hover:bg-red-200 hover:text-red-700 transition-all duration-300 mr-4"
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
import { ref, onMounted } from "vue";
import { currentUser } from "@/service/auth.js";
// /Users/nimanahmed/VS_code/Project/final_wisdom_weyn/client/src/components/Composables/actions.js
import { Actions } from "../Composables/actions";

const props = defineProps({
  displayedItems: {
    type: Array,
    required: true,
  },
  activeFilter: {
    type: String,
    default: "",
  },
  isLoading: Boolean,
});

const isLoggedIn = ref(false);
const user = ref(null);

// TODO only users that are logged in can see the @click="deleteSubmission(item)" no other users should see this




const toggleMeaning = (item) => {
  item.showMeaning = !item.showMeaning;
};

// Format the date
const formatDate = (date) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString("en-US", options);
};

onMounted(async () => {
  try {
    isLoggedIn.value = (await currentUser()) !== null;
    user.value = await currentUser();
  } catch (error) {
    console.error("Error getting current user:", error);
  }
});

// we will now define what we are emitting to the parent
const emits = defineEmits(["loginRequired"]);

const upvoteSubmisson = (id) => {
  if (isLoggedIn.value) {
    upvote(id);
  } else {
    emits("loginRequired", id);
  }
};

const downvoteSubmisson = (id) => {
  if (isLoggedIn.value) {
    downvote;
  } else {
    emits("loginRequired", id);
  }
};



const { userdashboard, showFullText, upvote, downvote, deleteSubmission } = Actions();
</script>
