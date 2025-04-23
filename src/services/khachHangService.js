import api from "./api";
import { KhachHangModel } from "../models/KhachHangModel";

export const khachHangService = {
  getAllKhachHang: async (params = {}) => {
    try {
      const response = await api.get("/khachhang", { params });
      return response.data.map((khachHang) => new KhachHangModel(khachHang));
    } catch (error) {
      console.error("Error fetching khách hàng:", error);
      throw error;
    }
  },

  getKhachHangById: async (id) => {
    try {
      const response = await api.get(`/khachhang/${id}`);
      return new KhachHangModel(response.data);
    } catch (error) {
      console.error(`Error fetching khách hàng #${id}:`, error);
      throw error;
    }
  },

  createKhachHang: async (khachHangData) => {
    try {
      const response = await api.post("/khachhang", khachHangData);
      return new KhachHangModel(response.data);
    } catch (error) {
      console.error("Error creating khách hàng:", error);
      throw error;
    }
  },

  updateKhachHang: async (id, khachHangData) => {
    try {
      const response = await api.put(`/khachhang/${id}`, khachHangData);
      return new KhachHangModel(response.data);
    } catch (error) {
      console.error(`Error updating khách hàng #${id}:`, error);
      throw error;
    }
  },

  deleteKhachHang: async (id) => {
    try {
      const response = await api.delete(`/khachhang/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting khách hàng #${id}:`, error);
      throw error;
    }
  },

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
};
