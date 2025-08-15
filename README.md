# 🛡️ RiskSim Enterprise - Risk Simulation Platform

A comprehensive enterprise risk management platform that provides Monte Carlo risk analysis, scenario modeling, and financial impact assessment for organizations.

![RiskSim Platform](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🎯 **Features**

### 📊 **Risk Analysis & Simulation**
- **Monte Carlo Analysis** - 10,000 iteration risk simulations
- **Scenario Modeling** - Interactive canvas for building risk scenarios
- **Real-time Analytics** - Live risk assessment and metrics
- **Financial Impact** - Revenue loss calculations and ROI analysis

### 🏢 **Business Management**
- **Location Tracking** - Monitor risk across business locations
- **Security Events** - Track incidents and their financial impact
- **Defense Systems** - Manage security investments and effectiveness
- **Financial Metrics** - Real-time profit/loss and cost analysis

### 📈 **Key Capabilities**
- ✅ Interactive risk scenario builder
- ✅ Real-time Monte Carlo simulations
- ✅ Financial impact assessment
- ✅ Security ROI calculations
- ✅ Multi-location risk monitoring
- ✅ Incident tracking and analysis
- ✅ Defense effectiveness metrics
- ✅ Comprehensive reporting

## 🏗️ **Architecture**

### **Frontend (React + Vite)**
- Modern React 18 with TypeScript support
- Tailwind CSS for responsive design
- Lucide React icons
- Recharts for data visualization
- React Router for navigation

### **Backend (FastAPI + Python)**
- FastAPI for high-performance API
- MongoDB for data persistence
- Pydantic for data validation
- NumPy/SciPy for Monte Carlo calculations
- Async/await for optimal performance

### **Database (MongoDB)**
- Document-based storage
- Real-time data synchronization
- Scalable architecture
- Cloud-ready deployment

## 🚀 **Quick Start**

### **Prerequisites**
```bash
# Required software
- Node.js 18+ and npm
- Python 3.9+
- MongoDB (local or cloud)
- Git
```

### **Installation**

#### 1. **Clone Repository**
```bash
git clone https://github.com/your-username/risksim-enterprise.git
cd risksim-enterprise
```

#### 2. **Backend Setup**
```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB URL
```

#### 3. **Frontend Setup**
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with API URL (default: http://localhost:8000/api)
```

### **Running the Application**

#### **Development Mode**
```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend
cd frontend
npm run dev
```

#### **Production Mode**
```bash
# Build frontend
cd frontend
npm run build

# Serve backend
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## 📁 **Project Structure**

```
risksim-enterprise/
├── frontend/                    # React application
│   ├── src/
│   │   ├── assets/             # Static assets
│   │   │   └── Hero1.jpg       # Hero image for public pages
│   │   ├── components/         # React components
│   │   │   ├── Auth/           # Authentication components
│   │   │   │   ├── Login.jsx   # Login page with Enterprise design
│   │   │   │   └── Register.jsx # Registration page
│   │   │   ├── Header.jsx      # Header for public pages
│   │   │   ├── Footer.jsx      # Footer for public pages
│   │   │   ├── Sidebar.jsx     # Sidebar for protected pages
│   │   │   ├── ProtectedRoute.jsx # Route protection
│   │   │   ├── Dashboard.jsx   # Main dashboard
│   │   │   ├── Scenarios.jsx   # Scenario management
│   │   │   ├── ScenarioCanvas.jsx # Interactive canvas
│   │   │   ├── Locations.jsx   # Business locations
│   │   │   ├── Events.jsx      # Security events
│   │   │   ├── Defenses.jsx    # Defense systems
│   │   │   └── Modals/         # Modal components
│   │   │       ├── AddBusinessAssetModal.jsx
│   │   │       ├── AddDefenseSystemModal.jsx
│   │   │       ├── AddRiskEventModal.jsx
│   │   │       ├── CreateScenarioModal.jsx
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Defenses.jsx
│   │   │       ├── Events.jsx
│   │   │       ├── Locations.jsx
│   │   │       ├── MonteCarloResults.jsx
│   │   │       ├── ProtectedRoute.jsx
│   │   │       ├── Scenarios.jsx
│   │   │       ├── ScenarioCanvas.jsx
│   │   │       └── Sidebar.jsx
│   │   ├── pages/              # Page components
│   │   │   └── Home.jsx        # Public home page with Enterprise design
│   │   ├── contexts/           # React contexts
│   │   │   └── AuthContext.jsx # Authentication context
│   │   ├── services/           # API services
│   │   │   └── api.js          # API service functions
│   │   ├── utils/              # Utility functions
│   │   └── App.jsx            # Main app component with routing
│   ├── public/
│   │   └── index.html         # HTML template with html2canvas CDN
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── backend/                     # FastAPI application
│   ├── app/
│   │   ├── models/             # Pydantic models
│   │   │   ├── scenario.py
│   │   │   ├── risk_event.py
│   │   │   ├── business_asset.py
│   │   │   ├── defense_system.py
│   │   │   ├── location.py
│   │   │   ├── event.py
│   │   │   ├── defense.py
│   │   │   └── user.py         # User authentication models
│   │   ├── routes/             # API routes
│   │   │   ├── scenarios.py
│   │   │   ├── analysis.py
│   │   │   ├── locations.py
│   │   │   ├── events.py
│   │   │   ├── defenses.py
│   │   │   └── auth.py         # Authentication routes
│   │   ├── services/           # Business logic
│   │   │   ├── database.py
│   │   │   ├── monte_carlo.py
│   │   │   └── auth_service.py # Authentication service
│   │   └── main.py            # FastAPI app
│   ├── requirements.txt
│   └── .env
└── README.md



## 🎮 **Usage Guide**

### **1. Dashboard Overview**
- View organization-wide risk metrics
- Monitor recent scenarios and incidents
- Track defense effectiveness
- Analyze risk distribution

### **2. Creating Risk Scenarios**
```bash
1. Navigate to Scenarios page
2. Click "New Scenario"
3. Add scenario name and description
4. Open scenario in canvas
5. Add risk events, business assets, and defenses
6. Run Monte Carlo analysis
```

### **3. Managing Business Locations**
- Add/edit business locations
- Track financial performance per location
- Monitor security incidents by location
- Analyze risk scores and trends

### **4. Security Event Tracking**
- Record security incidents
- Calculate financial impact
- Track recovery times
- Analyze incident patterns

### **5. Defense System Management**
- Add security investments
- Track ROI and effectiveness
- Monitor threat prevention
- Calculate cost-benefit ratios

## 🔧 **Configuration**

### **Environment Variables**

#### **Backend (.env)**
```env
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/
DATABASE_NAME=risk_simulation
```

#### **Frontend (.env)**
```env
VITE_API_URL=http://localhost:8000/api
```

### **Database Setup**
```bash
# Local MongoDB
mongod --dbpath /path/to/data/directory

# MongoDB Atlas (Cloud)
# Use connection string in MONGODB_URL
```

## 📊 **API Documentation**

### **Core Endpoints**
```bash
# Scenarios
GET    /api/scenarios                 # List all scenarios
POST   /api/scenarios                 # Create scenario
GET    /api/scenarios/{id}            # Get scenario
PUT    /api/scenarios/{id}            # Update scenario
DELETE /api/scenarios/{id}            # Delete scenario

# Risk Analysis
POST   /api/scenarios/{id}/run-analysis  # Run Monte Carlo

# Business Data
GET    /api/locations                 # Business locations
GET    /api/events                    # Security events
GET    /api/defenses                  # Defense systems
```

### **Response Format**
```json
{
  "data": [...],
  "message": "Success",
  "timestamp": "2024-03-15T10:30:00Z"
}
```

## 🧪 **Testing**

### **Backend Tests**
```bash
cd backend
pytest tests/ -v
```

### **Frontend Tests**
```bash
cd frontend
npm test
```

### **API Testing**
```bash
# Test endpoints with curl
curl http://localhost:8000/api/scenarios
curl http://localhost:8000/docs  # Interactive API docs
```

## 🚀 **Deployment**

### **Docker Deployment**
```bash
# Build containers
docker-compose build

# Run application
docker-compose up -d
```

### **Cloud Deployment**
```bash
# Frontend (Vercel/Netlify)
npm run build
# Deploy dist/ folder

# Backend (Heroku/Railway/DigitalOcean)
# Use Dockerfile or requirements.txt
```

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### **Development Guidelines**
- Follow PEP 8 for Python code
- Use ESLint/Prettier for JavaScript
- Write tests for new features
- Update documentation

## 📝 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 **Support**

### **Common Issues**

#### **Backend won't start**
```bash
# Check Python version
python --version  # Should be 3.9+

# Check dependencies
pip install -r requirements.txt

# Check MongoDB connection
# Verify MONGODB_URL in .env
```

#### **Frontend API errors**
```bash
# Check backend is running
curl http://localhost:8000

# Verify API URL in frontend/.env
VITE_API_URL=http://localhost:8000/api

# Check CORS settings in backend
```

#### **Port conflicts**
```bash
# Backend already running on 8000
netstat -ano | findstr :8000

# Use different port
uvicorn app.main:app --port 8001
```
