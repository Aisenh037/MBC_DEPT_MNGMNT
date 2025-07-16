// src/features/marks/MarksTableMUI.jsx
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

export default function MarksTableMUI() {
  const [marks, setMarks] = useState([]);
  useEffect(() => {
    axios.get("/api/marks").then(res => setMarks(res.data));
  }, []);
  const columns = [
    { field: "student", headerName: "Student", flex: 1, valueGetter: p => p.row.student?.user?.name || "-" },
    { field: "subject", headerName: "Subject", flex: 1, valueGetter: p => p.row.subject?.name || "-" },
    { field: "examType", headerName: "Exam Type", flex: 1 },
    { field: "marksObtained", headerName: "Obtained", flex: 1 },
    { field: "maxMarks", headerName: "Max", flex: 1 },
    { field: "remarks", headerName: "Remarks", flex: 1 }
  ];
  const rows = marks.map(m => ({ ...m, id: m._id }));
  return <div style={{ height: 500, width: "100%" }}>
    <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10, 20]} />
  </div>;
}
