import { ref, onMounted, onUnmounted, computed } from 'vue'
import AppApiService from '../../service/index'

export function CollectionsFunctions() {
  const collectionData = ref({})
  const showScrollToTopBtn = ref(false)
  const activeFilter = ref(null)
  const isLoading = ref(false)
  const errorMessage = ref(null)

  const service = AppApiService()

  const truncateString = (text, limit) => {
    if (!text) return '' // Return empty string if text is undefined

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

    // Loop through the collection data and push all the items into the allItems array and truncate the content and meaning
    Object.values(collectionData.value).forEach((typeCollection) => {
      typeCollection.forEach((item) => {
        // check if title isn't empty string
        if (item.title) {
          item.title = truncateString(item.title, 10)
        }
        item.content = truncateString(item.content, 12)
        item.meaning = truncateString(item.meaning, 12)
        allItems.push(item)
      })
    })

    if (activeFilter.value && activeFilter.value !== 'all') {
      return allItems.filter((item) => item.type === activeFilter.value)
    }

    return allItems
  })

  const filterType = (type) => {
    activeFilter.value = type !== 'all' ? type : null
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
      errorMessage.value = error.toString().includes('404')
        ? `No data found `
        : 'Server Error'
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

  const isSearching = ref(false)
  const searchResults = ref([])

  const updateSearchQuery = async (query) => {
    try {
      errorMessage.value = null
      isLoading.value = true
      const data = await service.searchCollection(query)
      if (data) {
        searchResults.value = data // Store search results
        isSearching.value = true // Set isSearching to true to display search results
      }
    } catch (error) {
      console.error('Error fetching collections:', error)
      // Display error message
      errorMessage.value = error.toString().includes('404')
        ? `'${query}' not found`
        : 'Server Error'
    } finally {
      isLoading.value = false
    }
  }

  const displayedItems = computed(() => {
    // If isSearching is true, display the search results, otherwise display the filtered collection
    return isSearching.value
      ? processedSearchResults.value
      : filteredCollection.value
  })

  const processedSearchResults = computed(() => {
    // Loop through the search results and push all the items into the allItems array and truncate the content and meaning
    const allItems = []
    searchResults.value.forEach((item) => {
      // check if title isn't empty string
      if (item.title) {
        item.title = truncateString(item.title, 10)
      }
      item.content = truncateString(item.content, 12)
      item.meaning = truncateString(item.meaning, 12)
      allItems.push(item)
    })

    return allItems
  })

  const closeError = () => {
    errorMessage.value = null
  }

  // Return all the functions so they can be used globally
  return {
    updateSearchQuery,
    collectionData,
    searchResults,
    processedSearchResults,
    displayedItems,
    isSearching,
    isLoading,
    filterType,
    activeFilter,
    formatDate,
    toggleMeaning,
    showMeaning,
    showScrollToTopBtn,
    scrollToTop,
    checkScroll,
    errorMessage,
    closeError,
  }
}
