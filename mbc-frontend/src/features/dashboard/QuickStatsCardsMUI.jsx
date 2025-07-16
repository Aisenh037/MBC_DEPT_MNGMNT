import React from "react";
import { Card, CardContent, Typography, Button, Grid, Box } from "@mui/material";
import CountUp from "react-countup";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonIcon from "@mui/icons-material/Person";
import NoticeIcon from "@mui/icons-material/Announcement";
import { Link as RouterLink } from "react-router-dom";

export default function QuickStatsCardsMUI({ stats }) {
  const cards = [
    {
      label: "Students",
      value: stats.totalStudents,
      color: "#2563eb",
      icon: <SchoolIcon fontSize="large" color="primary" />,
      link: "/students"
    },
    {
      label: "Teachers",
      value: stats.totalTeachers,
      color: "#059669",
      icon: <PersonIcon fontSize="large" sx={{ color: "#059669" }} />,
      link: "/teachers"
    },
    {
      label: "Assignments",
      value: stats.totalAssignments,
      color: "#f59e42",
      icon: <AssignmentIcon fontSize="large" sx={{ color: "#f59e42" }} />,
      link: "/assignments"
    },
    {
      label: "Notices",
      value: stats.totalNotices,
      color: "#9333ea",
      icon: <NoticeIcon fontSize="large" sx={{ color: "#9333ea" }} />,
      link: "/notices"
    }
  ];

  return (
    <Grid container spacing={3}>
      {cards.map(card => (
        <Grid item xs={12} sm={6} md={3} key={card.label}>
          <Card sx={{ borderLeft: `8px solid ${card.color}`, boxShadow: 4, transition: "transform 0.15s", "&:hover": { transform: "scale(1.03)" } }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                {card.icon}
                <Typography variant="h4" fontWeight="bold" color="text.primary">
                  <CountUp end={card.value || 0} duration={1.2} separator="," />
                </Typography>
              </Box>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {card.label}
              </Typography>
              <Button
                variant="text"
                component={RouterLink}
                to={card.link}
                sx={{ mt: 2, color: card.color, fontWeight: 700, textTransform: "none" }}
              >
                View {card.label}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
