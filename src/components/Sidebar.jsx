// src/components/Sidebar.jsx
import React from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import {
  KeyboardDoubleArrowLeftOutlined as CloseSidebarIcon,
  ChevronRightOutlined as ActiveIndicatorIcon,
  TuneOutlined as ControlIcon,
  CloudQueueOutlined as StatsIcon,
  BroadcastOnHomeOutlined as HomeIcon,
  QueryBuilderOutlined as HistoryIcon,
  PeopleOutlined as CustomerIcon,
  BarChartOutlined as ThongKeIcon,
  WaterDropOutlined as WaterIcon,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";

const menuItems = [
  {
    label: "Dashboard",
    route: "dashboard",
    icon: <HomeIcon />,
  },
  {
    label: "Quản lý khách hàng",
    route: "khachhang",
    icon: <CustomerIcon />,
  },
  {
    label: "Thống kê khách hàng",
    route: "thongke",
    icon: <ThongKeIcon />,
  },
  {
    label: "Đồng hồ nước & Hóa đơn",
    route: "donghonuoc",
    icon: <WaterIcon />,
  },
];

const Sidebar = ({
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const { pathname } = useLocation();
  const [currentPage, setCurrentPage] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    setCurrentPage(pathname.substring(1));
  }, [pathname]);

  return (
    <Box
      component="nav"
      sx={{ boxShadow: "0px 4px 6px rgba(255, 255, 255, 0.5)" }}
    >
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.neutral[0],
              backgroundColor: theme.palette.background.alt,
              boxSizing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
            },
          }}
        >
          <Box width="100%">
            <Box
              m="1rem 1rem 2rem 1rem"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <FlexBetween color={theme.palette.neutral[0]}>
                <Box display="flex" alignItems="center" gap="0.7rem">
                  <WaterIcon sx={{ fontSize: "2rem" }} />
                  <Typography variant="h4" fontWeight="bold">
                    NUOC
                  </Typography>
                  {!isNonMobile && (
                    <IconButton
                      sx={{ padding: "0" }}
                      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                      <CloseSidebarIcon />
                    </IconButton>
                  )}
                </Box>
              </FlexBetween>
            </Box>
            <List>
              {menuItems.map(({ label, route, icon }) => {
                if (!icon) {
                  return (
                    <Typography key={label} sx={{ m: "2.25rem 0 1rem 3rem" }}>
                      {label}
                    </Typography>
                  );
                }
                const routePath = route.toLowerCase();

                return (
                  <ListItem key={label} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        navigate(`/${routePath}`);
                        setCurrentPage(routePath);
                      }}
                      sx={{
                        backgroundColor:
                          currentPage === routePath
                            ? theme.palette.neutral[0]
                            : "transparent",
                        color:
                          currentPage === routePath
                            ? theme.palette.primary[600]
                            : theme.palette.neutral[0],
                        padding: "1rem 1rem",
                        borderRadius: "8px",
                        position: "relative",
                        "&:hover": {
                          color: theme.palette.neutral[0], // Màu chữ khi hover
                        },
                        "&:hover .MuiListItemIcon-root": {
                          color: theme.palette.neutral[0], // Màu icon khi hover
                        },
                      }}
                    >
                      {currentPage === routePath && (
                        <ActiveIndicatorIcon
                          sx={{
                            position: "absolute",
                            left: "0.5rem",
                          }}
                        />
                      )}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color:
                              currentPage === routePath
                                ? theme.palette.primary[600]
                                : theme.palette.neutral[0],
                            minWidth: "auto",
                            ml: "2rem",
                            mr: "2rem",
                          }}
                        >
                          {icon}
                        </ListItemIcon>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: "bold",
                            textAlign: "left",
                            flexGrow: 1, // Đảm bảo văn bản chiếm hết không gian còn lại
                          }}
                        >
                          {label}
                        </Typography>
                      </Box>
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
