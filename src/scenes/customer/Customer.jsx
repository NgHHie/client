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
import { DataGrid } from "@mui/x-data-grid";
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
import { isValidEmail, isValidPhone } from "utils/validators";

const Customer = () => {
  const theme = useTheme();
  const location = useLocation();
  const { toggleNotification } = useContext(NotificationContext);

  // Pagination and filtering state
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState({ input: "", column: "all" });
  const [searchInput, setSearchInput] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const isEditMode = Boolean(selectedRow);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Get customers data using React Query hook
  const { data, isLoading, refetch } = useFetchKhachHang(
    page,
    pageSize,
    sort,
    search
  );

  // Customer CRUD operations
  const {
    addNewCustomer,
    error: addError,
    isLoading: isAddLoading,
  } = useAddCustomer();
  const {
    editCustomer,
    error: editError,
    isLoading: isEditLoading,
  } = useEditCustomer();
  const { deleteCustomer, error: deleteError } = useDeleteCustomer();

  // Form management
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm();

  // Memoized handlers to prevent recreating functions on each render
  const handleOpenForm = useCallback(() => {
    setIsFormOpen(true);
    reset({
      hoten: "",
      email: "",
      sodienthoai: "",
    });
  }, [reset]);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setSelectedRow(null);
  }, []);

  const onSubmit = useCallback(
    async (data) => {
      try {
        let success = false;

        if (isEditMode && selectedRow) {
          success = await editCustomer({
            id: selectedRow.id,
            ...data,
          });

          if (success) {
            toggleNotification("Cập nhật khách hàng thành công", "success");
            handleCloseForm();
            refetch();
          } else {
            toggleNotification(
              editError || "Lỗi khi cập nhật khách hàng",
              "error"
            );
          }
        } else {
          success = await addNewCustomer(data);

          if (success) {
            toggleNotification("Thêm khách hàng thành công", "success");
            handleCloseForm();
            refetch();
          } else {
            toggleNotification(addError || "Lỗi khi thêm khách hàng", "error");
          }
        }
      } catch (error) {
        console.error("Form submission error:", error);
        toggleNotification(
          "Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng thử lại.",
          "error"
        );
      }
    },
    [
      isEditMode,
      selectedRow,
      editCustomer,
      addNewCustomer,
      toggleNotification,
      editError,
      addError,
      handleCloseForm,
      refetch,
    ]
  );

  const handleDeleteCustomer = useCallback(
    async (id) => {
      if (window.confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
        try {
          const success = await deleteCustomer(id);

          if (success) {
            toggleNotification("Xóa khách hàng thành công", "success");
            refetch();
          } else {
            toggleNotification(
              deleteError || "Lỗi khi xóa khách hàng",
              "error"
            );
          }
        } catch (error) {
          console.error("Delete error:", error);
          toggleNotification(
            "Đã xảy ra lỗi khi xóa khách hàng. Vui lòng thử lại.",
            "error"
          );
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

      // Populate form with selected customer data
      setValue("hoten", params.row.hoten || "");
      setValue("email", params.row.email || "");
      setValue("sodienthoai", params.row.sodienthoai || "");

      setIsFormOpen(true);
    },
    [setValue]
  );

  // Handle search with memoized callback
  const handleSearch = useCallback(
    (input) => {
      setSearch((prevSearch) => ({ ...prevSearch, input }));
      setPage(0); // Reset to first page on new search
      refetch();
    },
    [refetch]
  );

  // Handle sort model changes with memoized callback
  const handleSortModelChange = useCallback(
    (newSortModel) => {
      if (newSortModel && newSortModel.length > 0) {
        setSort({
          field: newSortModel[0].field,
          sort: newSortModel[0].sort,
        });
      } else {
        setSort({});
      }
      refetch();
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
        sortable: false,
        filterable: false,
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
          disableSelectionOnClick
        />
      </Box>

      {/* Dialog Form Thêm/Sửa Khách Hàng */}
      <Dialog
        open={isFormOpen}
        onClose={handleCloseForm}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {isEditMode ? "Sửa Thông Tin Khách Hàng" : "Thêm Khách Hàng"}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              label="Họ tên"
              fullWidth
              margin="normal"
              error={!!errors.hoten}
              helperText={errors.hoten?.message}
              {...register("hoten", {
                required: "Họ tên không được để trống",
              })}
            />
            <TextField
              label="Email"
              fullWidth
              margin="normal"
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
              margin="normal"
              error={!!errors.sodienthoai}
              helperText={errors.sodienthoai?.message}
              {...register("sodienthoai", {
                required: "Số điện thoại không được để trống",
                validate: (value) =>
                  isValidPhone(value) || "Số điện thoại không hợp lệ",
              })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseForm} color="secondary">
              Hủy
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={isAddLoading || isEditLoading}
            >
              {isEditMode ? "Cập nhật" : "Thêm mới"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default React.memo(Customer);
