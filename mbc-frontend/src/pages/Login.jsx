// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import {
  Button,
  TextField,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert, // For better error display
} from "@mui/material";
import logo from '../assets/Manit_Logo_color_0-removebg-preview.png'; // Make sure this path is correct

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Get state and actions from the Zustand store
  const { login, user } = useAuthStore((state) => ({
    login: state.login,
    user: state.user,
  }));
  const navigate = useNavigate();

  // Effect to redirect the user if they are already logged in
  useEffect(() => {
    if (user) {
      // Redirect based on user role
      switch (user.role) {
        case "admin":
          navigate("/admin");
          break;
        case "teacher":
          navigate("/teacher");
          break;
        case "student":
          navigate("/student");
          break;
        default:
          navigate("/dashboard"); // A general fallback dashboard
      }
    }
  }, [user, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Call the login action from the store
      await login({ email, password });
      // The useEffect hook above will handle successful navigation
    } catch (err) {
      // Set a user-friendly error message from the server response if available
      setError(err.response?.data?.error || "Login failed. Please check your credentials.");
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3f2fd 30%, #f5f7fa 90%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 3 }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
          <img src={logo} alt="MANIT Bhopal Logo" style={{ width: 64, height: 64, marginBottom: '16px' }} />
          <Typography component="h1" variant="h5" fontWeight="bold" color="primary">
            MBC Department Portal
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sign in to continue
          </Typography>
        </Box>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          {error && (
            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1rem' }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}