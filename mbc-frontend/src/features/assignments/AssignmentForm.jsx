// src/features/assignments/components/AssignmentForm.jsx
import React, { useState, useEffect } from 'react';
import {
  DialogTitle, DialogContent, DialogActions, Button, TextField,
  Grid, CircularProgress, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import { useNotify } from '../../../components/UI/NotificationProvider';
import { useCreateAssignment, useUpdateAssignment } from '../../../hooks/useAssignments';
import { getSubjects } from '../../../services/subjects'; // Assuming you have these services
import { getCourses } from '../../../services/courses';

export default function AssignmentForm({ editingAssignment, onClose }) {
  const [form, setForm] = useState({ title: '', description: '', subject: '', class: '', dueDate: '' });
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const notify = useNotify();

  // Fetch subjects and courses for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      const [subjectsRes, coursesRes] = await Promise.all([getSubjects(), getCourses()]);
      setSubjects(subjectsRes.data.data || []);
      setCourses(coursesRes.data.data || []);
    };
    fetchData();

    if (editingAssignment) {
      setForm({
        title: editingAssignment.title || '',
        description: editingAssignment.description || '',
        subject: editingAssignment.subject?._id || '',
        class: editingAssignment.class?._id || '',
        dueDate: editingAssignment.dueDate ? new Date(editingAssignment.dueDate).toISOString().split('T')[0] : '',
      });
    } else {
      setForm({ title: '', description: '', subject: '', class: '', dueDate: '' });
    }
  }, [editingAssignment]);

  const createMutation = useCreateAssignment();
  const updateMutation = useUpdateAssignment();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const mutation = editingAssignment ? updateMutation : createMutation;
    const payload = editingAssignment ? { id: editingAssignment._id, data: form } : form;
    
    mutation.mutate(payload, {
      onSuccess: () => {
        notify(`Assignment ${editingAssignment ? 'updated' : 'created'} successfully`, 'success');
        onClose();
      },
      onError: (err) => {
        notify(err.response?.data?.error || 'Operation failed', 'error');
      },
    });
  };

  const isLoading = createMutation.isLoading || updateMutation.isLoading;

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>{editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item xs={12}>
            <TextField label="Title" name="title" value={form.title} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth multiline rows={3} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Subject</InputLabel>
              <Select name="subject" value={form.subject} label="Subject" onChange={handleChange}>
                {subjects.map(s => <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Class</InputLabel>
              <Select name="class" value={form.class} label="Class" onChange={handleChange}>
                {courses.map(c => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
           <Grid item xs={12}>
                <TextField label="Due Date" name="dueDate" type="date" value={form.dueDate} onChange={handleChange} InputLabelProps={{ shrink: true }} fullWidth required />
           </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: '0 24px 16px' }}>
        <Button onClick={onClose} disabled={isLoading}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : 'Save'}
        </Button>
      </DialogActions>
    </form>
  );
}