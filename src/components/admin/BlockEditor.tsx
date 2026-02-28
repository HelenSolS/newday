import { useState } from 'react';
import { ContentBlock, VideoContent, QuizContent, ArticleContent, PracticeContent, QuizOption } from '@/types';
import { X, Plus, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { generateId } from '@/lib/storage';

interface BlockEditorProps {
  block: ContentBlock;
  onSave: (block: ContentBlock) => void;
  onClose: () => void;
}

export const BlockEditor = ({ block, onSave, onClose }: BlockEditorProps) => {
  const [localBlock, setLocalBlock] = useState<ContentBlock>(block);

  const handleSave = () => {
    onSave(localBlock);
  };

  const updateContent = <T extends ContentBlock['content']>(updates: Partial<T>) => {
    setLocalBlock(prev => ({
      ...prev,
      content: { ...prev.content, ...updates } as T,
    }));
  };

  const updateRules = (updates: Partial<ContentBlock['rules']>) => {
    setLocalBlock(prev => ({
      ...prev,
      rules: { ...prev.rules, ...updates },
    }));
  };

  const renderVideoEditor = () => {
    const content = localBlock.content as VideoContent;
    return (
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">URL видео</label>
          <Input
            value={content.url}
            onChange={(e) => updateContent<VideoContent>({ url: e.target.value })}
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Описание</label>
          <Textarea
            value={content.description}
            onChange={(e) => updateContent<VideoContent>({ description: e.target.value })}
            placeholder="Краткое описание видео..."
            rows={3}
          />
        </div>
      </div>
    );
  };

  const renderArticleEditor = () => {
    const content = localBlock.content as ArticleContent;
    return (
      <div>
        <label className="mb-2 block text-sm font-medium">Текст статьи (Markdown)</label>
        <Textarea
          value={content.markdown}
          onChange={(e) => updateContent<ArticleContent>({ markdown: e.target.value })}
          placeholder="# Заголовок&#10;&#10;Текст вашей статьи..."
          rows={12}
          className="font-mono text-sm"
        />
      </div>
    );
  };

  const renderQuizEditor = () => {
    const content = localBlock.content as QuizContent;
    
    const addOption = () => {
      const newOption: QuizOption = {
        id: generateId(),
        text: '',
        is_correct: content.options.length === 0,
      };
      updateContent<QuizContent>({ 
        options: [...content.options, newOption] 
      });
    };
    
    const updateOption = (optionId: string, updates: Partial<QuizOption>) => {
      updateContent<QuizContent>({
        options: content.options.map(opt => 
          opt.id === optionId ? { ...opt, ...updates } : opt
        ),
      });
    };
    
    const setCorrectOption = (optionId: string) => {
      updateContent<QuizContent>({
        options: content.options.map(opt => ({
          ...opt,
          is_correct: opt.id === optionId,
        })),
      });
    };
    
    const removeOption = (optionId: string) => {
      updateContent<QuizContent>({
        options: content.options.filter(opt => opt.id !== optionId),
      });
    };

    return (
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">Вопрос</label>
          <Textarea
            value={content.question}
            onChange={(e) => updateContent<QuizContent>({ question: e.target.value })}
            placeholder="Введите вопрос..."
            rows={2}
          />
        </div>
        
        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-medium">Варианты ответов</label>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={addOption}
              className="gap-1"
            >
              <Plus className="h-3 w-3" />
              Добавить
            </Button>
          </div>
          
          <div className="space-y-2">
            {content.options.map((option) => (
              <div key={option.id} className="flex items-center gap-2">
                <button
                  onClick={() => setCorrectOption(option.id)}
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                    option.is_correct 
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' 
                      : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  {option.is_correct && <Check className="h-4 w-4" />}
                </button>
                <Input
                  value={option.text}
                  onChange={(e) => updateOption(option.id, { text: e.target.value })}
                  placeholder="Вариант ответа..."
                  className="flex-1"
                />
                <button
                  onClick={() => removeOption(option.id)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/20 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            
            {content.options.length === 0 && (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Добавьте варианты ответов
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderPracticeEditor = () => {
    const content = localBlock.content as PracticeContent;
    return (
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">Задание для рефлексии</label>
          <Textarea
            value={content.prompt}
            onChange={(e) => updateContent<PracticeContent>({ prompt: e.target.value })}
            placeholder="Напишите задание, которое увидит пользователь..."
            rows={4}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">
            Инструкция для ИИ <span className="text-muted-foreground">(опционально)</span>
          </label>
          <Textarea
            value={content.ai_instruction || ''}
            onChange={(e) => updateContent<PracticeContent>({ ai_instruction: e.target.value })}
            placeholder="Как ИИ должен анализировать ответ пользователя..."
            rows={3}
          />
        </div>
      </div>
    );
  };

  const editors: Record<ContentBlock['type'], () => JSX.Element> = {
    video: renderVideoEditor,
    article: renderArticleEditor,
    quiz: renderQuizEditor,
    practice: renderPracticeEditor,
  };

  const typeLabels: Record<ContentBlock['type'], string> = {
    video: 'Видео',
    article: 'Статья',
    quiz: 'Квиз',
    practice: 'Практика',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl animate-scale-in rounded-3xl bg-card p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">Редактор: {typeLabels[localBlock.type]}</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Content Editor */}
        <div className="mb-6">
          {editors[localBlock.type]()}
        </div>
        
        {/* Rules */}
        <div className="mb-6 rounded-2xl bg-secondary/50 p-4">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Правила прохождения
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Можно пропустить</p>
                <p className="text-sm text-muted-foreground">
                  Разрешить перейти к следующему блоку без выполнения
                </p>
              </div>
              <Switch
                checked={localBlock.rules.is_skippable}
                onCheckedChange={(checked) => updateRules({ is_skippable: checked })}
              />
            </div>
            
            {localBlock.type === 'quiz' && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Требуется правильный ответ</p>
                  <p className="text-sm text-muted-foreground">
                    Блокировать прогресс до верного ответа
                  </p>
                </div>
                <Switch
                  checked={localBlock.rules.requires_correct_answer}
                  onCheckedChange={(checked) => updateRules({ requires_correct_answer: checked })}
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={handleSave} className="admin-gradient-bg border-0">
            Сохранить блок
          </Button>
        </div>
      </div>
    </div>
  );
};
