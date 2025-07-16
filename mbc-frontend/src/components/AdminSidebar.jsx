import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, Divider, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/PeopleOutline';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import CampaignIcon from '@mui/icons-material/Campaign';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 220;

export default function AdminSidebar({ handleLogout }) {
  const location = useLocation();
  const sidebarLinks = [
    { text: 'Dashboard', icon: <DashboardIcon />, link: '/admin' },
    { text: 'Students', icon: <PeopleIcon />, link: '/admin/students' },
    { text: 'Teachers', icon: <CoPresentIcon />, link: '/admin/teachers' },
    { text: 'Branches', icon: <AccountTreeIcon />, link: '/admin/branches' },
    { text: 'Courses', icon: <LibraryBooksIcon />, link: '/admin/courses' },
    { text: 'Notices', icon: <CampaignIcon />, link: '/admin/notices' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar>
        <Typography fontWeight="bold" fontSize={18} color="primary" sx={{ width: '100%' }}>
          Admin Panel
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {sidebarLinks.map(({ text, icon, link }) => (
          <ListItem
            button
            key={text}
            component={Link}
            to={link}
            selected={location.pathname === link}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Button
        variant="contained"
        color="error"
        startIcon={<LogoutIcon />}
        onClick={handleLogout}
        sx={{ m: 2 }}
      >
        Logout
      </Button>
    </Drawer>
  );
}
