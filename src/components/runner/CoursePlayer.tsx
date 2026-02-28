import { useState, useEffect, useRef } from 'react';
import { Course, CourseDay, ContentBlock, ChatMessage, QuizOption } from '@/types';
import { RunnerHeader } from './RunnerHeader';
import { ProgressBar } from './ProgressBar';
import { ChatBlock } from './ChatBlock';
import { TypingIndicator } from './TypingIndicator';
import { generateId } from '@/lib/storage';
import { Trophy, ArrowRight, Sparkles } from 'lucide-react';

interface CoursePlayerProps {
  course: Course;
  onBack: () => void;
}

export const CoursePlayer = ({ course, onBack }: CoursePlayerProps) => {
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [completedBlocks, setCompletedBlocks] = useState<Set<string>>(new Set());
  const [isCompleted, setIsCompleted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentDay = course.days[currentDayIndex];
  const currentBlock = currentDay?.blocks[currentBlockIndex];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initialize first message
  useEffect(() => {
    if (course.days.length === 0) return;
    
    const welcomeMessage: ChatMessage = {
      id: generateId(),
      type: 'bot',
      content_type: 'text',
      text: `👋 Добро пожаловать в марафон "${course.title}"!\n\nВас ждет ${course.days.length} дней трансформации. Готовы начать?`,
      timestamp: new Date().toISOString(),
    };
    
    setMessages([welcomeMessage]);
    
    // Show first block after welcome
    setTimeout(() => {
      showNextBlock(0, 0);
    }, 1500);
  }, [course]);

  const showNextBlock = (dayIdx: number, blockIdx: number) => {
    const day = course.days[dayIdx];
    if (!day) {
      // Course completed
      setIsCompleted(true);
      addCompletionMessage();
      return;
    }

    const block = day.blocks[blockIdx];
    if (!block) {
      // Day completed, move to next day
      addDayCompleteMessage(day);
      return;
    }

    // Show typing indicator
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      
      const blockMessage: ChatMessage = {
        id: generateId(),
        type: 'bot',
        content_type: block.type,
        block,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, blockMessage]);
      setCurrentDayIndex(dayIdx);
      setCurrentBlockIndex(blockIdx);
    }, 1000 + Math.random() * 500);
  };

  const addDayCompleteMessage = (day: CourseDay) => {
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      
      const nextDayIdx = currentDayIndex + 1;
      const hasNextDay = nextDayIdx < course.days.length;
      
      const message: ChatMessage = {
        id: generateId(),
        type: 'bot',
        content_type: 'system',
        text: hasNextDay 
          ? `🎉 Отлично! ${day.title} завершен!\n\nГотовы перейти к следующему дню?`
          : `🏆 Поздравляем! Вы завершили весь марафон!`,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, message]);
      
      if (!hasNextDay) {
        setIsCompleted(true);
      }
    }, 800);
  };

  const addCompletionMessage = () => {
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      
      const message: ChatMessage = {
        id: generateId(),
        type: 'bot',
        content_type: 'system',
        text: `🏆 Невероятно! Вы прошли весь марафон "${course.title}"!\n\nСпасибо за участие. Вы проделали большую работу!`,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, message]);
    }, 800);
  };

  const handleBlockComplete = (blockId: string, answer?: string, selectedOption?: QuizOption) => {
    // Mark block as completed
    setCompletedBlocks(prev => new Set([...prev, blockId]));
    
    // Add user response message if applicable
    if (answer) {
      const userMessage: ChatMessage = {
        id: generateId(),
        type: 'user',
        content_type: 'text',
        text: answer,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, userMessage]);
      
      // Add AI acknowledgment for practice blocks
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const aiResponse: ChatMessage = {
            id: generateId(),
            type: 'bot',
            content_type: 'text',
            text: '💜 Спасибо за вашу рефлексию! Это важный шаг на пути к изменениям.',
            timestamp: new Date().toISOString(),
          };
          setMessages(prev => [...prev, aiResponse]);
          
          // Continue to next block
          setTimeout(() => {
            moveToNextBlock();
          }, 1000);
        }, 1200);
      }, 500);
      return;
    }
    
    if (selectedOption) {
      const userMessage: ChatMessage = {
        id: generateId(),
        type: 'user',
        content_type: 'text',
        text: selectedOption.text,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, userMessage]);
    }
    
    // Move to next block
    setTimeout(() => {
      moveToNextBlock();
    }, 500);
  };

  const moveToNextBlock = () => {
    const nextBlockIdx = currentBlockIndex + 1;
    
    if (nextBlockIdx < currentDay.blocks.length) {
      showNextBlock(currentDayIndex, nextBlockIdx);
    } else {
      // Day completed
      addDayCompleteMessage(currentDay);
    }
  };

  const handleNextDay = () => {
    const nextDayIdx = currentDayIndex + 1;
    if (nextDayIdx < course.days.length) {
      showNextBlock(nextDayIdx, 0);
    }
  };

  const totalDays = course.days.length;
  const completedDays = currentDayIndex;

  return (
    <div className="runner-container flex flex-col">
      <RunnerHeader 
        title={course.title}
        subtitle={currentDay ? currentDay.title : 'Завершено'}
        onBack={onBack}
      />
      
      <ProgressBar 
        current={completedDays + 1} 
        total={totalDays}
        label={`${currentDay?.title || 'Финал'}`}
      />
      
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="mx-auto max-w-lg space-y-3">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.content_type === 'text' || msg.content_type === 'system' ? (
                <div className={`chat-bubble ${msg.type === 'bot' ? 'chat-bubble-bot' : 'chat-bubble-user'}`}>
                  {msg.text?.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
                  ))}
                </div>
              ) : msg.block ? (
                <div className="chat-bubble chat-bubble-bot w-full max-w-none">
                  <ChatBlock 
                    block={msg.block}
                    onComplete={(answer, option) => handleBlockComplete(msg.block!.id, answer, option)}
                    isCompleted={completedBlocks.has(msg.block.id)}
                  />
                </div>
              ) : null}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <TypingIndicator />
            </div>
          )}
          
          {/* Next Day Button */}
          {messages.length > 0 && 
           messages[messages.length - 1].content_type === 'system' && 
           !isCompleted &&
           currentDayIndex + 1 < course.days.length && (
            <div className="flex justify-center pt-4">
              <button
                onClick={handleNextDay}
                className="flex items-center gap-2 rounded-full admin-gradient-bg px-6 py-3 text-white font-medium shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <span>Следующий день</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
          
          {/* Completion State */}
          {isCompleted && (
            <div className="flex flex-col items-center pt-8 pb-4">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full admin-gradient-bg shadow-lg">
                <Trophy className="h-10 w-10 text-white" />
              </div>
              <div className="flex items-center gap-1 text-primary">
                <Sparkles className="h-4 w-4" />
                <span className="font-semibold">Марафон завершен!</span>
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};
