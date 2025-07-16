// src/features/assignments/AssignmentTable.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AssignmentTable() {
  const [assignments, setAssignments] = useState([]);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    axios.get("/api/assignments").then(res => setAssignments(res.data));
  }, []);

  function handleUpload(data) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));
    axios.post("/api/assignments/upload", formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then(() => { setShowUpload(false); window.location.reload(); });
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-yellow-700">Assignments</h2>
        <button className="bg-yellow-600 text-white px-4 py-1 rounded" onClick={() => setShowUpload(true)}>
          Upload Assignment
        </button>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b text-yellow-700">
            <th className="py-2">Title</th>
            <th>Subject</th>
            <th>Due Date</th>
            <th>File</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {assignments.map(a => (
            <tr key={a._id} className="border-b hover:bg-yellow-50">
              <td className="py-2">{a.title}</td>
              <td>{a.subject?.name || ""}</td>
              <td>{a.dueDate && new Date(a.dueDate).toLocaleDateString()}</td>
              <td>
                {a.file && (
                  <a href={`/uploads/assignments/${a.file}`} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                    Download
                  </a>
                )}
              </td>
              <td>
                {/* Show submission button for students if needed */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showUpload && (
        <AssignmentUploadModal onClose={() => setShowUpload(false)} onUpload={handleUpload} />
      )}
    </div>
  );
}

// Modal for assignment upload
function AssignmentUploadModal({ onClose, onUpload }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    subject: "",
    class: "",
    dueDate: "",
    assignmentFile: null,
  });

  function handleSubmit(e) {
    e.preventDefault();
    onUpload(form);
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <form className="bg-white rounded-xl shadow-lg p-6 min-w-[320px]" onSubmit={handleSubmit}>
        <h3 className="text-lg font-bold mb-4">Upload Assignment</h3>
        <input className="border p-2 rounded mb-2 w-full" placeholder="Title" value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
        <textarea className="border p-2 rounded mb-2 w-full" placeholder="Description" value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        {/* TODO: Add dropdowns for subject/class */}
        <input className="border p-2 rounded mb-2 w-full" type="date" value={form.dueDate}
          onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} required />
        <input className="border p-2 rounded mb-2 w-full" type="file" onChange={e => setForm(f => ({ ...f, assignmentFile: e.target.files[0] }))} required />
        <div className="flex gap-2 mt-3 justify-end">
          <button className="px-3 py-1 border rounded" type="button" onClick={onClose}>Cancel</button>
          <button className="px-3 py-1 bg-yellow-600 text-white rounded" type="submit">Upload</button>
        </div>
      </form>
    </div>
  );
}
