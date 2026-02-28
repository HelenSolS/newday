import { useState } from 'react';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { RunnerDashboard } from '@/components/runner/RunnerDashboard';
import { Sparkles, GraduationCap } from 'lucide-react';

const Index = () => {
  const [activeApp, setActiveApp] = useState<'select' | 'architect' | 'runner'>('select');

  if (activeApp === 'architect') {
    return <AdminDashboard />;
  }

  if (activeApp === 'runner') {
    return <RunnerDashboard />;
  }

  // App Selector Screen
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl admin-gradient-bg">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-2 text-3xl font-black tracking-tight">NewDay</h1>
          <p className="text-muted-foreground">
            Платформа для создания и проведения образовательных марафонов
          </p>
        </div>

        {/* App Selection */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Architect Card */}
          <button
            onClick={() => setActiveApp('architect')}
            className="group admin-card p-8 text-left transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl admin-gradient-bg transition-transform group-hover:scale-110">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <h2 className="mb-2 text-xl font-bold">Architect</h2>
            <p className="text-sm text-muted-foreground">
              Конструктор курсов. Создавайте структуру марафона, добавляйте контент и настраивайте правила прохождения.
            </p>
            <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
              <span>Открыть редактор</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </div>
          </button>

          {/* Runner Card */}
          <button
            onClick={() => setActiveApp('runner')}
            className="group admin-card p-8 text-left transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 transition-transform group-hover:scale-110">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <h2 className="mb-2 text-xl font-bold">Runner</h2>
            <p className="text-sm text-muted-foreground">
              Плеер курсов. Интерактивное прохождение марафона в формате чат-бота с поддержкой ИИ.
            </p>
            <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-emerald-400">
              <span>Начать обучение</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </div>
          </button>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          В production-версии приложения запускаются автономно через разные точки входа
        </p>
      </div>
    </div>
  );
};

export default Index;
