import React, {useState} from "react";
import { Search } from "@mui/icons-material";
import {
  IconButton,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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
  refetch, start, end, setStart, setEnd
}) => {

  const handleSearch = () => {
    console.log(start)
    setSearch((prev) => ({
      ...prev,
      input: searchInput,
    }));
    
    refetch(); // Fetch lại dữ liệu khi tìm kiếm
  };
  
  
  
  // console.log(columns);
  return (
    <GridToolbarContainer>
      <FlexBetween width="100%">
        <FlexBetween>
          <GridToolbarColumnsButton />
          <GridToolbarDensitySelector />
          <GridToolbarExport />
        </FlexBetween>
{/*         
        <TextField
          label="Start"
          variant="outlined"
          size="small"
          type="number"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          sx={{ marginRight: 2, width: 120 }}
        />

        <TextField
          label="End"
          variant="outlined"
          size="small"
          type="number"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          sx={{ marginRight: 2, width: 120 }}
        /> 
         */}

        {/* Dropdown để chọn cột tìm kiếm */}
        <FlexBetween>
          <FormControl
            variant="standard"
            sx={{ minWidth: 120, mr: 2, mb: "0.5rem" }}
          >
            <InputLabel id="select-column-label">Cột</InputLabel>
            <Select
              labelId="select-column-label"
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
            >
              {searchcolumn === "all"
                ? [
                    <MenuItem key="all" value="all">
                      Tất cả
                    </MenuItem>,
                    ...columns.map((column) => (
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

          {/* Trường tìm kiếm */}
          <TextField
            label="Tìm kiếm..."
            sx={{ mb: "0.5rem", width: "12rem" }}
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
            variant="standard"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      // setSearch(searchInput);
                      handleSearch();
                      // setSearchInput("");
                    }}
                  >
                    <Search />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </FlexBetween>
      </FlexBetween>
    </GridToolbarContainer>
  );
};

export default DataGridCustomToolbar;
