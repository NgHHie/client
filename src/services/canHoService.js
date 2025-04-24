// src/services/canHoService.js - Updated
import api from "./api";
import { CanHoModel } from "../models/CanHoModel";

export const canHoService = {
  /**
   * Fetches all apartments
   * @returns {Promise<Array<CanHoModel>>} Array of apartment models
   */
  getAllCanHo: async () => {
    try {
      const response = await api.get("/khachhang/canho");
      return response.data.map((canHo) => new CanHoModel(canHo));
    } catch (error) {
      console.error("Error fetching căn hộ:", error);
      throw error;
    }
  },

  /**
   * Fetches an apartment by ID
   * @param {number} id - Apartment ID
   * @returns {Promise<CanHoModel>} Apartment model
   */
  getCanHoById: async (id) => {
    try {
      const response = await api.get(`/khachhang/canho/${id}`);
      return new CanHoModel(response.data);
    } catch (error) {
      console.error(`Error fetching căn hộ #${id}:`, error);
      throw error;
    }
  },

  /**
   * Creates a new apartment
   * @param {CanHoModel} canHoData - Apartment data
   * @returns {Promise<CanHoModel>} Created apartment model
   */
  createCanHo: async (canHoData) => {
    try {
      // Format data according to API requirements
      // Khachhang field should be an object with id property
      const dataToSend = {
        socanho: canHoData.socanho,
        toanha: canHoData.toanha,
        khachhang: {
          id: canHoData.khachhang_id,
        },
      };

      console.log(dataToSend);

      const response = await api.post("/khachhang/canho", dataToSend);
      return new CanHoModel(response.data);
    } catch (error) {
      console.error("Error creating căn hộ:", error);

      // Extract more meaningful error messages if available
      const errorMessage =
        error.response?.data?.message || error.message || "Lỗi khi tạo căn hộ";

      // Create a new error with the extracted message
      const enhancedError = new Error(errorMessage);
      enhancedError.originalError = error;
      throw enhancedError;
    }
  },

  /**
   * Updates an existing apartment
   * @param {number} id - Apartment ID
   * @param {CanHoModel} canHoData - Updated apartment data
   * @returns {Promise<CanHoModel>} Updated apartment model
   */
  updateCanHo: async (id, canHoData) => {
    try {
      // Format data according to API requirements
      const dataToSend = {
        socanho: canHoData.socanho,
        toanha: canHoData.toanha,
        khachhang: {
          id: canHoData.khachhang_id,
        },
      };

      const response = await api.put(`/khachhang/canho/${id}`, dataToSend);
      return new CanHoModel(response.data);
    } catch (error) {
      console.error(`Error updating căn hộ #${id}:`, error);

      // Extract more meaningful error messages if available
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `Lỗi khi cập nhật căn hộ #${id}`;

      // Create a new error with the extracted message
      const enhancedError = new Error(errorMessage);
      enhancedError.originalError = error;
      throw enhancedError;
    }
  },

  /**
   * Deletes an apartment
   * @param {number} id - Apartment ID
   * @returns {Promise<any>} Server response
   */
  deleteCanHo: async (id) => {
    try {
      const response = await api.delete(`/khachhang/canho/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting căn hộ #${id}:`, error);

      // Extract more meaningful error messages if available
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `Lỗi khi xóa căn hộ #${id}`;

      // Handle specific error cases
      if (error.response?.status === 409) {
        throw new Error("Không thể xóa căn hộ này vì có thông tin liên quan");
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
   * @returns {Promise<Array<CanHoModel>>} Apartments associated with the customer
   */
  getCanHoByKhachHang: async (khachHangId) => {
    try {
      const response = await api.get(
        `/khachhang/canho/khachhang/${khachHangId}`
      );
      return response.data.map((canHo) => new CanHoModel(canHo));
    } catch (error) {
      console.error(
        `Error fetching căn hộ for khách hàng #${khachHangId}:`,
        error
      );
      throw error;
    }
  },
};
