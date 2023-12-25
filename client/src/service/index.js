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
  };
};

export default AppApiService;
