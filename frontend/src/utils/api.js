import axios from "axios";

export const api = axios.create({
  // local
  // baseURL: "/signing",
  baseURL: "http://localhost:8080/",
  // timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
