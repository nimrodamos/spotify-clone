import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production" ? "/" : "https://localhost:5000";

console.log("API Base URL:", baseURL);

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});
