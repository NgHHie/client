import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import FlexBetween from "./FlexBetween";

const SwitchBox = ({ title, status, icon }) => {
  const theme = useTheme();
  const [isActive, setIsActive] = useState(false);

  // Hàm gửi yêu cầu POST
  const sendPostRequest = async (newStatus) => {
    const message = newStatus ? "1" : "0"; // 1 nếu đang bật, 0 nếu tắt
    let topic;
    if (title == "Đèn") topic = "home/light";
    else if (title == "Quạt") topic = "home/fan";
    else if (title == "Điều hòa") topic = "home/air_conditioner";
    try {
      const response = await fetch("http://localhost:5001/api/remote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic: topic, message: message }), // Body của request
      });

      if (response.ok) {
        console.log("Request thành công");
      } else {
        console.error("Request thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi gửi request:", error);
    }
  };

  const handleClick = () => {
    const newStatus = !isActive;
    // setIsActive(newStatus);
    sendPostRequest(newStatus); // Gửi request POST sau khi click
  };

  useEffect(() => {
    if (status === "0") {
      setIsActive(false);
    } else if (status === "1") {
      setIsActive(true);
    }
  }, [status]);

  return (
    <Box
      gridColumn="span 1"
      gridRow="span 1"
      backgroundColor={
        isActive ? theme.palette.neutral[0] : theme.palette.background.default
      }
      p="1.2rem"
      borderRadius="1rem"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      onClick={handleClick} // Gọi handleClick khi người dùng click vào
      sx={{
        cursor: "pointer",
        transition: "background-color 0.25s ease, color 0.25s ease",
        boxShadow: isActive
          ? "0px 4px 6px rgba(255, 255, 255, 0.6)"
          : "0px 4px 6px rgba(255, 255, 255, 0.2)",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          color: isActive
            ? theme.palette.background.default
            : theme.palette.neutral[0],
        }}
      >
        {title}
      </Typography>
      {icon &&
        React.cloneElement(icon, {
          sx: {
            color: isActive
              ? theme.palette.background.default
              : theme.palette.neutral[0],
            fontSize: "30px",
          },
        })}
    </Box>
  );
};

export default SwitchBox;
