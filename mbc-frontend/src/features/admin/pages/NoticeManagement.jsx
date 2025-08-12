// src/features/admin/pages/NoticeManagement.jsx
import React, { useState } from 'react';
import { Box, Typography, Button, Dialog, Stack, IconButton, Tooltip, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNotify } from '../../../components/UI/NotificationProvider.jsx';
import NoticeForm from '../components/NoticeForm.jsx'; 
import { useNotices, useDeleteNotice } from '../../../hooks/useNotices.js';
import { format } from 'date-fns';

export default function NoticeManagement() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const notify = useNotify();

  const { data: notices = [], isLoading, isError, error } = useNotices();
  const deleteMutation = useDeleteNotice();

  const handleOpenDialog = (notice = null) => {
    setEditingNotice(notice);
    setDialogOpen(true);
  };
  const handleCloseDialog = () => setDialogOpen(false);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      deleteMutation.mutate(id, {
        onSuccess: () => notify('Notice deleted successfully', 'success'),
        onError: (err) => notify(err.response?.data?.error || 'Failed to delete', 'error'),
      });
    }
  };

  const columns = [
    { field: 'title', headerName: 'Title', flex: 2 },
    { 
      field: 'target', 
      headerName: 'Target Audience', 
      flex: 1,
      renderCell: (params) => <Chip label={params.value.charAt(0).toUpperCase() + params.value.slice(1)} size="small" />
    },
    { 
      field: 'createdAt', 
      headerName: 'Published On', 
      flex: 1,
      valueGetter: (params) => format(new Date(params.value), 'PP'), // Format as 'Aug 12, 2025'
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row">
          <Tooltip title="Edit Notice">
            <IconButton color="primary" onClick={() => handleOpenDialog(params.row)}><EditIcon /></IconButton>
          </Tooltip>
          <Tooltip title="Delete Notice">
            <IconButton color="error" onClick={() => handleDelete(params.row._id)}><DeleteIcon /></IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ height: 'calc(100vh - 150px)', width: '100%' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">Manage Notices</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Add Notice
        </Button>
      </Stack>
      <DataGrid
        rows={notices}
        columns={columns}
        loading={isLoading || deleteMutation.isLoading}
        getRowId={(row) => row._id}
        sx={{ bgcolor: 'background.paper', border: 'none' }}
        error={isError ? error.message : null}
      />
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <NoticeForm editingNotice={editingNotice} onClose={handleCloseDialog} />
      </Dialog>
    </Box>
  );
}