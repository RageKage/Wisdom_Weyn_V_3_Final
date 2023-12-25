// clinet side 
import axios from "axios";

const AppApiService = () => {
  return {
    // fucntion to get all the data in my collections in the testing path
    getAllCollections() {
      return axios.get("/api/testing").then((res) => {
        return res.data;
      });
    },
  };
};

export default AppApiService;
