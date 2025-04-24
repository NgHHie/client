// src/scenes/customer/Customer.jsx - Fixed version
import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { useLocation } from "react-router-dom";
import { Box, useTheme } from "@mui/material";
import {
  TextField,
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
import { NotificationContext } from "context/NotificationContext";
import {
  useFetchKhachHang,
  useAddCustomer,
  useEditCustomer,
  useDeleteCustomer,
} from "controllers/khachHangController";
import { isValidEmail, isValidPhone, isRequired } from "utils/validators";

const Customer = () => {
  const theme = useTheme();
  const location = useLocation();
  const { toggleNotification } = useContext(NotificationContext);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState({ input: "", column: "all" });
  const [searchInput, setSearchInput] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const isEditMode = Boolean(selectedRow);

  // Get customers data
  const { data, isLoading, refetch } = useFetchKhachHang(
    page,
    pageSize,
    sort,
    search
  );

  // Customer CRUD operations
  const { addNewCustomer, error: addError } = useAddCustomer();
  const { editCustomer, error: editError } = useEditCustomer();
  const { deleteCustomer, error: deleteError } = useDeleteCustomer();

  // Form management
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [open, setOpen] = useState(false);

  // Memoized handlers to prevent recreating functions on each render
  const handleOpenForm = useCallback(() => {
    setOpen(true);
    reset({
      hoten: "",
      email: "",
      sodienthoai: "",
    });
  }, [reset]);

  const handleCloseForm = useCallback(() => {
    setOpen(false);
    setSelectedRow(null);
  }, []);

  const onSubmit = useCallback(
    async (data) => {
      let success = false;

      if (isEditMode) {
        success = await editCustomer(data, selectedRow, () => {
          refetch();
        });
        if (success) {
          toggleNotification("Cập nhật khách hàng thành công", "success");
          handleCloseForm();
        } else {
          toggleNotification(
            editError || "Lỗi khi cập nhật khách hàng",
            "error"
          );
        }
      } else {
        success = await addNewCustomer(data, () => {
          refetch();
        });
        if (success) {
          toggleNotification("Thêm khách hàng thành công", "success");
          handleCloseForm();
        } else {
          toggleNotification(addError || "Lỗi khi thêm khách hàng", "error");
        }
      }
    },
    [
      isEditMode,
      editCustomer,
      selectedRow,
      refetch,
      toggleNotification,
      editError,
      addNewCustomer,
      addError,
      handleCloseForm,
    ]
  );

  const handleDeleteCustomer = useCallback(
    async (id) => {
      if (window.confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
        const success = await deleteCustomer(id, () => {
          refetch();
        });
        if (success) {
          toggleNotification("Xóa khách hàng thành công", "success");
        } else {
          toggleNotification(deleteError || "Lỗi khi xóa khách hàng", "error");
        }
      }
    },
    [deleteCustomer, refetch, toggleNotification, deleteError]
  );

  // Run once when location changes, not on every render
  useEffect(() => {
    refetch();
  }, [location, refetch]);

  // Handle row click with memoized callback
  const handleRowClick = useCallback(
    (params) => {
      setSelectedRow(params.row);
      reset({
        hoten: params.row.hoten,
        email: params.row.email,
        sodienthoai: params.row.sodienthoai,
      });
      setOpen(true);
    },
    [reset]
  );

  // Handle search with memoized callback
  const handleSearch = useCallback(
    (input) => {
      setSearch((prevSearch) => ({ ...prevSearch, input }));
      refetch();
    },
    [refetch]
  );

  // Handle sort model changes with memoized callback
  const handleSortModelChange = useCallback(
    (newSortModel) => {
      if (newSortModel && newSortModel.length > 0) {
        setSort(newSortModel[0]);
        refetch();
      } else {
        setSort({});
      }
    },
    [refetch]
  );

  // Define columns with memoized actions
  const columns = useMemo(
    () => [
      { field: "id", headerName: "ID", flex: 0.5 },
      { field: "hoten", headerName: "Họ tên", flex: 1 },
      { field: "email", headerName: "Email", flex: 1 },
      { field: "sodienthoai", headerName: "Số điện thoại", flex: 1 },
      {
        field: "actions",
        headerName: "Thao tác",
        flex: 1,
        renderCell: (params) => (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={(e) => {
                e.stopPropagation(); // Prevent row selection
                handleRowClick(params);
              }}
            >
              Sửa
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={(e) => {
                e.stopPropagation(); // Prevent row selection
                handleDeleteCustomer(params.row.id);
              }}
            >
              Xóa
            </Button>
          </Box>
        ),
      },
    ],
    [handleRowClick, handleDeleteCustomer]
  );

  // Memoize toolbar props to avoid recreating on every render
  const toolbarProps = useMemo(
    () => ({
      searchInput,
      setSearchInput,
      setSearch: handleSearch,
      columns,
      searchcolumn: "all",
      selectedColumn: search.column,
      setSelectedColumn: (column) => {
        setSearch((prev) => ({ ...prev, column }));
        setPage(0);
        refetch();
      },
      refetch,
      handleOpenForm,
    }),
    [searchInput, handleSearch, columns, search.column, refetch, handleOpenForm]
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
          rows={data || []}
          columns={columns}
          rowCount={(data || []).length}
          rowsPerPageOptions={[20, 50, 100]}
          pagination
          page={page}
          pageSize={pageSize}
          paginationMode="server"
          sortingMode="server"
          onPageChange={(newPage) => {
            setPage(newPage);
            refetch();
          }}
          onPageSizeChange={(newPageSize) => {
            setPageSize(newPageSize);
            refetch();
          }}
          onSortModelChange={handleSortModelChange}
          components={{ Toolbar: DataGridCustomCustomer }}
          componentsProps={{
            toolbar: toolbarProps,
          }}
          localeText={customLocaleText}
          disableSelectionOnClick
        />
      </Box>

      {/* Dialog Form Thêm/Sửa Khách Hàng */}
      <Dialog open={open} onClose={handleCloseForm}>
        <DialogTitle>
          {isEditMode ? "Sửa Thông Tin Khách Hàng" : "Thêm Khách Hàng"}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Họ tên"
              fullWidth
              margin="dense"
              error={!!errors.hoten}
              helperText={errors.hoten?.message}
              {...register("hoten", {
                required: "Họ tên không được để trống",
              })}
            />
            <TextField
              label="Email"
              fullWidth
              margin="dense"
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register("email", {
                required: "Email không được để trống",
                validate: (value) =>
                  isValidEmail(value) || "Email không hợp lệ",
              })}
            />
            <TextField
              label="Số điện thoại"
              fullWidth
              margin="dense"
              error={!!errors.sodienthoai}
              helperText={errors.sodienthoai?.message}
              {...register("sodienthoai", {
                required: "Số điện thoại không được để trống",
                validate: (value) =>
                  isValidPhone(value) || "Số điện thoại không hợp lệ",
              })}
            />
            <DialogActions>
              <Button onClick={handleCloseForm} color="secondary">
                Hủy
              </Button>
              <Button type="submit" color="primary" variant="contained">
                {isEditMode ? "Cập nhật" : "Thêm mới"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default React.memo(Customer);
