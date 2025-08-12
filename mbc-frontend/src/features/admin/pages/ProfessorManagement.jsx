// src/features/admin/pages/ProfessorManagement.jsx
import React, { useState } from 'react';
import { Box, Typography, Button, Dialog, Stack, IconButton, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNotify } from '@/components/UI/NotificationProvider';
import { useAdminTeachers, useDeleteTeacher } from '@/hooks/useTeachers';
import TeacherForm from '../components/TeacherForm';

export default function ProfessorManagement() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const notify = useNotify();

  const { data: teachers = [], isLoading, isError, error } = useAdminTeachers();
  const deleteMutation = useDeleteTeacher();

  const handleOpenDialog = (teacher = null) => {
    setEditingTeacher(teacher);
    setDialogOpen(true);
  };
  const handleCloseDialog = () => setDialogOpen(false);
  
  const handleDelete = (id) => {
    if (window.confirm('Are you sure?')) {
      deleteMutation.mutate(id, {
        onSuccess: () => notify('Teacher deleted successfully', 'success'),
        onError: (err) => notify(err.response?.data?.error || 'Failed to delete', 'error'),
      });
    }
  };
  
  const columns = [
    { field: 'name', headerName: 'Name', flex: 1.5, valueGetter: (params) => params.row.user?.name || 'N/A' },
    { field: 'email', headerName: 'Email', flex: 2, valueGetter: (params) => params.row.user?.email || 'N/A' },
    { field: 'employeeId', headerName: 'Employee ID', flex: 1 },
    { field: 'department', headerName: 'Department', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row">
          <Tooltip title="Edit Teacher">
            <IconButton color="primary" onClick={() => handleOpenDialog(params.row)}><EditIcon /></IconButton>
          </Tooltip>
          <Tooltip title="Delete Teacher">
            <IconButton color="error" onClick={() => handleDelete(params.row._id)}><DeleteIcon /></IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ height: 'calc(100vh - 150px)', width: '100%' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">Manage Teachers</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Add Teacher
        </Button>
      </Stack>
      <DataGrid
        rows={teachers}
        columns={columns}
        loading={isLoading || deleteMutation.isLoading}
        getRowId={(row) => row._id}
        sx={{ bgcolor: 'background.paper', border: 'none' }}
        error={isError ? error.message : null}
      />
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <TeacherForm editingTeacher={editingTeacher} onClose={handleCloseDialog} />
      </Dialog>
    </Box>
  );
}