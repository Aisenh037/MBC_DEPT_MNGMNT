// src/features/students/StudentTable.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function StudentTable() {
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    axios.get(`/api/students?page=${page}&limit=10&search=${query}`).then(res => setStudents(res.data));
  }, [page, query]);

  return (
    <div className="bg-white p-6 rounded-xl shadow mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-blue-700">All Students</h2>
        <input
          className="border px-3 py-1 rounded"
          placeholder="Search by name or scholar no"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b text-blue-600">
            <th className="py-2">Name</th>
            <th>Email</th>
            <th>Scholar No</th>
            <th>Class</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s._id} className="border-b hover:bg-blue-50">
              <td className="py-2">{s.user.name}</td>
              <td>{s.user.email}</td>
              <td>{s.scholarNo}</td>
              <td>{s.class?.name || "-"}</td>
              <td>
                <button className="text-blue-600 hover:underline">Edit</button>
                <button className="ml-2 text-red-500 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end gap-2 mt-4">
        <button className="px-3 py-1 border rounded" onClick={() => setPage(p => Math.max(p - 1, 1))}>Prev</button>
        <button className="px-3 py-1 border rounded" onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </div>
  );
}
