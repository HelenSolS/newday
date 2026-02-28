import { useState } from 'react';
import { ContentBlock, QuizContent, QuizOption } from '@/types';
import { Play, Check, X, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ChatBlockProps {
  block: ContentBlock;
  onComplete: (answer?: string, selectedOption?: QuizOption) => void;
  isCompleted?: boolean;
}

export const ChatBlock = ({ block, onComplete, isCompleted }: ChatBlockProps) => {
  const [selectedOption, setSelectedOption] = useState<QuizOption | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [practiceInput, setPracticeInput] = useState('');

  const renderVideo = () => {
    const content = block.content as { url: string; description: string };
    return (
      <div className="space-y-3">
        {content.description && (
          <p className="text-slate-700">{content.description}</p>
        )}
        <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105">
              <Play className="ml-1 h-6 w-6" />
            </button>
          </div>
          <p className="absolute bottom-2 left-2 rounded-lg bg-black/60 px-2 py-1 text-xs text-white">
            Видео
          </p>
        </div>
        {!isCompleted && (
          <button 
            onClick={() => onComplete()}
            className="runner-inline-btn runner-inline-btn-primary w-full"
          >
            Посмотрел ✓
          </button>
        )}
      </div>
    );
  };

  const renderArticle = () => {
    const content = block.content as { markdown: string };
    return (
      <div className="space-y-3">
        <div className="prose prose-sm max-w-none text-slate-700">
          {content.markdown.split('\n').map((line, i) => {
            if (line.startsWith('# ')) {
              return <h1 key={i} className="text-lg font-bold text-slate-900">{line.slice(2)}</h1>;
            }
            if (line.startsWith('## ')) {
              return <h2 key={i} className="text-base font-semibold text-slate-900">{line.slice(3)}</h2>;
            }
            if (line.trim() === '') return <br key={i} />;
            return <p key={i}>{line}</p>;
          })}
        </div>
        {!isCompleted && (
          <button 
            onClick={() => onComplete()}
            className="runner-inline-btn runner-inline-btn-primary w-full"
          >
            Прочитано ✓
          </button>
        )}
      </div>
    );
  };

  const renderQuiz = () => {
    const content = block.content as QuizContent;
    
    const handleSelect = (option: QuizOption) => {
      if (showResult) return;
      setSelectedOption(option);
      setShowResult(true);
      
      if (option.is_correct || block.rules.is_skippable) {
        setTimeout(() => {
          onComplete(undefined, option);
        }, 1500);
      }
    };

    return (
      <div className="space-y-3">
        <p className="font-medium text-slate-900">{content.question}</p>
        <div className="space-y-2">
          {content.options.map((option) => {
            let optionClass = 'runner-inline-btn w-full text-left';
            
            if (showResult && selectedOption?.id === option.id) {
              optionClass += option.is_correct 
                ? ' !bg-emerald-100 !text-emerald-700 !border-emerald-300'
                : ' !bg-red-100 !text-red-700 !border-red-300';
            } else if (showResult && option.is_correct) {
              optionClass += ' !bg-emerald-50 !border-emerald-200';
            }
            
            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option)}
                disabled={showResult}
                className={`${optionClass} flex items-center justify-between border`}
              >
                <span>{option.text}</span>
                {showResult && selectedOption?.id === option.id && (
                  option.is_correct 
                    ? <Check className="h-4 w-4" />
                    : <X className="h-4 w-4" />
                )}
                {showResult && option.is_correct && selectedOption?.id !== option.id && (
                  <Check className="h-4 w-4 text-emerald-500" />
                )}
              </button>
            );
          })}
        </div>
        {showResult && selectedOption && !selectedOption.is_correct && !block.rules.is_skippable && (
          <p className="text-center text-sm text-red-600">
            Попробуйте ещё раз
          </p>
        )}
      </div>
    );
  };

  const renderPractice = () => {
    const content = block.content as { prompt: string };
    
    const handleSubmit = () => {
      if (practiceInput.trim()) {
        onComplete(practiceInput.trim());
      }
    };

    return (
      <div className="space-y-3">
        <p className="text-slate-700">{content.prompt}</p>
        {!isCompleted && (
          <div className="flex gap-2">
            <Input
              value={practiceInput}
              onChange={(e) => setPracticeInput(e.target.value)}
              placeholder="Напишите ваш ответ..."
              className="flex-1 rounded-xl border-slate-200 bg-white"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <button
              onClick={handleSubmit}
              disabled={!practiceInput.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white transition-colors disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderers: Record<ContentBlock['type'], () => JSX.Element> = {
    video: renderVideo,
    article: renderArticle,
    quiz: renderQuiz,
    practice: renderPractice,
  };

  return renderers[block.type]();
};
