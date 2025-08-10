// src/features/marks/MarksManagement.jsx
import React, { useState } from 'react';
import { Box, Typography, Button, Dialog, Stack, IconButton, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNotify } from '../../components/UI/NotificationProvider';
import MarkForm from './components/MarkForm'; // The new reusable form component
import { useMarks, useDeleteMark } from '../../hooks/useMarks';

export default function MarksManagement() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMark, setEditingMark] = useState(null);
  const notify = useNotify();

  // Fetch data using our React Query hook
  const { data: marks = [], isLoading } = useMarks();
  
  // Get the delete mutation hook
  const deleteMutation = useDeleteMark();

  const handleOpenDialog = (mark = null) => {
    setEditingMark(mark);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingMark(null);
    setDialogOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this mark entry?')) {
      deleteMutation.mutate(id, {
        onSuccess: () => notify('Mark deleted successfully', 'success'),
        onError: (err) => notify(err.response?.data?.error || 'Failed to delete mark', 'error'),
      });
    }
  };

  const columns = [
    { field: 'studentName', headerName: 'Student', flex: 1.5, valueGetter: (params) => params.row.student?.user?.name || 'N/A' },
    { field: 'subjectName', headerName: 'Subject', flex: 1.5, valueGetter: (params) => params.row.subject?.name || 'N/A' },
    { field: 'examType', headerName: 'Exam Type', flex: 1, renderCell: (params) => <Chip label={params.value} size="small" /> },
    { field: 'marksObtained', headerName: 'Marks', width: 100, type: 'number' },
    { field: 'maxMarks', headerName: 'Max Marks', width: 100, type: 'number' },
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
        <Typography variant="h5" fontWeight="bold">Manage Student Marks</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Add Mark
        </Button>
      </Stack>
      <DataGrid
        rows={marks}
        columns={columns}
        loading={isLoading}
        getRowId={(row) => row._id}
        pageSizeOptions={[10, 25, 50]}
        sx={{ bgcolor: 'background.paper', boxShadow: 2, borderRadius: 2 }}
      />
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <MarkForm editingMark={editingMark} onClose={handleCloseDialog} />
      </Dialog>
    </Box>
  );
}