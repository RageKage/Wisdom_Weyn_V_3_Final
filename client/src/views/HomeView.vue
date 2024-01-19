<template>
  <div>
    <!-- Header section -->

    <section
      class="flex flex-col items-center justify-center min-h-screen py-4 px-4 my-9 rounded-3xl bg-saffron-500"
    >
      <h2
        data-aos="fade-down"
        data-aos-delay="200"
        data-aos-duration="900"
        class="text-4xl md:text-6xl lg:text-8xl font-bold text-center text-seashell-900"
      >
        Wisdom Weyn
      </h2>
    </section>

    <!-- Intro section -->
    <!-- Intro section -->

    <section
      class="flex flex-col items-center justify-center min-h-screen py-4 px-4 my-9 rounded-3xl bg-redDamask-500"
    >
      <div
        class="grid grid-cols-1 md:grid-cols-2 items-center justify-center py-4 px-4 my-9 rounded-3xl"
      >
        <div
          class="flex flex-col items-center justify-center text-center text-seashell-900"
        >
          <h1
            data-aos="fade-up"
            data-aos-delay="400"
            data-aos-duration="900"
            class="text-2xl md:text-4xl lg:text-6xl mt-0 mb-4 font-bold"
          >
            Explore the richness of Somali culture
          </h1>
          <p
            data-aos="fade-up"
            data-aos-delay="200"
            data-aos-duration="900"
            class="text-base md:text-lg lg:text-xl px-4 md:px-10"
          >
            Wisdom Weyn is a website that showcases and explains Somali poetry
            (Gabay) and proverbs (Maahmaahyo). These are the treasures of Somali
            culture that have been passed down for generations, reflecting the
            values, history, and identity of the Somali people.
          </p>
        </div>
        <div class="flex items-center justify-center">
          <a
            href="https://collections.artsmia.org/art/127170/exodus-aziz-osman"
            target="_blank"
            class="mt-8 hover:opacity-90 transition duration-300 ease-in-out"
          >
            <img
              src="../assets/images/somali_art.jpeg"
              alt="Exodus, 2004 by Aziz Osman"
              class="h-auto w-screen-full rounded-lg shadow-lg mt-6"
            />

            <p
              data-aos="fade-up"
              data-aos-delay="200"
              class="text-base md:text-lg lg:text-xl px-4 md:px-10 text-center text-seashell-900"
            >
              <span data-aos="zoom-in" data-aos-delay="200">
                Image: Exodus, 2004 by Aziz Osman
              </span>
              <span data-aos="zoom-in" data-aos-delay="400">
                Oil on canvas
              </span>
            </p>
          </a>
        </div>
      </div>
    </section>

    <!-- About section -->
    <section
      class="flex flex-col items-center justify-center min-h-screen py-4 px-4 my-9 rounded-3xl bg-redDamask-500"
    >
      <h1
        data-aos="fade-down"
        data-aos-delay="200"
        class="text-2xl md:text-4xl lg:text-6xl mt-0 mb-4 font-bold text-center text-seashell-900"
      >
        About Wisdom Weyn
      </h1>
      <p
        class="text-base md:text-lg lg:text-xl px-4 md:px-10 text-center text-seashell-900"
      >
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

    <section
      class="flex flex-col items-center justify-center min-h-screen py-4 px-4 my-9 rounded-3xl bg-cinnabar-500"
    >
      <div>
        <h1
          data-aos="fade-up"
          data-aos-delay="200"
          class="text-2xl md:text-4xl lg:text-6xl mt-0 mb-4 font-bold text-center text-seashell-900"
        >
          Discover
        </h1>
        <p
          data-aos="fade-up"
          data-aos-delay="300"
          class="text-base md:text-lg lg:text-xl px-4 md:px-10 text-center text-seashell-900"
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
          class="mt-8 p-2 md:p-3 ml-2 rounded-full bg-saffron-500 text-seashell-900 text-sm md:text-lg font-bold shadow-lg transition duration-300 ease-in-out hover:bg-saffron-600 focus:outline-none focus:ring-2 focus:ring-opacity-50"
          style="box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1)"
        >
          View Collections
        </router-link>
        <router-link
          to="/submissions/create"
          data-aos="fade-up"
          data-aos-delay="400"
          class="mt-8 p-2 md:p-3 ml-2 rounded-full bg-saffron-500 text-seashell-900 text-sm md:text-lg font-bold shadow-lg transition duration-300 ease-in-out hover:bg-saffron-600 focus:outline-none focus:ring-2 focus:ring-opacity-50"
          style="box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1)"
        >
          Contribute
        </router-link>
      </div>
    </section>
  </div>
</template>
