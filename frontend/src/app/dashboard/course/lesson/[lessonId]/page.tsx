'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import SidebarCourse from '../../components/SidebarCourse';
import { LessonData, ModuleData, CourseData, ModuleWithCourse } from '@/types';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


export default function LessonPage() {

  const { lessonId } = useParams() as { lessonId: string };
  console.log('lessonId: ', lessonId);
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [module, setModule] = useState<ModuleData | null>(null);
  const [course, setCourse] = useState<CourseData | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<
    {
      questionId: string;
      selectedAnswerIndex: number | null;
      writtenAnswer: string;
    }[]
  >([]);


  const handleAnswerChange = (questionId: string, value: any, isEssay: boolean = false) => {
    setAnswers(prev =>
      prev.map(a => a.questionId === questionId
        ? { ...a, ...(isEssay ? { writtenAnswer: value } : { selectedAnswerIndex: value }) }
        : a
      )
    );
  };


  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        console.log("✅ User from Supabase:", user);
        setUserId(user.id);
      } else {
        console.error("❌ No user found from Supabase");
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        // 1. Fetch lesson
        const lessonRes = await axios.get(`http://localhost:8080/api/v1/lessons/${lessonId}`);
        const lessonData: LessonData = lessonRes.data;
        console.log("✅ lessonData:", lessonData);
        setLesson(lessonData);

        // 2. Fetch module
        const moduleRes = await axios.get<ModuleWithCourse>(`http://localhost:8080/api/modules/${lessonData.moduleId}/full`);
        const moduleData: ModuleData = moduleRes.data;
        console.log("✅ moduleData:", moduleData);
        setModule(moduleData);

        // 3. Fetch full course
        const courseId = moduleRes.data.courseId;
        console.log("📦 moduleRes.data", moduleRes.data);
        if (!courseId) {
          console.error("❌ courseId is undefined!");
          return;
        }

        const courseRes = await axios.get(`http://localhost:8080/api/v1/courses/${courseId}/full`);
        const courseData: CourseData = courseRes.data;

        console.log("✅ courseData:", courseData);
        setCourse(courseData);


        console.log("✅ courseData:", courseData);
        setCourse(courseData);
      } catch (error) {
        console.error("❌ Error fetching lesson/module/course:", error);
      } finally {
        setLoading(false); 
      }
    };

    if (lessonId) {
      fetchLessonData();
    }
  }, [lessonId]);

  useEffect(() => {
    if (lesson?.quiz?.questions) {
      setAnswers(lesson.quiz.questions.map(q => ({
        questionId: q.id,
        selectedAnswerIndex: null,
        writtenAnswer: ''
      })));
    }
  }, [lesson?.quiz]);


  if (loading) return <div className="p-6 text-gray-600">Loading lesson...</div>;
  if (!lesson || !course) return <div className="p-6 text-red-600">Lesson or course not found.</div>;

  return (
    <div className="flex h-screen bg-white">
      <SidebarCourse courseTitle={course.title} modules={course.modules ??[]} />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4">{lesson.title}</h1>
        <div
          className="prose max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: lesson.content }}
        />
        {lesson.quiz && lesson.quiz.questions && (
        <form
          className="mt-8 p-6 border rounded-lg bg-gray-50"
          onSubmit={async (e) => {
            e.preventDefault();
            const payload = {
              userId,
              quizId: lesson.quiz?.id,
              lessonId: lesson.id,
              answers,
            };

            console.log("🧾 Payload before submit:", {
            userId,
            quizId: lesson.quiz?.id,
            lessonId: lesson.id,
            answers,
          });

          console.log("👤 Supabase userId:", userId);


            console.log("🔥 SUBMITTING:", payload);

            if (!userId || !lesson.quiz?.id || !lesson.id || answers.length === 0) {
              alert("Ada data yang belum lengkap untuk submit quiz!");
              return;
            }

            try {
              const res = await axios.post('http://localhost:8080/api/v1/quiz-submissions', payload);
              alert("Quiz submitted successfully!");
            } catch (err) {
              console.error("❌ Quiz submission failed", err);
              alert("Failed to submit quiz.");
            }
          }}

        >
          <h2 className="text-xl font-bold text-indigo-600 mb-4">Quiz: {lesson.quiz.title}</h2>
          <p className="text-gray-600 mb-4 text-xs ">{lesson.quiz.description}</p>

          {lesson.quiz.questions.map((q, index) => (
            <div key={q.id} className="mb-6 text-gray-700">
              <p className="font-semibold mb-2">{index + 1}. {q.questionText}</p>

              {q.questionType === 'multiple_choice' ? (
                <div className="space-y-1">
                  {q.options.map((opt, idx) => (
                    <label key={idx} className="block">
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={idx}
                        checked={answers.find(a => a.questionId === q.id)?.selectedAnswerIndex === idx}
                        onChange={() => handleAnswerChange(q.id, idx)}
                        className="mr-2 text-gray-600"
                      />
                      {String.fromCharCode(97 + idx)}. {opt}
                    </label>
                  ))}
                </div>
              ) : (
                <textarea
                  className="w-full p-2 border rounded"
                  rows={3}
                  value={answers.find(a => a.questionId === q.id)?.writtenAnswer || ''}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value, true)}
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Submit Quiz
          </button>
        </form>
      )}

      </main>
    </div>
  );
}
