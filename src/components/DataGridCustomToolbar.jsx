// src/components/DataGridCustomToolbar.jsx
import React, { useCallback } from "react";
import { Search } from "@mui/icons-material";
import {
  IconButton,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import {
  GridToolbarDensitySelector,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
} from "@mui/x-data-grid";
import FlexBetween from "./FlexBetween";

const DataGridCustomToolbar = ({
  searchInput,
  setSearchInput,
  setSearch,
  columns,
  searchcolumn,
  selectedColumn,
  setSelectedColumn,
  refetch,
  start,
  end,
  setStart,
  setEnd,
}) => {
  // Memoize handlers to prevent recreating on every render
  const handleSearch = useCallback(() => {
    if (setSearch) {
      setSearch(searchInput);
    }
    if (refetch) {
      refetch();
    }
  }, [searchInput, setSearch, refetch]);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    },
    [handleSearch]
  );

  const handleColumnChange = useCallback(
    (e) => {
      if (setSelectedColumn) {
        setSelectedColumn(e.target.value);
      }
    },
    [setSelectedColumn]
  );

  const handleStartChange = useCallback(
    (e) => {
      if (setStart) {
        setStart(e.target.value);
      }
    },
    [setStart]
  );

  const handleEndChange = useCallback(
    (e) => {
      if (setEnd) {
        setEnd(e.target.value);
      }
    },
    [setEnd]
  );

  return (
    <GridToolbarContainer>
      <FlexBetween width="100%">
        <FlexBetween>
          <GridToolbarColumnsButton />
          <GridToolbarDensitySelector />
          <GridToolbarExport />
        </FlexBetween>

        {/* Revenue Range Filters */}
        {setStart && setEnd && (
          <Box display="flex" gap={2}>
            <TextField
              label="Doanh thu từ"
              variant="outlined"
              size="small"
              type="number"
              value={start}
              onChange={handleStartChange}
              sx={{ width: 120 }}
            />

            <TextField
              label="Đến"
              variant="outlined"
              size="small"
              type="number"
              value={end}
              onChange={handleEndChange}
              sx={{ width: 120 }}
            />
          </Box>
        )}

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
            value={searchInput || ""}
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
        </FlexBetween>
      </FlexBetween>
    </GridToolbarContainer>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default React.memo(DataGridCustomToolbar);
