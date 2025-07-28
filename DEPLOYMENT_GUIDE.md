# CELPIP Trainer - Vercel Deployment Guide

This guide explains how to deploy both the frontend and backend of the CELPIP Trainer application to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI**: Install with `npm i -g vercel`
3. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, etc.)
4. **Environment Variables**: Have your API keys ready (especially GEMINI_API_KEY)

## Part 1: Frontend Deployment

### 1. Prepare Frontend for Deployment

The frontend is a React application that can be deployed directly to Vercel.

#### Configuration Files Created:
- ✅ `frontend/vercel.json` - Vercel configuration
- ✅ Frontend build scripts are ready in `package.json`

### 2. Deploy Frontend

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Connect Repository**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your Git repository
   - Select the `frontend` folder as the root directory

2. **Configure Build Settings**:
   ```
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install
   ```

3. **Set Environment Variables**:
   ```
   REACT_APP_API_URL = https://your-backend-url.vercel.app
   ```

4. **Deploy**: Click "Deploy"

#### Option B: Deploy via CLI

```bash
cd frontend
vercel login
vercel --prod
```

### 3. Frontend Deployment Notes

- **Custom Domain**: You can add a custom domain in Vercel dashboard
- **Environment Variables**: Set `REACT_APP_API_URL` to point to your backend URL
- **Automatic Deployments**: Vercel will auto-deploy on git pushes

## Part 2: Backend Deployment

### 1. Backend Configuration

The backend uses FastAPI and is configured to run as Vercel serverless functions.

#### Configuration Files Created:
- ✅ `backend/vercel.json` - Vercel serverless configuration
- ✅ `backend/main.py` - Updated for Vercel compatibility
- ✅ `backend/requirements.txt` - Python dependencies

### 2. Deploy Backend

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Create New Project**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your Git repository again (for backend)
   - Select the `backend` folder as the root directory

2. **Configure Build Settings**:
   ```
   Build Command: (leave empty)
   Output Directory: (leave empty)
   Install Command: pip install -r requirements.txt
   ```

3. **Set Environment Variables**:
   ```
   GEMINI_API_KEY = your_actual_gemini_api_key
   DEBUG = false
   HOST = 0.0.0.0
   PORT = 8000
   ```

4. **Deploy**: Click "Deploy"

#### Option B: Deploy via CLI

```bash
cd backend
vercel login
vercel --prod
```

### 3. Backend Deployment Notes

- **Serverless Functions**: Each API endpoint becomes a serverless function
- **Cold Starts**: First request may be slower due to cold start
- **Timeout**: Functions have a 60-second timeout limit (configurable)
- **Memory**: Default memory allocation is sufficient for most operations

## Part 3: Full Stack Configuration

### 1. Update Frontend API URL

After backend deployment, update the frontend's environment variable:

```bash
# In Vercel dashboard for frontend project
REACT_APP_API_URL = https://your-backend-url.vercel.app
```

### 2. CORS Configuration

The backend is already configured to handle CORS. The FastAPI app includes:

```python
# In app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 3. Environment Variables Summary

#### Frontend Environment Variables:
```
REACT_APP_API_URL = https://your-backend-url.vercel.app
```

#### Backend Environment Variables:
```
GEMINI_API_KEY = your_actual_gemini_api_key
DEBUG = false
HOST = 0.0.0.0
PORT = 8000
```

## Part 4: Domain Setup (Optional)

### 1. Custom Domains

You can add custom domains for both frontend and backend:

1. **Frontend**: `app.yourdomain.com`
2. **Backend**: `api.yourdomain.com`

### 2. Update API URL

If using custom domains, update the frontend environment variable:

```
REACT_APP_API_URL = https://api.yourdomain.com
```

## Part 5: Deployment Commands Summary

### Quick Deployment Steps:

1. **Deploy Backend**:
   ```bash
   cd backend
   vercel --prod
   # Note the deployed URL
   ```

2. **Deploy Frontend**:
   ```bash
   cd frontend
   # Update REACT_APP_API_URL in Vercel dashboard first
   vercel --prod
   ```

### Alternative: Single Repository Deployment

You can also deploy both as separate projects from the same repository by specifying the root directory in Vercel dashboard.

## Part 6: Monitoring and Logs

### 1. View Logs

```bash
vercel logs <deployment-url>
```

### 2. Function Performance

Monitor function performance in the Vercel dashboard:
- Cold start times
- Execution duration
- Memory usage
- Error rates

## Part 7: Production Considerations

### 1. Security

- **API Keys**: Never commit API keys to repository
- **CORS**: Configure specific origins in production
- **Rate Limiting**: Consider implementing rate limiting

### 2. Performance

- **Caching**: Vercel automatically caches static assets
- **CDN**: Global CDN distribution included
- **Function Optimization**: Keep functions lightweight

### 3. Costs

- **Free Tier**: Generous free tier available
- **Usage Monitoring**: Monitor function invocations and bandwidth
- **Scaling**: Automatic scaling included

## Troubleshooting

### Common Issues:

1. **Build Failures**: Check build logs in Vercel dashboard
2. **API Errors**: Verify environment variables are set correctly
3. **CORS Issues**: Ensure CORS is configured properly
4. **Cold Starts**: First request to functions may be slow

### Debug Commands:

```bash
# Check deployment status
vercel ls

# View logs
vercel logs <deployment-url>

# Check environment variables
vercel env ls
```

## Success!

After following these steps, you should have:

- ✅ Frontend deployed and accessible via URL
- ✅ Backend API deployed and functional
- ✅ Full stack application working together
- ✅ Automatic deployments on git pushes
- ✅ Global CDN distribution
- ✅ HTTPS enabled by default

Your CELPIP Trainer application is now live and ready for users!