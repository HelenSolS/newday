#!/usr/bin/env python3
"""
n8n Integration Endpoints for NewDay Platform

This module provides FastAPI endpoints for n8n integration,
enabling bidirectional data flow between the NewDay platform and n8n.
"""

from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import Dict, List, Optional, Any
import json
import os
from datetime import datetime

# Import our n8n integration module
from n8n_integration import N8nIntegration

# Create router
router = APIRouter(prefix="/api/n8n", tags=["n8n-integration"])

# Initialize n8n integration
n8n = N8nIntegration()

# Pydantic models for request/response validation
class EnrollmentData(BaseModel):
    user_id: int
    webinar_id: int
    enrollment_date: Optional[str] = None

class ContentUpdateData(BaseModel):
    webinar_id: int
    day_number: int
    content: Dict[str, Any]

class ProgressUpdateData(BaseModel):
    participant_id: int
    day_completed: int

class N8nWebhookData(BaseModel):
    event: str
    data: Dict[str, Any]

# API Key verification (simple implementation)
def verify_n8n_api_key(x_api_key: str = Header(None)) -> bool:
    """Verify n8n API key for protected endpoints"""
    expected_key = os.getenv("N8N_API_KEY")
    if not expected_key:
        # If no key is configured, allow access (development mode)
        return True
    
    if not x_api_key or x_api_key != expected_key:
        raise HTTPException(status_code=401, detail="Invalid or missing API key")
    
    return True

@router.post("/webhook", summary="Receive webhook from n8n")
async def receive_n8n_webhook(
    webhook_data: N8nWebhookData,
    api_key_verified: bool = Depends(verify_n8n_api_key)
):
    """
    Receive webhook data from n8n and process accordingly
    
    This endpoint handles various events from n8n:
    - enrollment_data: New participant enrollment
    - content_update: Content updates for webinars
    - progress_update: Participant progress updates
    """
    try:
        event_type = webhook_data.event
        data = webhook_data.data
        
        if event_type == "enrollment_data":
            enrollment = EnrollmentData(**data)
            success = n8n.receive_enrollment_data(enrollment.dict())
            if success:
                return {"status": "success", "message": "Enrollment processed"}
            else:
                raise HTTPException(status_code=400, detail="Failed to process enrollment")
        
        elif event_type == "content_update":
            content_update = ContentUpdateData(**data)
            success = n8n.receive_content_update(content_update.dict())
            if success:
                return {"status": "success", "message": "Content update processed"}
            else:
                raise HTTPException(status_code=400, detail="Failed to process content update")
        
        elif event_type == "progress_update":
            progress_update = ProgressUpdateData(**data)
            success = n8n.update_participant_progress(
                progress_update.participant_id,
                progress_update.day_completed
            )
            if success:
                return {"status": "success", "message": "Progress update processed"}
            else:
                raise HTTPException(status_code=400, detail="Failed to process progress update")
        
        else:
            raise HTTPException(status_code=400, detail=f"Unknown event type: {event_type}")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing webhook: {str(e)}")

@router.post("/enroll", summary="Enroll participant via n8n")
async def enroll_participant(
    enrollment_data: EnrollmentData,
    api_key_verified: bool = Depends(verify_n8n_api_key)
):
    """
    Enroll a participant in a webinar based on data from n8n
    """
    try:
        success = n8n.receive_enrollment_data(enrollment_data.dict())
        if success:
            return {"status": "success", "message": "Participant enrolled"}
        else:
            raise HTTPException(status_code=400, detail="Failed to enroll participant")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error enrolling participant: {str(e)}")

@router.post("/update-content", summary="Update webinar content via n8n")
async def update_content(
    content_data: ContentUpdateData,
    api_key_verified: bool = Depends(verify_n8n_api_key)
):
    """
    Update webinar content based on data from n8n
    """
    try:
        success = n8n.receive_content_update(content_data.dict())
        if success:
            return {"status": "success", "message": "Content updated"}
        else:
            raise HTTPException(status_code=400, detail="Failed to update content")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating content: {str(e)}")

@router.post("/update-progress", summary="Update participant progress via n8n")
async def update_progress(
    progress_data: ProgressUpdateData,
    api_key_verified: bool = Depends(verify_n8n_api_key)
):
    """
    Update participant progress based on data from n8n
    """
    try:
        success = n8n.update_participant_progress(
            progress_data.participant_id,
            progress_data.day_completed
        )
        if success:
            return {"status": "success", "message": "Progress updated"}
        else:
            raise HTTPException(status_code=400, detail="Failed to update progress")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating progress: {str(e)}")

@router.get("/reminders", summary="Get reminder data for n8n")
async def get_reminder_data(
    api_key_verified: bool = Depends(verify_n8n_api_key)
):
    """
    Get participant data for sending reminders via n8n
    """
    try:
        reminder_data = n8n.send_daily_reminder_data()
        return {
            "status": "success",
            "count": len(reminder_data),
            "reminders": reminder_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting reminder data: {str(e)}")

@router.post("/send-progress/{participant_id}", summary="Send participant progress to n8n")
async def send_progress(
    participant_id: int,
    api_key_verified: bool = Depends(verify_n8n_api_key)
):
    """
    Send participant progress data to n8n
    """
    try:
        success = n8n.send_participant_progress(participant_id)
        if success:
            return {"status": "success", "message": "Progress data sent to n8n"}
        else:
            raise HTTPException(status_code=400, detail="Failed to send progress data")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error sending progress data: {str(e)}")

@router.post("/send-completion/{participant_id}", summary="Send completion event to n8n")
async def send_completion(
    participant_id: int,
    api_key_verified: bool = Depends(verify_n8n_api_key)
):
    """
    Send webinar completion event to n8n
    """
    try:
        success = n8n.send_completion_event(participant_id)
        if success:
            return {"status": "success", "message": "Completion event sent to n8n"}
        else:
            raise HTTPException(status_code=400, detail="Failed to send completion event")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error sending completion event: {str(e)}")

# Health check endpoint
@router.get("/health", summary="n8n integration health check")
async def health_check():
    """
    Check if n8n integration is working properly
    """
    return {
        "status": "ok",
        "service": "n8n-integration",
        "timestamp": datetime.utcnow().isoformat(),
        "n8n_webhook_configured": bool(n8n.n8n_webhook_url),
        "n8n_api_key_configured": bool(n8n.n8n_api_key)
    }