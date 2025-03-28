import { createContext, useState } from "react";

// Tạo Context
export const NotificationContext = createContext();

// Tạo Provider cho Context này
export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    message: "",
    type: "success", // "success", "error", "warning", "info"
    open: false,
  });

  // Hàm bật/tắt thông báo
  const toggleNotification = (message, type = "success") => {
    setNotification((prev) => ({
      message,
      type,
      open: true, // Toggle trạng thái open
    }));
  };

  // Hàm ẩn thông báo (được gọi khi đóng tự động)
  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  return (
    <NotificationContext.Provider
      value={{ notification, toggleNotification, closeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
