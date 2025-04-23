// src/scenes/thongke/ThongKe.jsx
import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  useTheme,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { DataGrid, viVN } from "@mui/x-data-grid";
import Header from "components/Header";
import DataGridCustomToolbar from "components/DataGridCustomToolbar";
import { NotificationContext } from "context/NotificationContext";
import {
  useFetchThongKe,
  useFetchThongKeDetail,
} from "controllers/thongKeController";
import { formatCurrency, formatDate } from "utils/formatters";

const ThongKe = () => {
  const theme = useTheme();
  const location = useLocation();
  const { toggleNotification } = useContext(NotificationContext);

  // State for DataGrid
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState({});
  const [searchInput, setSearchInput] = useState("");

  // State for filtering by revenue range
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  // State for detailed statistics dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [detailStartDate, setDetailStartDate] = useState("");
  const [detailEndDate, setDetailEndDate] = useState("");

  // Fetch overview statistics
  const { data, isLoading, refetch } = useFetchThongKe(
    page,
    pageSize,
    sort,
    search,
    start || null,
    end || null
  );

  // Fetch detailed statistics for the selected customer
  const {
    data: detailData,
    isLoading: isLoadingDetail,
    refetch: refetchDetail,
  } = useFetchThongKeDetail(
    selectedCustomerId,
    detailStartDate || null,
    detailEndDate || null
  );

  // Refresh data when location changes - with proper dependencies
  useEffect(() => {
    refetch();
  }, [location, refetch]);

  // Handle opening the detail dialog
  const handleRowClick = useCallback((params) => {
    setSelectedCustomerId(params.row.id);
    setOpenDialog(true);
    // We'll refetch in an effect after state updates are complete
  }, []);

  // Effect for refetching detail data when selectedCustomerId changes
  useEffect(() => {
    if (selectedCustomerId) {
      refetchDetail();
    }
  }, [selectedCustomerId, refetchDetail]);

  // Handle closing the detail dialog
  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setSelectedCustomerId(null);
    setDetailStartDate("");
    setDetailEndDate("");
  }, []);

  // Apply date filters in detail view
  const handleApplyDetailFilters = useCallback(() => {
    refetchDetail();
  }, [refetchDetail]);

  // Handle sort model changes
  const handleSortModelChange = useCallback((newSortModel) => {
    if (newSortModel && newSortModel.length > 0) {
      setSort(newSortModel[0]);
    } else {
      setSort({});
    }
  }, []);

  // Define columns for the overview DataGrid
  const columns = useMemo(
    () => [
      { field: "id", headerName: "ID", flex: 0.5 },
      { field: "hoten", headerName: "Họ tên", flex: 1 },
      { field: "email", headerName: "Email", flex: 1 },
      {
        field: "doanhthu",
        headerName: "Doanh thu",
        flex: 1,
        valueFormatter: (params) => formatCurrency(params.value),
      },
      { field: "sodonhang", headerName: "Số đơn hàng", flex: 0.8 },
      { field: "xephang", headerName: "Xếp hạng", flex: 0.8 },
    ],
    []
  );

  // Format the data for the DataGrid
  const formattedData = useMemo(
    () =>
      data?.map(({ khachHang, thongKe }) => ({
        id: khachHang.id,
        hoten: khachHang.hoten,
        email: khachHang.email,
        sodienthoai: khachHang.sodienthoai,
        doanhthu: thongKe.doanhthu,
        sodonhang: thongKe.sodonhang,
        xephang: thongKe.xephang,
      })) || [],
    [data]
  );

  // Memoize toolbar props
  const toolbarProps = useMemo(
    () => ({
      searchInput,
      setSearchInput,
      setSearch: (input) => setSearch((prev) => ({ ...prev, input })),
      columns,
      searchcolumn: "all",
      selectedColumn: search.column,
      setSelectedColumn: (column) => {
        setSearch((prev) => ({ ...prev, column }));
        setPage(0);
      },
      start,
      end,
      setStart,
      setEnd,
      refetch,
    }),
    [searchInput, columns, search.column, start, end, refetch]
  );

  // Custom locale text for DataGrid
  const customLocaleText = useMemo(
    () => ({
      ...viVN.components.MuiDataGrid.defaultProps.localeText,
    }),
    []
  );

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="THỐNG KÊ KHÁCH HÀNG"
        subtitle="Doanh thu và hoạt động của khách hàng"
      />

      {/* Overview DataGrid */}
      <Box
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.neutral[0],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.neutral[10],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.neutral[10]} !important`,
          },
        }}
      >
        <DataGrid
          loading={isLoading || !data}
          getRowId={(row) => row.id}
          rows={formattedData}
          columns={columns}
          rowCount={formattedData.length}
          rowsPerPageOptions={[20, 50, 100]}
          pagination
          page={page}
          pageSize={pageSize}
          paginationMode="server"
          sortingMode="server"
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          onSortModelChange={handleSortModelChange}
          onRowClick={handleRowClick}
          components={{ Toolbar: DataGridCustomToolbar }}
          componentsProps={{
            toolbar: toolbarProps,
          }}
          localeText={customLocaleText}
          disableSelectionOnClick
        />
      </Box>

      {/* Detailed Statistics Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Chi tiết thống kê khách hàng</DialogTitle>
        <DialogContent>
          {isLoadingDetail ? (
            <Typography>Đang tải dữ liệu...</Typography>
          ) : detailData ? (
            <Box>
              {/* Filter controls */}
              <Box display="flex" gap={2} mb={3} mt={1}>
                <TextField
                  label="Từ ngày"
                  type="date"
                  value={detailStartDate}
                  onChange={(e) => setDetailStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Đến ngày"
                  type="date"
                  value={detailEndDate}
                  onChange={(e) => setDetailEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <Button variant="contained" onClick={handleApplyDetailFilters}>
                  Áp dụng
                </Button>
              </Box>

              {/* Basic Statistics */}
              <Box
                sx={{
                  backgroundColor: theme.palette.background.alt,
                  p: 2,
                  borderRadius: 1,
                  mb: 2,
                }}
              >
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Thống kê cơ bản
                </Typography>
                <Box
                  display="grid"
                  gridTemplateColumns="repeat(3, 1fr)"
                  gap={2}
                >
                  <Box>
                    <Typography variant="body1">Tổng doanh thu</Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {formatCurrency(detailData[0]?.doanhthu)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body1">Số đơn hàng</Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {detailData[0]?.sodonhang || 0}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body1">Xếp hạng</Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {detailData[0]?.xephang || "Silver"}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Advanced Statistics */}
              <Box
                sx={{
                  backgroundColor: theme.palette.background.alt,
                  p: 2,
                  borderRadius: 1,
                }}
              >
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Thống kê nâng cao
                </Typography>
                <Box
                  display="grid"
                  gridTemplateColumns="repeat(2, 1fr)"
                  gap={2}
                >
                  <Box>
                    <Typography variant="body1">
                      Ngày đặt hàng gần nhất
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {detailData[1]?.lastOrderDate
                        ? formatDate(detailData[1].lastOrderDate)
                        : "Chưa có"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body1">
                      Số ngày không hoạt động
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {detailData[1]?.inactiveDays || 0}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body1">
                      Doanh thu trong khoảng thời gian
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {formatCurrency(detailData[1]?.doanhthu)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body1">
                      Số đơn trong khoảng thời gian
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {detailData[1]?.sodonhang || 0}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          ) : (
            <Typography>Không có dữ liệu</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default React.memo(ThongKe);
