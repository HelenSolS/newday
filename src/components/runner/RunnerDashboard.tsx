import { useState, useEffect } from 'react';
import { Course } from '@/types';
import { getCourses } from '@/lib/storage';
import { CoursePlayer } from './CoursePlayer';
import { Sparkles, Calendar, ChevronRight, BookOpen } from 'lucide-react';

export const RunnerDashboard = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    // Load published courses
    const allCourses = getCourses();
    setCourses(allCourses.filter(c => c.status === 'published' || c.days.length > 0));
  }, []);

  if (selectedCourse) {
    return (
      <CoursePlayer 
        course={selectedCourse}
        onBack={() => setSelectedCourse(null)}
      />
    );
  }

  return (
    <div className="runner-container min-h-screen">
      {/* Header */}
      <header className="runner-header px-4 py-6 text-white">
        <div className="mx-auto max-w-lg">
          <div className="mb-1 flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium text-white/80">NewDay</span>
          </div>
          <h1 className="text-2xl font-bold">Ваши марафоны</h1>
          <p className="mt-1 text-white/70">Выберите курс для прохождения</p>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-lg p-4">
        {courses.length > 0 ? (
          <div className="space-y-3">
            {courses.map((course) => (
              <button
                key={course.id}
                onClick={() => setSelectedCourse(course)}
                className="group w-full rounded-2xl bg-white p-4 text-left shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl admin-gradient-bg">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </div>
                
                <h3 className="mb-1 font-semibold text-slate-900">{course.title}</h3>
                
                {course.description && (
                  <p className="mb-3 line-clamp-2 text-sm text-slate-500">
                    {course.description}
                  </p>
                )}
                
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{course.days.length} дней</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-8 text-center shadow-sm">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <BookOpen className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="mb-2 font-semibold text-slate-900">Нет доступных курсов</h3>
            <p className="text-sm text-slate-500">
              Создайте курс в панели администратора
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
