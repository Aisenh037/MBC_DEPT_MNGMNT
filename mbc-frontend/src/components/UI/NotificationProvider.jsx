// src/components/UI/NotificationProvider.jsx
import React, { createContext, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

const NotificationContext = createContext();
export const useNotify = () => useContext(NotificationContext);

export default function NotificationProvider({ children }) {
  const [snackbar, setSnackbar] = useState({ open: false, msg: "", type: "info" });

  const notify = (msg, type = "info") => setSnackbar({ open: true, msg, type });
  const handleClose = () => setSnackbar({ ...snackbar, open: false });

  return (
    <NotificationContext.Provider value={notify}>
      {children}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={handleClose} severity={snackbar.type} sx={{ width: "100%" }}>
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}
