// src/utils/api.js
import axios from "axios";
import Cookies from "js-cookie";

// Create Axios instance
const API = axios.create({
  baseURL: "http://localhost:5000/api", // Adjust this to your backend API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add Authorization header with token if available
API.interceptors.request.use((config) => {
  const token = Cookies.get("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication API
export const loginUser = async (credentials) => {
  try {
    const response = await API.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Operation Makers API
export const fetchOperationMakers = async () => {
  try {
    const response = await API.get("/operation-makers");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createOperationMaker = async (maker) => {
  try {
    const response = await API.post("/operation-makers", maker);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Operation Codes API
export const fetchOperationCodes = async () => {
  try {
    const response = await API.get("/operation-codes");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Operation Records API
export const fetchOperationRecords = async () => {
  try {
    const response = await API.get("/operation-records");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createOperationRecord = async (record) => {
  try {
    const response = await API.post("/operation-records", record);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Approval API
export const fetchPendingRecords = async () => {
  try {
    const response = await API.get("/approval/pending"); // Adjust the endpoint as per your backend
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const approveRecord = async (id) => {
  try {
    const response = await API.post(`/approval/${id}/approve`); // Adjust the endpoint and method as per your backend
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteOperationRecord = async (id) => {
    try {
      const response = await API.delete(`/operation-records/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };

  export const deleteOperationMaker = async (id) => {
    try {
      const response = await API.delete(`/operation-makers/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };

  export const updateOperationMaker = async (id, updatedData) => {
    try {
      const response = await API.put(`/operation-makers/${id}`, updatedData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };

  export const fetchOperationRecordsWithStatus = async (status = "all", page = 1, limit = 10, search = "") => {
    try {
      const response = await API.get("/operation-records", {
        params: { status, page, limit, search },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching operation records:", error);
      throw error.response?.data || error.message;
    }
  };
  // Approve Operation Record API
  export const approveOperationRecord = async (id) => {
    try {
      const response = await API.put(`/operation-records/${id}/approve`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };
  
  // Refuse Operation Record API
  export const refuseOperationRecord = async (id) => {
    try {
      const response = await API.put(`/operation-records/${id}/refuse`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };
  