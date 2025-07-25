# CELPIP Trainer

A full-stack web application for CELPIP (Canadian English Language Proficiency Index Program) exam preparation, featuring realistic practice tests that replicate the actual CELPIP exam experience.

## Features

- **Interactive Dashboard**: Practice CELPIP exam with realistic problems and comprehensive skills testing
- **Reading Task 1**: Complete implementation with correspondence-based passages and 11 multiple-choice questions
- **AI-Powered Content**: Generate realistic CELPIP content using Google Gemini AI
- **Realistic Test Experience**: 11-minute timer, question navigation, and detailed results
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Frontend**: React with TypeScript, Tailwind CSS
- **Backend**: FastAPI (Python) with Google Gemini API integration
- **Deployment**: Docker and Docker Compose
- **Package Management**: uv for Python dependencies, npm for Node.js

## Quick Start with Docker

### Prerequisites

- Docker and Docker Compose installed
- Google Gemini API key (get one from [Google AI Studio](https://aistudio.google.com/app/apikey))

### 1. Clone and Setup Environment

```bash
git clone <repository-url>
cd celpip-trainer-v2

# Copy environment file and add your API key
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### 2. Deploy with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up --build -d
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

### 4. Stop the Application

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## Manual Development Setup

### Backend Setup

```bash
cd backend

# Install uv (if not already installed)
pip install uv

# Install dependencies
uv sync

# Create .env file with your Gemini API key
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Run development server
uv run python main.py
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

## API Endpoints

### Reading Task 1
- `POST /api/reading/task1/generate` - Generate a new Reading Task 1
- `GET /api/reading/health` - Check Gemini API connectivity

### General
- `GET /health` - Application health check
- `GET /docs` - Interactive API documentation

## Environment Variables

### Backend (.env)
```env
GEMINI_API_KEY=your_gemini_api_key_here
DEBUG=false
HOST=0.0.0.0
PORT=8000
```

### Frontend
```env
REACT_APP_API_URL=http://localhost:8000
```

## Project Structure

```
celpip-trainer-v2/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── models/         # Pydantic models
│   │   ├── routers/        # API routes
│   │   ├── services/       # Business logic
│   │   └── main.py         # FastAPI app
│   ├── Dockerfile
│   └── pyproject.toml
├── frontend/               # React TypeScript frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   └── App.tsx
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml      # Docker orchestration
└── README.md
```

## CELPIP Reading Task 1 Format

The Reading Task 1 implementation follows the official CELPIP format:

- **Part 1 (Questions 1-6)**: Comprehension questions about the original correspondence
- **Part 2 (Questions 7-11)**: Complete blanks in a reply message
- **Time Limit**: 11 minutes
- **Question Types**: Multiple choice (A, B, C, D)
- **Content**: Realistic Canadian correspondence scenarios

## Development

### Adding New Features

1. **Backend**: Add new routes in `backend/app/routers/`
2. **Frontend**: Add new components in `frontend/src/components/`
3. **Models**: Define data structures in `backend/app/models/`
4. **Services**: Implement business logic in `backend/app/services/`

### Testing

```bash
# Backend tests
cd backend
uv run pytest

# Frontend tests  
cd frontend
npm test
```

### Linting and Type Checking

```bash
# Backend
cd backend
uv run ruff check
uv run mypy .

# Frontend
cd frontend
npm run lint
npm run type-check
```

## Deployment

The application is containerized and ready for deployment on any platform that supports Docker:

- **Local Development**: Docker Compose
- **Cloud Platforms**: Deploy to AWS ECS, Google Cloud Run, Azure Container Instances
- **Kubernetes**: Use the Dockerfiles to create Kubernetes deployments

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is for educational purposes and CELPIP exam preparation.