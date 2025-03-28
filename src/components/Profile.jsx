import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import {
  BroadcastOnHomeOutlined as HomeIcon,
  KeyboardArrowDownOutlined as DownIcon,
} from "@mui/icons-material";
import Avatar from "./Avatar";
import avatarImage from "assets/avatar.png";

const Profile = ({ onClose }) => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "100vw",
        height: "100vh",
        bgcolor: "rgba(30, 64, 97, 0.5)",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
        backdropFilter: "blur(20px)",
        p: 4,
        borderRadius: 2,
        zIndex: 1300,
        color: "black",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "row",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.5s ease-in-out",
        "@media (max-width: 600px)": {
          flexDirection: "column",
          overflowY: "auto",
          overflowX: "hidden",
          gap: "2rem",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginLeft: "5%",
          marginRight: "5%",
        }}
      >
        <Avatar
          src={avatarImage}
          alt="avatar"
          width="400px"
          height="400px"
          border="12px solid rgba(255,255,255,0.3)"
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center", // Căn giữa theo chiều dọc
          flexDirection: "column",
        }}
      >
        <Box
          onClick={onClose}
          display="flex"
          alignItems="center"
          gap="0.7rem"
          sx={{
            boxShadow: "0px 4px 20px rgba(255, 255, 255, 0.5)",
            borderRadius: "1rem",
            alignSelf: "flex-start",
            "&:hover": {
              backgroundColor: theme.palette.neutral[0],
              color: theme.palette.primary[600],
              cursor: "pointer",
              "& .iconHome": {
                color: theme.palette.primary[600],
              },
              "& .textHome": {
                color: theme.palette.primary[600],
              },
            },
          }}
          p="1rem"
          mb="2.5rem"
        >
          <HomeIcon
            className="iconHome"
            sx={{ fontSize: "2rem", color: theme.palette.neutral[0] }}
          />
          <Typography
            className="textHome"
            variant="h3"
            fontWeight="bold"
            color={theme.palette.neutral[0]}
          >
            SMARTHOME
          </Typography>
        </Box>

        <Box mr="5%">
          <Typography
            fontSize="4rem"
            fontWeight="bold"
            color={theme.palette.neutral[0]}
          >
            Nguyễn Hoàng Hiệp
          </Typography>
          <Typography
            variant="h1"
            sx={{
              background: `linear-gradient(90deg, #DE688D, #D47961)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "bold",
            }}
            mb="1rem"
          >
            Web Developer
          </Typography>
          <Typography
            variant="h3"
            color={theme.palette.neutral[0]}
            sx={{
              textAlign: "justify",
              lineHeight: "1.6",
            }}
          >
            Sinh viên Học viện Công nghệ Bưu chính Viễn thông, chuyên ngành Công
            nghệ phần mềm. Cảm thấy rất hứng thú với môn IOT và Ứng dụng của
            thầy Nguyễn Quốc Uy.
          </Typography>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          gap="0.7rem"
          sx={{
            alignSelf: "flex-start",
          }}
          mt="3.5rem"
        >
          <Button
            onClick={() => {
              window.open(
                "https://drive.google.com/file/d/1YL5yRvbIEeRvw4ut3QI826kRDeE6eyF9/view?usp=sharing",
                "_blank"
              );
            }}
            variant="contained"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",

              color: "#ffffff", // Màu sắc của biểu tượng và chữ
              padding: "0.5rem 1rem",
              "&:hover": {
                backgroundColor: "#365899", // Màu nền khi hover
              },
              borderRadius: "0.5rem",
            }}
          >
            <Typography>BÁO CÁO</Typography>
          </Button>
          <Button
            onClick={() => {
              window.open("http://localhost:5001/api/docs", "_blank");
            }}
            variant="contained"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",

              color: "#ffffff",
              padding: "0.5rem 1rem",
              "&:hover": {
                backgroundColor: "#FF6C37",
              },
              borderRadius: "0.5rem",
            }}
          >
            <Typography>API DOCS</Typography>
          </Button>
          <Button
            onClick={() => {
              window.open("https://github.com/NgHHie/iot", "_blank");
            }}
            variant="contained"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",

              color: "#ffffff",
              padding: "0.5rem 1rem",
              "&:hover": {
                backgroundColor: "#24292e",
              },
              borderRadius: "0.5rem",
            }}
          >
            <Typography>MÃ NGUỒN</Typography>
          </Button>
          <Button
            onClick={handleClickMenu}
            variant="contained"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: Boolean(anchorEl)
                ? theme.palette.primary.light
                : "initial",
              padding: "0.5rem 1rem",
              "&:hover": { backgroundColor: theme.palette.primary.light },
              borderRadius: "0.5rem",
            }}
          >
            <Typography>THÔNG TIN</Typography>
            <DownIcon />
          </Button>
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          PaperProps={{
            sx: {
              backgroundColor: "#435578",
              borderRadius: "0.5rem",
              mt: "0.1rem",
            },
          }}
        >
          <MenuItem onClick={handleCloseMenu}>
            Mã sinh viên: B21DCCN343
          </MenuItem>
          <MenuItem onClick={handleCloseMenu}>
            Email: hiep2003ka@gmai.com
          </MenuItem>
          <MenuItem onClick={handleCloseMenu}>
            Điện thoại: 0326 018 834
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Profile;
