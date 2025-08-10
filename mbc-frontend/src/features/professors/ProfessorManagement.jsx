// src/features/admin/dashboard/admin/ProfessorManagement.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Dialog, Stack, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNotify } from '../../../../components/UI/NotificationProvider';
import TeacherForm from './components/TeacherForm'; // The new form component

// ✨ Use central API services
import { getTeachers, deleteTeacher } from '../../../../services/professor';

export default function ProfessorManagement() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const notify = useNotify();

  const fetchAllTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getTeachers();
      setTeachers(data.data || []);
    } catch (err) {
      notify('Failed to fetch teachers.', 'error');
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    fetchAllTeachers();
  }, [fetchAllTeachers]);

  const handleOpenDialog = (teacher = null) => {
    setEditingTeacher(teacher);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingTeacher(null);
    setDialogOpen(false);
  };

  const handleSave = () => {
    handleCloseDialog();
    fetchAllTeachers(); // Refresh data after saving
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await deleteTeacher(id);
        notify('Teacher deleted successfully', 'success');
        fetchAllTeachers();
      } catch (err) {
        notify(err.response?.data?.error || 'Failed to delete teacher', 'error');
      }
    }
  };

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1, valueGetter: (params) => params.row.user?.name },
    { field: 'email', headerName: 'Email', flex: 1.5, valueGetter: (params) => params.row.user?.email },
    { field: 'employeeId', headerName: 'Employee ID', flex: 1 },
    { field: 'department', headerName: 'Department', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 120,
      renderCell: (params) => (
        <Stack direction="row">
          <IconButton color="primary" onClick={() => handleOpenDialog(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row._id)}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ height: 650, width: '100%' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">Manage Teachers</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Teacher
        </Button>
      </Stack>
      <DataGrid
        rows={teachers}
        columns={columns}
        loading={loading}
        getRowId={(row) => row._id}
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        sx={{ bgcolor: 'background.paper', boxShadow: 2, borderRadius: 2 }}
      />
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <TeacherForm
          editingTeacher={editingTeacher}
          onClose={handleCloseDialog}
          onSave={handleSave}
        />
      </Dialog>
    </Box>
  );
}