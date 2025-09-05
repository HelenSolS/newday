from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import json
from datetime import datetime
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
import os

# Import models
from models import ContentBlock, Course, CourseBlock, CourseSchedule

router = APIRouter(prefix="/api/courses", tags=["courses"])

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./data/newday_platform.db")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Pydantic models for request/response
class ContentBlockCreate(BaseModel):
    name: str
    category: str
    description: Optional[str] = None
    content_type: str
    content_data: Dict[str, Any]
    is_active: Optional[bool] = True

class ContentBlockResponse(ContentBlockCreate):
    id: int
    created_at: datetime
    updated_at: datetime

class CourseCreate(BaseModel):
    title: str
    description: Optional[str] = None
    duration_days: int
    is_active: Optional[bool] = True

class CourseResponse(CourseCreate):
    id: int
    created_at: datetime
    updated_at: datetime

class CourseBlockCreate(BaseModel):
    course_id: int
    content_block_id: int
    frequency: Optional[str] = "daily"
    time_of_day: Optional[str] = "morning"
    day_of_week: Optional[str] = None
    order_in_day: Optional[int] = 1

class CourseBlockResponse(CourseBlockCreate):
    id: int
    created_at: datetime
    updated_at: datetime

class CourseScheduleCreate(BaseModel):
    course_id: int
    day_number: int
    content_block_id: int
    scheduled_at: Optional[datetime] = None
    is_sent: Optional[bool] = False

class CourseScheduleResponse(CourseScheduleCreate):
    id: int
    created_at: datetime
    updated_at: datetime

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/blocks", response_model=ContentBlockResponse, summary="Create a new content block")
async def create_content_block(block: ContentBlockCreate, db = Depends(get_db)):
    """
    Create a new content block (exercise, question, meditation, etc.)
    """
    try:
        db_block = ContentBlock(
            name=block.name,
            category=block.category,
            description=block.description,
            content_type=block.content_type,
            content_data=json.dumps(block.content_data),
            is_active=block.is_active
        )
        db.add(db_block)
        db.commit()
        db.refresh(db_block)
        return db_block
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating content block: {str(e)}")

@router.get("/blocks", response_model=List[ContentBlockResponse], summary="Get all content blocks")
async def get_content_blocks(skip: int = 0, limit: int = 100, db = Depends(get_db)):
    """
    Get all content blocks
    """
    try:
        blocks = db.query(ContentBlock).offset(skip).limit(limit).all()
        return blocks
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving content blocks: {str(e)}")

@router.get("/blocks/{block_id}", response_model=ContentBlockResponse, summary="Get a specific content block")
async def get_content_block(block_id: int, db = Depends(get_db)):
    """
    Get a specific content block by ID
    """
    try:
        block = db.query(ContentBlock).filter(ContentBlock.id == block_id).first()
        if not block:
            raise HTTPException(status_code=404, detail="Content block not found")
        return block
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving content block: {str(e)}")

@router.put("/blocks/{block_id}", response_model=ContentBlockResponse, summary="Update a content block")
async def update_content_block(block_id: int, block: ContentBlockCreate, db = Depends(get_db)):
    """
    Update a content block
    """
    try:
        db_block = db.query(ContentBlock).filter(ContentBlock.id == block_id).first()
        if not db_block:
            raise HTTPException(status_code=404, detail="Content block not found")
        
        db_block.name = block.name
        db_block.category = block.category
        db_block.description = block.description
        db_block.content_type = block.content_type
        db_block.content_data = json.dumps(block.content_data)
        db_block.is_active = block.is_active
        db_block.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(db_block)
        return db_block
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error updating content block: {str(e)}")

@router.post("/", response_model=CourseResponse, summary="Create a new course")
async def create_course(course: CourseCreate, db = Depends(get_db)):
    """
    Create a new course
    """
    try:
        db_course = Course(
            title=course.title,
            description=course.description,
            duration_days=course.duration_days,
            is_active=course.is_active
        )
        db.add(db_course)
        db.commit()
        db.refresh(db_course)
        return db_course
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating course: {str(e)}")

@router.get("/", response_model=List[CourseResponse], summary="Get all courses")
async def get_courses(skip: int = 0, limit: int = 100, db = Depends(get_db)):
    """
    Get all courses
    """
    try:
        courses = db.query(Course).offset(skip).limit(limit).all()
        return courses
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving courses: {str(e)}")

@router.get("/{course_id}", response_model=CourseResponse, summary="Get a specific course")
async def get_course(course_id: int, db = Depends(get_db)):
    """
    Get a specific course by ID
    """
    try:
        course = db.query(Course).filter(Course.id == course_id).first()
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        return course
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving course: {str(e)}")

@router.post("/course-blocks", response_model=CourseBlockResponse, summary="Assign a content block to a course")
async def assign_block_to_course(course_block: CourseBlockCreate, db = Depends(get_db)):
    """
    Assign a content block to a course with scheduling parameters
    """
    try:
        # Check if course exists
        course = db.query(Course).filter(Course.id == course_block.course_id).first()
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        
        # Check if content block exists
        content_block = db.query(ContentBlock).filter(ContentBlock.id == course_block.content_block_id).first()
        if not content_block:
            raise HTTPException(status_code=404, detail="Content block not found")
        
        db_course_block = CourseBlock(
            course_id=course_block.course_id,
            content_block_id=course_block.content_block_id,
            frequency=course_block.frequency,
            time_of_day=course_block.time_of_day,
            day_of_week=course_block.day_of_week,
            order_in_day=course_block.order_in_day
        )
        db.add(db_course_block)
        db.commit()
        db.refresh(db_course_block)
        return db_course_block
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error assigning block to course: {str(e)}")

@router.post("/build-course/{course_id}", summary="Automatically build course schedule")
async def build_course_schedule(course_id: int, db = Depends(get_db)):
    """
    Automatically build course schedule based on assigned blocks and their frequencies
    """
    try:
        # Check if course exists
        course = db.query(Course).filter(Course.id == course_id).first()
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        
        # Get all assigned blocks for this course
        course_blocks = db.query(CourseBlock).filter(CourseBlock.course_id == course_id).all()
        
        # Clear existing schedule for this course
        db.query(CourseSchedule).filter(CourseSchedule.course_id == course_id).delete()
        
        # Build schedule based on course duration and block frequencies
        for day in range(1, course.duration_days + 1):
            for course_block in course_blocks:
                # Check if block should be included on this day based on frequency
                should_include = False
                
                if course_block.frequency == "daily":
                    should_include = True
                elif course_block.frequency == "every_other_day" and day % 2 == 1:
                    should_include = True
                elif course_block.frequency == "weekly":
                    # For weekly, we'll include on day 1, 8, 15, etc.
                    if day % 7 == 1:
                        should_include = True
                
                if should_include:
                    schedule = CourseSchedule(
                        course_id=course_id,
                        day_number=day,
                        content_block_id=course_block.content_block_id
                    )
                    db.add(schedule)
        
        db.commit()
        return {"status": "success", "message": f"Course schedule built for {course.duration_days} days"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error building course schedule: {str(e)}")

@router.get("/{course_id}/schedule", response_model=List[CourseScheduleResponse], summary="Get course schedule")
async def get_course_schedule(course_id: int, db = Depends(get_db)):
    """
    Get the schedule for a specific course
    """
    try:
        # Check if course exists
        course = db.query(Course).filter(Course.id == course_id).first()
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        
        schedule = db.query(CourseSchedule).filter(CourseSchedule.course_id == course_id).all()
        return schedule
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving course schedule: {str(e)}")