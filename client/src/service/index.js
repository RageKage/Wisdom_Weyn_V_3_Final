// clinet side
import axios from "axios";

const AppApiService = () => {
  return {
    // function to get all the data in my collections in the testing path
    getAllCollections() {
      return axios.get("/api/all-collections").then((res) => {
        return res.data;
      });
    },
    // function to create a new submission
    createSubmission(formData) {
      return axios.post("/api/sendSubmission", formData).then((res) => {
        return res.data;
      });
    },

    upvoteSubmission(id) {
      console.log(id);
      return axios.put("/api/upvoteSubmission/" + id).then((res) => {
        return res.data;
      });
    },

    downvoteSubmission(id) {
      console.log(id);
      return axios.put("/api/downvoteSubmission/" + id).then((res) => {
        return res.data;
      });
    },
  };
};

export default AppApiService;
