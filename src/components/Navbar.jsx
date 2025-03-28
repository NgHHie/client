import React, { useState } from "react";
import {
  LightModeOutlined,
  DarkModeOutlined,
  Menu as MenuIcon,
} from "@mui/icons-material";
import FlexBetween from "components/FlexBetween";
import Profile from "components/Profile";
import Avatar from "components/Avatar";

import { useDispatch } from "react-redux";
import { setMode } from "state";
import avatarImage from "assets/avatar.png";
import {
  AppBar,
  Button,
  Box,
  Typography,
  IconButton,
  Toolbar,
  useTheme,
} from "@mui/material";

const Navbar = ({ user, isSidebarOpen, setIsSidebarOpen }) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpenProfile, setIsOpenProfile] = useState(false);
  const handleToggle = () => {
    setIsOpenProfile(!isOpenProfile);
  };

  return (
    <AppBar
      sx={{
        position: "static",
        background: "none",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* LEFT SIDE */}
        <FlexBetween>
          <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <MenuIcon />
          </IconButton>
        </FlexBetween>

        {/* RIGHT SIDE */}
        <FlexBetween gap="1.5rem">
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlined sx={{ fontSize: "25px" }} />
            ) : (
              <LightModeOutlined sx={{ fontSize: "25px" }} />
            )}
          </IconButton>

          <FlexBetween>
            <Button
              onClick={handleToggle}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textTransform: "none",
                gap: "1rem",
              }}
            >
              <Avatar
                src={avatarImage}
                alt="avatar"
                width="32px"
                height="32px"
                border="2px solid rgba(255,255,255,0.3)"
              />
              <Box textAlign="left">
                <Typography
                  fontWeight="bold"
                  fontSize="0.85rem"
                  sx={{ color: theme.palette.neutral[0] }}
                >
                  Hiệp.
                </Typography>
              </Box>
            </Button>
            {isOpenProfile && <Profile onClose={handleToggle} />}
          </FlexBetween>
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
