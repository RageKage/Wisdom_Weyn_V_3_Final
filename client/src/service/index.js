import axios from 'axios'
import { useAuthStore } from '../store/authStore' // Import useAuthStore

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

  const apiPath =
    import.meta.env.NODE_ENV === 'production'
      ? import.meta.env.VITE_API_URL
      : import.meta.env.VITE_API_URL

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
      const headers = await useAuthStore().getAuthHeaders()

      if (Object.keys(headers).length === 0) {
        return Promise.reject('You must be logged in to create a submission')
      }

      return axios
        .post(apiPath + '/submissions', formData, { headers })
        .then(handleResponse)
        .catch(handleError)
    },

    async deleteSubmission(data) {
      const headers = await useAuthStore().getAuthHeaders()

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
      const headers = await useAuthStore().getAuthHeaders()

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
      const headers = await useAuthStore().getAuthHeaders()

      if (Object.keys(headers).length === 0) {
        return Promise.reject('You must be logged in to create a submission')
      }

      const uid = headers.user.uid
      return axios
        .put(apiPath + `/submissions/${id}/downvote`, { uid }, { headers })
        .then(handleResponse)
        .catch(handleError)
    },

    getuserDashBoardAPI(username) {
      return axios
        .get(apiPath + `/users/${username}`)
        .then(handleResponse)
        .catch(handleError)
    },

    async usernameUpdate(username) {
      const headers = await useAuthStore().getAuthHeaders()

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

    async addUserToDB(userData, personalName) {
      const headers = await useAuthStore().getAuthHeaders()

      if (Object.keys(headers).length === 0) {
        return Promise.reject('You must be logged in to create a submission')
      }

      await userData?.reload()

      const data = {
        personalName: personalName,
        email: userData.email,
        createdAt: userData.metadata.creationTime || null,
        lastLoginAt: userData.metadata.lastSignInTime || null,
        submissionCount: 0,
      }

      return axios
        .post(apiPath + '/users/create', data, { headers })
        .then(handleResponse)
        .catch(handleError)
    },
    // Check if the username is already in the database, past it as a body parameter
    async checkUsername() {
      const headers = await useAuthStore().getAuthHeaders()

      if (Object.keys(headers).length === 0) {
        return Promise.reject('You must be logged ')
      }

      return axios
        .get(apiPath + `/validate/user/username`, { headers })
        .then(handleResponse)
        .catch(handleError)
    },

    // update user last login time
    async updateLastlongAt(user) {
      const headers = await useAuthStore().getAuthHeaders()

      if (Object.keys(headers).length === 0) {
        return Promise.reject('You must be logged ')
      }

      const data = {
        lastLoginAt: user.metadata.lastSignInTime || null,
      }
      return axios
        .post(apiPath + `/users/lastLoginAt`, data, { headers })
        .then(handleResponse)
        .catch(handleError)
    },

    // Sync google user data with the database
    async syncGoogleUserData(user) {
      const headers = await useAuthStore().getAuthHeaders()

      if (Object.keys(headers).length === 0) {
        return Promise.reject('You must be ')
      }

      const userData = {
        personalName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: user.metadata.creationTime || null,
        lastLoginAt: user.metadata.lastSignInTime || null,
        submissionCount: 0,
      }

      return axios
        .post(apiPath + `/users/sync`, userData, { headers })
        .then(handleResponse)
        .catch(handleError)
    },
    // add user username to the db
    async addUsernameToDB(username) {
      const headers = await useAuthStore().getAuthHeaders()

      if (Object.keys(headers).length === 0) {
        return Promise.reject('You must be logged in to create a submission')
      }

      const data = {
        username,
      }

      return axios
        .post(apiPath + `/users/username`, data, { headers })
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
