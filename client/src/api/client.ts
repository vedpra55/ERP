import axios from "axios";

const client = axios.create({
  baseURL: `${process.env.REACT_APP_API_URI}/api/v1`,
});

export default client;
