<template>
  <div data-theme="light">
    <siteNavigation v-if="showHeader" />

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" class="px-4 sm:px-5 max-w-full mx-auto sm:max-w-[1500px] py-4" />
      </transition>
    </router-view>
  </div>
</template>


<script setup>
import { ref, provide } from "vue";
import siteNavigation from "./components/nav/SiteNavigation.vue";
import { showHeader } from "@/router";
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Lora&display=swap");

body {
  font-family: "Lora", serif;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

/* animation between pages */
.fade-enter-active,
.fade-leave-active {
  animation-duration: 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to {
  animation-name: fadeIn;
}

.fade-leave-from {
  animation-name: fadeOut;
}
</style>
