<template>
    <div>
      <!-- Header section -->
      <section
        class="flex flex-col items-center justify-center h-96 md:h-96 lg:h-screen py-4 px-4 my-9 rounded-3xl bg-custom-purple-500 text-custom-gold-500"
      >
        <h2
          data-aos="fade-down"
          data-aos-delay="200"
          data-aos-duration="900"
          class="text-5xl md:text-1xl sm:text-8xl font-bold text-center"
        >
          Wisdom Weyn
        </h2>
      </section>
  
      <!-- Intro section -->
      <section
        class="flex flex-col items-center justify-center h-96 md:h-96 lg:h-screen py-4 px-4 my-9 rounded-3xl bg-custom-purple-500 text-custom-gold-500"
      >
        <h1
          data-aos="fade-up"
          data-aos-delay="400"
          data-aos-duration="900"
          class="text-3xl mt-0 mb-4 md:text-1xl sm:text-4xl font-bold text-center"
        >
          Explore the richness of Somali culture
        </h1>
        <p
          data-aos="fade-up"
          data-aos-delay="200"
          data-aos-duration="900"
          class="text-xl px-10 md:text-3xl text-center"
        >
          Discover a collection of Poetry (Gabay) and proverbs (Maahmaahyo)
          submitted by users, each enhanced with user-contributed meanings and
          insights.
        </p>
      </section>
  
      <!-- About section -->
      <section
        class="flex flex-col items-center justify-center min-h-96 md:min-h-96 lg:min-h-screen py-4 md:px-10 px-4 my-9 rounded-3xl bg-custom-purple-500 text-custom-gold-500"
      >
        <h1
          data-aos="fade-down"
          data-aos-delay="200"
          class="text-3xl mt-0 mb-4 md:text-1xl sm:text-4xl font-bold text-center"
        >
          About Wisdom Weyn
        </h1>
        <p class="text-xl px-10 md:text-3xl text-center">
          <span data-aos="zoom-in" data-aos-delay="200"
            >Wisdom Weyn began as my personal journal to document motivational
            Somali poetry and proverbs from TikTok and others.</span
          ><span data-aos="zoom-in" data-aos-delay="400"
            >Often, searching for these sayings led to dead ends, and remembering
            them was hard.</span
          >
          <span data-aos="zoom-in" data-aos-delay="600">
            To make it easier for anyone to access and appreciate this cultural
            wisdom, I created a place to not only preserve but also explain
            them.</span
          >
        </p>
      </section>
  
      <!-- Collections Section -->
      <section
        class="flex flex-col items-center justify-center h-96 md:h-96 lg:h-screen py-4 px-4 my-9 rounded-3xl bg-custom-purple-500 text-custom-gold-500"
      >
        <h1
          data-aos="fade-up"
          data-aos-delay="200"
          class="text-3xl mt-0 mb-4 md:text-1xl sm:text-4xl font-bold text-center"
        >
          Discover
        </h1>
        <p
          data-aos="fade-up"
          data-aos-delay="300"
          class="text-xl px-10 md:text-3xl text-center"
        >
          Explore proverbs and Gabay, each with its story and meaning, in
          collections.
        </p>
        <router-link
          to="/Collections"
          data-aos="fade-up"
          data-aos-delay="400"
          class="mt-8 bg-custom-gold-500 text-custom-purple-900 px-8 py-3 rounded-full text-lg font-bold shadow-lg transition duration-300 ease-in-out hover:bg-custom-gold-600 focus:outline-none focus:ring-2 focus:ring-custom-gold-600 focus:ring-opacity-50"
          style="box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1)"
        >
          View Collections
        </router-link>
      </section>
    </div>
  </template>
  