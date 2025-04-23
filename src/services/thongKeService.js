import api from "./api";
import { ThongKeModel } from "../models/ThongKeModel";

export const thongKeService = {
  getThongKe: async (params = {}) => {
    try {
      const response = await api.get("/thongkekhachhang", { params });
      return response.data.map((item) => ({
        khachHang: item.khachHang,
        thongKe: new ThongKeModel(item.thongKe),
      }));
    } catch (error) {
      console.error("Error fetching thống kê:", error);
      throw error;
    }
  },

  getThongKeById: async (id, params = {}) => {
    try {
      const response = await api.get(`/thongkekhachhang/${id}`, { params });
      return response.data.map((item) => new ThongKeModel(item));
    } catch (error) {
      console.error(`Error fetching thống kê for khách hàng #${id}:`, error);
      throw error;
    }
  },
};
