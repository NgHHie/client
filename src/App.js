import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo, useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "theme";
import Layout from "scenes/layout";
import Dashboard from "scenes/dashboard";
import Transactions from "scenes/transactions";
import Histories from "scenes/histories";
import socketIOClient from "socket.io-client";
import { NotificationProvider } from "./context/NotificationContext"; // Import context

const host = "http://localhost:8080";
const socket = socketIOClient.connect(host);

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <NotificationProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/data_sensor" element={<Transactions />} />
                <Route path="/action_history" element={<Histories />} />
              </Route>
            </Routes>
          </NotificationProvider>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
