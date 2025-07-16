import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Stack, IconButton, Button
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import axios from "axios";
// import TeacherModalMUI from "./TeacherModalMUI"; // for Add/Edit modal

export default function TeacherTableMUI() {
  const [teachers, setTeachers] = useState([]);
  // const [modalOpen, setModalOpen] = useState(false);
  // const [editing, setEditing] = useState(null);

  useEffect(() => {
    axios.get("/api/teachers").then(res => setTeachers(res.data));
  }, []);

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "employeeId", headerName: "Employee ID", flex: 1 },
    { field: "department", headerName: "Department", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      renderCell: params => (
        <Stack direction="row" spacing={1}>
          <IconButton color="primary" /* onClick={() => { setEditing(params.row); setModalOpen(true); }} */>
            <EditIcon />
          </IconButton>
          <IconButton color="error" /* onClick={() => handleDelete(params.row._id)} */>
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
      flex: 1
    }
  ];

  const rows = teachers.map(t => ({
    id: t._id,
    name: t.user?.name,
    email: t.user?.email,
    employeeId: t.employeeId,
    department: t.department,
    // ...other fields
  }));

  return (
    <div>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <h2 className="text-xl font-bold text-green-700">All Teachers</h2>
        <Button
          variant="contained"
          color="success"
          startIcon={<PersonAddIcon />}
          // onClick={() => { setEditing(null); setModalOpen(true); }}
        >
          Add Teacher
        </Button>
      </Stack>
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 20]}
          disableSelectionOnClick
          sx={{ borderRadius: 2, boxShadow: 3, bgcolor: "background.paper" }}
        />
      </div>
      {/* {modalOpen && (
        <TeacherModalMUI
          teacher={editing}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSaved={refreshTeachers}
        />
      )} */}
    </div>
  );
}
