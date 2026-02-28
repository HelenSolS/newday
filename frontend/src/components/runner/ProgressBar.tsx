interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export const ProgressBar = ({ current, total, label }: ProgressBarProps) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
  
  return (
    <div className="px-4 py-3 bg-white/90 backdrop-blur-sm border-b border-slate-100">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-slate-600">
          {label || `День ${current} из ${total}`}
        </span>
        <span className="text-xs font-semibold text-primary">
          {percentage}%
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div 
          className="h-full rounded-full admin-gradient-bg transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
