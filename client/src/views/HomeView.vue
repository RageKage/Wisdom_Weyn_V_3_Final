<template>
  <div>
    <!-- Header section -->
    <section
      class="flex flex-col items-center justify-center h-96 md:h-128 lg:h-screen py-4 px-4 my-9 rounded-3xl bg-custom-purple-500 text-custom-gold-500"
    >
      <h2
        data-aos="fade-down"
        data-aos-delay="200"
        data-aos-duration="900"
        class="text-4xl md:text-6xl lg:text-8xl font-bold text-center"
      >
        Wisdom Weyn
      </h2>
    </section>

    <!-- Intro section -->
    <section
      class="flex flex-col items-center justify-center h-96 md:h-128 lg:h-screen py-4 px-4 my-9 rounded-3xl bg-custom-purple-500 text-custom-gold-500"
    >
      <h1
        data-aos="fade-up"
        data-aos-delay="400"
        data-aos-duration="900"
        class="text-2xl md:text-4xl lg:text-6xl mt-0 mb-4 font-bold text-center"
      >
        Explore the richness of Somali culture
      </h1>
      <p
        data-aos="fade-up"
        data-aos-delay="200"
        data-aos-duration="900"
        class="text-base md:text-lg lg:text-xl px-4 md:px-10 text-center"
      >
        Wisdom Weyn is a website that showcases and explains Somali poetry
        (Gabay) and proverbs (Maahmaahyo). These are the treasures of Somali
        culture that have been passed down for generations, reflecting the
        values, history, and identity of the Somali people.
      </p>
    </section>

    <!-- About section -->
    <section
      class="flex flex-col items-center justify-center h-96 md:h-128 lg:h-screen py-4 px-4 my-9 rounded-3xl bg-custom-purple-500 text-custom-gold-500"
    >
      <h1
        data-aos="fade-down"
        data-aos-delay="200"
        class="text-2xl md:text-4xl lg:text-6xl mt-0 mb-4 font-bold text-center"
      >
        About Wisdom Weyn
      </h1>
      <p class="text-base md:text-lg lg:text-xl px-4 md:px-10 text-center">
        <span data-aos="zoom-in" data-aos-delay="200">
          Wisdom Weyn began as a personal project to collect and document the
          poems and proverbs that I found on TikTok and other sources.
        </span>
        <span data-aos="zoom-in" data-aos-delay="400">
          I soon realized that many people were interested in learning more
          about these sayings and their meanings,
        </span>
        <span data-aos="zoom-in" data-aos-delay="600">
          so I decided to create a platform where anyone can access, contribute,
          and enjoy them.
        </span>
      </p>
    </section>

    <!-- Collections Section -->
    <section
      class="flex flex-col items-center justify-center h-96 md:h-128 lg:h-screen py-4 px-4 my-9 rounded-3xl bg-custom-purple-500 text-custom-gold-500"
    >
      <div>
        <h1
          data-aos="fade-up"
          data-aos-delay="200"
          class="text-2xl md:text-4xl lg:text-6xl mt-0 mb-4 font-bold text-center"
        >
          Discover
        </h1>
        <p
          data-aos="fade-up"
          data-aos-delay="300"
          class="text-base md:text-lg lg:text-xl px-4 md:px-10 text-center"
        >
          Discover Browse through the collections of poems and proverbs, each
          with its own story and interpretation. You can also submit your own
          poems and proverbs, or share your insights and feedback with other
          users.
        </p>
      </div>

      <div class="mt-8 flex flex-row justify-between">
        <router-link
          to="/Collections"
          data-aos="fade-up"
          data-aos-delay="400"
          class="mt-8 p-3 ml-2 rounded-full bg-custom-gold-500 text-custom-purple-900 text-lg font-bold shadow-lg transition duration-300 ease-in-out hover:bg-custom-gold-600 focus:outline-none focus:ring-2 focus:ring-custom-gold-600 focus:ring-opacity-50"
          style="box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1)"
        >
          View Collections
        </router-link>
        <router-link
          to="/submissions/create"
          data-aos="fade-up"
          data-aos-delay="400"
          class="mt-8 p-3 ml-2 rounded-full bg-custom-gold-500 text-custom-purple-900 text-lg font-bold shadow-lg transition duration-300 ease-in-out hover:bg-custom-gold-600 focus:outline-none focus:ring-2 focus:ring-custom-gold-600 focus:ring-opacity-50"
          style="box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1)"
        >
          Contribute
        </router-link>
      </div>
    </section>
  </div>
</template>
