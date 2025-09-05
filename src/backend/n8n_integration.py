#!/usr/bin/env python3
"""
n8n Integration Module for NewDay Platform

This module handles bidirectional data flow between the NewDay platform and n8n
to optimize processes and enable faster operations.
"""

import os
import json
import requests
from datetime import datetime
from typing import Dict, List, Optional, Any
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship

# Import the models we created in populate_database.py
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

class N8nIntegration:
    """Handles bidirectional data flow between NewDay platform and n8n"""
    
    def __init__(self, n8n_webhook_url: str = None, n8n_api_key: str = None):
        """
        Initialize n8n integration
        
        Args:
            n8n_webhook_url: URL for n8n webhooks
            n8n_api_key: API key for n8n authentication
        """
        self.n8n_webhook_url = n8n_webhook_url or os.getenv("N8N_WEBHOOK_URL", "")
        self.n8n_api_key = n8n_api_key or os.getenv("N8N_API_KEY", "")
        self.headers = {
            "Content-Type": "application/json"
        }
        if self.n8n_api_key:
            self.headers["Authorization"] = f"Bearer {self.n8n_api_key}"
        
        # Database setup
        self.DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./data/newday_platform.db")
        self.engine = create_engine(self.DATABASE_URL)
        Base.metadata.create_all(self.engine)
        self.Session = sessionmaker(bind=self.engine)
    
    def send_participant_progress(self, participant_id: int) -> bool:
        """
        Send participant progress data to n8n
        
        Args:
            participant_id: ID of the participant
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            session = self.Session()
            
            # Get participant data
            participant = session.query(Participant).filter_by(id=participant_id).first()
            if not participant:
                print(f"Participant with ID {participant_id} not found")
                return False
            
            # Get webinar data
            webinar = session.query(Webinar).filter_by(id=participant.webinar_id).first()
            if not webinar:
                print(f"Webinar with ID {participant.webinar_id} not found")
                return False
            
            # Get responses
            responses = session.query(Response).filter_by(participant_id=participant_id).all()
            
            # Prepare data payload
            payload = {
                "event": "participant_progress",
                "timestamp": datetime.utcnow().isoformat(),
                "participant": {
                    "id": participant.id,
                    "user_id": participant.user_id,
                    "webinar_id": participant.webinar_id,
                    "webinar_title": webinar.title,
                    "enrollment_date": participant.enrollment_date.isoformat() if participant.enrollment_date else None,
                    "completion_status": participant.completion_status,
                    "current_day": participant.current_day,
                    "total_days": webinar.duration_days
                },
                "responses": [
                    {
                        "id": resp.id,
                        "day_id": resp.day_id,
                        "question_id": resp.question_id,
                        "response_text": resp.response_text,
                        "response_timestamp": resp.response_timestamp.isoformat() if resp.response_timestamp else None
                    }
                    for resp in responses
                ],
                "progress_percentage": (participant.current_day / webinar.duration_days) * 100 if webinar.duration_days else 0
            }
            
            # Send to n8n
            if self.n8n_webhook_url:
                response = requests.post(
                    self.n8n_webhook_url,
                    headers=self.headers,
                    data=json.dumps(payload),
                    timeout=30
                )
                response.raise_for_status()
                print(f"Successfully sent progress data for participant {participant_id}")
                return True
            else:
                print("n8n webhook URL not configured")
                return False
                
        except Exception as e:
            print(f"Error sending participant progress to n8n: {e}")
            return False
        finally:
            session.close()
    
    def send_completion_event(self, participant_id: int) -> bool:
        """
        Send webinar completion event to n8n
        
        Args:
            participant_id: ID of the participant
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            session = self.Session()
            
            # Get participant data
            participant = session.query(Participant).filter_by(id=participant_id).first()
            if not participant:
                print(f"Participant with ID {participant_id} not found")
                return False
            
            # Get webinar data
            webinar = session.query(Webinar).filter_by(id=participant.webinar_id).first()
            if not webinar:
                print(f"Webinar with ID {participant.webinar_id} not found")
                return False
            
            # Prepare data payload
            payload = {
                "event": "webinar_completion",
                "timestamp": datetime.utcnow().isoformat(),
                "participant": {
                    "id": participant.id,
                    "user_id": participant.user_id,
                    "webinar_id": participant.webinar_id,
                    "webinar_title": webinar.title,
                    "enrollment_date": participant.enrollment_date.isoformat() if participant.enrollment_date else None,
                    "completion_date": datetime.utcnow().isoformat(),
                    "total_days": webinar.duration_days
                }
            }
            
            # Send to n8n
            if self.n8n_webhook_url:
                response = requests.post(
                    self.n8n_webhook_url,
                    headers=self.headers,
                    data=json.dumps(payload),
                    timeout=30
                )
                response.raise_for_status()
                print(f"Successfully sent completion event for participant {participant_id}")
                return True
            else:
                print("n8n webhook URL not configured")
                return False
                
        except Exception as e:
            print(f"Error sending completion event to n8n: {e}")
            return False
        finally:
            session.close()
    
    def receive_enrollment_data(self, enrollment_data: Dict[str, Any]) -> bool:
        """
        Receive enrollment data from n8n and create participant record
        
        Args:
            enrollment_data: Enrollment data from n8n
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            session = self.Session()
            
            # Extract data
            user_id = enrollment_data.get("user_id")
            webinar_id = enrollment_data.get("webinar_id")
            enrollment_date = enrollment_data.get("enrollment_date")
            
            if not user_id or not webinar_id:
                print("Missing required enrollment data")
                return False
            
            # Check if participant already exists
            existing_participant = session.query(Participant).filter_by(
                user_id=user_id, 
                webinar_id=webinar_id
            ).first()
            
            if existing_participant:
                print(f"Participant already enrolled in webinar {webinar_id}")
                return True
            
            # Create new participant
            participant = Participant(
                user_id=user_id,
                webinar_id=webinar_id,
                enrollment_date=datetime.fromisoformat(enrollment_date) if enrollment_date else datetime.utcnow(),
                completion_status="enrolled",
                current_day=1
            )
            
            session.add(participant)
            session.commit()
            session.refresh(participant)
            
            print(f"Successfully enrolled participant {participant.id} in webinar {webinar_id}")
            
            # Send confirmation back to n8n
            confirmation_payload = {
                "event": "enrollment_confirmation",
                "timestamp": datetime.utcnow().isoformat(),
                "participant_id": participant.id,
                "user_id": user_id,
                "webinar_id": webinar_id
            }
            
            if self.n8n_webhook_url:
                try:
                    response = requests.post(
                        self.n8n_webhook_url,
                        headers=self.headers,
                        data=json.dumps(confirmation_payload),
                        timeout=30
                    )
                    response.raise_for_status()
                except Exception as e:
                    print(f"Warning: Could not send enrollment confirmation to n8n: {e}")
            
            return True
            
        except Exception as e:
            print(f"Error receiving enrollment data from n8n: {e}")
            return False
        finally:
            session.close()
    
    def receive_content_update(self, content_data: Dict[str, Any]) -> bool:
        """
        Receive content updates from n8n
        
        Args:
            content_data: Content update data from n8n
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            session = self.Session()
            
            # Extract data
            webinar_id = content_data.get("webinar_id")
            day_number = content_data.get("day_number")
            updated_content = content_data.get("content")
            
            if not webinar_id or not day_number or not updated_content:
                print("Missing required content update data")
                return False
            
            # Find the webinar day
            webinar_day = session.query(WebinarDay).filter_by(
                webinar_id=webinar_id,
                day_number=day_number
            ).first()
            
            if not webinar_day:
                print(f"Webinar day {day_number} for webinar {webinar_id} not found")
                return False
            
            # Update content
            webinar_day.content = json.dumps(updated_content)
            webinar_day.updated_at = datetime.utcnow()
            
            session.commit()
            
            print(f"Successfully updated content for webinar {webinar_id}, day {day_number}")
            return True
            
        except Exception as e:
            print(f"Error receiving content update from n8n: {e}")
            return False
        finally:
            session.close()
    
    def send_daily_reminder_data(self) -> List[Dict]:
        """
        Get data for daily reminders to send to n8n
        
        Returns:
            List[Dict]: List of participant data for reminders
        """
        try:
            session = self.Session()
            
            # Get participants who need reminders (not completed, not on current day)
            participants = session.query(Participant).filter(
                Participant.completion_status != "completed"
            ).all()
            
            reminder_data = []
            for participant in participants:
                # Get webinar
                webinar = session.query(Webinar).filter_by(id=participant.webinar_id).first()
                if not webinar:
                    continue
                
                # Check if participant should receive reminder
                # (e.g., if they haven't responded in 24 hours)
                last_response = session.query(Response).filter_by(
                    participant_id=participant.id
                ).order_by(Response.response_timestamp.desc()).first()
                
                should_remind = False
                if not last_response:
                    # No responses yet, remind if enrolled more than 1 day ago
                    if (datetime.utcnow() - participant.enrollment_date).days >= 1:
                        should_remind = True
                else:
                    # Check if last response was more than 24 hours ago
                    if (datetime.utcnow() - last_response.response_timestamp).days >= 1:
                        should_remind = True
                
                if should_remind:
                    reminder_data.append({
                        "participant_id": participant.id,
                        "user_id": participant.user_id,
                        "webinar_id": participant.webinar_id,
                        "webinar_title": webinar.title,
                        "current_day": participant.current_day,
                        "completion_status": participant.completion_status
                    })
            
            return reminder_data
            
        except Exception as e:
            print(f"Error getting reminder data: {e}")
            return []
        finally:
            session.close()
    
    def update_participant_progress(self, participant_id: int, day_completed: int) -> bool:
        """
        Update participant progress based on data from n8n
        
        Args:
            participant_id: ID of the participant
            day_completed: Day that was completed
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            session = self.Session()
            
            # Get participant
            participant = session.query(Participant).filter_by(id=participant_id).first()
            if not participant:
                print(f"Participant with ID {participant_id} not found")
                return False
            
            # Get webinar
            webinar = session.query(Webinar).filter_by(id=participant.webinar_id).first()
            if not webinar:
                print(f"Webinar with ID {participant.webinar_id} not found")
                return False
            
            # Update progress
            if day_completed >= participant.current_day:
                participant.current_day = day_completed + 1
                
                # Check if webinar is completed
                if participant.current_day > webinar.duration_days:
                    participant.completion_status = "completed"
                    participant.current_day = webinar.duration_days
                    
                    # Send completion event
                    self.send_completion_event(participant_id)
                else:
                    participant.completion_status = "in_progress"
                
                participant.updated_at = datetime.utcnow()
                session.commit()
                
                print(f"Updated progress for participant {participant_id} to day {participant.current_day}")
                
                # Send progress update to n8n
                self.send_participant_progress(participant_id)
                
                return True
            
            return False
            
        except Exception as e:
            print(f"Error updating participant progress: {e}")
            return False
        finally:
            session.close()

# Example usage
if __name__ == "__main__":
    # Initialize integration
    n8n = N8nIntegration()
    
    # Example: Send participant progress
    # n8n.send_participant_progress(participant_id=1)
    
    # Example: Send completion event
    # n8n.send_completion_event(participant_id=1)
    
    # Example: Get reminder data
    # reminders = n8n.send_daily_reminder_data()
    # print(f"Found {len(reminders)} participants for reminders")
    
    print("n8n integration module ready")