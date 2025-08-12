// src/components/UI/StatCard.jsx
import React from 'react';
import { Card, CardActionArea, CardContent, Typography, Box, CircularProgress, alpha } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function StatCard({ item, loading }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (item.link) {
      navigate(item.link);
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        // THE FIX IS HERE: Use a theme callback to resolve the color first
        backgroundColor: (theme) => {
          // Fallback to a default color if item.color is not a valid theme color
          const colorPath = item.color.split('.');
          const colorValue = theme.palette[colorPath[0]]?.[colorPath[1]] || theme.palette.grey[200];
          return alpha(colorValue, 0.15); // Increased alpha slightly for better visibility
        },
      }}
    >
      <CardActionArea onClick={handleCardClick} sx={{ height: '100%', p: 2 }}>
        <CardContent sx={{ textAlign: 'center' }}>
          {loading ? (
            <CircularProgress sx={{ color: item.color }} />
          ) : (
            <>
              <Box sx={{ color: item.color, mb: 1 }}>
                {React.cloneElement(item.icon, { style: { fontSize: 40 } })}
              </Box>
              <Typography variant="h4" component="div" fontWeight="bold">
                {item.count ?? 0}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {item.title}
              </Typography>
            </>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}