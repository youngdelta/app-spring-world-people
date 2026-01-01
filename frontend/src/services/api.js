import axios from "axios";

export const API_BASE_URL = ""; // Use relative path for Vite proxy

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default api;
