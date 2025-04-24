import api from "./api";
import { DongHoNuocModel } from "../models/DongHoNuocModel";

export const dongHoNuocService = {
  getAllDongHoNuoc: async () => {
    try {
      const response = await api.get("/donghonuoc");
      return response.data.map((dongHo) => new DongHoNuocModel(dongHo));
    } catch (error) {
      console.error("Error fetching đồng hồ nước:", error);
      throw error;
    }
  },

  getDongHoNuocById: async (id) => {
    try {
      const response = await api.get(`/donghonuoc/${id}`);
      return new DongHoNuocModel(response.data);
    } catch (error) {
      console.error(`Error fetching đồng hồ nước #${id}:`, error);
      throw error;
    }
  },

  createDongHoNuoc: async (dongHoData) => {
    try {
      const response = await api.post(`/donghonuoc`, dongHoData);
      return new DongHoNuocModel(response.data);
    } catch (error) {
      console.error(`Error creating đồng hồ nước:`, error);
      throw error;
    }
  },

  updateDongHoNuoc: async (id, dongHoData) => {
    try {
      const response = await api.put(`/donghonuoc/${id}`, dongHoData);
      return new DongHoNuocModel(response.data);
    } catch (error) {
      console.error(`Error updating đồng hồ nước #${id}:`, error);
      throw error;
    }
  },

  getDongHoNuocByCanHo: async (canHoId) => {
    try {
      const response = await api.get(`/donghonuoc/canho/${canHoId}/latest`);
      return new DongHoNuocModel(response.data);
    } catch (error) {
      console.error(
        `Error fetching đồng hồ nước for căn hộ #${canHoId}:`,
        error
      );
      throw error;
    }
  },

  // Add a special utility method for reading the meter and creating invoice in one operation
  readMeterAndCreateInvoice: async (canHoId, chisomoi) => {
    try {
      const response = await api.post(`/donghonuoc/ghisonuoc`, null, {
        params: {
          canhoId: canHoId,
          chisomoi: chisomoi,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error reading meter and creating invoice:`, error);
      throw error;
    }
  },
};
