# Sandy's Lab AI Layer

## Backend Integration (Already Done ✅)
AI routes are in: `BACKEND/src/routes/ai.routes.js`

### Endpoints:
- POST /api/v1/ai/research → AI research assistance
- POST /api/v1/ai/analyze → Data analysis
- POST /api/v1/ai/generate-task → Task generation
- GET /api/v1/ai/logs → View AI activity

### Setup:
1. Add OpenAI key to BACKEND/.env:
   OPENAI_API_KEY=your_key_here

2. Start backend:
   cd BACKEND && npm install && node src/index.js

3. Frontend auto-connects via api.js

## Optional: Python AI Scripts
Put advanced ML scripts here if needed.
