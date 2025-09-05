from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

# Import the n8n endpoints
from n8n_endpoints import router as n8n_router
# Import the course endpoints
from course_endpoints import router as course_router

app = FastAPI(
    title="NewDay Platform API",
    description="API for the NewDay Platform with n8n integration",
    version="1.0.0"
)

# CORS configuration
origins = os.getenv("ALLOWED_ORIGINS", "").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include n8n integration routes
app.include_router(n8n_router)
# Include course management routes
app.include_router(course_router)

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.get("/")
async def root():
    return {"message": "Welcome to NewDay Platform API"}

# Database population endpoint
@app.post("/populate-database")
async def populate_database():
    """Populate the database with webinar content"""
    try:
        # Import and run the population script
        from populate_database import populate_webinar_content
        populate_webinar_content()
        return {"status": "success", "message": "Database populated with webinar content"}
    except Exception as e:
        return {"status": "error", "message": f"Failed to populate database: {str(e)}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=True)