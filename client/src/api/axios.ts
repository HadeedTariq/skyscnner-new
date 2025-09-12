import axios from "axios";

export default axios.create({
  baseURL:
    import.meta.env.VITE_ENV === "development"
      ? "http://localhost:3001/api"
      : "https://easyfligth/api/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
