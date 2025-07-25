from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from app.routers import reading, listening, writing, speaking, images
from app.config import settings
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

app = FastAPI(
    title="CELPIP Trainer API",
    description="API for CELPIP exam preparation and practice",
    version="1.0.0",
    debug=settings.debug
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(reading.router, prefix="/reading", tags=["reading"])
app.include_router(listening.router, prefix="/listening", tags=["listening"])
app.include_router(writing.router, prefix="/writing", tags=["writing"])
app.include_router(speaking.router, prefix="/speaking", tags=["speaking"])
app.include_router(images.router, prefix="/images", tags=["images"])

@app.get("/")
async def root():
    return {"message": "CELPIP Trainer API is running"}

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "CELPIP Trainer API"}

@app.get("/api-doc", include_in_schema=False)
async def api_doc_stoplight():
    html_content = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>API documentation</title>
    </head>
    <body>
        <script src="https://unpkg.com/@stoplight/elements/web-components.min.js"></script>
        <link rel="stylesheet" href="https://unpkg.com/@stoplight/elements/styles.min.css">
            <elements-api
               apiDescriptionUrl="/openapi.json"
               router="hash"
               hideSchemas="true"
               layout="responsive"/>
    </body>
    </html>
    """

    return HTMLResponse(content=html_content)