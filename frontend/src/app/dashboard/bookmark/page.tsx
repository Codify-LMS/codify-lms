'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar'; // pastikan path sesuai dengan struktur proyekmu
import DashboardHeader from '../components/DashboardHeader';

const bookmarkedCourses = [
  {
    courseName: 'UI/UX Design Basics',
    difficulty: 'Beginner',
    duration: '4h 30m',
    category: 'Design',
  },
  {
    courseName: 'Intro to Python',
    difficulty: 'Intermediate',
    duration: '6h 15m',
    category: 'Programming',
  },
];

export default function BookmarksPage() {
  return (
    <Sidebar>
        <DashboardHeader />
      <div className="p-6 w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Bookmarked Courses</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-md">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">Course Name</th>
                <th className="px-6 py-3 text-left">Difficulty | Duration | Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookmarkedCourses.map((course, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{course.courseName}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {course.difficulty} | {course.duration} | {course.category}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Sidebar>
  );
}