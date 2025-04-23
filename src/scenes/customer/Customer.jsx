import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box, useTheme } from "@mui/material";
import {
  IconButton,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { DataGrid, viVN } from "@mui/x-data-grid";
import Header from "components/Header";
import DataGridCustomCustomer from "components/DataGridCustomCustomer";
import { useForm } from "react-hook-form";
import {
  useFetchKhachHang,
  useAddCustomer,
  useEditCustomer,
} from "controllers/khachHangController";

const Customer = () => {
  const theme = useTheme();
  const location = useLocation();

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const isEditMode = Boolean(selectedRow);

  const { data, isLoading, refetch } = useFetchKhachHang(
    page,
    pageSize,
    sort,
    search
  );
  console.log(data);

  const { addNewCustomer } = useAddCustomer();
  const { editCustomer } = useEditCustomer();

  const { register, handleSubmit, reset } = useForm();
  const [open, setOpen] = useState(false);

  const handleOpenForm = () => {
    setOpen(true);
    reset();
  };

  const handleCloseForm = () => {
    setOpen(false);
  };

  const onSubmit = (data) => {
    if (isEditMode) {
      const success = editCustomer(data, selectedRow, refetch);
      if (success) handleCloseForm();
    } else {
      addNewCustomer(data, refetch);
      handleCloseForm();
    }
  };

  useEffect(() => {
    refetch();
  }, [location, refetch]);

  // Define columns for DataGrid
  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "hoten", headerName: "Họ tên", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "sodienthoai", headerName: "Số điện thoại", flex: 1 },
  ];

  // Custom locale text for DataGrid
  const customLocaleText = {
    ...viVN.components.MuiDataGrid.defaultProps.localeText,
  };

  const formattedData =
    data?.map((khachHang) => ({
      id: khachHang.id,
      hoten: khachHang.hoten,
      email: khachHang.email,
      sodienthoai: khachHang.sodienthoai,
    })) || [];

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="KHÁCH HÀNG" subtitle="Quản lý danh sách khách hàng" />
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
          onRowClick={(params) => {
            setSelectedRow(params.row);
            reset(params.row); // reset form với dữ liệu dòng
            setOpen(true); // mở form sửa
          }}
          pagination
          page={page}
          pageSize={pageSize}
          paginationMode="server"
          sortingMode="server"
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          onSortModelChange={(newSortModel) => setSort(...newSortModel)}
          components={{ Toolbar: DataGridCustomCustomer }}
          componentsProps={{
            toolbar: {
              searchInput,
              setSearchInput,
              setSearch: (input) => setSearch({ input, column: search.column }), // Updated to handle column search
              columns,
              searchcolumn: "all",
              selectedColumn: search.column,
              setSelectedColumn: (column) => {
                setSearch((prev) => ({ ...prev, column })); // Update the selected column
                setPage(0); // Reset page to 0 when changing column
              },
              refetch,
              addNewCustomer,
            },
          }}
          localeText={customLocaleText}
        />
      </Box>
      {/* Dialog Form Thêm Thành Viên */}
      <Dialog open={open} onClose={handleCloseForm}>
        <DialogTitle>Sửa Thông Tin Khách Hàng</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Họ tên"
              fullWidth
              margin="dense"
              {...register("hoten", { required: true })}
            />
            <TextField
              label="Email"
              fullWidth
              margin="dense"
              {...register("email", { required: true })}
            />
            <TextField
              label="Số điện thoại"
              fullWidth
              margin="dense"
              {...register("sodienthoai", { required: true })}
            />
            <DialogActions>
              <Button onClick={handleCloseForm} color="secondary">
                Hủy
              </Button>
              <Button type="submit" color="primary" variant="contained">
                Lưu
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Customer;
