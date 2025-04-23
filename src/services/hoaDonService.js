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
};
