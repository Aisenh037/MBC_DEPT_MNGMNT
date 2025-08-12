// src/features/admin/components/TeacherForm.jsx
import React, { useState, useEffect } from 'react';
import {
  DialogTitle, DialogContent, DialogActions, Button,
  TextField, Grid, CircularProgress,
} from '@mui/material';
import { useNotify } from '@/components/UI/NotificationProvider';
import { useAddTeacher, useUpdateTeacher } from '@/hooks/useTeachers';

export default function TeacherForm({ editingTeacher, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', employeeId: '', department: '' });
  const notify = useNotify();

  useEffect(() => {
    if (editingTeacher) {
      setForm({
        name: editingTeacher.user?.name || '',
        email: editingTeacher.user?.email || '',
        employeeId: editingTeacher.employeeId || '',
        department: editingTeacher.department || '',
        password: '',
      });
    } else {
      setForm({ name: '', email: '', password: '', employeeId: '', department: '' });
    }
  }, [editingTeacher]);

  const addMutation = useAddTeacher();
  const updateMutation = useUpdateTeacher();
  const isLoading = addMutation.isLoading || updateMutation.isLoading;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const mutation = editingTeacher ? updateMutation : addMutation;
    const payload = { ...form };
    if (editingTeacher && !payload.password) {
        delete payload.password;
    }
    const finalPayload = editingTeacher ? { id: editingTeacher._id, data: payload } : payload;

    mutation.mutate(finalPayload, {
      onSuccess: () => {
        notify(`Teacher ${editingTeacher ? 'updated' : 'added'} successfully`, 'success');
        onClose(); // Close the dialog on success
      },
      onError: (err) => {
        notify(err.response?.data?.error || 'Operation failed', 'error');
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>{editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item xs={12}><TextField label="Full Name" name="name" value={form.name} onChange={handleChange} fullWidth required /></Grid>
          <Grid item xs={12}><TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} fullWidth required /></Grid>
          <Grid item xs={12} sm={6}><TextField label="Employee ID" name="employeeId" value={form.employeeId} onChange={handleChange} fullWidth required /></Grid>
          <Grid item xs={12} sm={6}><TextField label="Department" name="department" value={form.department} onChange={handleChange} fullWidth required /></Grid>
          {!editingTeacher && (
            <Grid item xs={12}><TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} fullWidth required /></Grid>
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