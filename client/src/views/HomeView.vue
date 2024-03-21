<template>
  <div
    class="py-4 px-4 mt-4 mb-4 flex flex-col items-center justify-center min-h-screen rounded-3xl bg-saffron-500"
  >
    <!-- Header section -->
    <section class="flex flex-col items-center justify-center min-h-screen">
      <h2
        class="text-4xl md:text-6xl lg:text-8xl font-bold text-seashell-900"
        v-motion
        :initial="{ opacity: 0, y: 100 }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: { type: 'spring', stiffness: '100', delay: 100 },
        }"
      >
        Wisdom Weyn
      </h2>
      <p
        class="text-md lg:text-xl font-bold text-seashell-900"
        v-motion
        :initial="{ opacity: 0, y: 100 }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: { type: 'spring', stiffness: '100', delay: 300 },
        }"
      >
        Gabay & Maahmaahyo
      </p>
    </section>

    <!-- Intro section -->
    <section
      class="intro-section grid md:grid-cols-2 gap-10 items-center mb-6 mt-6 rounded-3xl bg-seashell-50 p-8"
    >
      <div
        class="text-center"
        data-aos="fade-right"
        data-aos-offset="300"
        data-aos-easing="ease-in-sine"
      >
        <h1
          class="text-2xl md:text-4xl lg:text-4xl font-semibold text-seashell-900 mt-6 mb-4"
        >
          What is Wisdom Weyn?
        </h1>
        <p class="text-seashell-900 leading-relaxed mb-6">
          Wisdom Weyn is a website that showcases and explains Somali Poetry
          (Gabay) and Proverbs (Maahmaahyo). These are the treasures of Somali
          culture that have been passed down for generations, reflecting the
          values, history, and identity of the Somali people.
        </p>
      </div>
      <div class="text-center" data-aos="zoom-in" data-aos-delay="500">
        <a :href="currentImage.source" target="_blank">
          <img
            :src="currentImage.src"
            alt="Art Image"
            class="object-cover rounded-3xl mx-auto shadow-lg"
          />
        </a>
        <p
          class="text-seashell-900 text-sm leading-relaxed mb-6 max-w-3xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="700"
        >
          {{ currentImage.description }}
        </p>
      </div>
    </section>

    <section
      class="flex flex-col items-center justify-center mb-6 mt-6 rounded-3xl bg-coolGray-50 py-8 px-4"
    >
      <h1
        data-aos="fade-down"
        data-aos-delay="100"
        class="text-2xl md:text-4xl lg:text-4xl font-semibold text-center text-seashell-900 mt-6 mb-4"
      >
        Discover Wisdom Weyn
      </h1>
      <p
        class="text-center text-seashell-900 leading-relaxed mb-10 max-w-3xl mx-auto"
      >
        <span data-aos="zoom-in" data-aos-delay="300">
          Browse through the collections of poems and Proverbs, each with its
          own story and interpretation.
        </span>
        <span data-aos="zoom-in" data-aos-delay="500">
          You can also submit your own poems and Proverbs, or share your
          insights and feedback with other users.
        </span>
      </p>

      <div
        class="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8"
        data-aos="fade-up"
        data-aos-delay="700"
      >
        <router-link
          to="/collections"
          class="bg-saffron-300 px-4 py-2 rounded-2xl hover:bg-saffron-400 flex items-center cursor-pointer border-b-4 border-saffron-400 text-seashell-800 transition-all duration-300"
          >Contribute to Wisdom Weyn
        </router-link>
        <router-link
          to="/submissions/create"
          class="bg-saffron-300 px-4 py-2 rounded-2xl hover:bg-saffron-400 flex items-center cursor-pointer border-b-4 border-saffron-400 text-seashell-800 transition-all duration-300"
          >Check out the Collections
        </router-link>
      </div>
    </section>

    <!-- About section -->
    <section
      class="flex flex-col items-center justify-center mb-6 mt-6 rounded-3xl bg-coolGray-50 py-8 px-4"
    >
      <h1
        data-aos="fade-down"
        data-aos-delay="100"
        class="text-2xl md:text-4xl lg:text-4xl font-semibold text-center text-seashell-900 mt-6 mb-4"
      >
        About Wisdom Weyn
      </h1>
      <p
        class="text-center text-seashell-900 leading-relaxed mb-10 max-w-3xl mx-auto"
      >
        <span data-aos="zoom-in" data-aos-delay="300">
          Wisdom Weyn began as my way of saving all the insightful Poems and
          Proverbs I discovered on TikTok and other places.
        </span>
        <span data-aos="zoom-in" data-aos-delay="500">
          Since lots of people seemed interested,so I figured – why not make a
          space where we can all share them and learn what they mean?
        </span>
      </p>
    </section>
  </div>
</template>

<script setup>
  import { onMounted, ref } from 'vue'

  import somaliArt from '@/assets/images/somali_art.jpeg'
  import somaliArt2 from '@/assets/images/somali_art_2.jpeg'
  import somaliArt3 from '@/assets/images/somali_art_3.jpeg'
  import somaliArt4 from '@/assets/images/somali_art_4.jpeg'
  import somaliArt5 from '@/assets/images/somali_art_5.jpeg'
  import somaliArt6 from '@/assets/images/somali_art_6.jpeg'
  import somaliArt7 from '@/assets/images/somali_art_7.jpeg'
  import somaliArt8 from '@/assets/images/somali_art_8.jpeg'

  const options = [
    {
      src: somaliArt,
      source: 'https://collections.artsmia.org/art/127170/exodus-aziz-osman',
      description: 'Exodus, 2004 by Aziz Osman',
    },
    {
      src: somaliArt2,
      source: 'https://www.arabnews.com/node/1870281/lifestyle',
      description: 'Jandheer Dance, 2016 by Aziz Osman',
    },
    {
      src: somaliArt3,
      source: 'https://www.pinterest.com/pin/180988478748598445/',
      description: 'Reer Guuraa aka Nomads, source unknown',
    },
    {
      src: somaliArt4,
      source: 'https://halgankiixisbigasyl.wordpress.com/2015/04/29/538/r',
      description: 'Sheikh Abukar, 1954',
    },
    {
      src: somaliArt5,
      source:
        'https://www.somalispot.com/threads/somali-painting-thread.22639/',
      description: 'Somali Women, 1926, source unknown',
    },
    {
      src: somaliArt6,
      source: 'Source: Artist Name, Year',
      description: 'Concerto di Madame, 1930 by Milo Corso Malverna',
    },
    {
      src: somaliArt7,
      source:
        'https://somaliwomen.tumblr.com/post/59448886489/the-first-painting-is-by-amin-amir-the-last-three',
      description: 'Untitled, by Madaar Osmans',
    },

    {
      src: somaliArt8,
      source: 'https://www.flickr.com/photos/clairity/30582975007/',
      description: 'Moving, 2016 by Aziz Osman',
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
