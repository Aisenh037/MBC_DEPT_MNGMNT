import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, Tabs, Tab, Box, Typography, CircularProgress
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import NotificationsIcon from "@mui/icons-material/Notifications";
import axios from "axios";

export default function StudentProfileModal({ studentId, onClose }) {
  const [student, setStudent] = useState(null);
  const [tab, setTab] = useState(0);
  const [assignments, setAssignments] = useState([]);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    axios.get(`/api/students/${studentId}`).then(res => setStudent(res.data));
    axios.get(`/api/assignments?classId=${student?.class?._id || ""}`).then(res => setAssignments(res.data));
    axios.get(`/api/notices?classId=${student?.class?._id || ""}`).then(res => setNotices(res.data));
  }, [studentId, student?.class?._id]);

  if (!student) return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
        <CircularProgress />
      </DialogContent>
    </Dialog>
  );

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {student.user?.name} <Typography variant="body2" color="text.secondary">{student.user?.email}</Typography>
      </DialogTitle>
      <DialogContent>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth" sx={{ mb: 2 }}>
          <Tab icon={<AssignmentIcon />} label="Assignments" />
          <Tab icon={<NotificationsIcon />} label="Notices" />
          <Tab label="Profile" />
        </Tabs>
        {tab === 0 && (
          <Box>
            {assignments.length === 0 ? (
              <Typography>No assignments found.</Typography>
            ) : (
              assignments.map(a => (
                <Box key={a._id} sx={{ mb: 1, p: 1, border: "1px solid #e0e0e0", borderRadius: 2 }}>
                  <Typography fontWeight="bold">{a.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{a.description}</Typography>
                  <Typography variant="caption" color="text.secondary">Due: {a.dueDate && new Date(a.dueDate).toLocaleDateString()}</Typography>
                  {a.file && (
                    <Typography>
                      <a href={`/uploads/assignments/${a.file}`} target="_blank" rel="noopener noreferrer">
                        Download Assignment
                      </a>
                    </Typography>
                  )}
                </Box>
              ))
            )}
          </Box>
        )}
        {tab === 1 && (
          <Box>
            {notices.length === 0 ? (
              <Typography>No notices.</Typography>
            ) : (
              notices.map(n => (
                <Box key={n._id} sx={{ mb: 1, p: 1, border: "1px solid #e0e0e0", borderRadius: 2 }}>
                  <Typography fontWeight="bold">{n.title}</Typography>
                  <Typography variant="body2">{n.content}</Typography>
                  <Typography variant="caption" color="text.secondary">Date: {n.createdAt && new Date(n.createdAt).toLocaleDateString()}</Typography>
                </Box>
              ))
            )}
          </Box>
        )}
        {tab === 2 && (
          <Box>
            <Typography variant="body1">Scholar No: {student.scholarNo}</Typography>
            <Typography variant="body1">Class: {student.class?.name || "-"}</Typography>
            <Typography variant="body1">Subjects: {student.subjects?.map(s => s.name).join(", ")}</Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
