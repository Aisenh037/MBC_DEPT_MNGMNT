// src/features/dashboard/AnalyticsCharts.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, ResponsiveContainer } from "recharts";

export default function AnalyticsCharts() {
  const [stats, setStats] = useState({});
  useEffect(() => {
    axios.get("/api/analytics").then(res => setStats(res.data));
  }, []);

  // Example gradingTrends data from your API
  const gradingTrends = [
    { assignment: "A1", avgMark: 78 },
    { assignment: "A2", avgMark: 84 },
    { assignment: "A3", avgMark: 90 },
    // ...from stats.gradingTrends
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow mb-6">
      <h2 className="text-lg font-bold text-blue-700 mb-4">Analytics Overview</h2>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <h3 className="font-semibold mb-2">Average Marks Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={gradingTrends}>
              <XAxis dataKey="assignment" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="avgMark" stroke="#2563eb" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-2">Student/Teacher Ratio</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[
              { label: "Students", value: stats.totalStudents },
              { label: "Teachers", value: stats.totalTeachers }
            ]}>
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Add more cards/charts as needed! */}
    </div>
  );
}
