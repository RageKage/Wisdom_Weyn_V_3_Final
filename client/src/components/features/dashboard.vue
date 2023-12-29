<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Niman Ahmed!</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium text-gray-900">Most Popular Posts</h3>
          <ul class="mt-3">
            <li
              v-for="post in popularPosts"
              :key="post.id"
              class="border-t border-gray-200 py-4"
            >
              <a :href="post.url" class="block hover:underline">
                {{ post.title }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium text-gray-900">Recent Posts</h3>
          <ul class="mt-3">
            <li
              v-for="post in recentPosts"
              :key="post.id"
              class="border-t border-gray-200 py-4"
            >
              <a :href="post.url" class="block hover:underline ">
                {{ post.title }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium text-gray-900">Your Stats</h3>
          <div class="mt-3">
            <div class="text-sm text-gray-500">
              <span class="font-medium text-gray-900">Proverbs:</span> 5
            </div>
            <div class="text-sm text-gray-500">
              <span class="font-medium text-gray-900">Collections:</span> 16
            </div>
          </div>
        </div>
      </div>

      <div
        v-for="component in otherDashboardComponents"
        :key="component.id"
        class="bg-white overflow-hidden shadow rounded-lg"
      >
        <div class="px-4 py-5 sm:p-6"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
const popularPosts = [
  { id: 1, title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { id: 2, title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { id: 3, title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { id: 4, title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { id: 5, title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
];

const recentPosts = [
  { id: 1, title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { id: 2, title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { id: 3, title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { id: 4, title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { id: 5, title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
];
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
}

.text-2xl {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.bg-white {
  background-color: #fff;
}

.overflow-hidden {
  overflow: hidden;
}

.shadow {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.rounded-lg {
  border-radius: 0.5rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-5 {
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
}

.text-lg {
  font-size: 1.125rem;
  font-weight: 600;
}

.text-gray-900 {
  color: #111827;
}

.mt-3 {
  margin-top: 0.75rem;
}

.text-sm {
  font-size: 0.875rem;
}

.text-gray-500 {
  color: #6b7280;
}

.font-medium {
  font-weight: 500;
}

.border-t {
  border-top-width: 1px;
}

.border-gray-200 {
  border-color: #e5e7eb;
}

.py-4 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.block {
  display: block;
}

.hover\:underline:hover {
  text-decoration: underline;
}
</style>
