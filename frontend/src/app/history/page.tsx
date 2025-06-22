'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link'; // Keep Link for navigation, if any, or remove if not used
import toast from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '../dashboard/components/DashboardHeader';
import { useUser } from '@/hooks/useUser'; // Import useUser hook

interface HistoryItem {
  courseName: string;
  progress: string;
  lastAccessed: string;
}

export default function HistoryPage() {
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isLoading: isUserLoading } = useUser(); // Get user and loading state from context

  const API_BASE_URL = 'http://localhost:8080/api';

  const fetchHistoryData = async (userId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/history/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // If your backend requires JWT for history, pass it here
          // 'Authorization': `Bearer ${user.jwtToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (Array.isArray(data)) {
        setHistoryData(data);
      } else {
        toast.error('Failed to fetch learning history: Invalid data format.');
        setHistoryData([]);
      }
    } catch (error: any) {
      console.error('Error fetching history:', error);
      toast.error('Error fetching learning history.');
      setHistoryData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch data if user is loaded and available
    if (!isUserLoading && user?.id) {
      fetchHistoryData(user.id);
    } else if (!isUserLoading && !user) {
      // Handle case where user is not logged in or not available
      toast.error('User not found. Please login to view history.');
      // Optionally redirect to login page if user must be logged in to see this page
      // router.push('/auth/login');
      setLoading(false); // Stop loading if no user
    }
  }, [user, isUserLoading]); // Depend on user and its loading state

  // No need for formatProgress or formatDate as backend already formats it
  // const formatProgress = (progress: string) => { /* ... */ };
  // const formatDate = (dateString: string) => { /* ... */ };
  

  return (
    <Sidebar>
      <DashboardHeader />
      <div className="p-6 w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Learning History</h1>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading learning history...</div>
          ) : historyData.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No learning history found. Start a course to see your progress here!</div>
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
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{item.courseName}</td>
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