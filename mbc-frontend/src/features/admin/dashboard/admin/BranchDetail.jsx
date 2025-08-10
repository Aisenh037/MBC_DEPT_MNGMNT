// src/features/admin/dashboard/admin/BranchDetail.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Button, Tabs, Tab, CircularProgress, Divider
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNotify } from '../../../../components/UI/NotificationProvider';

// ✨ Use central API services
import { getBranchById, getBranchStudents, getBranchSemesters } from '../../../../services/branch';
import StudentList from './components/StudentList'; // Assuming you create this sub-component

// Sub-component for the header
const BranchHeader = ({ branch }) => (
  <>
    <Typography variant="h4" fontWeight="bold">
      {branch.name} ({branch.code})
    </Typography>
    <Typography variant="subtitle1" color="text.secondary">
      Coordinator: {branch.coordinator?.name || 'N/A'} | Intake: {branch.intakeCapacity}
    </Typography>
  </>
);

// TabPanel utility component
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function BranchDetail() {
  const { branchId } = useParams();
  const navigate = useNavigate();
  const notify = useNotify();

  const [branch, setBranch] = useState(null);
  const [students, setStudents] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [branchRes, studentsRes, semestersRes] = await Promise.all([
        getBranchById(branchId),
        getBranchStudents(branchId),
        getBranchSemesters(branchId),
      ]);
      setBranch(branchRes.data.data);
      setStudents(studentsRes.data.data || []);
      setSemesters(semestersRes.data.data || []);
    } catch (error) {
      notify('Error fetching branch details', 'error');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [branchId, notify]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!branch) {
    return <Typography>Branch not found.</Typography>;
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/branches')}>
        Back to Branches
      </Button>
      <Box sx={{ mt: 2, p: 2 }}>
        <BranchHeader branch={branch} />
      </Box>
      <Divider />
      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tab label="Students" />
        <Tab label="Semesters" />
        <Tab label="Curriculum" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <StudentList students={students} branch={branch} onRefresh={fetchData} />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6">Semester Information</Typography>
        {/* You can map over `semesters` here to display them */}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6">Branch Curriculum</Typography>
        {/* A component to display subjects per semester would go here */}
      </TabPanel>
    </Paper>
  );
}