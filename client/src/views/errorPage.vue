<template>
  <div
    class="bg-saffron-500 flex justify-center items-center fixed top-0 left-0 min-h-full min-w-full z-50"
  >
    <div class="text-center w-full max-w-md text-gray-600">
      <h1 class="text-6xl font-bold">404</h1>
      <p class="text-2xl font-semibold">Oops! Page not found.</p>
      <p class="mt-4">We can't seem to find the page you're looking for.</p>

      <div class="mt-4">
        <span class="">
          <!-- img -->
          <span class="">
            <a :href="currentImage.source" target="_blank">
              <img
                :src="currentImage.src"
                alt="Art Image"
                class="object-cover rounded-3xl mx-auto shadow-lg border-4"
              />
            </a>

            <p>{{ currentImage.description }}</p>
          </span>
        </span>
      </div>

      <div class="mt-6">
        <span
          @click="goback"
          class="bg-carrotOrange-400 px-4 py-2 rounded-2xl hover:bg-carrotOrange-500 flex items-center justify-between text-white cursor-pointer border-b-4 border-carrotOrange-500 transition-all duration-300 max-w-xl"
        >
          <span aria-hidden="true"> &larr;</span> <span> Go back </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'

  import somaliArt from '@/assets/images/somali_art.jpeg'
  import somaliArt2 from '@/assets/images/somali_art_2.jpeg'
  import somaliArt3 from '@/assets/images/somali_art_3.jpeg'
  import somaliArt4 from '@/assets/images/somali_art_4.jpeg'
  import somaliArt5 from '@/assets/images/somali_art_5.jpeg'
  import somaliArt6 from '@/assets/images/somali_art_6.jpeg'
  import somaliArt7 from '@/assets/images/somali_art_7.jpeg'
  import somaliArt8 from '@/assets/images/somali_art_8.jpeg'

  const router = useRouter()

  const goback = () => {
    router.go(-1)
  }

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
