<template>
  <router-link 
    to="/"
    class="text-3xl font-bold leading-none hover-img"
    active-class="active-img"
  >
    <img
      src="@/assets/images/Wisdom_weyn.svg"
      class="h-12 md:h-16 lg:h-20 hover-img-scale hover-spin"
      alt="Wisdom Weyn"
    />
  </router-link>
</template>

<style>
.hover-spin:hover {
  transform: rotate(360deg);
  transition: transform 0.6s ease-in-out;
}

.hover-spin {
  transition: transform 0.6s ease-in-out;

}
</style>
