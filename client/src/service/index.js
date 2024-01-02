import axios from 'axios'
import { currentUser } from '@/service/authService.js'

// import router from '@/router'

const AppApiService = () => {
  const handleResponse = (response) => response.data

  const handleError = (error) => {
    if (error.response) {
      // The request was made, but the server responded with a status code outside of the 2xx range
      const { status, data } = error.response
      return Promise.reject(`Error: ${status} - ${data}`)
    } else if (error.request) {
      // The request was made, but no response was received
      return Promise.reject('Network error. Please try again.')
    } else {
      // Something happened in setting up the request that triggered an Error
      return Promise.reject('Unexpected error. Please try again.')
    }
  }

  return {
    getAllCollections() {
      return axios
        .get('/api/collections')
        .then(handleResponse)
        .catch(handleError)
    },

    async createSubmission(formData) {
      const authUser = await currentUser()

      if (!authUser) {
        return Promise.reject('You must be logged in to create a submission')
      }

      return axios
        .post('/api/submissions', formData)
        .then(handleResponse)
        .catch(handleError)
    },

    async deleteSubmission(data) {
      const authUser = await currentUser()

      if (!authUser) {
        return Promise.reject('You must be logged in to delete a submission')
      }

      const uid = authUser.uid
      return axios
        .delete(`/api/submissions/${data.id}/${uid}`)
        .then(handleResponse)
        .catch(handleError)
    },

    getSubmission(id) {
      return axios
        .get(`/api/submissions/${id}`)
        .then(handleResponse)
        .catch(handleError)
    },

    async upvoteSubmission(id) {
      const authUser = await currentUser()

      if (!authUser) {
        return Promise.reject('Sorry, you must be logged in to vote')
      }

      const uid = authUser.uid
      return axios
        .put(`/api/submissions/${id}/upvote`, { uid })
        .then(handleResponse)
        .catch(handleError)
    },

    async downvoteSubmission(id) {
      const authUser = await currentUser()

      if (!authUser) {
        return Promise.reject('Sorry, you must be logged in to vote')
      }

      const uid = authUser.uid
      return axios
        .put(`/api/submissions/${id}/downvote`, { uid })
        .then(handleResponse)
        .catch(handleError)
    },

    getuserDashBoardAPI(email) {
      return axios
        .get(`/api/users/${email}/dashboard`)
        .then(handleResponse)
        .catch(handleError)
    },

    // getUserDatabyuid(uid) {
    //   return axios
    //     .get(`/api/users/${uid}`)
    //     .then(handleResponse)
    //     .catch(handleError)
    // },

    checkServerStatus() {
      return axios
        .get('/api/server/status')
        .then((res) => res.data)
        .catch(handleError)
    },
  }
}

export default AppApiService

// import axios from 'axios'
// import { currentUser } from '@/service/authService.js'

// import router from '@/router'

// const AppApiService = () => {
//   const handleResponse = (response) => response.data

//   const handleError = (error) => {
//     if (error.response) {
//       // The request was made, but the server responded with a status code outside of the 2xx range
//       const { status, data } = error.response
//       const errorMessage = `Error: ${status} - ${data}`
//       router.push({ name: 'ErrorHandling', params: { error: errorMessage } }) // Redirect to error page with error message
//       return Promise.reject(errorMessage)
//     } else if (error.request) {
//       // The request was made, but no response was received
//       const errorMessage = 'Network error. Please try again.'
//       router.push({ name: 'ErrorHandling', params: { error: errorMessage } }) // Redirect to error page with error message
//       return Promise.reject(errorMessage)
//     } else {
//       // Something happened in setting up the request that triggered an Error
//       const errorMessage = 'Unexpected error. Please try again.'
//       router.push({ name: 'ErrorHandling', params: { error: errorMessage } }) // Redirect to error page with error message
//       return Promise.reject(errorMessage)
//     }
//   }
