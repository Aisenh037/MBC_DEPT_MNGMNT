// src/features/admin/dashboard/admin/NoticeManagement.jsx
import React, { useEffect, useState, useCallback } from "react";
import {
  Box, Typography, Button, TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, Table, TableHead, TableRow, TableCell, TableBody,
  TableContainer, Paper, Select, MenuItem, InputLabel, FormControl, IconButton
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useNotify } from '../../../../components/UI/NotificationProvider';

// ✨ Use central API services
import { getNotices, createNotice, updateNotice, deleteNotice } from '../../../../services/notice';
import { getCourses } from '../../../../services/courses';

export default function NoticeManagement() {
  const [notices, setNotices] = useState([]);
  const [courses, setCourses] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [form, setForm] = useState({ title: "", content: "", target: "all", class: "" });
  const notify = useNotify();

  const fetchData = useCallback(async () => {
    try {
      const [noticeRes, courseRes] = await Promise.all([getNotices(), getCourses()]);
      setNotices(noticeRes.data.data || []);
      setCourses(courseRes.data.data || []);
    } catch (err) {
      notify("Failed to fetch data.", "error");
    }
  }, [notify]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenDialog = (notice = null) => {
    if (notice) {
      setEditingNotice(notice);
      setForm({
        title: notice.title || "",
        content: notice.content || "",
        target: notice.target || "all",
        class: notice.class?._id || "",
      });
    } else {
      setEditingNotice(null);
      setForm({ title: "", content: "", target: "all", class: "" });
    }
    setDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
      setDialogOpen(false);
  }

  const handleSubmit = async () => {
    if (!form.title) {
      notify("Title is required.", "error");
      return;
    }
    const payload = { ...form };
    if (form.target !== "class") {
        payload.class = undefined;
    }

    try {
      if (editingNotice) {
        await updateNotice(editingNotice._id, payload);
        notify('Notice updated successfully', 'success');
      } else {
        await createNotice(payload);
        notify('Notice created successfully', 'success');
      }
      handleCloseDialog();
      fetchData();
    } catch (err) {
      notify(err.response?.data?.error || "Operation failed", "error");
    }
  };

  const handleDelete = async (id) => {
      if (window.confirm("Are you sure you want to delete this notice?")) {
          try {
              await deleteNotice(id);
              notify('Notice deleted successfully', 'success');
              fetchData();
          } catch(err) {
              notify(err.response?.data?.error || "Failed to delete notice", "error");
          }
      }
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Notice Management</Typography>
      <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
        Add Notice
      </Button>

      {/* Add/Edit Dialog would be here */}
      
      <TableContainer sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Target</TableCell>
              <TableCell>Class/Course</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notices.map((notice) => (
              <TableRow key={notice._id}>
                <TableCell>{notice.title}</TableCell>
                <TableCell>{notice.target}</TableCell>
                <TableCell>{notice.class?.name || 'N/A'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(notice)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(notice._id)}><DeleteIcon color="error" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}