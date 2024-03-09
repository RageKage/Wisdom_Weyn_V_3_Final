import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index'
import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth' // Import Auth service and emulator connection function
import { getDatabase, connectDatabaseEmulator } from 'firebase/database' // Import Database service and emulator connection function
import './assets/css/input.css'
import AOS from 'aos'
import 'aos/dist/aos.css'
import AppApiService from './service/index'
import { MotionPlugin } from '@vueuse/motion'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'wisdom-weyn.firebaseapp.com',
  projectId: 'wisdom-weyn',
  storageBucket: 'wisdom-weyn.appspot.com',
  messagingSenderId: '382036259636',
  appId: '1:382036259636:web:66994d9c8560395ce32b61',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Vue application
const vueApp = createApp(App)

AOS.init({
  duration: 2000,
})
vueApp.config.globalProperties.$index = AppApiService
AOS.init()

// Conditionally connect to Firebase emulators in development mode
if (import.meta.env.MODE !== 'production') {
  // Connect to Firebase Auth emulator
  const auth = getAuth(app)
  connectAuthEmulator(auth, 'http://localhost:9099')

  // Connect to Firebase Database emulator
  const database = getDatabase(app)
  connectDatabaseEmulator(database, 'localhost', 9000)
}

// Use Vue plugins
vueApp.use(createPinia())

// Import and setup the store after Pinia has been installed
import { setupStore } from './store'
setupStore(vueApp)

vueApp.use(router)
vueApp.use(MotionPlugin)

vueApp.mount('#app')
