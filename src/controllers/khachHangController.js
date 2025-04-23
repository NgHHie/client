import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { khachHangService } from "../services/khachHangService";
import { KhachHangModel } from "../models/KhachHangModel";

// Controller for fetching khách hàng data
export const useFetchKhachHang = (
  page = 0,
  pageSize = 20,
  sort = {},
  search = {}
) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ["khachHang", page, pageSize, sort, search],
    queryFn: () => {
      const params = {
        page: page + 1,
        pageSize,
        sort: JSON.stringify(sort),
        search: JSON.stringify(search),
      };
      return khachHangService.getAllKhachHang(params);
    },
  });

  return { data, isLoading, refetch, error };
};

// Controller for adding a customer
export const useAddCustomer = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const addCustomerMutation = useMutation({
    mutationFn: (formData) => {
      const khachHangModel = new KhachHangModel(formData);
      const validation = khachHangModel.validate();

      if (!validation.isValid) {
        throw new Error(JSON.stringify(validation.errors));
      }

      return khachHangService.createKhachHang(khachHangModel);
    },
  });

  const addNewCustomer = async (formData, onSuccess) => {
    try {
      setIsLoading(true);
      setError(null);

      await addCustomerMutation.mutateAsync(formData);

      if (onSuccess && typeof onSuccess === "function") {
        onSuccess();
      }

      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { addNewCustomer, error, isLoading };
};

// Controller for editing a customer
export const useEditCustomer = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const editCustomerMutation = useMutation({
    mutationFn: ({ id, ...formData }) => {
      const khachHangModel = new KhachHangModel(formData);
      const validation = khachHangModel.validate();

      if (!validation.isValid) {
        throw new Error(JSON.stringify(validation.errors));
      }

      return khachHangService.updateKhachHang(id, khachHangModel);
    },
  });

  const editCustomer = async (formData, selectedRow, onSuccess) => {
    try {
      setIsLoading(true);
      setError(null);

      await editCustomerMutation.mutateAsync({
        id: selectedRow.id,
        ...formData,
      });

      if (onSuccess && typeof onSuccess === "function") {
        onSuccess();
      }

      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { editCustomer, error, isLoading };
};

// Controller for deleting a customer
export const useDeleteCustomer = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const deleteCustomerMutation = useMutation({
    mutationFn: (id) => khachHangService.deleteKhachHang(id),
  });

  const deleteCustomer = async (id, onSuccess) => {
    try {
      setIsLoading(true);
      setError(null);

      await deleteCustomerMutation.mutateAsync(id);

      if (onSuccess && typeof onSuccess === "function") {
        onSuccess();
      }

      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteCustomer, error, isLoading };
};
