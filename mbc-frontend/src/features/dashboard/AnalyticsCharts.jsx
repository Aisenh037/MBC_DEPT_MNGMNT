// src/features/admin/dashboard/components/AnalyticsCharts.jsx
import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend, CartesianGrid,
} from 'recharts';

export default function AnalyticsCharts({ stats }) {
  // Mock data for trends, replace with real data from your `stats` object when available
  const gradingTrends = stats?.gradingTrends || [
    { name: 'Assignment 1', avgMark: 85 },
    { name: 'Midterm Exam', avgMark: 72 },
    { name: 'Assignment 2', avgMark: 91 },
    { name: 'Final Exam', avgMark: 78 },
  ];

  const studentTeacherData = [
    { name: 'Metrics', Students: stats?.totalStudents || 0, Teachers: stats?.totalTeachers || 0 },
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card component={Paper} elevation={2} sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Grading Trends
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={gradingTrends} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="avgMark" name="Average Mark" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card component={Paper} elevation={2} sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Student to Teacher Ratio
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={studentTeacherData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Students" fill="#8884d8" />
                <Bar dataKey="Teachers" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}