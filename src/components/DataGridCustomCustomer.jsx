// src/components/DataGridCustomCustomer.jsx
import React, { useCallback } from "react";
import { Search, Add } from "@mui/icons-material";
import {
  IconButton,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import {
  GridToolbarDensitySelector,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
} from "@mui/x-data-grid";
import FlexBetween from "./FlexBetween";

const DataGridCustomCustomer = ({
  searchInput,
  setSearchInput,
  setSearch,
  columns,
  searchcolumn,
  selectedColumn,
  setSelectedColumn,
  refetch,
  handleOpenForm,
}) => {
  // Memoize the search handler to prevent recreating on every render
  const handleSearch = useCallback(() => {
    setSearch((prev) => ({
      ...prev,
      input: searchInput,
    }));
    refetch(); // Fetch data when searching
  }, [searchInput, setSearch, refetch]);

  // Memoize the column selection handler
  const handleColumnChange = useCallback(
    (e) => {
      if (setSelectedColumn) {
        setSelectedColumn(e.target.value);
      }
    },
    [setSelectedColumn]
  );

  // Handle Enter key press
  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    },
    [handleSearch]
  );

  return (
    <GridToolbarContainer>
      <FlexBetween width="100%">
        <FlexBetween>
          <GridToolbarColumnsButton />
          <GridToolbarDensitySelector />
          <GridToolbarExport />
        </FlexBetween>

        {/* Column selection dropdown */}
        <FlexBetween>
          <FormControl
            variant="standard"
            sx={{ minWidth: 120, mr: 2, mb: "0.5rem" }}
          >
            <InputLabel id="select-column-label">Cột</InputLabel>
            <Select
              labelId="select-column-label"
              value={selectedColumn || "all"}
              onChange={handleColumnChange}
            >
              {searchcolumn === "all"
                ? [
                    <MenuItem key="all" value="all">
                      Tất cả
                    </MenuItem>,
                    ...columns
                      .filter((col) => col.field !== "actions") // Exclude actions column
                      .map((column) => (
                        <MenuItem key={column.field} value={column.field}>
                          {column.headerName}
                        </MenuItem>
                      )),
                  ]
                : columns
                    .filter((column) => column.field === selectedColumn)
                    .map((column) => (
                      <MenuItem key={column.field} value={column.field}>
                        {column.headerName}
                      </MenuItem>
                    ))}
            </Select>
          </FormControl>

          {/* Search field */}
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
            onKeyPress={handleKeyPress}
          />

          {/* Add Customer button */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleOpenForm}
            sx={{ ml: 2 }}
          >
            Thêm Khách Hàng
          </Button>
        </FlexBetween>
      </FlexBetween>
    </GridToolbarContainer>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default React.memo(DataGridCustomCustomer);
