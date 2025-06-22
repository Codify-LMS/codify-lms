'use client';

import Link from 'next/link';
import { FaEdit } from 'react-icons/fa';
import SidebarAdmin from '../admin/components/SidebarAdmin';
import DashboardHeader from '../components/DashboardHeader';
import Button from '@/components/Button';

const EditMaterialPage = () => {
  return (
    <div className="flex w-full h-screen bg-gray-50">
      <SidebarAdmin>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <DashboardHeader />
          <main className="flex-1 px-8 py-6">
            <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-md">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Edit Material</h1>
              <p className="text-gray-600 mb-8">
                Silakan pilih jenis materi yang ingin kamu edit.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link href="/dashboard/edit-material/course">
                  <div className="group cursor-pointer border rounded-lg p-6 bg-gray-50 hover:bg-indigo-50 hover:border-indigo-400 shadow-sm transition-all duration-200">
                    <div className="flex items-center gap-3 text-indigo-700 group-hover:text-indigo-900 font-semibold">
                      <FaEdit className="text-lg" />
                      <span>Edit Course</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Ubah informasi course yang tersedia.</p>
                  </div>
                </Link>

                <Link href="/dashboard/edit-material/module">
                  <div className="group cursor-pointer border rounded-lg p-6 bg-gray-50 hover:bg-indigo-50 hover:border-indigo-400 shadow-sm transition-all duration-200">
                    <div className="flex items-center gap-3 text-indigo-700 group-hover:text-indigo-900 font-semibold">
                      <FaEdit className="text-lg" />
                      <span>Edit Module</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Perbarui module dalam course tertentu.</p>
                  </div>
                </Link>

                <Link href="/dashboard/edit-material/lesson">
                  <div className="group cursor-pointer border rounded-lg p-6 bg-gray-50 hover:bg-indigo-50 hover:border-indigo-400 shadow-sm transition-all duration-200">
                    <div className="flex items-center gap-3 text-indigo-700 group-hover:text-indigo-900 font-semibold">
                      <FaEdit className="text-lg" />
                      <span>Edit Lesson</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Kelola konten dari tiap lesson.</p>
                  </div>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </SidebarAdmin>
    </div>
  );
};

export default EditMaterialPage;
