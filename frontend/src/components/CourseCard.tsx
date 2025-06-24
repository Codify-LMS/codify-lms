'use client';
import { Bookmark, BookmarkCheck } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  progressPercentage?: number;
  moduleCount?: number;
  lessonCount?: number;
  quizCount?: number;
}

interface CourseCardProps {
  course: Course;
  isBookmarked?: boolean;
  showBookmark?: boolean;
  showProgress?: boolean;
  onClick?: () => void;
  onToggleBookmark?: () => void;
}

export default function CourseCard({
  course,
  isBookmarked = false,
  showBookmark = true,
  showProgress = true,
  onClick,
  onToggleBookmark
}: CourseCardProps) {
  const progress = Math.round(course.progressPercentage || 0);

  return (
    <div className="relative rounded-lg shadow hover:shadow-lg transition overflow-hidden bg-white border group">
      {/* Bookmark icon */}
      {showBookmark && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark?.();
          }}
          className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow hover:bg-gray-100 transition"
        >
          {isBookmarked ? (
            <BookmarkCheck className="text-indigo-600 w-5 h-5" />
          ) : (
            <Bookmark className="text-gray-400 w-5 h-5" />
          )}
        </button>
      )}

      <div onClick={onClick} className="cursor-pointer">
        <img
          src={course.thumbnailUrl || '/default-thumbnail.jpg'}
          alt={course.title}
          className="w-full h-40 object-cover bg-gray-200"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/default-thumbnail.jpg';
          }}
        />
        <div className="p-4 space-y-1">
          <h2 className="text-lg font-semibold text-gray-800">{course.title}</h2>
          {/* <p className="text-sm text-gray-600 truncate">{course.description}</p> */}
          <p className="text-xs text-gray-500">
            {course.moduleCount} modules • {course.lessonCount} lessons • {course.quizCount} quiz
          </p>

          {/* Progress bar */}
          {showProgress && (
            <>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{progress}% completed</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
