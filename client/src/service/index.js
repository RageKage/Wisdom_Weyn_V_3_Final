import axios from 'axios'
import { currentUser } from '@/service/authService.js'

// see all of the env we have in our .

const AppApiService = () => {
  // ngrok header to disable the popup
  const headers = {
    'ngrok-skip-browser-warning': 'true',
  }

  const handleResponse = (response) => {
    return response.data
  }

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
  // const apiPath =
  //   'https://4f68-2601-447-c004-bdc0-9195-82a8-86cf-a303.ngrok-free.app/api'
  // router.get("/collections", function (req, res) {
  // router.post("/collections", async (req, res) => {

  // import NGROK_URL from our .env using dotenv , run on ngrok server
  // ! const apiPath = import.meta.env.VITE_NGROK_URL + '/api'
  // const apiPath = 'https://4407-2601-447-c004-bdc0-14a5-e544-e904-afeb.ngrok-free.app/api'

  // run locally
  const apiPath = '/api'

  return {
    getAllCollections() {
      return axios
        .get(apiPath + '/collections', { headers })
        .then(handleResponse)
        .catch(handleError)
    },

    async createSubmission(formData) {
      const authUser = await currentUser()

      if (!authUser) {
        return Promise.reject('You must be logged in to create a submission')
      }

      return axios
        .post(apiPath + '/submissions', formData, { headers })
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
        .delete(apiPath + `/submissions/${data.id}/${uid}`, { headers })
        .then(handleResponse)
        .catch(handleError)
    },

    getSubmission(id) {
      // this is the path it makes to the submission
      return axios
        .get(apiPath + `/submissions/${id}`, { headers })
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
        .put(apiPath + `/submissions/${id}/upvote`, { uid }, { headers })
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
        .put(apiPath + `/submissions/${id}/downvote`, { uid }, { headers })
        .then(handleResponse)
        .catch(handleError)
    },

    getuserDashBoardAPI(email) {
      return axios
        .get(apiPath + `/users/${email}/dashboard`, { headers })
        .then(handleResponse)
        .catch(handleError)
    },

    // getUserDatabyuid(uid) {
    //   return axios
    //     .get(`/api/users/${uid}`)
    //     .then(handleResponse)
    //     .catch(handleError)
    // },

    // checkServerStatus() {
    //   return axios
    //     .get(`${apiPath}/server/status`)
    //     .then((res) => {
    //       return res.data
    //     })
    //     .catch(handleError);
    // },
    checkServerStatus() {
      console.log('check server status')
      return axios
        .get(`${apiPath}/server/status`, { headers })
        .then((res) => {
          return res.data
        })
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
