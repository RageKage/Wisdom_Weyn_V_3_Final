<template>
  <router-link
    to="/"
    class="text-3xl font-bold leading-none hover-img"
    active-class="active-img"
  >
    <img
      src="@/assets/images/Wisdom_weyn.svg"
      class="h-6 md:h-8 lg:h-10 hover-img"
      alt="Wisdom Weyn"
      style="stroke: black; fill: none"
    />
  </router-link>
</template>

<style>
  /* icon animations on hover */
  .hover-img {
    transition: all 0.2s ease-in-out;
  }
  .hover-img:hover {
    transform: scale(1.1);
  }

  /* active class for router-link */
</style>
