'use client';

import Link from 'next/link';
import { FaEdit } from 'react-icons/fa';
import DashboardCard from '../components/DashboardCard';
import SidebarAdmin from '../admin/components/SidebarAdmin';
import Button from '@/components/Button';
import DashboardHeader from '../components/DashboardHeader';

const EditMaterialPage = () => {
  return (
    <div className="">
    <SidebarAdmin>
    <DashboardHeader />
      <h1 className="text-3xl font-bold text-gray-800 m-8">Edit Material</h1>
      <DashboardCard>
        <div className="p-4 m-6">
          <p className="mb-6 text-gray-600">
            Please select which type of material you would like to edit.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/dashboard/edit-material/course">
              <Button className="w-full flex items-center justify-center gap-2">
                <FaEdit />
                Edit Course
              </Button>
            </Link>
            <Link href="/dashboard/edit-material/module">
              <Button className="w-full flex items-center justify-center gap-2">
                <FaEdit />
                Edit Module
              </Button>
            </Link>
            <Link href="/dashboard/edit-material/lesson">
              <Button className="w-full flex items-center justify-center gap-2">
                <FaEdit />
                Edit Lesson
              </Button>
            </Link>
          </div>
        </div>
      </DashboardCard>
      </SidebarAdmin>
    </div>
  );
};

export default EditMaterialPage;