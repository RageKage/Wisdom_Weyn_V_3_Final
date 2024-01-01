import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

import AppApiService from '../../service/index'

export function CollectionsFunctions() {
  const collectionData = ref({})
  const showScrollToTopBtn = ref(false)
  const activeFilter = ref(null)
  const isLoading = ref(false)
  const searchQuery = ref('')
  const searchResults = ref([])

  const service = AppApiService()

  const truncateString = (text, limit) => {
    text = text.trim()
    const words = text.split(' ')

    if (words.length <= limit) {
      return text
    }

    const truncatedText = words.slice(0, limit).join(' ')

    return truncatedText + '...'
  }

  // Filter the collection data based on the active filter
  const filteredCollection = computed(() => {
    let allItems = []

    // Loop through the collection data and push all the items into the allItems array and trucate the content and meaning
    Object.values(collectionData.value).forEach((typeCollection) => {
      typeCollection.forEach((item) => {
        // check if title isn't empty string
        if (item.title) {
          item.title = truncateString(item.title, 5)
        }
        item.content = truncateString(item.content, 10)
        item.meaning = truncateString(item.meaning, 10)
        allItems.push(item)
      })
    })

    if (activeFilter.value && activeFilter.value !== 'all') {
      return allItems.filter((item) => item.type === activeFilter.value)
    }

    return allItems
  })

  // Display the items based on the search query
  const displayedItems = computed(() => {
    if (searchQuery.value) {
      return searchResults.value
    }

    return filteredCollection.value
  })

  // Search the items based on the search query
  const searchItems = () => {
    searchResults.value = filteredCollection.value.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
  }

  // Watch the search query and call the searchItems function when it changes
  watch(searchQuery, searchItems)

  // Filter the collection data based on the active filter
  const filterType = (type) => {
    activeFilter.value = type !== 'all' ? type : null
    searchQuery.value = ''
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US')
  }

  const showMeaning = ref(false)

  const toggleMeaning = (item) => {
    item.showMeaning = !item.showMeaning
  }

  // Fetch the collection data from the database
  const fetchCollectionData = async () => {
    isLoading.value = true
    const tempArray = {}

    try {
      const data = await service.getAllCollections() // Await the promise
      if (data) {
        Object.keys(data).forEach((type) => {
          tempArray[type] = Object.values(data[type]).reverse()
        })
      }
      collectionData.value = tempArray
    } catch (error) {
      console.error('Error fetching collections:', error)
    } finally {
      isLoading.value = false // Set isLoading to false immediately after fetching data
    }
  }

  // Scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const checkScroll = () => {
    showScrollToTopBtn.value = window.scrollY > 100
  }

  // Call the fetchCollectionData function when the component is mounted
  onMounted(() => {
    fetchCollectionData()
    window.addEventListener('scroll', checkScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', checkScroll)
  })

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
  }
}
