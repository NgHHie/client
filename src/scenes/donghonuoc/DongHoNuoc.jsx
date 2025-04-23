// src/scenes/donghonuoc/DongHoNuoc.jsx
import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  useTheme,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  Divider,
} from "@mui/material";
import { DataGrid, viVN } from "@mui/x-data-grid";
import { useForm, Controller } from "react-hook-form";
import Header from "components/Header";
import { NotificationContext } from "context/NotificationContext";
import { useFetchKhachHang } from "controllers/khachHangController";
import {
  useFetchDongHoNuocByCanHo,
  useUpdateDongHoNuoc,
} from "controllers/dongHoNuocController";
import {
  useCreateHoaDon,
  useFetchHoaDonByKhachHang,
  useUpdateHoaDonStatus,
} from "controllers/hoaDonController";
import {
  formatCurrency,
  formatDate,
  calculateWaterAmount,
} from "utils/formatters";
import { isValidMeterReading } from "utils/validators";

const DongHoNuoc = () => {
  const theme = useTheme();
  const location = useLocation();
  const { toggleNotification } = useContext(NotificationContext);

  // States for customer and apartment selection
  const [selectedKhachHang, setSelectedKhachHang] = useState(null);
  const [selectedCanHo, setSelectedCanHo] = useState(null);

  // States for dialog controls
  const [openMeterDialog, setOpenMeterDialog] = useState(false);
  const [openInvoiceDialog, setOpenInvoiceDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // State for consumption preview
  const [consumption, setConsumption] = useState(0);
  const [amount, setAmount] = useState(0);

  // Fetch customers
  const { data: customers, isLoading: isLoadingCustomers } =
    useFetchKhachHang();

  // Fetch water meter for selected apartment
  const {
    data: dongHoNuoc,
    isLoading: isLoadingDongHoNuoc,
    refetch: refetchDongHoNuoc,
  } = useFetchDongHoNuocByCanHo(selectedCanHo?.id);

  // Fetch invoices for selected customer
  const {
    data: invoices,
    isLoading: isLoadingInvoices,
    refetch: refetchInvoices,
  } = useFetchHoaDonByKhachHang(selectedKhachHang?.id);

  // Mutations
  const { updateDongHoNuoc, error: updateMeterError } = useUpdateDongHoNuoc();
  const { createHoaDon, error: createInvoiceError } = useCreateHoaDon();
  const { updateHoaDonStatus, error: updateStatusError } =
    useUpdateHoaDonStatus();

  // Form control
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm();

  // Watch meter reading values for immediate feedback
  const watchChiSoMoi = watch("chisomoi", 0);

  // Update consumption preview when meter readings change
  useEffect(() => {
    if (dongHoNuoc && watchChiSoMoi) {
      const newConsumption = Math.max(
        0,
        parseFloat(watchChiSoMoi) - dongHoNuoc.chisocu
      );
      setConsumption(newConsumption);
      setAmount(calculateWaterAmount(newConsumption));
    }
  }, [watchChiSoMoi, dongHoNuoc]);

  // Refetch data when location changes
  useEffect(() => {
    if (selectedCanHo?.id) {
      refetchDongHoNuoc();
    }
    if (selectedKhachHang?.id) {
      refetchInvoices();
    }
  }, [
    location,
    selectedCanHo,
    selectedKhachHang,
    refetchDongHoNuoc,
    refetchInvoices,
  ]);

  // Handle customer selection
  const handleKhachHangChange = (event) => {
    const khId = event.target.value;
    const kh = customers.find((c) => c.id.toString() === khId.toString());
    setSelectedKhachHang(kh);
    setSelectedCanHo(null); // Reset apartment selection when customer changes
  };

  // Handle apartment selection
  const handleCanHoChange = (event) => {
    const chId = event.target.value;
    const canHo = selectedKhachHang.canho.find(
      (ch) => ch.id.toString() === chId.toString()
    );
    setSelectedCanHo(canHo);
  };

  // Open meter reading dialog
  const handleOpenMeterDialog = () => {
    if (!dongHoNuoc) {
      toggleNotification("Không tìm thấy đồng hồ nước cho căn hộ này", "error");
      return;
    }

    reset({
      chisocu: dongHoNuoc.chisocu,
      chisomoi: dongHoNuoc.chisomoi,
    });

    setOpenMeterDialog(true);
  };

  // Close meter reading dialog
  const handleCloseMeterDialog = () => {
    setOpenMeterDialog(false);
    setConsumption(0);
    setAmount(0);
  };

  // Submit meter reading updates
  const onSubmitMeterReading = async (data) => {
    if (!dongHoNuoc) return;

    const success = await updateDongHoNuoc(
      dongHoNuoc.id,
      {
        chisocu: parseFloat(data.chisocu),
        chisomoi: parseFloat(data.chisomoi),
        canho_id: selectedCanHo.id,
      },
      () => {
        refetchDongHoNuoc();
      }
    );

    if (success) {
      toggleNotification("Cập nhật chỉ số đồng hồ thành công", "success");
      handleCloseMeterDialog();
    } else {
      toggleNotification(
        updateMeterError || "Lỗi khi cập nhật chỉ số đồng hồ",
        "error"
      );
    }
  };

  // Create new invoice
  const handleCreateInvoice = async () => {
    if (!dongHoNuoc || !selectedKhachHang) return;

    const newConsumption = dongHoNuoc.chisomoi - dongHoNuoc.chisocu;
    if (newConsumption <= 0) {
      toggleNotification(
        "Không thể tạo hóa đơn với lượng tiêu thụ không dương",
        "error"
      );
      return;
    }

    const invoiceAmount = calculateWaterAmount(newConsumption);

    const hoaDonData = {
      ngaylap: new Date().toISOString(),
      tongsotien: invoiceAmount,
      khachhangId: selectedKhachHang.id,
      donghonuocId: dongHoNuoc.id,
      trangthai: "Chưa thanh toán",
    };

    const success = await createHoaDon(hoaDonData, () => {
      refetchInvoices();

      // Update the old reading with the new one
      updateDongHoNuoc(
        dongHoNuoc.id,
        {
          chisocu: dongHoNuoc.chisomoi,
          chisomoi: dongHoNuoc.chisomoi,
          canho_id: selectedCanHo.id,
        },
        () => {
          refetchDongHoNuoc();
        }
      );
    });

    if (success) {
      toggleNotification("Tạo hóa đơn thành công", "success");
    } else {
      toggleNotification(createInvoiceError || "Lỗi khi tạo hóa đơn", "error");
    }
  };

  // Handle payment for an invoice
  const handlePayInvoice = async (invoice) => {
    const success = await updateHoaDonStatus(
      invoice.id,
      "Đã thanh toán",
      () => {
        refetchInvoices();
      }
    );

    if (success) {
      toggleNotification("Cập nhật trạng thái hóa đơn thành công", "success");
    } else {
      toggleNotification(
        updateStatusError || "Lỗi khi cập nhật trạng thái hóa đơn",
        "error"
      );
    }
  };

  // Open invoice detail dialog
  const handleOpenInvoiceDialog = (invoice) => {
    setSelectedInvoice(invoice);
    setOpenInvoiceDialog(true);
  };

  // Close invoice detail dialog
  const handleCloseInvoiceDialog = () => {
    setOpenInvoiceDialog(false);
    setSelectedInvoice(null);
  };

  // Define columns for invoices DataGrid
  const columns = [
    {
      field: "id",
      headerName: "Mã HĐ",
      flex: 0.5,
    },
    {
      field: "ngaylap",
      headerName: "Ngày lập",
      flex: 1,
      valueFormatter: (params) => formatDate(params.value),
    },
    {
      field: "tongsotien",
      headerName: "Tổng tiền",
      flex: 1,
      valueFormatter: (params) => formatCurrency(params.value),
    },
    {
      field: "trangthai",
      headerName: "Trạng thái",
      flex: 1,
    },
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
            onClick={() => handleOpenInvoiceDialog(params.row)}
          >
            Chi tiết
          </Button>
          {params.row.trangthai === "Chưa thanh toán" && (
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={() => handlePayInvoice(params.row)}
            >
              Thanh toán
            </Button>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="ĐỒNG HỒ NƯỚC & HÓA ĐƠN"
        subtitle="Quản lý chỉ số nước và hóa đơn khách hàng"
      />

      {/* Customer and Apartment Selection */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          backgroundColor: theme.palette.background.alt,
          borderRadius: 1,
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Chọn khách hàng</InputLabel>
              <Select
                value={selectedKhachHang?.id || ""}
                onChange={handleKhachHangChange}
                label="Chọn khách hàng"
              >
                {!isLoadingCustomers &&
                  customers?.map((kh) => (
                    <MenuItem key={kh.id} value={kh.id}>
                      {kh.hoten} - {kh.sodienthoai}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth disabled={!selectedKhachHang}>
              <InputLabel>Chọn căn hộ</InputLabel>
              <Select
                value={selectedCanHo?.id || ""}
                onChange={handleCanHoChange}
                label="Chọn căn hộ"
              >
                {selectedKhachHang?.canho?.map((ch) => (
                  <MenuItem key={ch.id} value={ch.id}>
                    {ch.toanha} - Căn {ch.socanho}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Meter Reading Display and Controls */}
      {selectedCanHo && (
        <Paper
          sx={{
            p: 2,
            mb: 3,
            backgroundColor: theme.palette.background.alt,
            borderRadius: 1,
          }}
        >
          <Typography variant="h5" gutterBottom>
            Thông tin đồng hồ nước
          </Typography>

          {isLoadingDongHoNuoc ? (
            <Typography>Đang tải dữ liệu...</Typography>
          ) : dongHoNuoc ? (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Typography variant="body1">Chỉ số cũ</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {dongHoNuoc.chisocu} m³
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body1">Chỉ số mới</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {dongHoNuoc.chisomoi} m³
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body1">Tiêu thụ</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {Math.max(0, dongHoNuoc.chisomoi - dongHoNuoc.chisocu)} m³
                  </Typography>
                </Grid>
              </Grid>

              <Box mt={3} display="flex" gap={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenMeterDialog}
                >
                  Cập nhật chỉ số
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleCreateInvoice}
                  disabled={dongHoNuoc.chisomoi <= dongHoNuoc.chisocu}
                >
                  Tạo hóa đơn
                </Button>
              </Box>
            </Box>
          ) : (
            <Typography>Không tìm thấy đồng hồ nước cho căn hộ này</Typography>
          )}
        </Paper>
      )}

      {/* Invoices List */}
      {selectedKhachHang && (
        <Box
          height="50vh"
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
          }}
        >
          <Typography variant="h5" mb={2}>
            Danh sách hóa đơn
          </Typography>

          <DataGrid
            loading={isLoadingInvoices}
            getRowId={(row) => row.id}
            rows={invoices || []}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
            localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
          />
        </Box>
      )}

      {/* Meter Reading Dialog */}
      <Dialog
        open={openMeterDialog}
        onClose={handleCloseMeterDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cập nhật chỉ số đồng hồ nước</DialogTitle>
        <form onSubmit={handleSubmit(onSubmitMeterReading)}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Chỉ số cũ (m³)"
                  fullWidth
                  {...register("chisocu")}
                  InputProps={{ readOnly: true }}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Chỉ số mới (m³)"
                  fullWidth
                  type="number"
                  error={!!errors.chisomoi}
                  helperText={errors.chisomoi?.message}
                  {...register("chisomoi", {
                    required: "Chỉ số mới không được để trống",
                    validate: (value) =>
                      isValidMeterReading(value, dongHoNuoc?.chisocu) ||
                      "Chỉ số mới phải lớn hơn chỉ số cũ",
                  })}
                  margin="normal"
                />
              </Grid>

              {/* Consumption preview */}
              {consumption > 0 && (
                <Grid item xs={12}>
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: theme.palette.background.default,
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle1">
                      Tiêu thụ: {consumption} m³
                    </Typography>
                    <Typography variant="subtitle1">
                      Thành tiền: {formatCurrency(amount)}
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseMeterDialog} color="inherit">
              Hủy
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Cập nhật
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Invoice Detail Dialog */}
      <Dialog
        open={openInvoiceDialog}
        onClose={handleCloseInvoiceDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Chi tiết hóa đơn</DialogTitle>
        <DialogContent>
          {selectedInvoice && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Mã hóa đơn:</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {selectedInvoice.id}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Ngày lập:</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {formatDate(selectedInvoice.ngaylap)}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Tổng tiền:</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {formatCurrency(selectedInvoice.tongsotien)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Trạng thái:</Typography>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    color={
                      selectedInvoice.trangthai === "Đã thanh toán"
                        ? "success.main"
                        : "warning.main"
                    }
                  >
                    {selectedInvoice.trangthai}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInvoiceDialog} color="inherit">
            Đóng
          </Button>
          {selectedInvoice?.trangthai === "Chưa thanh toán" && (
            <Button
              onClick={() => {
                handlePayInvoice(selectedInvoice);
                handleCloseInvoiceDialog();
              }}
              variant="contained"
              color="success"
            >
              Thanh toán
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DongHoNuoc;
