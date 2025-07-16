import { Paper, Avatar, Box, Typography, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';

export default function StatCard({ item, loading }) {
  return (
    <Paper
      component={Link}
      to={item.link}
      elevation={4}
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '12px',
        textDecoration: 'none',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'scale(1.03)',
          boxShadow: '0 8px 20px -5px rgba(0,0,0,0.2)'
        },
      }}
    >
      <Avatar sx={{ bgcolor: item.color, width: 60, height: 60, color: 'white' }}>
        {item.icon}
      </Avatar>
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="h4" fontWeight="bold">
          {loading ? <CircularProgress size={28} /> : item.count}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {item.title}
        </Typography>
      </Box>
    </Paper>
  );
}
