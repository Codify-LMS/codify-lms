'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface Quiz {
  id: string;
  title: string;
}

interface Lesson {
  id: string;
  title: string;
  quiz?: Quiz | null;
}

interface Module {
  id: string;
  title: string;
  orderInCourse: number;
  lessons: Lesson[];
}

interface SidebarProps {
  courseTitle: string;
  modules: Module[];
}

export default function SidebarCourse({ courseTitle, modules }: SidebarProps) {
  const pathname = usePathname();
  const [openModules, setOpenModules] = useState<string[]>(modules.map(m => m.id));

  const toggleModule = (moduleId: string) => {
    setOpenModules((prev) =>
      prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
    );
  };

  return (
    <aside className="w-64 bg-indigo-800 text-white p-4 overflow-y-auto">
      <h2 className="font-bold text-xl mb-6">{courseTitle}</h2>

      {modules.map((mod) => (
        <div key={mod.id} className="mb-4">
          <button
            onClick={() => toggleModule(mod.id)}
            className="w-full text-left font-semibold text-sm text-indigo-200 hover:text-white"
          >
            📂 {mod.title}
          </button>

          {openModules.includes(mod.id) && (
            <ul className="ml-4 mt-2 space-y-1">
              {mod.lessons.map((lesson) => {
                const active = pathname.includes(lesson.id);
                return (
                  <li key={lesson.id}>
                    <Link
                      href={`/dashboard/course/lesson/${lesson.id}`}
                      className={`block text-sm ${active ? 'text-white font-bold' : 'text-indigo-300'} hover:text-white`}
                    >
                      • {lesson.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ))}
    </aside>
  );
}
