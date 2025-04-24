// src/controllers/khachHangController.js - Fixed version
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { khachHangService } from "../services/khachHangService";
import { KhachHangModel } from "../models/KhachHangModel";

// Controller for fetching khách hàng data with pagination, sorting and filtering
export const useFetchKhachHang = (
  page = 0,
  pageSize = 20,
  sort = {},
  search = {}
) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ["khachHang", page, pageSize, sort, search],
    queryFn: async () => {
      try {
        // Prepare parameters according to API specification
        const params = {
          page: page + 1, // API uses 1-based pagination
          size: pageSize,
        };

        // Handle sort parameter
        if (sort && sort.field) {
          params.sort = JSON.stringify({
            field: sort.field,
            sort: sort.sort || "asc",
          });
        }

        // Handle search parameter
        if (search && search.input) {
          params.search = JSON.stringify({
            input: search.input,
            column: search.column || "all",
          });
        }

        const response = await khachHangService.getAllKhachHang(params);
        return response;
      } catch (error) {
        console.error("Error fetching customers:", error);
        throw error;
      }
    },
    // Disable auto-refetching to have more control
    refetchOnWindowFocus: false,
  });

  return { data, isLoading, refetch, error };
};

// Controller for adding a customer
export const useAddCustomer = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const addCustomerMutation = useMutation({
    mutationFn: async (formData) => {
      // Create model and validate
      const khachHangModel = new KhachHangModel(formData);
      const validation = khachHangModel.validate();

      if (!validation.isValid) {
        const errorMessages = Object.values(validation.errors).join(", ");
        throw new Error(errorMessages);
      }

      // Send to API
      return await khachHangService.createKhachHang(khachHangModel);
    },
    onSuccess: () => {
      // Invalidate cache to trigger a refetch
      queryClient.invalidateQueries(["khachHang"]);
    },
    onError: (error) => {
      console.error("Add customer error:", error);
      setError(error.message || "Đã xảy ra lỗi khi thêm khách hàng");
    },
  });

  const addNewCustomer = async (formData) => {
    try {
      setIsLoading(true);
      setError(null);

      await addCustomerMutation.mutateAsync(formData);
      return true;
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi thêm khách hàng");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addNewCustomer,
    error,
    isLoading: isLoading || addCustomerMutation.isLoading,
  };
};

// Controller for editing a customer
export const useEditCustomer = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const editCustomerMutation = useMutation({
    mutationFn: async (customerData) => {
      const { id, ...formData } = customerData;

      if (!id) {
        throw new Error("ID khách hàng không được để trống");
      }

      // Create model and validate
      const khachHangModel = new KhachHangModel(formData);
      const validation = khachHangModel.validate();

      if (!validation.isValid) {
        const errorMessages = Object.values(validation.errors).join(", ");
        throw new Error(errorMessages);
      }

      // Send to API
      return await khachHangService.updateKhachHang(id, khachHangModel);
    },
    onSuccess: () => {
      // Invalidate cache to trigger a refetch
      queryClient.invalidateQueries(["khachHang"]);
    },
    onError: (error) => {
      console.error("Edit customer error:", error);
      setError(error.message || "Đã xảy ra lỗi khi cập nhật khách hàng");
    },
  });

  const editCustomer = async (customerData) => {
    try {
      setIsLoading(true);
      setError(null);

      await editCustomerMutation.mutateAsync(customerData);
      return true;
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi cập nhật khách hàng");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    editCustomer,
    error,
    isLoading: isLoading || editCustomerMutation.isLoading,
  };
};

// Controller for deleting a customer
export const useDeleteCustomer = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const deleteCustomerMutation = useMutation({
    mutationFn: async (id) => {
      if (!id) {
        throw new Error("ID khách hàng không được để trống");
      }

      return await khachHangService.deleteKhachHang(id);
    },
    onSuccess: () => {
      // Invalidate cache to trigger a refetch
      queryClient.invalidateQueries(["khachHang"]);
    },
    onError: (error) => {
      console.error("Delete customer error:", error);
      setError(error.message || "Đã xảy ra lỗi khi xóa khách hàng");
    },
  });

  const deleteCustomer = async (id) => {
    try {
      setIsLoading(true);
      setError(null);

      await deleteCustomerMutation.mutateAsync(id);
      return true;
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi xóa khách hàng");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteCustomer,
    error,
    isLoading: isLoading || deleteCustomerMutation.isLoading,
  };
};
