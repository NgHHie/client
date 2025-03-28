import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import FlexBetween from "./FlexBetween";
import {
  Report,
  WhatshotOutlined,
  WaterDropOutlined,
  LightModeOutlined,
  BlurOnOutlined,
} from "@mui/icons-material";

const StatBox = ({ title, value, description, onChange }) => {
  const theme = useTheme();
  const getColor = (description, val) => {
    // console.log(description);
    if (val === 1) {
      switch (description) {
        case "temper": {
          // Đối với nhiệt độ từ 0 đến 100
          // console.log("color: ", value);
          const tmp = value.split("°C")[0];
          if (tmp <= 10) {
            return theme.palette.secondary[50]; // 0-10
          } else if (tmp <= 15) {
            return theme.palette.secondary[100]; // 11-20
          } else if (tmp <= 20) {
            return theme.palette.secondary[200]; // 21-30
          } else if (tmp <= 25) {
            return theme.palette.secondary[300]; // 31-40
          } else if (tmp <= 30) {
            return theme.palette.secondary[400]; // 41-50
          } else if (tmp <= 35) {
            return theme.palette.secondary[500]; // 51-60
          } else if (tmp <= 40) {
            return theme.palette.secondary[600]; // 61-70
          } else if (tmp <= 45) {
            return theme.palette.secondary[700]; // 71-80
          } else if (tmp <= 90) {
            return theme.palette.secondary[800]; // 81-90
          } else {
            return theme.palette.secondary[700]; // 91-100
          }
        }
        case "humid": {
          // Đối với độ ẩm từ 0 đến 100
          const tmp = value.split("%")[0];
          if (tmp <= 10) {
            return theme.palette.xanhduong[50]; // 0-10
          } else if (tmp <= 20) {
            return theme.palette.xanhduong[100]; // 11-20
          } else if (tmp <= 30) {
            return theme.palette.xanhduong[200]; // 21-30
          } else if (tmp <= 40) {
            return theme.palette.xanhduong[300]; // 31-40
          } else if (tmp <= 50) {
            return theme.palette.xanhduong[400]; // 41-50
          } else if (tmp <= 60) {
            return theme.palette.xanhduong[500]; // 51-60
          } else if (tmp <= 70) {
            return theme.palette.xanhduong[600]; // 61-70
          } else if (tmp <= 80) {
            return theme.palette.xanhduong[700]; // 71-80
          } else if (tmp <= 90) {
            return theme.palette.xanhduong[800]; // 81-90
          } else {
            return theme.palette.xanhduong[900]; // 91-100
          }
        }
        case "light": {
          // Đối với ánh sáng từ 0 đến 4095
          if (value < 500) {
            return theme.palette.vang[900]; // 0-499
          } else if (value < 1000) {
            return theme.palette.vang[800]; // 500-999
          } else if (value < 1500) {
            return theme.palette.vang[700]; // 1000-1499
          } else if (value < 2000) {
            return theme.palette.vang[600]; // 1500-1999
          } else if (value < 2500) {
            return theme.palette.vang[500]; // 2000-2499
          } else if (value < 3000) {
            return theme.palette.vang[300]; // 2500-2999
          } else if (value < 3500) {
            return theme.palette.vang[100]; // 3000-3499
          } else if (value < 4000) {
            return theme.palette.vang[50]; // 3500-3999
          } else if (value < 4095) {
            return theme.palette.vang[50]; // 4000-4094
          } else {
            return theme.palette.vang[50]; // 4095
          }
        }
        default:
          return theme.palette.neutral[0]; // Màu mặc định nếu không khớp với bất kỳ trường nào
      }
    } else {
      switch (description) {
        case "temper":
          return theme.palette.secondary[200];
        case "humid":
          return theme.palette.xanhduong[200];
        case "light":
          return theme.palette.vang[200];
        default:
          return theme.palette.neutral[10];
      }
    }
  };

  const getIncrease = (description, value) => {
    value = parseFloat(value);
    let res = { increase: "", alert: false };
    switch (description) {
      case "temper":
        if (value < 10) {
          res.increase = "Rất lạnh";
          res.alert = true;
          return res;
        } else if (value < 20) {
          res.increase = "Khá lạnh";
          return res;
        } else if (value < 25) {
          res.increase = "Mát mẻ";
          return res;
        } else if (value < 30) {
          res.increase = "Khá nóng";
          return res;
        } else if (value < 35) {
          res.increase = "Nóng";
          return res;
        } else if (value < 45) {
          res.increase = "Rất nóng";
          return res;
        } else {
          res.increase = "Nguy hiểm";
          res.alert = true;
          return res;
        }
      case "humid":
        if (value < 30) {
          res.increase = "Khô";
          return res;
        } else if (value < 60) {
          res.increase = "Vừa đủ";
          return res;
        } else {
          res.increase = "Ẩm ướt";
          return res;
        }
      case "light":
        if (value < 1000) {
          res.increase = "Tối";
          return res;
        } else if (value < 3000) {
          res.increase = "Đủ sáng";
          return res;
        } else {
          res.increase = "Quá sáng";
          res.alert = true;
          return res;
        }
      case "hiep":
        res.increase = "Cảm biến mới";
        return res;
      default:
        return "";
    }
  };

  const icon =
    title === "Nhiệt độ" ? (
      <WhatshotOutlined
        sx={{ color: getColor(description, 1), fontSize: "26px" }}
      />
    ) : title === "Độ ẩm" ? (
      <WaterDropOutlined
        sx={{ color: getColor(description, 1), fontSize: "26px" }}
      />
    ) : title === "Ánh sáng" ? (
      <LightModeOutlined
        sx={{ color: getColor(description, 1), fontSize: "26px" }}
      />
    ) : title === "Chung" ? (
      <BlurOnOutlined
        sx={{ color: theme.palette.neutral[0], fontSize: "26px" }}
      />
    ) : null;

  return (
    <Box
      gridColumn="span 2"
      gridRow="span 1"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      p="1.25rem 1rem"
      flex="1 1 100%"
      backgroundColor={theme.palette.background.alt}
      borderRadius="1.5rem"
      sx={{
        boxShadow: "0px 4px 6px rgba(255, 255, 255, 0.5)",
        transition: "box-shadow 0.3s ease-in-out",
        "&:hover": {
          backgroundColor: theme.palette.primary[500],
        },
      }}
    >
      <FlexBetween>
        <Typography variant="h5" sx={{ color: getColor(description, 1) }}>
          {title}
        </Typography>
        {icon}
      </FlexBetween>

      <Typography
        variant={description === "null" ? "h6" : "h2"}
        fontWeight="600"
        sx={{
          color: getColor(description, 1),
          overflowWrap: "break-word",
          wordBreak: "break-word",
          overflow: "auto",
          "&::-webkit-scrollbar": {
            // Ẩn thanh cuộn trên Chrome, Safari
            display: "none",
          },
          scrollbarWidth: "none",
        }}
      >
        {value}
      </Typography>
      <FlexBetween>
        <Typography variant="h6">
          {getIncrease(description, value).increase}
        </Typography>
        {getIncrease(description, value).alert && (
          <Report
            sx={{
              color: "rgba(200, 0, 0, 1)",
              mr: "2px",
              "@keyframes blink": {
                "50%": {
                  opacity: 0.1,
                },
              },
              //boxShadow: "0px 4px 6px rgba(255, 0, 0, 0.5)",
              borderRadius: "25%",
              animation: "blink 0.5s infinite",
            }}
          />
        )}
      </FlexBetween>
    </Box>
  );
};

export default StatBox;
