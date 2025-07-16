import React from "react";
import { Box, Typography, Button, Avatar } from "@mui/material";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";

export default function AdminHeader() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
        px: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Avatar sx={{ bgcolor: "#1976d2", mr: 1 }}>
          {(user?.name ? user.name[0] : "A").toUpperCase()}
        </Avatar>
        <Typography variant="h6" fontSize={{ xs: 16, sm: 20 }}>
          Welcome, {user?.name || "Admin"}
        </Typography>
      </Box>
      <Button variant="outlined" color="error" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
}
