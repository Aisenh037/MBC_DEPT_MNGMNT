// src/components/Layout/AdminHeader.jsx
import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { useAuthStore } from "@/stores/authStore";

export default function AdminHeader() {
  const { user } = useAuthStore();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        mb: 4,
      }}
    >
      <Avatar sx={{ bgcolor: "primary.main" }}>
        {(user?.name ? user.name[0] : "A").toUpperCase()}
      </Avatar>
      <Typography variant="h6">Welcome, {user?.name || "Admin"}</Typography>
    </Box>
  );
}
