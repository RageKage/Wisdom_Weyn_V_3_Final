// this is the service file that will be used to make all the api calls
import axios from 'axios'
import { currentUser } from '@/service/authService.js'

const AppApiService = () => {
  return {
    // function to get all the data in my collections in the testing path
    getAllCollections() {
      return axios.get('/api/collections').then((res) => {
        return res.data
      })
    },
    // function to create a new submission
    async createSubmission(formData) {
      // check that isn't an auth user
      const authUser = await currentUser()
      if (!authUser) {
        // return not login validation
        return Promise.reject('You must be logged in to create a submission')
      } else {
        return axios.post('/api/submissions', formData).then((res) => {
          return res.data
        })
      }
    },

    // this will delete a submission by data object which contains the id and the uid
    async deleteSubmission(data) {
      console.log(data)
      const authUser = await currentUser()
      if (!authUser) {
        return Promise.reject('You must be logged in to delete a submission')
      } else {
        const uid = authUser.uid
        return axios
          .delete('/api/submissions/' + data.id + '/' + uid)
          .then((res) => {
            return res.data
          })
      }
    },


    // this is to get one submission by id
    getSubmission(id) {
      return axios.get('/api/submissions/' + id).then((res) => {
        return res.data
      })
    },

    async upvoteSubmission(id) {
      const authUser = await currentUser()
      if (!authUser) {
        return Promise.reject('Sorry, you must be logged in to vote')
      } else {
        const uid = authUser.uid // Get the auth user uid
        return axios
          .put('/api/submissions/' + id + '/upvote', { uid })
          .then((res) => {
            return res.data
          })
      }
    },

    async downvoteSubmission(id) {
      const authUser = await currentUser()
      if (!authUser) {
        return Promise.reject('Sorry, you must be logged in to vote')
      } else {
        const uid = authUser.uid
        return axios
          .put('/api/submissions/' + id + '/downvote', { uid })
          .then((res) => {
            return res.data
          })
      }
    },

    // get data by user email
    getuserDashBoardAPI(email) {
      return axios.get('/api/users/' + email + '/dashboard').then((res) => {
        return res.data
      })
    },
  }
}

export default AppApiService
