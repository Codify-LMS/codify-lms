'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';

interface HistoryItem {
  courseName: string;
  progress: string;
  lastAccessed: string;
}

export default function HistoryPage() {
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>('');

  const API_BASE_URL = 'http://localhost:8080/api';

  // Get user ID from localStorage or context/auth
  useEffect(() => {
    // Assuming you store userId in localStorage after login
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      // Handle case where user is not logged in
      toast.error('User not found. Please login again.');
      // Redirect to login page if needed
      // router.push('/login');
    }
  }, []);

  const fetchHistoryData = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/history/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add Supabase auth token if needed
          // 'Authorization': `Bearer ${supabaseToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (Array.isArray(data)) {
        setHistoryData(data);
      } else {
        toast.error('Failed to fetch learning history.');
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
    if (userId) {
      fetchHistoryData();
    }
  }, [userId]);

  const formatProgress = (progress: string) => {
    // Backend already returns formatted progress like "80% Completed"
    return progress;
  };

  const formatDate = (dateString: string) => {
    // Backend already returns formatted date like "5/5/2025"
    return dateString;
  };

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