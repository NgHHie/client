import { useQuery } from "@tanstack/react-query";
import { thongKeService } from "../services/thongKeService";

// Controller for fetching thống kê data
export const useFetchThongKe = (
  page = 0,
  pageSize = 20,
  sort = {},
  search = {},
  start = null,
  end = null
) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ["thongKe", page, pageSize, sort, search, start, end],
    queryFn: () => {
      const params = {
        page: page + 1,
        pageSize,
        sort: JSON.stringify(sort),
        search: JSON.stringify(search),
        start,
        end,
      };
      return thongKeService.getThongKe(params);
    },
  });

  return { data, isLoading, refetch, error };
};

// Controller for fetching detailed thống kê for a specific customer
export const useFetchThongKeDetail = (
  khachHangId,
  start = null,
  end = null
) => {
  const formattedStart = start
    ? start instanceof Date
      ? start.toISOString()
      : start
    : null;
  const formattedEnd = end
    ? end instanceof Date
      ? end.toISOString()
      : end
    : null;

  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ["thongKeDetail", khachHangId, formattedStart, formattedEnd],
    queryFn: () => {
      const params = {};
      if (formattedStart) params.start = formattedStart;
      if (formattedEnd) params.end = formattedEnd;

      return thongKeService.getThongKeById(khachHangId, params);
    },
    enabled: !!khachHangId,
  });

  return { data, isLoading, refetch, error };
};
