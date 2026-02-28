import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Course, Enrollment } from '@/types';
import { getCourses, getEnrollments, createEnrollment } from '@/lib/storage';
import { CoursePlayer } from '@/components/runner/CoursePlayer';
import { Lead7Marathon } from '@/components/lead7/Lead7Marathon';
import { 
  Sparkles, 
  BookOpen, 
  Calendar, 
  ChevronRight, 
  Trophy, 
  Clock, 
  CheckCircle2,
  ArrowLeft,
  User,
  Settings,
  Target,
  Play,
  BarChart3
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const StudentDashboard = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState('available');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allCourses = getCourses();
    const publishedCourses = allCourses.filter(c => c.status === 'published' || c.days.length > 0);
    setCourses(publishedCourses);
    
    const userEnrollments = getEnrollments('demo-user');
    setEnrollments(userEnrollments);
  };

  const handleStartCourse = (course: Course) => {
    // Check if already enrolled
    let enrollment = enrollments.find(e => e.course_id === course.id);
    
    if (!enrollment) {
      enrollment = createEnrollment('demo-user', course.id);
      setEnrollments(prev => [...prev, enrollment!]);
    }
    
    setSelectedCourse(course);
  };

  const handleBackFromPlayer = () => {
    setSelectedCourse(null);
    loadData(); // Refresh data after course interaction
  };

  const getEnrollmentForCourse = (courseId: string) => {
    return enrollments.find(e => e.course_id === courseId);
  };

  const activeCourses = courses.filter(course => {
    const enrollment = getEnrollmentForCourse(course.id);
    return enrollment && enrollment.status === 'active';
  });

  const completedCourses = courses.filter(course => {
    const enrollment = getEnrollmentForCourse(course.id);
    return enrollment && enrollment.status === 'completed';
  });

  const availableCourses = courses.filter(course => {
    const enrollment = getEnrollmentForCourse(course.id);
    return !enrollment;
  });

  if (selectedCourse) {
    return (
      <CoursePlayer 
        course={selectedCourse}
        onBack={handleBackFromPlayer}
      />
    );
  }

  const calculateProgress = (course: Course, enrollment: Enrollment | undefined) => {
    if (!enrollment) return 0;
    const totalBlocks = course.days.reduce((acc, day) => acc + day.blocks.length, 0);
    const completedBlocks = enrollment.current_day * (course.days[0]?.blocks.length || 1) + enrollment.current_block_index;
    return Math.min(Math.round((completedBlocks / totalBlocks) * 100), 100);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg admin-gradient-bg">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold">NewDay</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-2">
            <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary transition-colors hover:bg-secondary/80">
              <Settings className="h-4 w-4 text-muted-foreground" />
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
              <User className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <section className="border-b border-border bg-gradient-to-b from-secondary/50 to-transparent px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-2 text-2xl font-bold">Добро пожаловать! 👋</h1>
          <p className="text-muted-foreground">
            Здесь вы найдете все ваши курсы и сможете отслеживать прогресс
          </p>
          
          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="rounded-2xl bg-card p-4 text-center">
              <div className="mb-1 text-2xl font-bold text-primary">{activeCourses.length}</div>
              <div className="text-xs text-muted-foreground">В процессе</div>
            </div>
            <div className="rounded-2xl bg-card p-4 text-center">
              <div className="mb-1 text-2xl font-bold text-emerald-500">{completedCourses.length}</div>
              <div className="text-xs text-muted-foreground">Завершено</div>
            </div>
            <div className="rounded-2xl bg-card p-4 text-center">
              <div className="mb-1 text-2xl font-bold text-amber-500">{availableCourses.length}</div>
              <div className="text-xs text-muted-foreground">Доступно</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-6">
        <Tabs defaultValue="available" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-6 grid w-full grid-cols-4 bg-secondary">
            <TabsTrigger value="available" className="data-[state=active]:bg-card">
              Каталог
            </TabsTrigger>
            <TabsTrigger value="active" className="data-[state=active]:bg-card">
              Мои курсы
            </TabsTrigger>
            <TabsTrigger value="lead7" className="data-[state=active]:bg-card">
              Марафон 7 дней
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-card">
              Завершённые
            </TabsTrigger>
          </TabsList>

          {/* Available Courses */}
          <TabsContent value="available" className="mt-0">
            {availableCourses.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {availableCourses.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => handleStartCourse(course)}
                    className="group admin-card p-5 text-left transition-all hover:border-primary/50"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl admin-gradient-bg">
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </div>
                    
                    <h3 className="mb-2 font-semibold">{course.title}</h3>
                    
                    {course.description && (
                      <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                        {course.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{course.days.length} дней</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>~{course.days.length * 15} мин</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
                      <Play className="h-4 w-4" />
                      Начать курс
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <EmptyState 
                icon={BookOpen}
                title="Все курсы уже начаты"
                description="Загляните во вкладку «Мои курсы» для продолжения"
              />
            )}
          </TabsContent>

          {/* Lead7 Marathon (n8n) */}
          <TabsContent value="lead7" className="mt-0">
            <Lead7Marathon />
          </TabsContent>

          {/* Active Courses */}
          <TabsContent value="active" className="mt-0">
            {activeCourses.length > 0 ? (
              <div className="space-y-4">
                {activeCourses.map((course) => {
                  const enrollment = getEnrollmentForCourse(course.id);
                  const progress = calculateProgress(course, enrollment);
                  
                  return (
                    <button
                      key={course.id}
                      onClick={() => setSelectedCourse(course)}
                      className="group admin-card w-full p-5 text-left transition-all hover:border-primary/50"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl admin-gradient-bg">
                          <BookOpen className="h-7 w-7 text-white" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="mb-1 flex items-center justify-between">
                            <h3 className="font-semibold">{course.title}</h3>
                            <span className="text-sm font-medium text-primary">{progress}%</span>
                          </div>
                          
                          <p className="mb-3 text-sm text-muted-foreground">
                            День {(enrollment?.current_day || 0) + 1} из {course.days.length}
                          </p>
                          
                          {/* Progress Bar */}
                          <div className="h-2 overflow-hidden rounded-full bg-secondary">
                            <div 
                              className="h-full rounded-full admin-gradient-bg transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                        
                        <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <EmptyState 
                icon={Clock}
                title="Нет активных курсов"
                description="Выберите курс из каталога, чтобы начать обучение"
              />
            )}
          </TabsContent>

          {/* Completed Courses */}
          <TabsContent value="completed" className="mt-0">
            {completedCourses.length > 0 ? (
              <div className="space-y-4">
                {completedCourses.map((course) => (
                  <div
                    key={course.id}
                    className="admin-card p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                        <Trophy className="h-7 w-7 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <h3 className="font-semibold">{course.title}</h3>
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        </div>
                        
                        <p className="mb-2 text-sm text-muted-foreground">
                          Пройдено {course.days.length} дней
                        </p>
                        
                        <div className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400">
                          <Trophy className="h-3 w-3" />
                          Завершено
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState 
                icon={Trophy}
                title="Пока нет завершённых курсов"
                description="Завершите хотя бы один курс, чтобы увидеть его здесь"
              />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const EmptyState = ({ icon: Icon, title, description }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center rounded-2xl bg-card p-12 text-center">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
      <Icon className="h-8 w-8 text-muted-foreground" />
    </div>
    <h3 className="mb-2 font-semibold">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

export default StudentDashboard;
