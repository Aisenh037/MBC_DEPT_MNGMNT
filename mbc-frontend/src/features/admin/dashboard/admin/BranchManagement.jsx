// src/features/admin/dashboard/admin/BranchManagement.jsx
import React, { useEffect, useState, useCallback } from "react";
import {
  Box, Typography, Button, TextField, IconButton, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, Grid
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, CloudUpload as UploadIcon } from "@mui/icons-material";
import { useNotify } from '../../../../components/UI/NotificationProvider';

// ✨ Use central API services
import { getBranches, createBranch, updateBranch, deleteBranch, importBranchStudents } from '../../../../services/branch';
import * as excelHelper from '../../../../utils/excelHelper'; // A new utility for Excel logic

export default function BranchManagement() {
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState({ name: "", code: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const notify = useNotify();

  const fetchAllBranches = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getBranches();
      setBranches(data.data || []);
    } catch (err) {
      notify('Failed to fetch branches.', 'error');
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    fetchAllBranches();
  }, [fetchAllBranches]);

  const handleOpenDialog = (branch = null) => {
    if (branch) {
      setForm({ name: branch.name, code: branch.code });
      setEditId(branch._id);
    } else {
      setForm({ name: "", code: "" });
      setEditId(null);
    }
    setDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
      setDialogOpen(false);
      setForm({ name: "", code: "" });
      setEditId(null);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await updateBranch(editId, form);
        notify('Branch updated successfully!', 'success');
      } else {
        await createBranch(form);
        notify('Branch added successfully!', 'success');
      }
      handleCloseDialog();
      fetchAllBranches();
    } catch (err) {
      notify(err.response?.data?.error || "Operation failed", "error");
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id) => {
      if (window.confirm("Are you sure? This will delete associated semesters.")) {
          try {
              await deleteBranch(id);
              notify("Branch deleted successfully!", "success");
              fetchAllBranches();
          } catch (err) {
              notify(err.response?.data?.error || "Delete failed", "error");
          }
      }
  }

  // ... (Your UI with Table and Dialogs)
  
  return (
    <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Branch Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
            Add Branch
        </Button>
        {/* Table to display branches */}
        {/* Add/Edit Dialog */}
    </Paper>
  );
}