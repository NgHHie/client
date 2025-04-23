import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { dongHoNuocService } from '../services/dongHoNuocService';
import { DongHoNuocModel } from '../models/DongHoNuocModel';

// Controller for fetching đồng hồ nước by căn hộ
export const useFetchDongHoNuocByCanHo = (canHoId) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ['dongHoNuoc', canHoId],
    queryFn: () => dongHoNuocService.getDongHoNuocByCanHo(canHoId),
    enabled: !!canHoId // Only run query if we have a canHoId
  });

  return { data, isLoading, refetch, error };
};

export const useUpdateDongHoNuoc = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateDongHoNuocMutation = useMutation({
    mutationFn: ({ id, ...dongHoData }) => {
      return dongHoNuocService.updateDongHoNuoc(id, dongHoData);
    }
  });

  const updateDongHoNuoc = async (id, dongHoData, onSuccess) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Ensure new reading is greater than old reading
      if (dongHoData.chisomoi < dongHoData.chisocu) {
        throw new Error('Chỉ số mới không thể nhỏ hơn chỉ số cũ');
      }
      
      await updateDongHoNuocMutation.mutateAsync({ id, ...dongHoData });
      
      if (onSuccess && typeof onSuccess === 'function') {
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