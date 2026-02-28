// ============================================
// MARATHON LAB - LOCAL STORAGE BACKEND BRIDGE
// Simulates database operations, ready for n8n/Supabase migration
// ============================================

import { Course, Enrollment, CourseDay, ContentBlock } from '@/types';

const COURSES_KEY = 'marathon_lab_courses';
const ENROLLMENTS_KEY = 'marathon_lab_enrollments';

// Generate unique ID
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// ============================================
// COURSE OPERATIONS (Admin/Architect)
// ============================================

export const getCourses = (): Course[] => {
  const data = localStorage.getItem(COURSES_KEY);
  return data ? JSON.parse(data) : [];
};

export const getCourse = (id: string): Course | undefined => {
  return getCourses().find(c => c.id === id);
};

export const saveCourse = (course: Course): void => {
  const courses = getCourses();
  const index = courses.findIndex(c => c.id === course.id);
  
  course.updated_at = new Date().toISOString();
  
  if (index >= 0) {
    courses[index] = course;
  } else {
    course.created_at = new Date().toISOString();
    courses.push(course);
  }
  
  localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
};

export const deleteCourse = (id: string): void => {
  const courses = getCourses().filter(c => c.id !== id);
  localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
};

export const createNewCourse = (): Course => {
  const id = generateId();
  return {
    id,
    title: 'Новый марафон',
    description: '',
    category: 'general',
    bot_username: '',
    status: 'draft',
    days: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

export const addDayToCourse = (courseId: string): CourseDay => {
  const course = getCourse(courseId);
  if (!course) throw new Error('Course not found');
  
  const dayNumber = course.days.length + 1;
  const newDay: CourseDay = {
    id: generateId(),
    day_number: dayNumber,
    title: `День ${dayNumber}`,
    blocks: [],
  };
  
  course.days.push(newDay);
  saveCourse(course);
  
  return newDay;
};

export const removeDayFromCourse = (courseId: string, dayId: string): void => {
  const course = getCourse(courseId);
  if (!course) return;
  
  course.days = course.days
    .filter(d => d.id !== dayId)
    .map((day, index) => ({
      ...day,
      day_number: index + 1,
      title: day.title.startsWith('День ') ? `День ${index + 1}` : day.title,
    }));
  
  saveCourse(course);
};

export const addBlockToDay = (
  courseId: string, 
  dayId: string, 
  blockType: ContentBlock['type']
): ContentBlock => {
  const course = getCourse(courseId);
  if (!course) throw new Error('Course not found');
  
  const day = course.days.find(d => d.id === dayId);
  if (!day) throw new Error('Day not found');
  
  const defaultContent = {
    video: { url: '', description: '' },
    quiz: { question: '', options: [] },
    article: { markdown: '' },
    practice: { prompt: '', ai_instruction: '' },
  };
  
  const newBlock: ContentBlock = {
    id: generateId(),
    type: blockType,
    order_index: day.blocks.length,
    content: defaultContent[blockType],
    rules: {
      is_skippable: false,
      requires_correct_answer: blockType === 'quiz',
    },
  };
  
  day.blocks.push(newBlock);
  saveCourse(course);
  
  return newBlock;
};

export const updateBlock = (
  courseId: string,
  dayId: string,
  blockId: string,
  updates: Partial<ContentBlock>
): void => {
  const course = getCourse(courseId);
  if (!course) return;
  
  const day = course.days.find(d => d.id === dayId);
  if (!day) return;
  
  const blockIndex = day.blocks.findIndex(b => b.id === blockId);
  if (blockIndex < 0) return;
  
  day.blocks[blockIndex] = { ...day.blocks[blockIndex], ...updates };
  saveCourse(course);
};

export const removeBlock = (courseId: string, dayId: string, blockId: string): void => {
  const course = getCourse(courseId);
  if (!course) return;
  
  const day = course.days.find(d => d.id === dayId);
  if (!day) return;
  
  day.blocks = day.blocks
    .filter(b => b.id !== blockId)
    .map((block, index) => ({ ...block, order_index: index }));
  
  saveCourse(course);
};

// ============================================
// ENROLLMENT OPERATIONS (Runner)
// ============================================

export const getEnrollments = (userId?: string): Enrollment[] => {
  const data = localStorage.getItem(ENROLLMENTS_KEY);
  const enrollments: Enrollment[] = data ? JSON.parse(data) : [];
  
  if (userId) {
    return enrollments.filter(e => e.user_id === userId);
  }
  
  return enrollments;
};

export const getEnrollment = (userId: string, courseId: string): Enrollment | undefined => {
  return getEnrollments().find(e => e.user_id === userId && e.course_id === courseId);
};

export const createEnrollment = (userId: string, courseId: string): Enrollment => {
  const enrollment: Enrollment = {
    id: generateId(),
    user_id: userId,
    course_id: courseId,
    current_day: 1,
    current_block_index: 0,
    answers: [],
    status: 'active',
    started_at: new Date().toISOString(),
  };
  
  const enrollments = getEnrollments();
  enrollments.push(enrollment);
  localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(enrollments));
  
  return enrollment;
};

export const updateEnrollment = (enrollment: Enrollment): void => {
  const enrollments = getEnrollments();
  const index = enrollments.findIndex(e => e.id === enrollment.id);
  
  if (index >= 0) {
    enrollments[index] = enrollment;
    localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(enrollments));
  }
};

export const getOrCreateEnrollment = (userId: string, courseId: string): Enrollment => {
  const existing = getEnrollment(userId, courseId);
  if (existing) return existing;
  return createEnrollment(userId, courseId);
};
