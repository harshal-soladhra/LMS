import axios from "axios";

const API_URL = "http://localhost:5000/api";

// ✅ User Authentication APIs (MySQL)
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error.response?.data);
    return null;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error.response?.data);
    return null;
  }
};

// ✅ Book Management APIs (MongoDB)
export const fetchBooks = async () => {
  try {
    const response = await axios.get(`${API_URL}/books`);
    return response.data;
  } catch (error) {
    console.error("Error fetching books:", error.response?.data);
    return [];
  }
};

export const addBook = async (bookData) => {
  try {
    const response = await axios.post(`${API_URL}/books`, bookData);
    return response.data;
  } catch (error) {
    console.error("Error adding book:", error.response?.data);
    return null;
  }
};
