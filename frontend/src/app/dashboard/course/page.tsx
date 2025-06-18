'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';
//import { useParams } from 'next/navigation';

interface Course {
  id: string;
  title: string;
  thumbnailUrl: string;
  isPublished: boolean;
}

export default function CourseListPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/v1/courses/all');
        setCourses(res.data);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseClick = async (courseId: string) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/v1/courses/${courseId}/full`);
      const courseData = res.data;
      const firstLessonId = courseData.modules?.[0]?.lessons?.[0]?.id;

      if (firstLessonId) {
        router.push(`/dashboard/course/lesson/${firstLessonId}`);
      } else {
        alert('No lessons found for this course.');
      }
    } catch (error) {
      console.error('Failed to fetch course preview:', error);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar>
        <DashboardHeader />
        <div className="flex flex-col flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Popular Courses</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                onClick={() => handleCourseClick(course.id)}
                className="cursor-pointer rounded-lg shadow hover:shadow-lg transition overflow-hidden bg-white border"
              >
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="w-full h-40 object-cover bg-gray-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/default-thumbnail.jpg';
                  }}
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-1">{course.title}</h2>
                  <p className="text-sm text-gray-500">Tap to view details</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Sidebar>
    </div>
  );
}
