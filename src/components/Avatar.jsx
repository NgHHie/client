import React from "react";
import { Box } from "@mui/material";

const Avatar = ({ src, alt, width, height, border }) => {
  return (
    <Box
      sx={{
        width: { width },
        height: { height },
        borderRadius: "50%",
        overflow: "hidden",
        border: { border },
        boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.2)",
        transition: "border 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        "&:hover": {
          border: "1px solid rgba(255,255,255,0.5)",
          boxShadow: "0px 4px 20px rgba(255, 255, 255, 0.5)",
        },
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover", // Đảm bảo ảnh lấp đầy khung mà không bị méo
          filter: "brightness(0.9)", // Làm tối ảnh (giảm độ sáng)
        }}
      />
    </Box>
  );
};

export default Avatar;
