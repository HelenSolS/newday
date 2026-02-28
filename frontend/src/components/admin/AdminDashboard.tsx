import { useState, useEffect } from 'react';
import { Course } from '@/types';
import { Plus, Sparkles, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminHeader } from './AdminHeader';
import { CourseCard } from './CourseCard';
import { CourseEditor } from './CourseEditor';
import { getCourses, createNewCourse, saveCourse, deleteCourse } from '@/lib/storage';

export const AdminDashboard = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    setCourses(getCourses());
  }, []);

  const handleCreateCourse = () => {
    const newCourse = createNewCourse();
    saveCourse(newCourse);
    setCourses(prev => [...prev, newCourse]);
    setSelectedCourse(newCourse);
  };

  const handleDeleteCourse = (id: string) => {
    deleteCourse(id);
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  const handleCourseUpdate = (updated: Course) => {
    setCourses(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  if (selectedCourse) {
    return (
      <CourseEditor
        course={selectedCourse}
        onBack={() => setSelectedCourse(null)}
        onUpdate={handleCourseUpdate}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      
      <main className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="admin-label">Конструктор</span>
          </div>
          <h1 className="admin-section-title mb-2">Ваши марафоны</h1>
          <p className="text-lg text-muted-foreground">
            Создавайте и управляйте образовательными программами
          </p>
        </div>

        {/* Actions Bar */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-xl bg-secondary p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-background text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-background text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          
          <Button onClick={handleCreateCourse} className="admin-gradient-bg border-0 gap-2">
            <Plus className="h-4 w-4" />
            Новый марафон
          </Button>
        </div>

        {/* Courses Grid/List */}
        {courses.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3' 
            : 'space-y-4'
          }>
            {courses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                onSelect={setSelectedCourse}
                onDelete={handleDeleteCourse}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border py-20">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl admin-gradient-bg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Создайте первый марафон</h3>
            <p className="mb-6 text-muted-foreground">
              Начните собирать вашу образовательную программу
            </p>
            <Button onClick={handleCreateCourse} className="admin-gradient-bg border-0 gap-2">
              <Plus className="h-4 w-4" />
              Создать марафон
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};
