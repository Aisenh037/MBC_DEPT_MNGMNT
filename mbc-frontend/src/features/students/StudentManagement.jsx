// src/features/admin/dashboard/admin/StudentManagement.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Dialog, Stack, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNotify } from '../../../../components/UI/NotificationProvider';
import StudentForm from './components/StudentForm'; // The new, reusable form component

// ✨ Use central API services
import { getStudents, deleteStudent } from '../../../../services/student';

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const notify = useNotify();

  const fetchAllStudents = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getStudents();
      setStudents(data.data || []);
    } catch (err) {
      notify('Failed to fetch students.', 'error');
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    fetchAllStudents();
  }, [fetchAllStudents]);

  const handleOpenDialog = (student = null) => {
    setEditingStudent(student);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingStudent(null);
    setDialogOpen(false);
  };

  const handleSave = () => {
    handleCloseDialog();
    fetchAllStudents(); // Refresh data after saving
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(id);
        notify('Student deleted successfully', 'success');
        fetchAllStudents();
      } catch (err) {
        notify(err.response?.data?.error || 'Failed to delete student', 'error');
      }
    }
  };

  const columns = [
    { field: 'scholarNo', headerName: 'Scholar No.', flex: 1 },
    { field: 'name', headerName: 'Name', flex: 1.5, valueGetter: (params) => params.row.user?.name },
    { field: 'email', headerName: 'Email', flex: 1.5, valueGetter: (params) => params.row.user?.email },
    { field: 'branch', headerName: 'Branch', flex: 1, valueGetter: (params) => params.row.branch?.name || 'N/A' },
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
        <Typography variant="h5" fontWeight="bold">Manage Students</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Student
        </Button>
      </Stack>
      <DataGrid
        rows={students}
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
        <StudentForm
          editingStudent={editingStudent}
          onClose={handleCloseDialog}
          onSave={handleSave}
        />
      </Dialog>
    </Box>
  );
}