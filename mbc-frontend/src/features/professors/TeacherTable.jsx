// src/features/teachers/TeacherTable.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TeacherTable() {
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchTeachers = () =>
    axios.get("/api/teachers").then(res => setTeachers(res.data));
  useEffect(() => { fetchTeachers(); }, []);

  function handleEdit(t) {
    setEditing(t);
    setShowModal(true);
  }
  function handleAdd() {
    setEditing(null);
    setShowModal(true);
  }
  function handleDelete(id) {
    axios.delete(`/api/teachers/${id}`).then(fetchTeachers);
  }
  function handleSave(data) {
    if (editing) {
      axios.put(`/api/teachers/${editing._id}`, data).then(() => {
        setShowModal(false); fetchTeachers();
      });
    } else {
      axios.post("/api/teachers", data).then(() => {
        setShowModal(false); fetchTeachers();
      });
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-green-700">All Teachers</h2>
        <button className="bg-green-600 text-white px-4 py-1 rounded" onClick={handleAdd}>
          Add Teacher
        </button>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b text-green-600">
            <th className="py-2">Name</th>
            <th>Email</th>
            <th>Emp. ID</th>
            <th>Department</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {teachers.map(t => (
            <tr key={t._id} className="border-b hover:bg-green-50">
              <td className="py-2">{t.user.name}</td>
              <td>{t.user.email}</td>
              <td>{t.employeeId}</td>
              <td>{t.department}</td>
              <td>
                <button className="text-green-600 hover:underline" onClick={() => handleEdit(t)}>Edit</button>
                <button className="ml-2 text-red-500 hover:underline" onClick={() => handleDelete(t._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <TeacherModal
          teacher={editing}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

// Modal Component (simple version)
function TeacherModal({ teacher, onClose, onSave }) {
  const [form, setForm] = useState({
    name: teacher?.user.name || "",
    email: teacher?.user.email || "",
    employeeId: teacher?.employeeId || "",
    department: teacher?.department || "",
    password: ""
  });
  function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
  }
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <form className="bg-white rounded-xl shadow-lg p-6 min-w-[320px]" onSubmit={handleSubmit}>
        <h3 className="text-lg font-bold mb-4">{teacher ? "Edit Teacher" : "Add Teacher"}</h3>
        <input className="border p-2 rounded mb-2 w-full" placeholder="Name" value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        <input className="border p-2 rounded mb-2 w-full" placeholder="Email" value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="email" required />
        <input className="border p-2 rounded mb-2 w-full" placeholder="Employee ID" value={form.employeeId}
          onChange={e => setForm(f => ({ ...f, employeeId: e.target.value }))} required />
        <input className="border p-2 rounded mb-2 w-full" placeholder="Department" value={form.department}
          onChange={e => setForm(f => ({ ...f, department: e.target.value }))} required />
        {!teacher && (
          <input className="border p-2 rounded mb-2 w-full" placeholder="Password" value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))} type="password" required />
        )}
        <div className="flex gap-2 mt-3 justify-end">
          <button className="px-3 py-1 border rounded" type="button" onClick={onClose}>Cancel</button>
          <button className="px-3 py-1 bg-green-600 text-white rounded" type="submit">Save</button>
        </div>
      </form>
    </div>
  );
}
