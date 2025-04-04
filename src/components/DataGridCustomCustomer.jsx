import React, { useState } from "react";
import { Search, Add } from "@mui/icons-material";
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
import {
  GridToolbarDensitySelector,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
} from "@mui/x-data-grid";
import FlexBetween from "./FlexBetween";
import { useForm } from "react-hook-form";

const DataGridCustomCustomer = ({
  searchInput,
  setSearchInput,
  setSearch,
  columns,
  searchcolumn,
  selectedColumn,
  setSelectedColumn,
  refetch,
  addNewCustomer, 
}) => {
  const [open, setOpen] = useState(false); // Trạng thái mở form
  const { register, handleSubmit, reset } = useForm(); // Hook form quản lý form

  const handleSearch = () => {
    setSearch((prev) => ({
      ...prev,
      input: searchInput,
    }));
    refetch(); // Fetch lại dữ liệu khi tìm kiếm
  };

  const handleOpenForm = () => {
    setOpen(true);
    reset(); // Reset form khi mở
  };

  const handleCloseForm = () => {
    setOpen(false);
  };

  const onSubmit = (data) => {
    addNewCustomer(data); // Gọi function thêm thành viên
    handleCloseForm();
  };

  return (
    <>
      <GridToolbarContainer>
        <FlexBetween width="100%">
          <FlexBetween>
            <GridToolbarColumnsButton />
            <GridToolbarDensitySelector />
            <GridToolbarExport />
          </FlexBetween>

          {/* Dropdown chọn cột tìm kiếm */}
          <FlexBetween>
            <FormControl variant="standard" sx={{ minWidth: 120, mr: 2, mb: "0.5rem" }}>
              <InputLabel id="select-column-label">Cột</InputLabel>
              <Select
                labelId="select-column-label"
                value={selectedColumn}
                onChange={(e) => setSelectedColumn(e.target.value)}
              >
                {searchcolumn === "all"
                  ? [
                      <MenuItem key="all" value="all">Tất cả</MenuItem>,
                      ...columns.map((column) => (
                        <MenuItem key={column.field} value={column.field}>{column.headerName}</MenuItem>
                      )),
                    ]
                  : columns
                      .filter((column) => column.field === selectedColumn)
                      .map((column) => (
                        <MenuItem key={column.field} value={column.field}>{column.headerName}</MenuItem>
                      ))}
              </Select>
            </FormControl>

            {/* Ô tìm kiếm */}
            <TextField
              label="Tìm kiếm..."
              sx={{ mb: "0.5rem", width: "12rem" }}
              onChange={(e) => setSearchInput(e.target.value)}
              value={searchInput}
              variant="standard"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearch}>
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Nút "Thêm Thành Viên" */}
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={handleOpenForm}
              sx={{ ml: 2 }}
            >
              Thêm Thành Viên
            </Button>
          </FlexBetween>
        </FlexBetween>
      </GridToolbarContainer>

      {/* Dialog Form Thêm Thành Viên */}
      <Dialog open={open} onClose={handleCloseForm}>
        <DialogTitle>Thêm Thành Viên</DialogTitle>
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
              <Button onClick={handleCloseForm} color="secondary">Hủy</Button>
              <Button type="submit" color="primary" variant="contained">Lưu</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DataGridCustomCustomer;
