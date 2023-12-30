<template>
  <div class="px-4 py-4">
    <MainNav
      :isMenuOpen="isMenuOpen"
      :isLargeScreen="isLargeScreen"
      @toggleMenu="toggleMenu"
    />
    <MobileNav :isMenuOpen="isMenuOpen" @updateMenu="updateMenu" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import MainNav from './MainNav.vue'
import MobileNav from './MobileNav.vue'

const isMenuOpen = ref(false)
const lgBreakpoint = 1024
const screenWidth = ref(window.innerWidth)

const isLargeScreen = computed(() => screenWidth.value >= lgBreakpoint)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const updateMenu = (status) => {
  isMenuOpen.value = status
}

const resizeListener = () => {
  screenWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', resizeListener)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeListener)
})
</script>
