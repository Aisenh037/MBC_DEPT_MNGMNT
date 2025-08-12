// src/features/admin/components/StudentForm.jsx
import React, { useState, useEffect } from 'react';
import {
  DialogTitle, DialogContent, DialogActions, Button,
  TextField, Grid, CircularProgress, Select, MenuItem,
  InputLabel, FormControl,
} from '@mui/material';
import { useNotify } from '../../../components/UI/NotificationProvider';
import { useAddStudent, useUpdateStudent } from '../../../hooks/useStudents';
import { getBranches } from '../../../api/branch'; // Assuming you have this service

export default function StudentForm({ editingStudent, onClose, onSave }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    scholarNo: '',
    currentSemester: 1,
    branch: '',
  });
  const [branches, setBranches] = useState([]);
  const notify = useNotify();

  const addMutation = useAddStudent();
  const updateMutation = useUpdateStudent();
  const isLoading = addMutation.isLoading || updateMutation.isLoading;

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await getBranches();
        setBranches(res?.data?.data || []);
      } catch (error) {
        notify('Could not load branches', 'error');
      }
    };
    fetchBranches();

    if (editingStudent) {
      setForm({
        name: editingStudent.user?.name || '',
        email: editingStudent.user?.email || '',
        scholarNo: editingStudent.scholarNo || '',
        currentSemester: editingStudent.currentSemester || 1,
        branch: editingStudent.branch?._id || '',
        password: '',
      });
    } else {
      setForm({ name: '', email: '', password: '', scholarNo: '', currentSemester: 1, branch: '' });
    }
  }, [editingStudent, notify]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const mutation = editingStudent ? updateMutation : addMutation;
    const payload = { ...form };
    
    // Don't send an empty password field when updating
    if (editingStudent && !payload.password) {
      delete payload.password;
    }

    const finalPayload = editingStudent ? { id: editingStudent._id, data: payload } : payload;

    mutation.mutate(finalPayload, {
      onSuccess: () => {
        notify(`Student ${editingStudent ? 'updated' : 'added'} successfully`, 'success');
        onSave(); // Close dialog and refetch data
      },
      onError: (err) => {
        notify(err.response?.data?.error || 'An unexpected error occurred', 'error');
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>{editingStudent ? 'Edit Student' : 'Add New Student'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item xs={12}><TextField label="Full Name" name="name" value={form.name} onChange={handleChange} fullWidth required /></Grid>
          <Grid item xs={12}><TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} fullWidth required /></Grid>
          <Grid item xs={12} sm={6}><TextField label="Scholar No." name="scholarNo" value={form.scholarNo} onChange={handleChange} fullWidth required /></Grid>
          <Grid item xs={12} sm={6}><TextField label="Current Semester" name="currentSemester" type="number" value={form.currentSemester} onChange={handleChange} fullWidth required /></Grid>
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Branch</InputLabel>
              <Select name="branch" value={form.branch} label="Branch" onChange={handleChange}>
                {branches.map((b) => (<MenuItem key={b._id} value={b._id}>{b.name}</MenuItem>))}
              </Select>
            </FormControl>
          </Grid>
          {!editingStudent && (
            <Grid item xs={12}><TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} fullWidth required helperText="Set an initial password for the student." /></Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: '0 24px 16px' }}>
        <Button onClick={onClose} disabled={isLoading}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={isLoading}>{isLoading ? <CircularProgress size={24} /> : 'Save'}</Button>
      </DialogActions>
    </form>
  );
}