import { ArrowLeft, MoreVertical } from 'lucide-react';

interface RunnerHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
}

export const RunnerHeader = ({ title, subtitle, onBack }: RunnerHeaderProps) => {
  return (
    <header className="runner-header sticky top-0 z-50 px-4 py-3 text-white shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button 
              onClick={onBack}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div>
            <h1 className="font-semibold">{title}</h1>
            {subtitle && (
              <p className="text-sm text-white/70">{subtitle}</p>
            )}
          </div>
        </div>
        
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};
