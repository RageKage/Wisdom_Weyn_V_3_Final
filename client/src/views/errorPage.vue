<template>
  <div class="min-h-screen w-screen flex items-center justify-center">
    <div
      class="text-center p-8 rounded-3xl shadow-md w-full max-w-md bg-seashell-50"
    >
      <h1 class="text-6xl font-bold text-gray-800">404</h1>
      <p class="text-2xl font-semibold text-gray-600">Oops! Page not found.</p>
      <p class="mt-4 text-gray-600">
        We can't seem to find the page you're looking for.
      </p>

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
          class="text-sm font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
        >
          <span aria-hidden="true"> &larr;</span> Go back
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const goback = () => {
    router.go(-1)
  }

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
