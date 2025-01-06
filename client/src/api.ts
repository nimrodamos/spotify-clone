import axios from "axios";

export const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/",
});
