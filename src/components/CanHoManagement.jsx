// src/components/CanHoManagement.jsx - Updated
import React, { useState, useCallback, useContext, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  useTheme,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import ApartmentCard from "./ApartmentCard";
import { useForm } from "react-hook-form";
import { NotificationContext } from "context/NotificationContext";
import {
  useFetchCanHoByKhachHang,
  useAddCanHo,
  useEditCanHo,
  useDeleteCanHo,
} from "controllers/canHoController";

const CanHoManagement = ({ khachHangId, khachHangName, open, onClose }) => {
  const theme = useTheme();
  const { toggleNotification } = useContext(NotificationContext);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const isEditMode = Boolean(selectedApartment);

  // Form management
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm();

  // Fetch apartments for this customer
  const {
    data: apartments,
    isLoading,
    refetch,
  } = useFetchCanHoByKhachHang(khachHangId);

  // Apartment CRUD operations
  const {
    addNewCanHo,
    error: addError,
    isLoading: isAddLoading,
  } = useAddCanHo();
  const {
    editCanHo,
    error: editError,
    isLoading: isEditLoading,
  } = useEditCanHo();
  const { deleteCanHo, error: deleteError } = useDeleteCanHo();

  // Open form for adding a new apartment
  const handleOpenForm = useCallback(() => {
    setSelectedApartment(null);
    reset({
      socanho: "",
      toanha: "",
    });
    setIsFormOpen(true);
  }, [reset]);

  // Close form
  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setSelectedApartment(null);
  }, []);

  // Handle edit apartment
  const handleEditApartment = useCallback(
    (apartment) => {
      setSelectedApartment(apartment);
      setValue("socanho", apartment.socanho || "");
      setValue("toanha", apartment.toanha || "");
      setIsFormOpen(true);
    },
    [setValue]
  );

  // Handle delete apartment
  const handleDeleteApartment = useCallback(
    async (id) => {
      if (window.confirm("Bạn có chắc chắn muốn xóa căn hộ này?")) {
        try {
          const success = await deleteCanHo(id, khachHangId);
          if (success) {
            toggleNotification("Xóa căn hộ thành công", "success");
            refetch();
          } else {
            toggleNotification(deleteError || "Lỗi khi xóa căn hộ", "error");
          }
        } catch (error) {
          console.error("Delete error:", error);
          toggleNotification(
            "Đã xảy ra lỗi khi xóa căn hộ. Vui lòng thử lại.",
            "error"
          );
        }
      }
    },
    [deleteCanHo, khachHangId, refetch, toggleNotification, deleteError]
  );

  // Handle form submission
  const onSubmit = useCallback(
    async (data) => {
      try {
        let success = false;

        // Structure data for API - important to match backend expectations
        const formData = {
          ...data,
          khachhang_id: khachHangId,
        };

        if (isEditMode && selectedApartment) {
          success = await editCanHo({
            id: selectedApartment.id,
            ...formData,
          });

          if (success) {
            toggleNotification("Cập nhật căn hộ thành công", "success");
            handleCloseForm();
            refetch();
          } else {
            toggleNotification(editError || "Lỗi khi cập nhật căn hộ", "error");
          }
        } else {
          success = await addNewCanHo(formData);

          if (success) {
            toggleNotification("Thêm căn hộ thành công", "success");
            handleCloseForm();
            refetch();
          } else {
            toggleNotification(addError || "Lỗi khi thêm căn hộ", "error");
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
      selectedApartment,
      khachHangId,
      editCanHo,
      addNewCanHo,
      toggleNotification,
      handleCloseForm,
      refetch,
      editError,
      addError,
    ]
  );

  // Refresh apartment list when dialog opens
  useEffect(() => {
    if (open && khachHangId) {
      refetch();
    }
  }, [open, khachHangId, refetch]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6">Quản lý căn hộ</Typography>
            {khachHangName && (
              <Typography variant="subtitle1" color="textSecondary">
                Khách hàng: {khachHangName}
              </Typography>
            )}
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenForm}
          >
            Thêm căn hộ
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Typography>Đang tải dữ liệu...</Typography>
        ) : apartments?.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 4,
            }}
          >
            <Typography variant="body1" color="textSecondary">
              Khách hàng này chưa có căn hộ nào
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenForm}
              sx={{ mt: 2 }}
            >
              Thêm căn hộ mới
            </Button>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {apartments?.map((apartment) => (
              <Grid item xs={12} md={6} key={apartment.id}>
                <ApartmentCard
                  apartment={apartment}
                  onEdit={handleEditApartment}
                  onDelete={handleDeleteApartment}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Đóng
        </Button>
      </DialogActions>

      {/* Dialog Form for adding/editing apartments */}
      <Dialog
        open={isFormOpen}
        onClose={handleCloseForm}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {isEditMode ? "Sửa thông tin căn hộ" : "Thêm căn hộ mới"}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            {/* Display customer information (read-only) */}
            <Box
              mb={2}
              p={2}
              bgcolor={theme.palette.background.alt}
              borderRadius={1}
            >
              <Typography variant="subtitle2" color={theme.palette.neutral[10]}>
                Khách hàng:
              </Typography>
              <Typography variant="body1" color={theme.palette.neutral[0]}>
                {khachHangName || `ID: ${khachHangId}`}
              </Typography>
              <input
                type="hidden"
                {...register("khachhang_id")}
                value={khachHangId}
              />
            </Box>

            <TextField
              label="Số căn hộ"
              fullWidth
              margin="normal"
              type="number"
              error={!!errors.socanho}
              helperText={errors.socanho?.message}
              {...register("socanho", {
                required: "Số căn hộ không được để trống",
                min: {
                  value: 1,
                  message: "Số căn hộ phải lớn hơn 0",
                },
              })}
            />
            <TextField
              label="Tòa nhà"
              fullWidth
              margin="normal"
              error={!!errors.toanha}
              helperText={errors.toanha?.message}
              {...register("toanha", {
                required: "Tòa nhà không được để trống",
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
    </Dialog>
  );
};

export default React.memo(CanHoManagement);
