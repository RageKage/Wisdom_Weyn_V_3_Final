import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index'
import { initializeApp } from 'firebase/app'
import './assets/css/input.css'
import AOS from 'aos'
import 'aos/dist/aos.css'
import AppApiService from './service/index'
import { MotionPlugin } from '@vueuse/motion'


const app = createApp(App)
AOS.init()

app.config.globalProperties.$index = AppApiService

AOS.init({
  duration: 2000,
})

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'wisdom-weyn.firebaseapp.com',
  databaseURL: 'https://wisdom-weyn-default-rtdb.firebaseio.com',
  projectId: 'wisdom-weyn',
  storageBucket: 'wisdom-weyn.appspot.com',
  messagingSenderId: '382036259636',
  appId: '1:382036259636:web:66994d9c8560395ce32b61',
}

// Initialize the Firebase app with the configured credentials
initializeApp(firebaseConfig)

// Use the Pinia state management library
app.use(createPinia())

app.use(MotionPlugin)

// Use the router instance
app.use(router)

// Mount the app to the DOM
app.mount('#app')
