import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Button, Stack } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SchoolIcon from "@mui/icons-material/School";
import EditIcon from "@mui/icons-material/Edit";
import StudentProfileModal from "./StudentProfileModalMUI";
import MarksModal from "../marks/MarksModalMUI";
import axios from "axios";

export default function StudentTableMUI() {
  const [students, setStudents] = useState([]);
  const [showProfile, setShowProfile] = useState(null);
  const [showMarks, setShowMarks] = useState(null);

  useEffect(() => {
    axios.get("/api/students").then(res => setStudents(res.data));
  }, []);

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "scholarNo", headerName: "Scholar No", flex: 1 },
    { field: "class", headerName: "Class", flex: 1, valueGetter: p => p.row.class?.name || "-" },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      renderCell: params => (
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => setShowProfile(params.row._id)}><VisibilityIcon /></IconButton>
          <IconButton color="primary" onClick={() => setShowMarks(params.row._id)}><SchoolIcon /></IconButton>
          <IconButton color="secondary"><EditIcon /></IconButton>
        </Stack>
      ),
      flex: 1,
    }
  ];

  // DataGrid expects flat data, so flatten user fields:
  const rows = students.map(s => ({
    id: s._id,
    _id: s._id,
    name: s.user?.name,
    email: s.user?.email,
    scholarNo: s.scholarNo,
    class: s.class,
    // ...add other fields if needed
  }));

  return (
    <>
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 20]}
          disableSelectionOnClick
          sx={{ borderRadius: 2, boxShadow: 3, mt: 2, bgcolor: "background.paper" }}
        />
      </div>
      {/* Modals */}
      {showProfile && (
        <StudentProfileModal studentId={showProfile} onClose={() => setShowProfile(null)} />
      )}
      {showMarks && (
        <MarksModal studentId={showMarks} onClose={() => setShowMarks(null)} />
      )}
    </>
  );
}
