// src/features/auth/LoginPage.jsx
import { useState, useEffect } from "react";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate } from "react-router-dom";
import { 
  Box, Button, CircularProgress, TextField, Typography, Link
} from "@mui/material";
import AuthLayout from "../../layouts/AuthLayout";
import { useNotify } from "../../components/UI/NotificationProvider";

export default function LoginPage() {
  const { login, user } = useAuthStore();
  const navigate = useNavigate();
  const notify = useNotify();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await login(formData);
      notify('Login successful!', 'success');
      // The useEffect hook will handle redirection
    } catch (err) {
      notify(err.response?.data?.error || 'Login failed. Please check your credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign In">
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Email Address"
          name="email"
          type="email"
          required
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          autoFocus
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          required
          fullWidth
          margin="normal"
          value={formData.password}
          onChange={handleChange}
          autoComplete="current-password"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{ mt: 3, mb: 2, py: 1.5 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
        </Button>
        <Typography variant="body2" align="center">
          Don't have an account?{' '}
          <Link component={RouterLink} to="/register" variant="body2">
            Sign Up
          </Link>
        </Typography>
      </Box>
    </AuthLayout>
  );
}