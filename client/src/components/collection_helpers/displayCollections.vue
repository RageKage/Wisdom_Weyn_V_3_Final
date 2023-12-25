<template>
    <div v-if="displayedItems.length === 0" class="text-center">
      No results found.
    </div>
    <div
      v-if="!isLoading"
      class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start max-w-[1200px] mx-auto  md:px-0"
    >
      <div
        v-for="item in displayedItems"
        :key="item.id"
        class="bg-white shadow rounded-lg p-6"
      >
        <!-- Flex Container -->
        <div
          class="flex flex-row md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6"
        >
          <div class="flex-1">
            <div class="flex flex-row flex-nowrap justify-between items-center">
              <div class="pr-2">
                <h2
                  v-if="item.title"
                  class="text-xl font-bold text-custom-purple-600 mb-2"
                >
                  {{ item.title || item.proverb }}
                </h2>
                <p class="text-gray-700">
                  {{ item.content }}
                </p>
              </div>
  
              <!-- Share Button -->
              <button
                @click="ShareToTwitter(item)"
                class="text-custom-gold-600 hover:text-custom-gold-700 transition p-2 rounded-full bg-custom-gold-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                  />
                </svg>
              </button>
            </div>
  
            <div
              role="alert"
              v-show="item.showMeaning"
              class="mt-2 p-2 bg-custom-purple-100 text-custom-purple-600 rounded"
            >
              <span>{{ item.meaning }}</span>
            </div>
            <button
              @click="toggleMeaning(item)"
              class="mt-2 text-custom-purple-600 hover:text-custom-purple-700 transition"
            >
              {{ item.showMeaning ? "Hide Meaning" : "See Meaning" }}
            </button>
            <p class="text-sm text-gray-500 mt-2">
              Submitted by: <span class="font-medium">{{ item.username }}</span>
            </p>
  
            <p class="text-sm text-gray-500">
              Date Added:
              <span class="font-medium">{{ formatDate(item.creationDate) }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, ref } from "vue";
  
  const props = defineProps({
    displayedItems: {
      type: Array,
      required: true,
    },
    activeFilter: {
      type: String,
      default: "",
    },
    isLoading: Boolean,
  });
  
  const toggleMeaning = (item) => {
    item.showMeaning = !item.showMeaning;
  };
  const formatDate = (date) => {
    // Format the date
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  };
  
  const ShareToTwitter = (item) => {
    const itemType = item.title ? "poem" : "proverb";
    const textToShare = item.title || item.content;
    let tweetText = `Check out this ${itemType}: "${textToShare}"`;
  
    const viaText = " - via [YourAppName]";
    const websiteLink = "https://www.yourwebsite.com"; // Replace with your actual website URL
    const meaningText = item.meaning ? ` - Meaning: "${item.meaning}"` : "";
    const logoUrl = "https://www.yourwebsite.com/logo.png"; // Replace with the actual URL of your logo
    const potentialTweet =
      tweetText + meaningText + ` [${websiteLink}]` + viaText;
  
    // Add the logo URL at the end of the tweet if there's space
    let spaceForLogoUrl = 280 - potentialTweet.length - 24; // 24 chars for the URL shortening
    if (spaceForLogoUrl > 0) {
      tweetText = potentialTweet + ` [${logoUrl}]`;
    } else {
      tweetText = potentialTweet;
    }
  
    // Truncate if still too long
    if (tweetText.length > 280) {
      const maxMeaningLength = 280 - (tweetText.length - item.meaning.length) - 3; // Adjust for ellipsis and other text
      const truncatedMeaning = item.meaning.slice(0, maxMeaningLength) + "...";
      tweetText = `Check out this ${itemType}: "${textToShare}"\nMeaning: "${truncatedMeaning}"\n[${websiteLink}] - via ${viaText} [${logoUrl}]`;
    }
  
    const shareToTwitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText
    )}`;
    window.open(shareToTwitterUrl, "_blank");
  };
  </script>
  