import { useAuthStore } from './authStore'

export function setupStore(app) {
  const authStore = useAuthStore()

  // Fetch the current user details
  authStore.getCurrentUserDetails().catch((error) => {
    console.error('Error getting current user details:', error)
  })
}
