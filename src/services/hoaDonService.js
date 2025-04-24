import api from "./api";
import { HoaDonModel } from "../models/HoaDonModel";

export const hoaDonService = {
  getAllHoaDon: async (params = {}) => {
    try {
      const response = await api.get("/hoadon", { params });
      return response.data.map((hoaDon) => new HoaDonModel(hoaDon));
    } catch (error) {
      console.error("Error fetching hóa đơn:", error);
      throw error;
    }
  },

  getHoaDonById: async (id) => {
    try {
      const response = await api.get(`/hoadon/${id}`);
      return new HoaDonModel(response.data);
    } catch (error) {
      console.error(`Error fetching hóa đơn #${id}:`, error);
      throw error;
    }
  },

  createHoaDon: async (hoaDonData) => {
    try {
      // We don't have a direct create endpoint in the API
      // This will depend on the actual API implementation
      // Alternatively, use the water meter service's ghisonuoc endpoint

      // For now, creating a temporary implementation
      // In a real application, this would connect to the appropriate endpoint
      const response = await api.post("/hoadon", hoaDonData);
      return new HoaDonModel(response.data);
    } catch (error) {
      console.error("Error creating hóa đơn:", error);
      throw error;
    }
  },

  updateHoaDon: async (id, hoaDonData) => {
    try {
      const response = await api.put(`/hoadon/${id}`, hoaDonData);
      return new HoaDonModel(response.data);
    } catch (error) {
      console.error(`Error updating hóa đơn #${id}:`, error);
      throw error;
    }
  },

  getHoaDonByKhachHang: async (khachHangId, params = {}) => {
    try {
      const response = await api.get(`/hoadon/khachhang/${khachHangId}`, {
        params,
      });
      return response.data.map((hoaDon) => new HoaDonModel(hoaDon));
    } catch (error) {
      console.error(
        `Error fetching hóa đơn for khách hàng #${khachHangId}:`,
        error
      );
      throw error;
    }
  },

  // Method to update payment status
  updatePaymentStatus: async (id, amount) => {
    try {
      const response = await api.put(`/hoadon/${id}/payment`, null, {
        params: { amount },
      });
      return new HoaDonModel(response.data);
    } catch (error) {
      console.error(`Error updating payment status for hóa đơn #${id}:`, error);
      throw error;
    }
  },
};
