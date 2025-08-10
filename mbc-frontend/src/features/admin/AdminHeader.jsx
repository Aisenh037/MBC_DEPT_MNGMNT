// src/components/Layout/AdminHeader.jsx
import React from "react";
import { Box, Typography, Button, Avatar } from "@mui/material";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';

export default function AdminHeader() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 4,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar sx={{ bgcolor: "primary.main" }}>
          {(user?.name ? user.name[0] : "A").toUpperCase()}
        </Avatar>
        <Typography variant="h6">
          Welcome, {user?.name || "Admin"}
        </Typography>
      </Box>
      <Button
        variant="outlined"
        color="error"
        onClick={handleLogout}
        startIcon={<LogoutIcon />}
      >
        Logout
      </Button>
    </Box>
  );
}