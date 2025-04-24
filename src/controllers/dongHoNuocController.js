import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dongHoNuocService } from "../services/dongHoNuocService";
import { DongHoNuocModel } from "../models/DongHoNuocModel";

// Controller for fetching đồng hồ nước by căn hộ
export const useFetchDongHoNuocByCanHo = (canHoId) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ["dongHoNuoc", canHoId],
    queryFn: () => dongHoNuocService.getDongHoNuocByCanHo(canHoId),
    enabled: !!canHoId, // Only run query if we have a canHoId
    retry: false, // Don't retry if there's an error (e.g., 404 when meter doesn't exist)
  });

  return { data, isLoading, refetch, error };
};

export const useUpdateDongHoNuoc = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const updateDongHoNuocMutation = useMutation({
    mutationFn: ({ id, ...dongHoData }) => {
      // If id is 0, this is a create operation
      if (id === 0) {
        return dongHoNuocService.createDongHoNuoc(dongHoData);
      } else {
        return dongHoNuocService.updateDongHoNuoc(id, dongHoData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries("dongHoNuoc");
    },
  });

  const updateDongHoNuoc = async (id, dongHoData, onSuccess) => {
    try {
      setIsLoading(true);
      setError(null);

      // Ensure new reading is greater than old reading if this is an update
      if (id !== 0 && dongHoData.chisomoi < dongHoData.chisocu) {
        throw new Error("Chỉ số mới không thể nhỏ hơn chỉ số cũ");
      }

      await updateDongHoNuocMutation.mutateAsync({ id, ...dongHoData });

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

  return { updateDongHoNuoc, error, isLoading };
};

// Controller for creating a new water meter
export const useCreateDongHoNuoc = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const createDongHoNuocMutation = useMutation({
    mutationFn: (dongHoData) => {
      const dongHoModel = new DongHoNuocModel(dongHoData);
      return dongHoNuocService.createDongHoNuoc(dongHoModel);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("dongHoNuoc");
    },
  });

  const createDongHoNuoc = async (dongHoData, onSuccess) => {
    try {
      setIsLoading(true);
      setError(null);

      await createDongHoNuocMutation.mutateAsync(dongHoData);

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

  return { createDongHoNuoc, error, isLoading };
};
