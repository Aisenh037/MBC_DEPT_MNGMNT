// src/features/marks/MarksModal.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const EXAM_TYPES = ["Midterm", "Endterm", "Assignment", "Quiz", "Other"];

export default function MarksModal({ studentId, onClose }) {
  const [marks, setMarks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({
    subject: "",
    examType: "",
    marksObtained: "",
    maxMarks: "",
    remarks: ""
  });

  useEffect(() => {
    // Fetch marks for this student
    axios.get(`/api/marks?studentId=${studentId}`).then(res => setMarks(res.data));
    // Fetch available subjects for this student (optional: or global subjects list)
    axios.get("/api/subjects").then(res => setSubjects(res.data));
  }, [studentId]);

  function handleSubmit(e) {
    e.preventDefault();
    axios.post("/api/marks", { ...form, student: studentId }).then(() => {
      setForm({ subject: "", examType: "", marksObtained: "", maxMarks: "", remarks: "" });
      axios.get(`/api/marks?studentId=${studentId}`).then(res => setMarks(res.data));
    });
  }

  function handleEdit(mark) {
    setForm({
      subject: mark.subject._id,
      examType: mark.examType,
      marksObtained: mark.marksObtained,
      maxMarks: mark.maxMarks,
      remarks: mark.remarks || ""
    });
  }

  function handleUpdate(e, id) {
    e.preventDefault();
    axios.put(`/api/marks/${id}`, form).then(() => {
      setForm({ subject: "", examType: "", marksObtained: "", maxMarks: "", remarks: "" });
      axios.get(`/api/marks?studentId=${studentId}`).then(res => setMarks(res.data));
    });
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 min-w-[350px] max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-3">Student Marks</h3>
        <button className="absolute top-4 right-6 text-gray-400 hover:text-red-500" onClick={onClose}>✕</button>
        {/* List of marks */}
        <table className="w-full mb-4 text-sm">
          <thead>
            <tr className="border-b text-blue-600">
              <th>Subject</th>
              <th>Exam</th>
              <th>Obtained</th>
              <th>Max</th>
              <th>Remarks</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {marks.map(mark => (
              <tr key={mark._id} className="border-b hover:bg-blue-50">
                <td>{mark.subject?.name}</td>
                <td>{mark.examType}</td>
                <td>{mark.marksObtained}</td>
                <td>{mark.maxMarks}</td>
                <td>{mark.remarks}</td>
                <td>
                  <button className="text-blue-600 hover:underline" onClick={() => handleEdit(mark)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Add/Edit form */}
        <form className="flex flex-col gap-2" onSubmit={form._id ? e => handleUpdate(e, form._id) : handleSubmit}>
          <select
            className="border p-2 rounded"
            value={form.subject}
            onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
            required
          >
            <option value="">Select Subject</option>
            {subjects.map(s => <option value={s._id} key={s._id}>{s.name}</option>)}
          </select>
          <select
            className="border p-2 rounded"
            value={form.examType}
            onChange={e => setForm(f => ({ ...f, examType: e.target.value }))}
            required
          >
            <option value="">Exam Type</option>
            {EXAM_TYPES.map(type => <option key={type}>{type}</option>)}
          </select>
          <div className="flex gap-2">
            <input className="border p-2 rounded w-1/2" type="number" placeholder="Obtained" value={form.marksObtained}
              onChange={e => setForm(f => ({ ...f, marksObtained: e.target.value }))} required />
            <input className="border p-2 rounded w-1/2" type="number" placeholder="Max" value={form.maxMarks}
              onChange={e => setForm(f => ({ ...f, maxMarks: e.target.value }))} required />
          </div>
          <input className="border p-2 rounded" placeholder="Remarks" value={form.remarks}
            onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))} />
          <div className="flex justify-end gap-2">
            <button type="submit" className="bg-blue-700 text-white px-5 py-1 rounded">{form._id ? "Update" : "Add"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
