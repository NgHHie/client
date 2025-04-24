// src/controllers/canHoController.js
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { canHoService } from "../services/canHoService";
import { CanHoModel } from "../models/CanHoModel";

// Controller for fetching apartments by customer
export const useFetchCanHoByKhachHang = (khachHangId) => {
  return useQuery({
    queryKey: ["canHo", khachHangId],
    queryFn: async () => {
      if (!khachHangId) return [];

      try {
        const response = await canHoService.getCanHoByKhachHang(khachHangId);
        return response;
      } catch (error) {
        console.error(
          `Error fetching apartments for customer #${khachHangId}:`,
          error
        );
        throw error;
      }
    },
    enabled: !!khachHangId,
    refetchOnWindowFocus: false,
  });
};

// Controller for adding an apartment
export const useAddCanHo = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const addCanHoMutation = useMutation({
    mutationFn: async (formData) => {
      // Create model and validate
      const canHoModel = new CanHoModel(formData);
      const validation = canHoModel.validate();

      if (!validation.isValid) {
        const errorMessages = Object.values(validation.errors).join(", ");
        throw new Error(errorMessages);
      }

      // Send to API
      console.log(canHoModel);
      return await canHoService.createCanHo(canHoModel);
    },
    onSuccess: (_, variables) => {
      // Invalidate cache to trigger a refetch
      queryClient.invalidateQueries(["canHo", variables.khachhang_id]);
    },
    onError: (error) => {
      console.error("Add apartment error:", error);
      setError(error.message || "Đã xảy ra lỗi khi thêm căn hộ");
    },
  });

  const addNewCanHo = async (formData) => {
    try {
      setIsLoading(true);
      setError(null);

      await addCanHoMutation.mutateAsync(formData);
      return true;
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi thêm căn hộ");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addNewCanHo,
    error,
    isLoading: isLoading || addCanHoMutation.isLoading,
  };
};

// Controller for editing an apartment
export const useEditCanHo = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const editCanHoMutation = useMutation({
    mutationFn: async (apartmentData) => {
      const { id, ...formData } = apartmentData;

      if (!id) {
        throw new Error("ID căn hộ không được để trống");
      }

      // Create model and validate
      const canHoModel = new CanHoModel(formData);
      const validation = canHoModel.validate();

      if (!validation.isValid) {
        const errorMessages = Object.values(validation.errors).join(", ");
        throw new Error(errorMessages);
      }

      // Send to API
      return await canHoService.updateCanHo(id, canHoModel);
    },
    onSuccess: (_, variables) => {
      // Invalidate cache to trigger a refetch
      queryClient.invalidateQueries(["canHo", variables.khachhang_id]);
    },
    onError: (error) => {
      console.error("Edit apartment error:", error);
      setError(error.message || "Đã xảy ra lỗi khi cập nhật căn hộ");
    },
  });

  const editCanHo = async (apartmentData) => {
    try {
      setIsLoading(true);
      setError(null);

      await editCanHoMutation.mutateAsync(apartmentData);
      return true;
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi cập nhật căn hộ");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    editCanHo,
    error,
    isLoading: isLoading || editCanHoMutation.isLoading,
  };
};

// Controller for deleting an apartment
export const useDeleteCanHo = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const deleteCanHoMutation = useMutation({
    mutationFn: async ({ id, khachhangId }) => {
      if (!id) {
        throw new Error("ID căn hộ không được để trống");
      }

      return await canHoService.deleteCanHo(id);
    },
    onSuccess: (_, variables) => {
      // Invalidate cache to trigger a refetch
      queryClient.invalidateQueries(["canHo", variables.khachhangId]);
    },
    onError: (error) => {
      console.error("Delete apartment error:", error);
      setError(error.message || "Đã xảy ra lỗi khi xóa căn hộ");
    },
  });

  const deleteCanHo = async (id, khachhangId) => {
    try {
      setIsLoading(true);
      setError(null);

      await deleteCanHoMutation.mutateAsync({ id, khachhangId });
      return true;
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi xóa căn hộ");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteCanHo,
    error,
    isLoading: isLoading || deleteCanHoMutation.isLoading,
  };
};
