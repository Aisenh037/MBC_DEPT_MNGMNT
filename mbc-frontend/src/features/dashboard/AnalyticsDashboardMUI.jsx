import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import axios from "axios";

export default function AnalyticsDashboardMUI() {
  const [stats, setStats] = useState({
    totalStudents: 0, totalTeachers: 0, totalAssignments: 0, totalClasses: 0,
    avgMark: 0, maxMark: 0, minMark: 0, totalMarksRecords: 0,
    gradingTrends: []
  });

  useEffect(() => {
    axios.get("/api/analytics").then(res => setStats(res.data));
  }, []);

  const cards = [
    { label: "Students", value: stats.totalStudents, color: "#2563eb" },
    { label: "Teachers", value: stats.totalTeachers, color: "#059669" },
    { label: "Assignments", value: stats.totalAssignments, color: "#f59e42" },
    { label: "Classes", value: stats.totalClasses, color: "#9333ea" }
  ];

  // Example gradingTrends from stats:
  // [{ assignment: "A1", avgMark: 78 }, ...]
  const gradingTrends = stats.gradingTrends || [];

  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {cards.map(card => (
          <Grid item xs={6} md={3} key={card.label}>
            <Card sx={{ borderLeft: `8px solid ${card.color}` }}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold">{card.value}</Typography>
                <Typography color="text.secondary">{card.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography fontWeight="bold" mb={2}>Average Marks per Assignment</Typography>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={gradingTrends}>
                  <XAxis dataKey="assignment" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="avgMark" stroke="#2563eb" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography fontWeight="bold" mb={2}>Student/Teacher Ratio</Typography>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={[
                  { label: "Students", value: stats.totalStudents },
                  { label: "Teachers", value: stats.totalTeachers }
                ]}>
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
