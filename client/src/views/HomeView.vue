<template>
  <div class="max-w-screen-lg mx-auto">
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
    <section class="grid md:grid-cols-2 gap-10 items-center mb-6 mt-6">
      <div>
        <h1
          data-aos="fade-up"
          data-aos-delay="400"
          data-aos-duration="900"
          class="text-3xl font-bold text-gray-800 mb-4"
        >
          Explore the richness of Somali culture
        </h1>
        <p
          data-aos="fade-up"
          data-aos-delay="200"
          data-aos-duration="900"
          class="text-gray-600 text-lg leading-relaxed"
        >
          Wisdom Weyn is a website that showcases and explains Somali poetry
          (Gabay) and proverbs (Maahmaahyo). These are the treasures of Somali
          culture that have been passed down for generations, reflecting the
          values, history, and identity of the Somali people.
        </p>
      </div>
      <div>
        <span class="rounded-3xl shadow-lg">
          <a
            :href="currentImage.source"
            target="_blank"
            data-aos="zoom-in"
            data-aos-delay="200"
          >
            <img
              :src="currentImage.src"
              alt="Art Image"
              class="object-cover rounded-3xl mx-auto shadow-lg border-4 border-seashell-50"
            />
          </a>

          <p
            data-aos="fade-up"
            data-aos-delay="200"
            class="text-center text-gray-600 text-sm leading-relaxed mt-2 mb-2 max-w-3xl mx-auto"
          >
            {{ currentImage.description }}
          </p>
        </span>
      </div>
    </section>

    <!-- Discover section -->
    <section class="mb-16 mt-16">
      <h1
        data-aos="fade-up"
        data-aos-delay="200"
        class="text-2xl font-semibold text-center text-gray-800 mt-6 mb-4"
      >
        Discover
      </h1>
      <p
        data-aos="fade-up"
        data-aos-delay="300"
        class="text-center text-gray-600 leading-relaxed mb-10 max-w-3xl mx-auto"
      >
        Discover Browse through the collections of poems and proverbs, each with
        its own story and interpretation. You can also submit your own poems and
        proverbs, or share your insights and feedback with other users.
      </p>

      <div class="flex justify-center space-x-6">
        <router-link
          to="/Collections"
          data-aos="fade-up"
          data-aos-delay="400"
          class="bg-saffron-500 hover:bg-saffron-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300"
        >
          Collections
        </router-link>
        <router-link
          to="/submissions/create"
          data-aos="fade-up"
          data-aos-delay="400"
          class="bg-carrotOrange-500 hover:bg-carrotOrange-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300"
        >
          Contribute
        </router-link>
      </div>
    </section>

    <!-- About section -->
    <section class="mb-16 mt-16">
      <h1
        data-aos="fade-down"
        data-aos-delay="200"
        class="text-2xl font-semibold text-center text-gray-800 mb-6"
      >
        About Wisdom Weyn
      </h1>
      <p class="text-center text-gray-600 leading-relaxed max-w-3xl mx-auto">
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
  </div>
</template>

<script setup>
  import { onMounted, ref } from 'vue'

  const options = [
    {
      src: '/src/assets/images/somali_art.jpeg',
      source: 'https://collections.artsmia.org/art/127170/exodus-aziz-osman',
      description: 'Exodus, 2004 by Aziz Osman Oil on canvas',
    },
    {
      src: '/src/assets/images/somali_art_2.jpeg',
      source: 'Source: Artist Name, Year',
      description: 'Description of the second image',
    },
    {
      src: '/src/assets/images/somali_art_3.jpeg',
      source: 'Source: Artist Name, Year',
      description: 'Description of the third image',
    },
    {
      src: '/src/assets/images/somali_art_4.jpeg',
      source: 'Source: Artist Name, Year',
      description: 'Description of the fourth image',
    },
    {
      src: '/src/assets/images/somali_art_5.jpeg',
      source: 'Source: Artist Name, Year',
      description: 'Description of the fifth image',
    },
    {
      src: '/src/assets/images/somali_art_6.jpeg',
      source: 'Source: Artist Name, Year',
      description: 'Description of the sixth image',
    },
    {
      src: '/src/assets/images/somali_art_7.jpeg',
      source: 'Source: Artist Name, Year',
      description: 'Description of the seventh image',
    },
    {
      src: '/src/assets/images/somali_art_8.jpeg',
      source: 'Source: Artist Name, Year',
      description: 'Description of the eighth image',
    },
  ]

  const currentImage = ref({})

  // show random pick each time the page refreshed
  const setRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * options.length)
    currentImage.value = options[randomIndex]
  }

  // show random pick each time the page refreshed
  onMounted(setRandomImage)
</script>
