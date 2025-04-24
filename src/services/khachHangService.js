// src/services/khachHangService.js - Fixed version
import api from "./api";
import { KhachHangModel } from "../models/KhachHangModel";

export const khachHangService = {
  /**
   * Fetches all customers with optional pagination, sorting and filtering
   * @param {Object} params - Optional parameters for the request
   * @returns {Promise<Array<KhachHangModel>>} Array of customer models
   */
  getAllKhachHang: async (params = {}) => {
    try {
      // Use the paginated endpoint when specific params are provided
      const endpoint =
        params.page || params.size ? "/khachhang/paged" : "/khachhang";

      const response = await api.get(endpoint, { params });

      // Handle both paginated and unpaginated responses
      const customers = params.page
        ? response.data.content // Paginated response returns {content: [...], totalItems, etc}
        : response.data; // Unpaginated response is just an array

      return customers.map((khachHang) => new KhachHangModel(khachHang));
    } catch (error) {
      console.error("Error fetching khách hàng:", error);
      throw error;
    }
  },

  /**
   * Fetches a customer by ID
   * @param {number} id - Customer ID
   * @returns {Promise<KhachHangModel>} Customer model
   */
  getKhachHangById: async (id) => {
    try {
      const response = await api.get(`/khachhang/${id}`);
      return new KhachHangModel(response.data);
    } catch (error) {
      console.error(`Error fetching khách hàng #${id}:`, error);
      throw error;
    }
  },

  /**
   * Creates a new customer
   * @param {KhachHangModel} khachHangData - Customer data
   * @returns {Promise<KhachHangModel>} Created customer model
   */
  createKhachHang: async (khachHangData) => {
    try {
      // Ensure we're sending a plain object, not the class instance with methods
      const dataToSend = {
        hoten: khachHangData.hoten,
        sodienthoai: khachHangData.sodienthoai,
        email: khachHangData.email,
        // Add other fields as needed
      };

      const response = await api.post("/khachhang", dataToSend);
      return new KhachHangModel(response.data);
    } catch (error) {
      console.error("Error creating khách hàng:", error);

      // Extract more meaningful error messages if available
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Lỗi khi tạo khách hàng";

      // Create a new error with the extracted message
      const enhancedError = new Error(errorMessage);
      enhancedError.originalError = error;
      throw enhancedError;
    }
  },

  /**
   * Updates an existing customer
   * @param {number} id - Customer ID
   * @param {KhachHangModel} khachHangData - Updated customer data
   * @returns {Promise<KhachHangModel>} Updated customer model
   */
  updateKhachHang: async (id, khachHangData) => {
    try {
      // Ensure we're sending a plain object, not the class instance with methods
      const dataToSend = {
        hoten: khachHangData.hoten,
        sodienthoai: khachHangData.sodienthoai,
        email: khachHangData.email,
        // Add other fields as needed
      };

      const response = await api.put(`/khachhang/${id}`, dataToSend);
      return new KhachHangModel(response.data);
    } catch (error) {
      console.error(`Error updating khách hàng #${id}:`, error);

      // Extract more meaningful error messages if available
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `Lỗi khi cập nhật khách hàng #${id}`;

      // Create a new error with the extracted message
      const enhancedError = new Error(errorMessage);
      enhancedError.originalError = error;
      throw enhancedError;
    }
  },

  /**
   * Deletes a customer
   * @param {number} id - Customer ID
   * @returns {Promise<any>} Server response
   */
  deleteKhachHang: async (id) => {
    try {
      const response = await api.delete(`/khachhang/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting khách hàng #${id}:`, error);

      // Extract more meaningful error messages if available
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `Lỗi khi xóa khách hàng #${id}`;

      // Handle specific error cases
      if (error.response?.status === 409) {
        throw new Error(
          "Không thể xóa khách hàng này vì có thông tin liên quan"
        );
      }

      // Create a new error with the extracted message
      const enhancedError = new Error(errorMessage);
      enhancedError.originalError = error;
      throw enhancedError;
    }
  },

  /**
   * Fetches all apartments for a specific customer
   * @param {number} khachHangId - Customer ID
   * @returns {Promise<Array>} Apartments associated with the customer
   */
  getCanHoByKhachHang: async (khachHangId) => {
    try {
      const response = await api.get(
        `/khachhang/canho/khachhang/${khachHangId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching căn hộ for khách hàng #${khachHangId}:`,
        error
      );
      throw error;
    }
  },

  /**
   * Searches for customers by name
   * @param {string} name - Name to search for
   * @returns {Promise<Array<KhachHangModel>>} Matching customers
   */
  searchKhachHangByName: async (name) => {
    try {
      const response = await api.get("/khachhang/search", {
        params: { name },
      });
      return response.data.map((khachHang) => new KhachHangModel(khachHang));
    } catch (error) {
      console.error(
        `Error searching for khách hàng with name "${name}":`,
        error
      );
      throw error;
    }
  },
};
