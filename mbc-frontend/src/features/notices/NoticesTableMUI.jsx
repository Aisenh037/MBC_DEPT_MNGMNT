// src/features/notices/NoticesTableMUI.jsx
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

export default function NoticesTableMUI() {
  const [notices, setNotices] = useState([]);
  useEffect(() => {
    axios.get("/api/notices").then(res => setNotices(res.data));
  }, []);
  const columns = [
    { field: "title", headerName: "Title", flex: 1 },
    { field: "content", headerName: "Content", flex: 2 },
    { field: "target", headerName: "Target", flex: 1 },
    { field: "createdBy", headerName: "By", flex: 1, valueGetter: p => p.row.createdBy?.name || "-" },
    { field: "createdAt", headerName: "Date", flex: 1, valueGetter: p => p.row.createdAt ? new Date(p.row.createdAt).toLocaleDateString() : "-" }
  ];
  const rows = notices.map(n => ({ ...n, id: n._id }));
  return <div style={{ height: 500, width: "100%" }}>
    <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10, 20]} />
  </div>;
}
