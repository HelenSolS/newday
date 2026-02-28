import { useState } from 'react';
import { Course, CourseDay, ContentBlock } from '@/types';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Video, 
  FileText, 
  HelpCircle, 
  Brain,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronRight,
  Settings2,
  Bot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BlockEditor } from './BlockEditor';
import { 
  saveCourse, 
  addDayToCourse, 
  removeDayFromCourse, 
  addBlockToDay,
  removeBlock 
} from '@/lib/storage';

interface CourseEditorProps {
  course: Course;
  onBack: () => void;
  onUpdate: (course: Course) => void;
}

const blockTypeConfig = {
  video: { icon: Video, label: 'Видео', color: 'text-rose-400' },
  article: { icon: FileText, label: 'Статья', color: 'text-blue-400' },
  quiz: { icon: HelpCircle, label: 'Квиз', color: 'text-amber-400' },
  practice: { icon: Brain, label: 'Практика', color: 'text-emerald-400' },
};

export const CourseEditor = ({ course, onBack, onUpdate }: CourseEditorProps) => {
  const [localCourse, setLocalCourse] = useState<Course>(course);
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set(course.days.map(d => d.id)));
  const [editingBlock, setEditingBlock] = useState<{
    dayId: string;
    block: ContentBlock;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    saveCourse(localCourse);
    onUpdate(localCourse);
    setTimeout(() => setIsSaving(false), 500);
  };

  const handleAddDay = () => {
    const newDay = addDayToCourse(localCourse.id);
    setLocalCourse(prev => ({
      ...prev,
      days: [...prev.days, newDay],
    }));
    setExpandedDays(prev => new Set([...prev, newDay.id]));
  };

  const handleRemoveDay = (dayId: string) => {
    removeDayFromCourse(localCourse.id, dayId);
    setLocalCourse(prev => ({
      ...prev,
      days: prev.days
        .filter(d => d.id !== dayId)
        .map((day, index) => ({
          ...day,
          day_number: index + 1,
        })),
    }));
  };

  const handleAddBlock = (dayId: string, type: ContentBlock['type']) => {
    const newBlock = addBlockToDay(localCourse.id, dayId, type);
    setLocalCourse(prev => ({
      ...prev,
      days: prev.days.map(day => 
        day.id === dayId 
          ? { ...day, blocks: [...day.blocks, newBlock] }
          : day
      ),
    }));
    setEditingBlock({ dayId, block: newBlock });
  };

  const handleRemoveBlock = (dayId: string, blockId: string) => {
    removeBlock(localCourse.id, dayId, blockId);
    setLocalCourse(prev => ({
      ...prev,
      days: prev.days.map(day => 
        day.id === dayId 
          ? { ...day, blocks: day.blocks.filter(b => b.id !== blockId) }
          : day
      ),
    }));
  };

  const handleBlockUpdate = (dayId: string, updatedBlock: ContentBlock) => {
    setLocalCourse(prev => ({
      ...prev,
      days: prev.days.map(day => 
        day.id === dayId 
          ? { 
              ...day, 
              blocks: day.blocks.map(b => b.id === updatedBlock.id ? updatedBlock : b) 
            }
          : day
      ),
    }));
  };

  const toggleDay = (dayId: string) => {
    setExpandedDays(prev => {
      const next = new Set(prev);
      if (next.has(dayId)) {
        next.delete(dayId);
      } else {
        next.add(dayId);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Назад</span>
          </button>
          
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="admin-gradient-bg border-0"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Course Meta */}
        <div className="mb-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="admin-card p-6">
              <h2 className="admin-label mb-4">Основная информация</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Название марафона</label>
                  <Input
                    value={localCourse.title}
                    onChange={(e) => setLocalCourse(prev => ({ ...prev, title: e.target.value }))}
                    className="text-lg font-semibold"
                    placeholder="Введите название..."
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Описание</label>
                  <Textarea
                    value={localCourse.description}
                    onChange={(e) => setLocalCourse(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Опишите ваш марафон..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="admin-card p-6">
              <h2 className="admin-label mb-4 flex items-center gap-2">
                <Bot className="h-4 w-4" />
                Telegram Бот
              </h2>
              <div>
                <label className="mb-2 block text-sm font-medium">Username бота</label>
                <div className="flex items-center">
                  <span className="flex h-10 items-center rounded-l-lg border border-r-0 border-input bg-secondary px-3 text-muted-foreground">
                    @
                  </span>
                  <Input
                    value={localCourse.bot_username}
                    onChange={(e) => setLocalCourse(prev => ({ ...prev, bot_username: e.target.value }))}
                    className="rounded-l-none"
                    placeholder="your_bot"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Days Section */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="admin-section-title">Программа курса</h2>
          <Button onClick={handleAddDay} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Добавить день
          </Button>
        </div>

        {/* Days List */}
        <div className="space-y-4">
          {localCourse.days.map((day) => (
            <div key={day.id} className="admin-card overflow-hidden">
              {/* Day Header */}
              <div 
                className="flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-secondary/30"
                onClick={() => toggleDay(day.id)}
              >
                <div className="flex items-center gap-3">
                  <button className="text-muted-foreground">
                    <GripVertical className="h-5 w-5" />
                  </button>
                  {expandedDays.has(day.id) ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <h3 className="font-bold">{day.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {day.blocks.length} блоков
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/20 hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveDay(day.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Day Content */}
              {expandedDays.has(day.id) && (
                <div className="border-t border-border/50 p-4">
                  {/* Blocks */}
                  <div className="mb-4 space-y-2">
                    {day.blocks.map((block) => {
                      const config = blockTypeConfig[block.type];
                      const Icon = config.icon;
                      
                      return (
                        <div 
                          key={block.id}
                          className="group flex items-center justify-between rounded-xl bg-secondary/50 p-3 transition-colors hover:bg-secondary"
                        >
                          <div 
                            className="flex flex-1 cursor-pointer items-center gap-3"
                            onClick={() => setEditingBlock({ dayId: day.id, block })}
                          >
                            <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-background ${config.color}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <span className="font-medium">{config.label}</span>
                              {!block.rules.is_skippable && (
                                <span className="ml-2 text-xs text-amber-400">Обязательный</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <button 
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                              onClick={() => setEditingBlock({ dayId: day.id, block })}
                            >
                              <Settings2 className="h-4 w-4" />
                            </button>
                            <button 
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/20 hover:text-destructive"
                              onClick={() => handleRemoveBlock(day.id, block.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Add Block Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(blockTypeConfig).map(([type, config]) => {
                      const Icon = config.icon;
                      return (
                        <button
                          key={type}
                          onClick={() => handleAddBlock(day.id, type as ContentBlock['type'])}
                          className={`flex items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-sm transition-colors hover:border-primary hover:bg-primary/5 ${config.color}`}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="text-foreground">{config.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* Empty State */}
          {localCourse.days.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border py-16">
              <p className="mb-4 text-lg text-muted-foreground">Начните создавать программу</p>
              <Button onClick={handleAddDay} className="admin-gradient-bg border-0 gap-2">
                <Plus className="h-4 w-4" />
                Добавить первый день
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Block Editor Modal */}
      {editingBlock && (
        <BlockEditor
          block={editingBlock.block}
          onSave={(updatedBlock) => {
            handleBlockUpdate(editingBlock.dayId, updatedBlock);
            setEditingBlock(null);
          }}
          onClose={() => setEditingBlock(null)}
        />
      )}
    </div>
  );
};
