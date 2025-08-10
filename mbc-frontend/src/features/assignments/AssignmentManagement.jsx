// src/features/assignments/AssignmentManagement.jsx
import React, { useState } from 'react';
import { Box, Typography, Button, Dialog, Stack, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNotify } from '../../components/UI/NotificationProvider';
import AssignmentForm from './components/AssignmentForm';
import { useAssignments, useDeleteAssignment } from '../../hooks/useAssignments';

export default function AssignmentManagement() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const notify = useNotify();

  // Fetch data using our React Query hook
  const { data: assignmentsData, isLoading } = useAssignments();
  const assignments = assignmentsData?.data?.data || [];

  // Get the delete mutation hook
  const deleteMutation = useDeleteAssignment();

  const handleOpenDialog = (assignment = null) => {
    setEditingAssignment(assignment);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingAssignment(null);
    setDialogOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      deleteMutation.mutate(id, {
        onSuccess: () => notify('Assignment deleted successfully', 'success'),
        onError: (err) => notify(err.response?.data?.error || 'Failed to delete', 'error'),
      });
    }
  };

  const columns = [
    { field: 'title', headerName: 'Title', flex: 2 },
    { field: 'subject', headerName: 'Subject', flex: 1, valueGetter: (params) => params.row.subject?.name || 'N/A' },
    { field: 'class', headerName: 'Class', flex: 1, valueGetter: (params) => params.row.class?.name || 'N/A' },
    { field: 'dueDate', headerName: 'Due Date', width: 150, valueGetter: (params) => new Date(params.row.dueDate).toLocaleDateString() },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 120,
      renderCell: (params) => (
        <Stack direction="row">
          <IconButton color="primary" onClick={() => handleOpenDialog(params.row)}><EditIcon /></IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row._id)}><DeleteIcon /></IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ height: 650, width: '100%' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">Manage Assignments</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          New Assignment
        </Button>
      </Stack>
      <DataGrid
        rows={assignments}
        columns={columns}
        loading={isLoading}
        getRowId={(row) => row._id}
        pageSizeOptions={[10, 25, 50]}
        sx={{ bgcolor: 'background.paper', boxShadow: 2, borderRadius: 2 }}
      />
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <AssignmentForm editingAssignment={editingAssignment} onClose={handleCloseDialog} />
      </Dialog>
    </Box>
  );
}