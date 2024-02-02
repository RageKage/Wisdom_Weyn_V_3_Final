import axios from 'axios'
import { getAuthHeaders } from '@/service/authService.js'

// see all of the env we have in our .

const AppApiService = () => {
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

  const apiPath = import.meta.env.VITE_API_URL

  return {
    // this also is pagination
    getAllCollections(pageNumber) {
      const params = {
        page: pageNumber,
        limit: 12,
      }

      return axios
        .get(apiPath + '/collections', { params })
        .then(handleResponse)
        .catch(handleError)
    },

    async createSubmission(formData) {
      const headers = await getAuthHeaders()

      if (Object.keys(headers).length === 0) {
        return Promise.reject('You must be logged in to create a submission')
      }

      return axios
        .post(apiPath + '/submissions', formData, { headers })
        .then(handleResponse)
        .catch(handleError)
    },

    async deleteSubmission(data) {
      const headers = await getAuthHeaders()

      if (Object.keys(headers).length === 0) {
        return Promise.reject('You must be logged in to create a submission')
      }

      return axios
        .delete(`${apiPath}/submissions/${data.id}`, {
          headers,
        })
        .then(handleResponse)
        .catch(handleError)
    },

    getSubmission(id) {
      // this is the path it makes to the submission
      return axios
        .get(apiPath + `/submissions/${id}`)
        .then(handleResponse)
        .catch(handleError)
    },

    async upvoteSubmission(id) {
      const headers = await getAuthHeaders()

      if (Object.keys(headers).length === 0) {
        return Promise.reject('You must be logged in to create a submission')
      }

      const uid = headers.user.uid

      return axios
        .put(apiPath + `/submissions/${id}/upvote`, { uid }, { headers })
        .then(handleResponse)
        .catch(handleError)
    },

    async downvoteSubmission(id) {
      const headers = await getAuthHeaders()

      if (Object.keys(headers).length === 0) {
        return Promise.reject('You must be logged in to create a submission')
      }

      const uid = headers.user.uid
      return axios
        .put(apiPath + `/submissions/${id}/downvote`, { uid }, { headers })
        .then(handleResponse)
        .catch(handleError)
    },

    getuserDashBoardAPI(email) {
      return axios
        .get(apiPath + `/users/${email}/dashboard`)
        .then(handleResponse)
        .catch(handleError)
    },

    async usernameUpdate(username) {
      const headers = await getAuthHeaders()

      if (Object.keys(headers).length === 0) {
        return Promise.reject('You must be logged in to create a submission')
      }

      const uid = headers.user.uid
      const data = { username } // Put the new username in the request body

      return axios
        .put(apiPath + `/users/${uid}`, data, { headers }) // Use PUT method to update data
        .then(handleResponse)
        .catch(handleError)
    },

    async searchCollection(query) {
      return axios
        .get(apiPath + `/search/${query}`)
        .then(handleResponse)
        .catch(handleError)
    },
    checkServerStatus() {
      return axios
        .get(`${apiPath}/server/status`)
        .then((res) => {
          return res.data
        })
        .catch(handleError)
    },
  }
}

export default AppApiService
