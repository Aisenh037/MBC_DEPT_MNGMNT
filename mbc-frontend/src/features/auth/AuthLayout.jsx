// src/layouts/AuthLayout.jsx
import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import logo from '../assets/Manit_Logo_color_0-removebg-preview.png'; // Ensure path is correct

export default function AuthLayout({ title, children }) {
  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url(https://source.unsplash.com/random?college,university)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img src={logo} alt="MANIT Logo" style={{ width: 72, height: 72, marginBottom: '16px' }} />
          <Typography component="h1" variant="h5" fontWeight="bold">
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            MBC Department Portal
          </Typography>
          <Box sx={{ mt: 3, width: '100%' }}>
            {children}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}