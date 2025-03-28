import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box, useTheme } from "@mui/material";
import { DataGrid, viVN } from "@mui/x-data-grid";
import Header from "components/Header";
import DataGridCustomToolbar from "components/DataGridCustomToolbar";
import { useGetOverviewQuery } from "state/api";

const Transactions = () => {
  const theme = useTheme();
  const location = useLocation();

  // values to be sent to the backend
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState({}); // Always search in "time" column
  const [searchInput, setSearchInput] = useState("");
  const [start, setStart] = useState("0");
  const [end, setEnd] = useState("0");

  console.log("Start:", start, "End:", end);
  const { data, isLoading, refetch } = useGetOverviewQuery({
    page: page + 1,
    pageSize,
    sort: JSON.stringify(sort),
    search: JSON.stringify(search),
    start: start, 
    end: end 
  });

  console.log(data)
  useEffect(() => {
    refetch();
  }, [location, refetch, start, end]);

  // console.log(data);
  // Define columns
  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "hoten", headerName: "Họ tên", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "doanhthu", headerName: "Doanh thu", flex: 1 },
    { field: "sodonhang", headerName: "Số đơn hàng", flex: 1 },
    { field: "xephang", headerName: "Xếp hạng", flex: 1 },
  ];
  

  // Custom locale text for DataGrid
  const customLocaleText = {
    ...viVN.components.MuiDataGrid.defaultProps.localeText,
  };

  const formattedData =
  data?.map(({ khachHang, thongKe }) => ({
    id: khachHang.id, // ID khách hàng
    hoten: khachHang.hoten,
    email: khachHang.email,
    doanhthu: thongKe.doanhthu,
    sodonhang: thongKe.sodonhang,
    xephang: thongKe.xephang,
  })) || [];


  return (
    <Box m="1.5rem 2.5rem">
      <Header title="LỊCH SỬ" subtitle="Lịch sử thao tác thiết bị của bạn" />
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
          onSortModelChange={(newSortModel) => setSort(...newSortModel)}
          components={{ Toolbar: DataGridCustomToolbar }}
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
              start,
              end,
              setStart, 
              setEnd,  
              refetch,
            },
          }}
          localeText={customLocaleText}
        />
      </Box>
    </Box>
  );
};

export default Transactions;
