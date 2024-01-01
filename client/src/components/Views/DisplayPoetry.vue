<template>
  <div
    class="container px-4 bg-white shadow rounded-lg p-6 sm:px-5 max-w-full mx-auto sm:max-w-[800px] py-4 m-4"
    v-if="item"
  >
    <div class="flex flex-col space-y-4">
      <div class="flex flex-col items-start">
        <h2 class="text-xl font-bold text-custom-purple-600 mb-2">
          {{ item.title }}
        </h2>

        <div class="text-gray-700 text-lg leading-relaxed">
          {{ item.content }}
        </div>

        <div
          role="alert"
          class="mt-2 p-2 bg-custom-purple-100 text-custom-purple-600 rounded"
        >
          <span>{{ item.meaning }}</span>
        </div>

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

        <div class="flex items-center mt-4 w-full justify-between">
          <div>
            <button
              @click="upvoteSubmisson(item.id)"
              class="rounded-lg bg-custom-purple-100 text-custom-purple-600 p-2 hover:bg-custom-purple-200 hover:text-custom-purple-700 transition-all duration-300 mr-4"
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
                  d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                />
              </svg>
            </button>

            <span class="text-gray-700">{{ item.upvotes }}</span>
            <button
              @click="downvoteSubmisson(item.id)"
              class="rounded-lg bg-red-100 text-red-600 p-2 hover:bg-red-200 hover:text-red-700 transition-all duration-300 ml-4 mr-4"
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
                  d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54"
                />
              </svg>
            </button>

            <span class="text-gray-700">{{ item.downvotes }}</span>
          </div>
          <div>
            <button
              @click="ShareToTwitter(item)"
              class="text-custom-gold-600 hover:text-custom-gold-700 transition p-2 rounded-full bg-custom-gold-100 ml-4 mr-4"
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
                  d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                />
              </svg>
            </button>
            <!-- TODO soon to be added -->

            <button
              class="rounded-lg bg-custom-purple-100 text-custom-purple-600 p-2 hover:bg-custom-purple-200 hover:text-custom-purple-700 transition-all duration-300 mr-4"
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
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                />
              </svg>
            </button>
            <!-- TODO soon to be added -->
            <button
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import AppApiService from "../../service/index";
import { Actions } from "../Composables/actions";
import { currentUser } from "@/service/auth.js";
import Swal from "sweetalert2";

const service = AppApiService();
const router = useRouter();

const itemId = computed(() => router.currentRoute.value.params.id);
const item = ref(null);

const fetchItem = async () => {
  try {
    item.value = await service.getSubmission(itemId.value);
  } catch (error) {
    console.error("Error fetching item:", error);
  }
};

// Format the date
const formatDate = (date) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString("en-US", options);
};

const isLoggedIn = ref(false);

onMounted(async () => {
  try {
    isLoggedIn.value = (await currentUser()) !== null;
  } catch (error) {
    console.error("Error getting current user:", error);
  }
});

const upvoteSubmisson = (id) => {
  if (isLoggedIn.value) {
    upvote(id);
  } else {
    Swal.fire({
      title: "Login Required",
      text: "You must be logged in to vote on collections!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Login",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        popup: "flex flex-col space-y-4",
        header: "flex items-center justify-between w-full",
        closeButton: "text-gray-400 hover:text-gray-500 ml-auto",
        content: "text-gray-700 prose",
        actions: "flex justify-end gap-4 mt-4",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Redirect to login page
        window.location.href = "/signin";
      }
    });
  }
};

const downvoteSubmisson = (id) => {
  if (isLoggedIn.value) {
    upvote(id);
  } else {
    Swal.fire({
      title: "Login Required",
      text: "You must be logged in to vote on collections!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Login",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        popup: "flex flex-col space-y-4",
        header: "flex items-center justify-between w-full",
        closeButton: "text-gray-400 hover:text-gray-500 ml-auto",
        content: "text-gray-700 prose",
        actions: "flex justify-end gap-4 mt-4",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Redirect to login page
        window.location.href = "/signin";
      }
    });
  }
};

// eslint-disable-next-line no-unused-vars
const { upvote, downvote, ShareToTwitter, userdashboard } = Actions();

onMounted(fetchItem);
</script>
