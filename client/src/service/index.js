// this is the service file that will be used to make all the api calls
import axios from "axios";
import { currentUser } from "@/service/auth.js";

const AppApiService = () => {
  return {
    // function to get all the data in my collections in the testing path
    getAllCollections() {
      return axios.get("/api/all-collections").then((res) => {
        return res.data;
      });
    },
    // function to create a new submission
    async createSubmission(formData) {
      // check that isn't an auth user
      const authUser = await currentUser();
      if (!authUser) {
        // return not login validation
        return Promise.reject("You must be logged in to create a submission");
      } else {
        return axios.post("/api/sendSubmission", formData).then((res) => {
          return res.data;
        });
      }
    },

    async upvoteSubmission(id) {
      const authUser = await currentUser();
      if (!authUser) {
        return Promise.reject("Sorry, you must be logged in to vote");
      } else {
        const uid = authUser.uid; // Get the auth user uid
        return axios.put("/api/upvoteSubmission/" + id, { uid }).then((res) => {
          return res.data;
        });
      }
    },

    async downvoteSubmission(id) {
      const authUser = await currentUser();
      if (!authUser) {
        return Promise.reject("Sorry, you must be logged in to vote");
      } else {
        const uid = authUser.uid;
        return axios
          .put("/api/downvoteSubmission/" + id, { uid })
          .then((res) => {
            return res.data;
          });
      }
    },

    // this is to get one submission by id
    getSubmission(id) {
      return axios.get("/api/getSubmission/" + id).then((res) => {
        return res.data;
      });
    },

    // get data by user email
    getuserDashBoardAPI(email) {
      return axios.get("/api/userDashboard/" + email).then((res) => {
        return res.data;
      });
    },
  };
};

export default AppApiService;
