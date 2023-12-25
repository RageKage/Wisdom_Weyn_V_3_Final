<template>
  <nav class="bg-white border-gray-200 dark:bg-gray-900">
    <div
      class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4"
    >
      <Logo class="flex items-center space-x-3 rtl:space-x-reverse" />

      <div
        class="relative flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse"
      >
        <div
          v-if="user"
          class="flex items-center space-x-3 sm:pr-4 md:pr-4 lg:pr-0"
        >
          <button
            @click="toggleDropdown"
            type="button"
            class="bg-custom-purple-600 p-1 rounded-full text-custom-gold-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-purple-500"
            id="user-menu-button"
          >
            <span class="sr-only">Open user menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-8 h-8 rounded-full"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </button>
        </div>
        <router-link
          v-else
          to="/signin"
          class="hidden lg:inline text-gray-900 hover:text-custom-purple-700"
        >
          Log in <span>&rarr;</span>
        </router-link>
        <!-- Dropdown menu -->
        <div
          v-show="dropdownOpen"
          class="z-50 absolute mt-2 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow-lg"
          id="user-dropdown"
          style="top: 100%; right: 0"
        >
          <div class="px-4 py-3">
            <span class="block text-sm text-gray-900">{{
              user?.displayName
            }}</span>
            <span class="block text-sm text-gray-500 truncate">{{
              user?.email
            }}</span>
          </div>
          <ul class="py-2" aria-labelledby="user-menu-button">
            <li>
              <a
                @click="closeDropdown"
                href="#"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >Dashboard</a
              >
            </li>
            <li>
              <a
                @click="closeDropdown"
                href="#"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >Settings</a
              >
            </li>
            <li>
              <a
                @click="closeDropdown"
                href="#"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >Earnings</a
              >
            </li>
            <li>
              <a
                @click="closeDropdown"
                href="#"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >Sign out</a
              >
            </li>
          </ul>
        </div>

        <div class="lg:hidden flex justify-between">
          <button
            @click="toggleMenu"
            class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-custom-gold-500 rounded-lg md:inline-flex lg:hidden hover:bg-custom-gold-100 focus:outline-none focus:ring-2 focus:ring-custom-gold-200"
          >
            <svg
              class="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
      </div>

      <div
        class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
        id="navbar-user"
      >
        <ul
          v-show="isMenuOpen || isLargeScreen"
          class="sm:hidden md:hidden lg:flex items-center space-x-6"
        >
          <li>
            <router-link
              to="/"
              class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-custom-purple-700 md:p-0"
              >Home</router-link
            >
          </li>
          <li>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </li>
          <li>
            <router-link
              to="/collections"
              class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-custom-purple-700 md:p-0"
              >Collections</router-link
            >
          </li>
          <li>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </li>
          <li>
            <router-link
              to="/SubmitProverb"
              class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-custom-purple-700 md:p-0"
              >Submit</router-link
            >
          </li>
          <li>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { defineProps, defineEmits, onMounted, ref, onUnmounted } from "vue";
import Logo from "./Logo.vue";
import { currentUser, getCurrentUser } from "@/service/auth.js";

const user = ref(null);
const dropdownOpen = ref(false);

// Props and Emits
const props = defineProps({
  isMenuOpen: Boolean,
  isLargeScreen: Boolean,
});
const emit = defineEmits(["toggleMenu"]); // this emmits the toggle menu

// show the dropdown menu
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

// close the dropdown menu
const closeDropdown = () => {
  dropdownOpen.value = false;
};
const toggleMenu = () => {
  emit("toggleMenu");
};

// this closes the dropdown menu when users clicks outside the dropdown menu
const onClickOutside = (event) => {
  if (
    !event.target.closest("#user-menu-button") &&
    !event.target.closest("#user-dropdown")
  ) {
    closeDropdown(); // Reuse closeDropdown for consistent behavior.
  }
};

onMounted(async () => {
  document.addEventListener("click", onClickOutside);

  try {
    const authUser = await currentUser();

    if (authUser) {
      // get the data in the user data, displayName is available in the authUser but not for if the account was created via email and password, 
      // also this is better encase the provider doesn't provide that data
      const dbUser = await getCurrentUser(authUser.uid);
      user.value = dbUser;
    }
  } catch (error) {
    console.error("Error getting current user:", error);
  }
});

onUnmounted(() => {
  document.removeEventListener("click", onClickOutside);
});
</script>

<style scoped>
.hamburger .line {
  display: block;
  width: 30px;
  height: 2px;
  background-color: #b794f4;
  margin: 5px 0;
  transition: transform 0.3s ease-in-out;
}

#hamburger-10.is-active {
  transform: rotate(90deg);
}

#hamburger-10.is-active .line:nth-child(1) {
  transform: translateY(10px) rotate(0deg);
}

#hamburger-10.is-active .line:nth-child(3) {
  transform: translateY(-10px) rotate(0deg);
}
</style>
