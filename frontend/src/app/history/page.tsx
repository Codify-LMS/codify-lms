'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '../dashboard/components/DashboardHeader';
import { useUser } from '@/hooks/useUser';

interface HistoryItem {
  lessonId: string;
  courseName: string;
  progress: string;
  lastAccessed: string;
}

export default function HistoryPage() {
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isLoading: isUserLoading } = useUser();
  const router = useRouter();

  const API_BASE_URL = 'http://localhost:8080/api';

  const fetchHistoryData = async (userId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/history/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ History Data:', data); // Debugging log

      if (Array.isArray(data)) {
        setHistoryData(data);
      } else {
        toast.error('Invalid data format from server.');
        setHistoryData([]);
      }
    } catch (error: any) {
      console.error('Error fetching history:', error);
      toast.error('Failed to fetch learning history.');
      setHistoryData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isUserLoading && user?.id) {
      fetchHistoryData(user.id);
    } else if (!isUserLoading && !user) {
      toast.error('User not found. Please login.');
      setLoading(false);
    }
  }, [user, isUserLoading]);

  const handleRowClick = (lessonId: string) => {
    if (!lessonId) {
      toast.error('Lesson ID tidak ditemukan.');
      return;
    }

    console.log('➡ Navigating to lesson:', lessonId);
    router.push(`/course/lesson/${lessonId}`);
  };

  return (
    <Sidebar>
      <DashboardHeader />
      <div className="p-6 w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Learning History</h1>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500">
              Loading learning history...
            </div>
          ) : historyData.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No learning history found. Start a course to see your progress here!
            </div>
          ) : (
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
                  <tr
                    key={index}
                    onClick={() => handleRowClick(item.lessonId)}
                    className="hover:bg-gray-100 cursor-pointer transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {item.courseName}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{item.progress}</td>
                    <td className="px-6 py-4 text-gray-700">{item.lastAccessed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Sidebar>
  );
}
