import { ref, onMounted, computed } from 'vue'
import AppApiService from '../../service/index'

export function CollectionsFunctions() {
  const collectionData = ref({})
  const activeFilter = ref(null)
  const isLoading = ref(false)
  const errorMessage = ref(null)

  const currentPage = ref(1)

  const service = AppApiService()

  // Truncate the text by words
  const truncateString = (text, limit) => {
    const normalizedText = text.replace(/\s+/g, ' ')

    const words = normalizedText.split(' ')

    if (words.length <= limit) {
      return words.join(' ')
    }

    const truncatedWords = words.slice(0, limit)

    return truncatedWords.join(' ') + '...'
  }

  // Filter the collection data based on the active filter
  const filteredCollection = computed(() => {
    let allItems = []

    if (Array.isArray(collectionData.value)) {
      collectionData.value.forEach((item) => {
        // Check if title is empty, and if so, use content as the title
        if (!item.title || item.title === '') {
          item.title = item.content.split(' ').slice(0, 6).join(' ')
        } else {
          item.title = truncateString(item.title, 6)
        }
        item.content = truncateString(item.content, 10)
        item.meaning = truncateString(item.meaning, 5)
        allItems.push(item)
      })
    }

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

  const fetchCollectionData = async (pageNum) => {
    isLoading.value = true

    try {
      const data = await service.getAllCollections(pageNum)
      if (data) {
        collectionData.value = {}
        collectionData.value = data
      }
    } catch (error) {
      console.error('Error fetching collections:', error)
      // Display error message
      if (error.toString().includes('404')) {
        errorMessage.value = error
      } else if (error.toString().includes('500')) {
        errorMessage.value = error
      } else if (error.toString().includes('401')) {
        errorMessage.value = error
      } else if (error.toString().includes('405')) {
        errorMessage.value = error
      } else {
        errorMessage.value = error
      }
    } finally {
      isLoading.value = false
    }
  }
  const goForward = () => {
    window.scrollTo(0, 0)
    currentPage.value++
    fetchCollectionData(currentPage.value)
  }

  const goBack = () => {
    window.scrollTo(0, 0)
    if (currentPage.value > 1) {
      currentPage.value--
      fetchCollectionData(currentPage.value)
    }
  }

  // Call the fetchCollectionData function when the component is mounted
  onMounted(() => {
    fetchCollectionData(currentPage.value)
    window.scrollTo(0, 0)
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
      isLoading.value = false // Set isLoading to false immediately after fetching data
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

    // refresh page state
    window.location.reload()
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
    errorMessage,
    closeError,
    goForward,
    goBack,
  }
}
