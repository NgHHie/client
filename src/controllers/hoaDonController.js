import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { hoaDonService } from "../services/hoaDonService";

// Controller for creating a new invoice
export const useCreateHoaDon = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const createHoaDonMutation = useMutation({
    mutationFn: (hoaDonData) => hoaDonService.createHoaDon(hoaDonData),
  });

  const createHoaDon = async (hoaDonData, onSuccess) => {
    try {
      setIsLoading(true);
      setError(null);

      await createHoaDonMutation.mutateAsync(hoaDonData);

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

  return { createHoaDon, error, isLoading };
};

// Controller for fetching invoices for a specific customer
export const useFetchHoaDonByKhachHang = (khachHangId, params = {}) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ["hoaDon", khachHangId, params],
    queryFn: () => hoaDonService.getHoaDonByKhachHang(khachHangId, params),
    enabled: !!khachHangId, // Only run query if we have an ID
  });

  return { data, isLoading, refetch, error };
};

// Controller for updating an invoice's status
export const useUpdateHoaDonStatus = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateHoaDonMutation = useMutation({
    mutationFn: ({ id, trangthai }) => {
      return hoaDonService.updateHoaDon(id, { trangthai });
    },
  });

  const updateHoaDonStatus = async (id, trangthai, onSuccess) => {
    try {
      setIsLoading(true);
      setError(null);

      await updateHoaDonMutation.mutateAsync({ id, trangthai });

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

  return { updateHoaDonStatus, error, isLoading };
};
