from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class Webinar(Base):
    __tablename__ = 'webinars'
    
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    duration_days = Column(Integer, default=10)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    days = relationship("WebinarDay", back_populates="webinar")

class WebinarDay(Base):
    __tablename__ = 'webinar_days'
    
    id = Column(Integer, primary_key=True)
    webinar_id = Column(Integer, ForeignKey('webinars.id'), nullable=False)
    day_number = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    content = Column(Text)  # JSON formatted content
    visual_test_data = Column(Text)  # JSON formatted visual test data
    questions = Column(Text)  # JSON formatted questions
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    webinar = relationship("Webinar", back_populates="days")

class Participant(Base):
    __tablename__ = 'participants'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)  # Removed ForeignKey reference to non-existent users table
    webinar_id = Column(Integer, ForeignKey('webinars.id'), nullable=False)
    enrollment_date = Column(DateTime, default=datetime.utcnow)
    completion_status = Column(String, default="enrolled")  # enrolled, in_progress, completed
    current_day = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Response(Base):
    __tablename__ = 'responses'
    
    id = Column(Integer, primary_key=True)
    participant_id = Column(Integer, ForeignKey('participants.id'), nullable=False)
    day_id = Column(Integer, ForeignKey('webinar_days.id'), nullable=False)
    question_id = Column(Integer)  # Reference to specific question
    response_text = Column(Text)
    response_timestamp = Column(DateTime, default=datetime.utcnow)

class VisualTest(Base):
    __tablename__ = 'visual_tests'
    
    id = Column(Integer, primary_key=True)
    day_id = Column(Integer, ForeignKey('webinar_days.id'), nullable=False)
    image_url = Column(String)
    options = Column(Text)  # JSON formatted options
    correct_answer = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Новые модели для системы блоков и курсов
class ContentBlock(Base):
    __tablename__ = 'content_blocks'
    
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)  # Название блока (дыхание, ЛФК, питание и т.д.)
    category = Column(String, nullable=False)  # Категория блока
    description = Column(Text)  # Описание блока
    content_type = Column(String, nullable=False)  # Тип контента (exercise, question, meditation и т.д.)
    content_data = Column(JSON)  # JSON с данными контента
    is_active = Column(Boolean, default=True)  # Активен ли блок
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship to course blocks
    course_blocks = relationship("CourseBlock", back_populates="content_block")

class Course(Base):
    __tablename__ = 'courses'
    
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    duration_days = Column(Integer, nullable=False)  # Длительность курса в днях
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    course_blocks = relationship("CourseBlock", back_populates="course")
    course_schedules = relationship("CourseSchedule", back_populates="course")

class CourseBlock(Base):
    __tablename__ = 'course_blocks'
    
    id = Column(Integer, primary_key=True)
    course_id = Column(Integer, ForeignKey('courses.id'), nullable=False)
    content_block_id = Column(Integer, ForeignKey('content_blocks.id'), nullable=False)
    frequency = Column(String, default="daily")  # Как часто показывать (daily, every_other_day, weekly и т.д.)
    time_of_day = Column(String, default="morning")  # Когда показывать (morning, evening)
    day_of_week = Column(String)  # Для недельного расписания (monday, tuesday и т.д.)
    order_in_day = Column(Integer, default=1)  # Порядок в рамках дня
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    course = relationship("Course", back_populates="course_blocks")
    content_block = relationship("ContentBlock", back_populates="course_blocks")

class CourseSchedule(Base):
    __tablename__ = 'course_schedules'
    
    id = Column(Integer, primary_key=True)
    course_id = Column(Integer, ForeignKey('courses.id'), nullable=False)
    day_number = Column(Integer, nullable=False)  # Номер дня курса
    content_block_id = Column(Integer, ForeignKey('content_blocks.id'), nullable=False)
    scheduled_at = Column(DateTime)  # Конкретное время отправки
    is_sent = Column(Boolean, default=False)  # Отправлено ли уже
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    course = relationship("Course", back_populates="course_schedules")
    content_block = relationship("ContentBlock")