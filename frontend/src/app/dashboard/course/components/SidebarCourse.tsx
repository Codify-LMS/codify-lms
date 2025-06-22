// frontend/src/app/dashboard/course/components/SidebarCourse.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge'; // ✅ PASTIKAN ini sudah diimport

interface Quiz {
  id: string;
  title: string;
}

interface Lesson {
  id: string;
  title: string;
  quiz?: Quiz | null;
  isCompleted?: boolean;
}

interface Module {
  id: string;
  title: string;
  orderInCourse: number;
  lessons: Lesson[];
}

// ✅ Interface props SidebarCourse agar bisa menerima className
interface SidebarProps {
  courseTitle: string;
  modules: Module[];
  className?: string; // ✅ Tambah baris ini
}

// ✅ Terima className sebagai prop
export default function SidebarCourse({ courseTitle, modules, className }: SidebarProps) {
  const pathname = usePathname();
  const [openModules, setOpenModules] = useState<string[]>(modules.map((m) => m.id));

  const toggleModule = (moduleId: string) => {
    setOpenModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const countMaterialsAndQuizzes = (lessons: Lesson[]) => {
    const materialCount = lessons.length;
    const quizCount = lessons.filter((l) => l.quiz).length;
    return { materialCount, quizCount };
  };

  return (
    // ✅ Gunakan twMerge untuk menggabungkan className
    <aside className={twMerge(
      "w-72 bg-gradient-to-b from-indigo-900 to-indigo-700 text-white p-4 overflow-y-auto",
      className // ✅ Terapkan className yang diterima
    )}>
      <Link href="/dashboard/course">
        <button className="text-sm text-indigo-300 hover:text-white mb-4">← Back</button>
      </Link>

      <h2 className="font-bold text-lg mb-6">{courseTitle}</h2>

      {modules.map((mod) => {
        const { materialCount, quizCount } = countMaterialsAndQuizzes(mod.lessons);
        const isOpen = openModules.includes(mod.id);

        return (
          <div key={mod.id} className="mb-4">
            <button
              onClick={() => toggleModule(mod.id)}
              className="w-full text-left group" // Tambah 'group' untuk efek hover yang lebih baik
            >
              {/* ✅ PERUBAHAN DI SINI: Pindahkan count ke bawah judul */}
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-indigo-200 group-hover:text-white transition-colors duration-200">
                  {mod.title}
                </span>
                <span className="text-xs text-indigo-300 group-hover:text-indigo-100 transition-colors duration-200">
                  {materialCount} Materials{quizCount > 0 ? ` · ${quizCount} Quiz` : ''}
                </span>
              </div>
            </button>

            {isOpen && (
              <ul className="ml-3 mt-2 space-y-1">
                {mod.lessons.map((lesson) => {
                  const isActive = pathname.includes(lesson.id);
                  return (
                    <li key={lesson.id}>
                      <Link
                        href={`/dashboard/course/lesson/${lesson.id}`}
                        className={`block text-sm px-2 py-1 rounded ${
                          isActive
                            ? 'bg-indigo-600 text-white font-semibold'
                            : 'text-indigo-300 hover:text-white hover:bg-indigo-700'
                        }`}
                      >
                        <span className="mr-1">
                          {lesson.isCompleted ? '✅' : '•'}
                        </span>
                        {lesson.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </aside>
  );
}