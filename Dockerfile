# Build frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY Frontend/package*.json ./
RUN npm ci
COPY Frontend/ ./
RUN npm run build

# Python backend
FROM python:3.11-slim AS backend
RUN apt-get update && apt-get install -y gcc g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ ./
COPY --from=frontend-builder /app/frontend/dist ./static

# Set environment variables directly in Dockerfile
ENV PYTHONPATH=/app
ENV MONGODB_URL=mongodb+srv://hamza:hamza@cluster0.n44j3.mongodb.net/risk_simulation
ENV DATABASE_NAME=risk_simulation
ENV SECRET_KEY=1q2w3e
ENV ALGORITHM=HS256
ENV ACCESS_TOKEN_EXPIRE_MINUTES=1440
ENV REFRESH_TOKEN_EXPIRE_DAYS=70
ENV BASE_URL=http://localhost:8000
ENV FRONTEND_URL=http://localhost:5173

RUN echo '#!/bin/bash\nexport PORT=${PORT:-8000}\npython -m uvicorn app.main:app --host 0.0.0.0 --port $PORT' > start.sh && chmod +x start.sh

EXPOSE 8000
CMD ["./start.sh"]