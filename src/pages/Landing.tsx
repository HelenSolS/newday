import { Link } from 'react-router-dom';
import { Sparkles, GraduationCap, ArrowRight, Zap, Users, BarChart3 } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl admin-gradient-bg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold">NewDay</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              to="/student"
              className="rounded-xl admin-gradient-bg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Войти
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
        </div>
        
        <div className="mx-auto max-w-6xl px-6 text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Образовательная платформа нового поколения</span>
          </div>
          
          <h1 className="mx-auto mb-6 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Проходите{' '}
            <span className="admin-gradient-text">образовательные марафоны</span>
          </h1>
          
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
            Интерактивное обучение в формате чат-бота с поддержкой ИИ. 
            Отслеживайте прогресс и получайте персональную обратную связь.
          </p>
          
          <Link
            to="/student"
            className="group inline-flex items-center gap-2 rounded-2xl admin-gradient-bg px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
          >
            <GraduationCap className="h-5 w-5" />
            Начать обучение
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-black tracking-tight">Почему NewDay?</h2>
            <p className="text-muted-foreground">Удобное обучение в формате, который вам понравится</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="admin-card p-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-bold">Интерактивный чат</h3>
              <p className="text-sm text-muted-foreground">
                Обучение в формате диалога — как общение с личным наставником
              </p>
            </div>

            {/* Feature 2 */}
            <div className="admin-card p-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl admin-gradient-bg">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-bold">ИИ-поддержка</h3>
              <p className="text-sm text-muted-foreground">
                Получайте персональную обратную связь на ваши размышления
              </p>
            </div>

            {/* Feature 3 */}
            <div className="admin-card p-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-bold">Отслеживание прогресса</h3>
              <p className="text-sm text-muted-foreground">
                Видите свой путь и достижения в личном кабинете
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-border py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 text-3xl font-black text-primary">4</div>
              <div className="text-sm text-muted-foreground">Типа контента</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-black text-primary">∞</div>
              <div className="text-sm text-muted-foreground">Дней в курсе</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-black text-primary">AI</div>
              <div className="text-sm text-muted-foreground">Обратная связь</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-black text-primary">TG</div>
              <div className="text-sm text-muted-foreground">Интеграция</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg admin-gradient-bg">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold">NewDay</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Платформа для создания и проведения образовательных марафонов
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
