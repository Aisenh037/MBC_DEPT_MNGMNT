// src/features/admin/AdminSidebar.jsx
import React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Box,
  Button
} from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore'; // Assuming this is your auth store path

import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/PeopleOutline';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import CampaignIcon from '@mui/icons-material/Campaign';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 240;

const sidebarLinks = [
  { text: 'Dashboard', icon: <DashboardIcon />, link: '/admin' },
  { text: 'Students', icon: <PeopleIcon />, link: '/admin/students' },
  { text: 'Teachers', icon: <CoPresentIcon />, link: '/admin/teachers' },
  { text: 'Branches', icon: <AccountTreeIcon />, link: '/admin/branches' },
  { text: 'Courses', icon: <LibraryBooksIcon />, link: '/admin/courses' },
  { text: 'Notices', icon: <CampaignIcon />, link: '/admin/notices' },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const { logout } = useAuthStore(); // Use logout from your store

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          // Flexbox to push logout to the bottom
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between', 
        },
      }}
    >
      {/* Top section with Title and Nav Links */}
      <Box>
        <Toolbar>
          <Typography variant="h6" fontWeight="bold" color="primary">
            Admin Panel
          </Typography>
        </Toolbar>
        <Divider />
        <List sx={{ p: 1 }}>
          {sidebarLinks.map(({ text, icon, link }) => (
            <ListItemButton
              key={text}
              component={NavLink}
              to={link}
              end={link === '/admin'}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                '&.active': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  },
                },
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* Bottom section with Logout Button */}
      <Box sx={{ p: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <Button
          variant="outlined"
          color="error"
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          aria-label="logout"
        >
          Logout
        </Button>
      </Box>
    </Drawer>
  );
}