import React, { useState, useContext } from "react";
import { Box, useMediaQuery, Snackbar, Alert, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "components/Navbar";
import Sidebar from "components/Sidebar";
import { Report } from "@mui/icons-material";
import { NotificationContext } from "../../context/NotificationContext";

const Layout = () => {
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { notification, closeNotification } = useContext(NotificationContext); // Lấy notification từ context

  // // State để quản lý thông báo
  // const [notification, setNotification] = useState({
  //   message: "Nhà bạn đang bất ổn!!",
  //   type: "success", // "success", "error", "warning", "info"
  //   open: true,
  // });

  // // Hàm để hiển thị thông báo
  // const showNotification = (message, type = "success") => {
  //   setNotification({ message, type, open: true });
  // };

  // // Hàm để ẩn thông báo
  // const handleClose = () => {
  //   setNotification((prev) => ({ ...prev, open: false }));
  // };

  return (
    <Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
      <Sidebar
        isNonMobile={isNonMobile}
        drawerWidth="250px"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <Box flexGrow={1}>
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Hiển thị thông báo */}
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={notification.open}
          sx={{ mt: "4.5rem", mr: "1rem" }}
        >
          <Alert
            onClose={closeNotification}
            severity={notification.type}
            icon={<Report sx={{ color: "rgba(255,0,0,0.8)" }} />}
            sx={{
              color: theme.palette.background.default,
              backgroundColor: theme.palette.neutral[0],
              borderRadius: "10px",
              backdropFilter: "blur(20px) !important",
              boxShadow: "0px 4px 6px rgba(255, 255, 255, 0.5)",
            }}
          >
            {notification.message}
          </Alert>
        </Snackbar>

        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
