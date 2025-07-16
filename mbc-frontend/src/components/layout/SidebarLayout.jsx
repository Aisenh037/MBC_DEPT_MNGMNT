import React, { useState } from "react";
import { Box, Drawer, AppBar, Toolbar, IconButton, Typography, List, ListItem, ListItemIcon, ListItemText, CssBaseline } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentIcon from "@mui/icons-material/Assignment";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate } from "react-router-dom";

const drawerWidth = 220;
const menu = [
  { label: "Dashboard", icon: <HomeIcon />, link: "/dashboard" },
  { label: "Students", icon: <SchoolIcon />, link: "/students" },
  { label: "Assignments", icon: <AssignmentIcon />, link: "/assignments" },
  { label: "Notices", icon: <NotificationsIcon />, link: "/notices" },
];

export default function SidebarLayout({ children }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" color="primary">MBC Portal</Typography>
      </Toolbar>
      <List>
        {menu.map(item => (
          <ListItem button key={item.label} onClick={() => navigate(item.link)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: 1400 }}>
        <Toolbar>
          <IconButton color="inherit" onClick={() => setOpen(!open)} edge="start" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>My College Dashboard</Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth, flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" }
        }}
        open={open}
      >
        {drawer}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "#f9fafb", p: 3, minHeight: "100vh" }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
