// src/features/students/StudentProfileModal.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function StudentProfileModal({ studentId, onClose }) {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    axios.get(`/api/students/${studentId}`).then(res => setStudent(res.data));
  }, [studentId]);

  if (!student) return <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"><div className="bg-white p-6 rounded-xl shadow">Loading...</div></div>;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 min-w-[320px] max-w-[400px]">
        <button className="absolute top-4 right-6 text-gray-400 hover:text-red-500" onClick={onClose}>✕</button>
        <div className="flex flex-col items-center mb-4">
          <div className="rounded-full w-20 h-20 bg-blue-200 flex items-center justify-center text-4xl font-bold mb-2">
            {student.user?.name?.charAt(0)}
          </div>
          <div className="text-lg font-bold text-blue-700">{student.user?.name}</div>
          <div className="text-sm text-gray-600">{student.user?.email}</div>
          <div className="text-xs text-gray-400 mt-1">Scholar No: {student.scholarNo}</div>
          <div className="text-xs text-gray-400">Class: {student.class?.name || "-"}</div>
        </div>
        {/* Add more info as needed */}
        <div>
          <div className="font-medium text-blue-600 mb-1">Subjects:</div>
          <ul className="text-sm text-gray-700 mb-3">
            {student.subjects?.map(s => <li key={s._id}>• {s.name}</li>)}
          </ul>
        </div>
        {/* You can link to marks/assignments here if needed */}
        <button className="w-full bg-blue-600 text-white py-2 rounded mt-2" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
