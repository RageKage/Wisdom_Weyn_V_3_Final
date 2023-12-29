import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { getDatabase, ref as dbRef, get } from "firebase/database";
import { currentUser, getCurrentUser, signout } from "@/service/auth.js";
import { useRouter } from "vue-router";

import AppApiService from "../../service/index";

export function CollectionsFunctions() {
  const collectionData = ref({});
  const showScrollToTopBtn = ref(false);
  const activeFilter = ref(null);
  const isLoading = ref(false);
  const searchQuery = ref("");
  const searchResults = ref([]);
  const isLoggedIn = ref(false);

  const service = AppApiService();
  const router = useRouter();

  // truncateString function to truncate the displayedItems content and meaning
  const truncateString = (string, limit) => {
    if (string.length > limit) {
      return string.slice(0, limit) + "...";
    } else {
      return string;
    }
  };

  // Filter the collection data based on the active filter
  const filteredCollection = computed(() => {
    let allItems = [];

    // Loop through the collection data and push all the items into the allItems array and trucate the content and meaning
    Object.values(collectionData.value).forEach((typeCollection) => {
      typeCollection.forEach((item) => {
        item.content = truncateString(item.content, 100);
        item.meaning = truncateString(item.meaning, 100);
        allItems.push(item);
      });
    });

    if (activeFilter.value && activeFilter.value !== "all") {
      return allItems.filter((item) => item.type === activeFilter.value);
    }

    return allItems;
  });

  // Display the items based on the search query
  const displayedItems = computed(() => {
    if (searchQuery.value) {
      return searchResults.value;
    }

    return filteredCollection.value;
  });

  // Search the items based on the search query
  const searchItems = () => {
    searchResults.value = filteredCollection.value.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  };

  // Watch the search query and call the searchItems function when it changes
  watch(searchQuery, searchItems);

  // Filter the collection data based on the active filter
  const filterType = (type) => {
    activeFilter.value = type !== "all" ? type : null;
    searchQuery.value = "";
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US");
  };

  const showMeaning = ref(false);

  const toggleMeaning = (item) => {
    item.showMeaning = !item.showMeaning;
  };

  // Fetch the collection data from the database
  const fetchCollectionData = async () => {
    isLoading.value = true;
    const tempArray = {};

    try {
      service
        .getAllCollections()
        .then((data) => {
          if (data) {
            Object.keys(data).forEach((type) => {
              tempArray[type] = Object.values(data[type]).reverse();
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching collections:", error);
        });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        collectionData.value = tempArray;
        isLoading.value = false;
      }, 100);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const checkScroll = () => {
    showScrollToTopBtn.value = window.scrollY > 100;
  };

  onMounted(() => {
    fetchCollectionData();
    window.addEventListener("scroll", checkScroll);
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", checkScroll);
  });


  // Return all the functions so they can be used globally
  return {
    collectionData,
    isLoading,
    searchQuery,
    searchResults,
    displayedItems,
    filterType,
    activeFilter,
    formatDate,
    toggleMeaning,
    showMeaning,
    showScrollToTopBtn,
    scrollToTop,
    checkScroll,
  };
}
