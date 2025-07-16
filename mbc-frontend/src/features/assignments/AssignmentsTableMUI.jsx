// src/features/assignments/AssignmentsTableMUI.jsx
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

export default function AssignmentsTableMUI() {
  const [assignments, setAssignments] = useState([]);
  useEffect(() => {
    axios.get("/api/assignments").then(res => setAssignments(res.data));
  }, []);
  const columns = [
    { field: "title", headerName: "Title", flex: 1 },
    { field: "subject", headerName: "Subject", flex: 1, valueGetter: p => p.row.subject?.name || "-" },
    { field: "class", headerName: "Class", flex: 1, valueGetter: p => p.row.class?.name || "-" },
    { field: "dueDate", headerName: "Due Date", flex: 1, valueGetter: p => p.row.dueDate ? new Date(p.row.dueDate).toLocaleDateString() : "-" },
    { field: "teacher", headerName: "Teacher", flex: 1, valueGetter: p => p.row.teacher?.user?.name || "-" },
    {
      field: "file",
      headerName: "File",
      flex: 1,
      renderCell: params => params.row.file ? (
        <a href={`/uploads/assignments/${params.row.file}`} target="_blank" rel="noopener noreferrer">Download</a>
      ) : "-"
    }
  ];
  const rows = assignments.map(a => ({ ...a, id: a._id }));
  return <div style={{ height: 500, width: "100%" }}>
    <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10, 20]} />
  </div>;
}
