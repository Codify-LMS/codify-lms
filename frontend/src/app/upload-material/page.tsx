'use client';

import Link from 'next/link';
import { FaBook, FaPlusSquare, FaFileAlt } from 'react-icons/fa'; // Import icons baru
import SidebarAdmin from '../dashboard/admin/components/SidebarAdmin';
import DashboardHeader from '../dashboard/components/DashboardHeader';
import Button from '@/components/Button';

const UploadMaterialPage = () => {
  return (
    <div className="flex w-full h-screen bg-gray-50">
      <SidebarAdmin>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <DashboardHeader />
          <main className="flex-1 px-8 py-6">
            <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-md">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Pilih Tipe Upload Materi</h1>
              <p className="text-gray-600 mb-8">
                Silakan pilih jenis materi yang ingin Anda unggah.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Opsi 1: Upload Course Lengkap */}
                <Link href="/upload-material/full-course">
                  <div className="group cursor-pointer border rounded-lg p-6 bg-blue-50 hover:bg-blue-100 hover:border-blue-400 shadow-sm transition-all duration-200 text-center">
                    <FaBook className="text-4xl text-blue-600 mx-auto mb-3 group-hover:text-blue-800" />
                    <h2 className="text-lg font-semibold text-blue-700 group-hover:text-blue-900">
                      Upload Course Lengkap
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Unggah Course, Modul, dan Lesson dalam satu alur.
                    </p>
                  </div>
                </Link>

                {/* Opsi 2: Upload Module Saja */}
                <Link href="/upload-material/standalone-module">
                  <div className="group cursor-pointer border rounded-lg p-6 bg-green-50 hover:bg-green-100 hover:border-green-400 shadow-sm transition-all duration-200 text-center">
                    <FaPlusSquare className="text-4xl text-green-600 mx-auto mb-3 group-hover:text-green-800" />
                    <h2 className="text-lg font-semibold text-green-700 group-hover:text-green-900">
                      Upload Module Saja
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Tambahkan modul ke Course yang sudah ada.
                    </p>
                  </div>
                </Link>

                {/* Opsi 3: Upload Lesson Saja */}
                <Link href="/upload-material/standalone-lesson">
                  <div className="group cursor-pointer border rounded-lg p-6 bg-purple-50 hover:bg-purple-100 hover:border-purple-400 shadow-sm transition-all duration-200 text-center">
                    <FaFileAlt className="text-4xl text-purple-600 mx-auto mb-3 group-hover:text-purple-800" />
                    <h2 className="text-lg font-semibold text-purple-700 group-hover:text-purple-900">
                      Upload Lesson Saja
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Tambahkan lesson ke Modul yang sudah ada.
                    </p>
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

export default UploadMaterialPage;