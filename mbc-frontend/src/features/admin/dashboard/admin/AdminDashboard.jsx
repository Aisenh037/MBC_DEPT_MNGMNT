// src/features/admin/dashboard/admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CampaignIcon from '@mui/icons-material/Campaign';
import StatCard from '../../../../components/UI/StatCard';
import { getAnalyticsData } from '../../../../services/analytics'; // ✨ Use central API service
import { useNotify } from '../../../../components/UI/NotificationProvider';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalBranches: 0,
    totalNotices: 0,
  });
  const [loading, setLoading] = useState(true);
  const notify = useNotify();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await getAnalyticsData();
        setStats(data.data); // Assuming data is in response.data.data
      } catch (error) {
        notify('Error fetching dashboard analytics', 'error');
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [notify]);

  const dashboardItems = [
    { title: 'Students', count: stats.totalStudents, icon: <PeopleOutlineIcon />, color: 'primary.main', link: '/admin/students' },
    { title: 'Teachers', count: stats.totalTeachers, icon: <CoPresentIcon />, color: 'success.main', link: '/admin/teachers' },
    { title: 'Branches', count: stats.totalBranches, icon: <AccountTreeIcon />, color: 'secondary.main', link: '/admin/branches' },
    { title: 'Notices', count: stats.totalNotices, icon: <CampaignIcon />, color: 'warning.main', link: '/admin/notices' },
  ];

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      <Grid container spacing={3}>
        {dashboardItems.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.title}>
            <StatCard item={item} loading={loading} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}