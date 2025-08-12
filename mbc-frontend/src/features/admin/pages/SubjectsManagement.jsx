// src/features/admin/pages/SubjectsManagement.jsx
import React, { useState } from 'react';
import { Box, Typography, Button, Dialog, Stack, IconButton, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNotify } from '@/components/UI/NotificationProvider';
import { useSubjects, useDeleteSubject } from '@/hooks/useSubjects';
import SubjectForm from '../components/SubjectForm';

export default function SubjectsManagement() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const notify = useNotify();

  const { data: subjects = [], isLoading, isError, error } = useSubjects();
  const deleteMutation = useDeleteSubject();

  const handleOpenDialog = (subject = null) => {
    setEditingSubject(subject);
    setDialogOpen(true);
  };
  const handleCloseDialog = () => setDialogOpen(false);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure?')) {
      deleteMutation.mutate(id, {
        onSuccess: () => notify('Subject deleted', 'success'),
        onError: (err) => notify(err.response?.data?.error || 'Failed to delete', 'error'),
      });
    }
  };

  const columns = [
    { field: 'name', headerName: 'Subject Name', flex: 2 },
    { field: 'code', headerName: 'Subject Code', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row">
          <Tooltip title="Edit Subject"><IconButton color="primary" onClick={() => handleOpenDialog(params.row)}><EditIcon /></IconButton></Tooltip>
          <Tooltip title="Delete Subject"><IconButton color="error" onClick={() => handleDelete(params.row._id)}><DeleteIcon /></IconButton></Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ height: 'calc(100vh - 150px)', width: '100%' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">Manage Subjects</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>Add Subject</Button>
      </Stack>
      <DataGrid
        rows={subjects}
        columns={columns}
        loading={isLoading || deleteMutation.isLoading}
        getRowId={(row) => row._id}
        sx={{ bgcolor: 'background.paper', border: 'none' }}
        error={isError ? error.message : null}
      />
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <SubjectForm editingSubject={editingSubject} onClose={handleCloseDialog} />
      </Dialog>
    </Box>
  );
}