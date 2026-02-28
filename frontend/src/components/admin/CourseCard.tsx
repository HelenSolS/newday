import { Course } from '@/types';
import { Calendar, MessageCircle, MoreVertical, Play, Archive, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CourseCardProps {
  course: Course;
  onSelect: (course: Course) => void;
  onDelete: (id: string) => void;
}

export const CourseCard = ({ course, onSelect, onDelete }: CourseCardProps) => {
  const totalBlocks = course.days.reduce((acc, day) => acc + day.blocks.length, 0);
  
  const statusColors = {
    draft: 'bg-amber-500/20 text-amber-400',
    published: 'bg-emerald-500/20 text-emerald-400',
    archived: 'bg-slate-500/20 text-slate-400',
  };
  
  const statusLabels = {
    draft: 'Черновик',
    published: 'Опубликован',
    archived: 'Архив',
  };

  return (
    <div 
      className="admin-card group cursor-pointer p-6"
      onClick={() => onSelect(course)}
    >
      <div className="mb-4 flex items-start justify-between">
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[course.status]}`}>
          {statusLabels[course.status]}
        </span>
        
        <DropdownMenu>
          <DropdownMenuTrigger 
            className="flex h-8 w-8 items-center justify-center rounded-lg opacity-0 transition-opacity hover:bg-secondary group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <Play className="mr-2 h-4 w-4" />
              Предпросмотр
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Archive className="mr-2 h-4 w-4" />
              Архивировать
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(course.id);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <h3 className="mb-2 text-xl font-bold tracking-tight">{course.title}</h3>
      
      {course.description && (
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
          {course.description}
        </p>
      )}
      
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          <span>{course.days.length} дней</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MessageCircle className="h-4 w-4" />
          <span>{totalBlocks} блоков</span>
        </div>
      </div>
      
      {course.bot_username && (
        <div className="mt-4 rounded-lg bg-secondary/50 px-3 py-2">
          <p className="text-xs text-muted-foreground">
            Бот: <span className="font-medium text-foreground">@{course.bot_username}</span>
          </p>
        </div>
      )}
    </div>
  );
};
