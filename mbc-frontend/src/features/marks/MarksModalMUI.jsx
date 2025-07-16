import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, Button, TextField, MenuItem, Typography, CircularProgress, Box
} from "@mui/material";
import axios from "axios";

const EXAM_TYPES = ["Midterm", "Endterm", "Assignment", "Quiz", "Other"];

export default function MarksModal({ studentId, onClose }) {
  const [marks, setMarks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({ subject: "", examType: "", marksObtained: "", maxMarks: "", remarks: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/marks?studentId=${studentId}`).then(res => setMarks(res.data));
    axios.get("/api/subjects").then(res => setSubjects(res.data));
    setLoading(false);
  }, [studentId]);

  function handleSubmit(e) {
    e.preventDefault();
    axios.post("/api/marks", { ...form, student: studentId }).then(() => {
      setForm({ subject: "", examType: "", marksObtained: "", maxMarks: "", remarks: "" });
      axios.get(`/api/marks?studentId=${studentId}`).then(res => setMarks(res.data));
    });
  }

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Marks</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <table style={{ width: "100%", marginBottom: 16 }}>
              <thead>
                <tr style={{ color: "#2563eb" }}>
                  <th>Subject</th>
                  <th>Exam</th>
                  <th>Obtained</th>
                  <th>Max</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {marks.map(mark => (
                  <tr key={mark._id}>
                    <td>{mark.subject?.name}</td>
                    <td>{mark.examType}</td>
                    <td>{mark.marksObtained}</td>
                    <td>{mark.maxMarks}</td>
                    <td>{mark.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <form onSubmit={handleSubmit}>
              <TextField
                select label="Subject" fullWidth margin="dense" required
                value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              >
                {subjects.map(s => <MenuItem value={s._id} key={s._id}>{s.name}</MenuItem>)}
              </TextField>
              <TextField
                select label="Exam Type" fullWidth margin="dense" required
                value={form.examType}
                onChange={e => setForm(f => ({ ...f, examType: e.target.value }))}
              >
                {EXAM_TYPES.map(type => <MenuItem value={type} key={type}>{type}</MenuItem>)}
              </TextField>
              <Box display="flex" gap={2}>
                <TextField
                  label="Obtained" type="number" required fullWidth margin="dense"
                  value={form.marksObtained}
                  onChange={e => setForm(f => ({ ...f, marksObtained: e.target.value }))}
                />
                <TextField
                  label="Max" type="number" required fullWidth margin="dense"
                  value={form.maxMarks}
                  onChange={e => setForm(f => ({ ...f, maxMarks: e.target.value }))}
                />
              </Box>
              <TextField
                label="Remarks" fullWidth margin="dense"
                value={form.remarks}
                onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))}
              />
              <Button type="submit" variant="contained" sx={{ mt: 2 }}>Add Mark</Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
