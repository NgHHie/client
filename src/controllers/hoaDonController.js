import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { hoaDonService } from "../services/hoaDonService";

// Controller for creating a new invoice
export const useCreateHoaDon = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const createHoaDonMutation = useMutation({
    mutationFn: (hoaDonData) => hoaDonService.createHoaDon(hoaDonData),
    onSuccess: () => {
      queryClient.invalidateQueries(["hoaDon"]);
    },
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
  const queryClient = useQueryClient();

  const updateHoaDonMutation = useMutation({
    mutationFn: ({ id, trangthai }) => {
      // Since our API uses updatePaymentStatus with amount parameter
      // We'll adapt this based on the trangthai value
      if (trangthai === "Đã thanh toán") {
        return hoaDonService.updatePaymentStatus(id, 0); // 0 as a placeholder, actual amount is in the invoice
      } else {
        return hoaDonService.updateHoaDon(id, { trangthai });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["hoaDon"]);
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
