import React from "react";
import { Box, Typography, Divider, Grid, Paper, Button, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import CoPresentIcon from "@mui/icons-material/CoPresent";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import CampaignIcon from "@mui/icons-material/Campaign";

const cardData = [
  {
    title: "Manage Professors",
    subtitle: "Add, edit, and manage professors.",
    icon: <CoPresentIcon fontSize="large" />,
    avatarColor: "#388e3c",
    link: "/admin/professors",
    btnLabel: "Go to Professor Section",
  },
  {
    title: "Manage Students",
    subtitle: "Enroll, edit, and track student records.",
    icon: <PeopleOutlineIcon fontSize="large" />,
    avatarColor: "#1976d2",
    link: "/admin/students",
    btnLabel: "Go to Student Section",
  },
  {
    title: "Manage Branches / Classes",
    subtitle: "Define and update academic branches and class groups.",
    icon: <AccountTreeIcon fontSize="large" />,
    avatarColor: "#673ab7",
    link: "/admin/branches",
    btnLabel: "Go to Branch Section",
  },
  {
    title: "Manage Notices",
    subtitle: "Create and publish campus notices.",
    icon: <CampaignIcon fontSize="large" />,
    avatarColor: "#f57c00",
    link: "/admin/notices",
    btnLabel: "Go to Notices",
  },
  // Add more sections as needed
];

function DashboardCard({ title, subtitle, icon, avatarColor, link, btnLabel, navigate }) {
  return (
    <Paper elevation={3} sx={{ p: 3, textAlign: "center", height: "100%" }}>
      <Avatar
        sx={{
          bgcolor: avatarColor,
          width: 56,
          height: 56,
          mx: "auto",
          mb: 2,
          fontSize: 32,
        }}
      >
        {icon}
      </Avatar>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        {subtitle}
      </Typography>
      <Button
        variant="contained"
        fullWidth
        onClick={() => navigate(link)}
        sx={{ mt: 1 }}
      >
        {btnLabel}
      </Button>
    </Paper>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <Box sx={{ flex: 1, p: 3 }}>
        <AdminHeader />
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {cardData.map((card) => (
            <Grid item xs={12} sm={6} md={4} key={card.title}>
              <DashboardCard {...card} navigate={navigate} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
