'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar'; 
import DashboardHeader from '../components/DashboardHeader';

const historyData = [
  {
    courseName: 'HTML Basics',
    progress: '80% Completed',
    lastAccessed: '5/5/2025',
  },
  {
    courseName: 'JavaScript Beginner',
    progress: '100% Completed',
    lastAccessed: '5/8/2025',
  },
  {
    courseName: 'UI/UX Fundamentals',
    progress: '60% Completed',
    lastAccessed: '6/10/2025',
  },
];

export default function HistoryPage() {
  return (
    <Sidebar>
        <DashboardHeader />
      <div className="p-6 w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Learning History</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-md">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">Course Name</th>
                <th className="px-6 py-3 text-left">Progress</th>
                <th className="px-6 py-3 text-left">Last Accessed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {historyData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.courseName}</td>
                  <td className="px-6 py-4 text-gray-700">{item.progress}</td>
                  <td className="px-6 py-4 text-gray-700">{item.lastAccessed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Sidebar>
  );
}