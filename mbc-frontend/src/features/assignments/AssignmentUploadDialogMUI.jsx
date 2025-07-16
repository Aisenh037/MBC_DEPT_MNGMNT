import React, { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Box
} from "@mui/material";
import axios from "axios";

export default function AssignmentUploadDialogMUI({ open, onClose, onUpload, subjects, classes }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    subject: "",
    class: "",
    dueDate: "",
    assignmentFile: null
  });
  const [uploading, setUploading] = useState(false);

  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm(f => ({
      ...f,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setUploading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      await axios.post("/api/assignments/upload", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setForm({
        title: "",
        description: "",
        subject: "",
        class: "",
        dueDate: "",
        assignmentFile: null
      });
      onUpload && onUpload(); // refresh list
      onClose();
    } catch (err) {
      alert("Upload failed: " + (err?.response?.data?.error || err.message));
    }
    setUploading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Upload New Assignment</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            fullWidth
            margin="dense"
            required
          />
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            margin="dense"
            multiline
            rows={2}
          />
          <TextField
            select
            label="Subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            fullWidth
            margin="dense"
            required
          >
            <MenuItem value="">Select Subject</MenuItem>
            {subjects.map(s => <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>)}
          </TextField>
          <TextField
            select
            label="Class"
            name="class"
            value={form.class}
            onChange={handleChange}
            fullWidth
            margin="dense"
            required
          >
            <MenuItem value="">Select Class</MenuItem>
            {classes.map(c => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
          </TextField>
          <TextField
            label="Due Date"
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            margin="dense"
            required
          />
          <Box mt={2}>
            <Button variant="contained" component="label">
              {form.assignmentFile ? form.assignmentFile.name : "Select File"}
              <input
                type="file"
                name="assignmentFile"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.png"
                hidden
                onChange={handleChange}
                required={!form.assignmentFile}
              />
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
