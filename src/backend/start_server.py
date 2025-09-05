#!/usr/bin/env python3
"""
Simple server start script for NewDay Platform API
"""

import os
import sys
from fastapi import FastAPI
import uvicorn

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import the main app
from main import app

if __name__ == "__main__":
    print("Starting NewDay Platform API server...")
    print("Access the API at: http://localhost:8001")
    print("Health check endpoint: http://localhost:8001/health")
    print("Press Ctrl+C to stop the server")
    
    uvicorn.run(
        "main:app", 
        host="127.0.0.1", 
        port=8001, 
        reload=True,
        reload_dirs=["."]
    )