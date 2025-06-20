'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import SidebarCourse from '../../components/SidebarCourse';
import { LessonData, ModuleData, CourseData, QuizQuestionData, QuizSubmissionResponse } from '@/types';
import { createClient } from '@supabase/supabase-js';
import { useUser } from '@/hooks/useUser';
import DashboardHeader from '@/app/dashboard/components/DashboardHeader';
import Button from '@/components/Button';
import toast from 'react-hot-toast';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function LessonPage() {
  const { lessonId } = useParams() as { lessonId: string };
  const router = useRouter();
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [module, setModule] = useState<ModuleData | null>(null);
  const [course, setCourse] = useState<CourseData | null>(null);
  const { user, isLoading: isLoadingUser } = useUser();
  const [loadingContent, setLoadingContent] = useState(true);
  const [answers, setAnswers] = useState<{ questionId: string; selectedAnswerIndex: number | null; writtenAnswer: string; }[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [isPassed, setIsPassed] = useState<boolean | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizResults, setQuizResults] = useState<QuizSubmissionResponse['answerResults'] | null>(null);

  const handleAnswerChange = (questionId: string, value: any, isEssay = false) => {
    if (quizSubmitted) return;
    setAnswers(prev =>
      prev.map(a => a.questionId === questionId
        ? { ...a, ...(isEssay ? { writtenAnswer: value } : { selectedAnswerIndex: value }) }
        : a
      )
    );
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoadingContent(true);
      if (isLoadingUser || !user) return;
      try {
        const lessonRes = await axios.get(`http://localhost:8080/api/v1/lessons/${lessonId}`);
        const lessonData: LessonData = lessonRes.data;
        setLesson(lessonData);

        const moduleRes = await axios.get(`http://localhost:8080/api/modules/${lessonData.moduleId}/full`);
        const moduleData = moduleRes.data;
        setModule(moduleData);

        const courseId = moduleData.courseId;
        if (!courseId) return;

        const courseRes = await axios.get(`http://localhost:8080/api/v1/courses/${courseId}/full`);
        const courseData: CourseData = courseRes.data;
        setCourse(courseData);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      } finally {
        setLoadingContent(false);
      }
    };
    if (lessonId && !isLoadingUser) fetchAllData();
  }, [lessonId, user, isLoadingUser]);

  useEffect(() => {
    if (lesson?.quiz?.questions) {
      setAnswers(lesson.quiz.questions.map(q => ({ questionId: q.id, selectedAnswerIndex: null, writtenAnswer: '' })));
    }
  }, [lesson?.quiz]);

  const getFlattenedLessons = () => {
    const modules = course?.modules ?? [];
    const flattened: { lesson: LessonData; moduleId: string }[] = [];
    modules.forEach(mod => mod.lessons.forEach(lesson => flattened.push({ lesson, moduleId: mod.id })));
    return flattened;
  };

  const handleSubmitQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !lesson?.quiz?.id || !lesson?.id || answers.length === 0) {
      alert("Data incomplete to submit quiz");
      return;
    }

    const payload = {
      userId: user.id,
      quizId: lesson.quiz.id,
      lessonId: lesson.id,
      answers,
    };

    try {
      const res = await axios.post<QuizSubmissionResponse>(
        'http://localhost:8080/api/v1/quiz-submissions',
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      const data = res.data;

      setScore(data.scoreObtained);
      setIsPassed(data.isPassed);
      setQuizResults(data.answerResults);
      setQuizSubmitted(true);

      toast.success("Quiz submitted successfully!");

    } catch (err) {
      console.error("❌ Quiz submission failed", err);
      alert("Failed to submit quiz.");
      console.log('📦 Payload:', JSON.stringify(payload, null, 2));
    }
  };

  const getQuestionResult = (questionId: string) => {
    return quizResults?.find(result => result.questionId === questionId);
  };

  if (isLoadingUser || loadingContent) return <div className="p-6 text-gray-600">Loading...</div>;
  if (!lesson || !course || !user) return <div className="p-6 text-red-600">Data not found</div>;

  const flattenedLessons = getFlattenedLessons();
  const currentIndex = flattenedLessons.findIndex(entry => entry.lesson.id === lesson.id);
  const previousLesson = currentIndex > 0 ? flattenedLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < flattenedLessons.length - 1 ? flattenedLessons[currentIndex + 1] : null;

  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarCourse courseTitle={course.title} modules={course.modules ?? []} />
      <div className="flex flex-col flex-1 overflow-y-auto">
        <DashboardHeader />
        <main className="flex-1 p-[40px] overflow-y-auto bg-white m-4 rounded-xl">
          <h1 className="text-3xl font-bold text-indigo-700 mb-4">{lesson.title}</h1>
          <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: lesson.content }} />

          {lesson.quiz && lesson.quiz.questions && (
            <form className="mt-8 p-6 border rounded-lg bg-gray-50" onSubmit={handleSubmitQuiz}>
              <h2 className="text-xl font-bold text-indigo-600 mb-4">Quiz: {lesson.quiz.title}</h2>
              <p className="text-gray-600 mb-4 text-xs">{lesson.quiz.description}</p>

              {lesson.quiz.questions.map((q, index) => {
                  const userAnswer = answers.find(a => a.questionId === q.id);
                  const result = getQuestionResult(q.id);
                  const isAnswerCorrect = result?.isCorrect;
                  const showFeedback = quizSubmitted;

                  // Tentukan kelas border dan teks untuk textarea
                  let inputBorderClass = 'border-gray-300'; // Default border
                  let inputTextColorClass = 'text-gray-700'; // Default text color

                  if (showFeedback) {
                    if (isAnswerCorrect) {
                      inputBorderClass = 'border-green-500';
                      inputTextColorClass = 'text-green-700';
                    } else {
                      inputBorderClass = 'border-red-500';
                      inputTextColorClass = 'text-red-700';
                    }
                  }


                return (
                <div key={q.id} className="mb-6 text-gray-700">
                  <p className="font-semibold mb-2">{index + 1}. {q.questionText}</p>
                  {q.questionType === 'multiple_choice' ? (
                    <div className="space-y-1">
                      {q.options.map((opt, idx) => {
                          const isSelected = userAnswer?.selectedAnswerIndex === idx;
                          let optionClass = 'block p-2 rounded';
                          if (showFeedback) {
                            if (result?.correctAnswerIndex === idx) {
                              // Ini jawaban yang benar (selalu hijau)
                              optionClass += ' bg-green-100 text-green-800 font-medium';
                            } else if (isSelected && !isAnswerCorrect) {
                              // Ini jawaban user yang salah
                              optionClass += ' bg-red-100 text-red-800 font-medium';
                            } else if (isSelected && isAnswerCorrect) {
                              // Ini jawaban user yang benar
                              optionClass += ' bg-green-100 text-green-800 font-medium';
                            }
                          } else if (isSelected) {
                             optionClass += ' bg-blue-100 text-blue-800'; // Highlight pilihan user sebelum submit
                          }

                        return (
                        <label key={idx} className={optionClass}>
                          <input
                            type="radio"
                            name={`question-${q.id}`}
                            value={idx}
                            checked={isSelected}
                            onChange={() => handleAnswerChange(q.id, idx)}
                            className="mr-2 text-gray-600"
                            disabled={quizSubmitted} // Nonaktifkan setelah disubmit
                          />
                          {String.fromCharCode(97 + idx)}. {opt}
                        </label>
                      )})}
                  </div>
                  ) : ( // Blok untuk essay/short_answer
                    <>
                      <textarea
                        className={`w-full p-2 border rounded ${inputBorderClass} ${inputTextColorClass}`} // Terapkan border dan warna teks
                        rows={3}
                        value={userAnswer?.writtenAnswer || ''}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value, true)}
                        disabled={quizSubmitted}
                      />
                      {/* Tampilkan label "Jawaban Benar" jika sudah disubmit DAN ada correctAnswerText */}
                      {showFeedback && (q.questionType === 'short_answer') && result?.correctAnswerText && (
                        <p className={`text-sm mt-1 ${isAnswerCorrect ? 'text-green-600' : 'text-red-600'}`}> {/* Warna label sesuai correctness */}
                          Jawaban Benar: <span className="font-semibold">{result.correctAnswerText}</span>
                        </p>
                      )}
                    </>
                  )}
                </div>
              )})}

              <Button
                type="submit"
                className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                disabled={!user?.id || quizSubmitted}
              >
                {quizSubmitted ? 'Quiz Submitted' : 'Submit Quiz'}
              </Button>

              {score !== null && (
                <div className="mt-4 p-4 border bg-white rounded shadow text-gray-800">
                  <p className="text-lg font-semibold">✅ Skor Kamu: {score}</p>
                  <p className={`text-sm mt-1 ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                    {isPassed ? 'Lulus 🎉' : 'Belum Lulus, coba lagi!'}
                  </p>
                </div>
              )}
            </form>
          )}

          <div className="flex justify-between mt-8">
            <Button
              type="button"
              disabled={!previousLesson}
              className={`px-6 py-2 rounded ${previousLesson ? 'bg-gray-300 text-gray-800 hover:bg-gray-400' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              onClick={() => previousLesson && router.push(`/dashboard/course/lesson/${previousLesson.lesson.id}`)}
            >
              ← Previous
            </Button>
            <Button
              type="button"
              disabled={!nextLesson}
              className={`px-6 py-2 rounded ${nextLesson ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-300 text-gray-200 cursor-not-allowed'}`}
              onClick={() => nextLesson && router.push(`/dashboard/course/lesson/${nextLesson.lesson.id}`)}
            >
              Next →
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}