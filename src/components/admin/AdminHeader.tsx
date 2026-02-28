import { Sparkles, Settings, HelpCircle } from 'lucide-react';

export const AdminHeader = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl admin-gradient-bg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">NewDay</h1>
            <p className="text-xs text-muted-foreground">Architect</p>
          </div>
        </div>
        
        <nav className="flex items-center gap-2">
          <button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            <HelpCircle className="h-5 w-5" />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            <Settings className="h-5 w-5" />
          </button>
        </nav>
      </div>
    </header>
  );
};
