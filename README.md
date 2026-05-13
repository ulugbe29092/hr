# 🚀 NEXUS Platform — Universal ERP + CRM + HR + AI

**Professional Enterprise Management System**

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-red)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-red)](https://redis.io/)

---

## 📋 Features

### 🏢 ERP (Enterprise Resource Planning)
- **Finance Management**: Income, Expenses, Invoicing, Tax Calculation
- **Inventory Management**: Stock Tracking, Movements, Low Stock Alerts
- **Procurement**: Purchase Orders, Supplier Management
- **Reporting**: Financial Reports, Analytics Dashboard

### 👥 CRM (Customer Relationship Management)
- **Client Management**: Contact Database, Company Profiles
- **Sales Pipeline**: Kanban Board, Deal Tracking, Stage Management
- **Lead Management**: Lead Scoring, Conversion Tracking
- **Communication History**: Email, Calls, Meetings Log

### 👨‍💼 HRM (Human Resource Management)
- **Employee Management**: Profiles, Departments, Positions
- **Attendance System**: QR Code, GPS, Face ID Check-in
- **Payroll**: Salary Calculation, Tax Deduction, Bonuses
- **Leave Management**: Vacation, Sick Leave, Balance Tracking
- **Recruitment**: Job Postings, CV Analysis (AI-powered)

### 🤖 AI Agents
- **HR Agent**: Employee queries, policy assistance
- **Sales Agent**: Lead qualification, deal insights
- **Finance Agent**: Budget analysis, expense optimization
- **Analytics Agent**: Data insights, trend prediction

### 📊 Analytics & Reporting
- **Real-time Dashboards**: KPIs, Charts, Metrics
- **Custom Reports**: Export to Excel, PDF
- **Data Visualization**: Recharts, Heatmaps, Radar Charts

---

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS 10 (Node.js)
- **Database**: PostgreSQL 16 + TypeORM
- **Cache**: Redis 7
- **Search**: Elasticsearch 8
- **Auth**: JWT + OAuth2 (Google) + 2FA
- **AI**: OpenAI GPT-4
- **WebSocket**: Socket.io (Real-time)
- **Queue**: Bull (Background Jobs)

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.3
- **Styling**: Tailwind CSS + Shadcn/ui
- **State Management**: Zustand + React Query
- **Animation**: Framer Motion + GSAP
- **Charts**: Recharts
- **Drag & Drop**: dnd-kit
- **Forms**: React Hook Form + Zod

### DevOps
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Reverse Proxy**: Nginx
- **Deployment**: Vercel (Frontend) + Railway (Backend)

---

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)
```bash
# Double-click this file:
start-dev.bat
```

### Option 2: Manual Setup

#### 1. Start Docker Services
```bash
docker-compose up -d postgres redis elasticsearch
```

#### 2. Start Backend
```bash
cd backend
npm install
npm run start:dev
```

#### 3. Start Frontend (New Terminal)
```bash
cd frontend
npm install
npm run dev
```

#### 4. Open Browser
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api
- API Docs: http://localhost:3001/api/docs

---

## 📚 Documentation

- **[Local Setup Guide](LOCAL_SETUP.md)** — Complete development setup
- **[Project Overview](PROJECT.md)** — Architecture & features
- **[TODO List](TODO.md)** — Roadmap & tasks
- **[Skills Guide](SKILL.md)** — Development guidelines

---

## 🌐 Live Demo

- **Frontend**: https://staffiq.vercel.app
- **Backend**: Coming soon (Railway deployment)

---

## 📁 Project Structure

```
profisianal/
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── modules/        # Feature modules
│   │   ├── common/         # Shared utilities
│   │   ├── config/         # Configuration
│   │   └── main.ts         # Entry point
│   ├── database/           # SQL migrations
│   └── package.json
│
├── frontend/               # Next.js Frontend
│   ├── src/
│   │   ├── app/           # Pages (App Router)
│   │   ├── components/    # UI Components
│   │   ├── lib/           # Utilities
│   │   └── styles/        # Global styles
│   └── package.json
│
├── docker-compose.yml      # Docker services
├── start-dev.bat          # Quick start script
├── stop-dev.bat           # Stop all services
└── README.md              # This file
```

---

## 🔑 Default Credentials

### Test User (After Seeding)
- **Email**: admin@nexus.com
- **Password**: Admin123!

### Database
- **Host**: localhost:5432
- **Database**: nexus_db
- **User**: nexus_user
- **Password**: nexus_secure_2024

---

## 🛠️ Development Commands

### Backend
```bash
npm run start:dev      # Development mode
npm run build          # Build for production
npm run start:prod     # Run production build
npm run test           # Run tests
npm run lint           # Lint code
```

### Frontend
```bash
npm run dev            # Development mode
npm run build          # Build for production
npm run start          # Run production build
npm run type-check     # TypeScript check
```

### Docker
```bash
docker-compose up -d           # Start all services
docker-compose down            # Stop all services
docker-compose logs -f backend # View logs
docker-compose restart backend # Restart service
```

---

## 📦 Modules

### Backend Modules
- ✅ Auth (JWT + OAuth2 + 2FA)
- ✅ Employees
- ✅ Attendance (QR/GPS/Face ID)
- ✅ Payroll
- ✅ Leave Management
- ✅ Clients
- ✅ Sales Pipeline
- ✅ Finance
- ✅ Inventory
- ✅ Recruitment (AI CV Analysis)
- ✅ AI Agents (4 agents)
- ✅ Analytics
- ✅ Notifications
- ✅ Audit Logs

### Frontend Pages
- ✅ Login (Glassmorphism UI)
- ✅ Dashboard (Real-time Charts)
- ✅ Employees (Table + Modal)
- ✅ Attendance (Calendar View)
- ✅ Payroll (Salary Management)
- ✅ Clients (Card Grid)
- ✅ Sales (Kanban Board)
- ✅ Finance (Charts + Transactions)
- ✅ Inventory (Stock Management)
- ✅ Recruitment (AI Resume Analyzer)
- ✅ AI Chat (4 Agents)
- ✅ Analytics (Advanced Charts)
- ✅ Tasks (Kanban Board)

---

## 🔐 Security Features

- ✅ JWT Authentication
- ✅ OAuth2 (Google Login)
- ✅ Two-Factor Authentication (2FA)
- ✅ OTP Verification
- ✅ Password Hashing (bcrypt)
- ✅ Rate Limiting
- ✅ CORS Protection
- ✅ Helmet Security Headers
- ✅ Input Validation
- ✅ SQL Injection Prevention
- ✅ XSS Protection

---

## 🚢 Deployment

### Frontend (Vercel)
```bash
# Already deployed
https://staffiq.vercel.app
```

### Backend (Railway.app)
```bash
# Coming soon
# Environment variables need to be configured
```

---

## 📊 Performance

- ⚡ Server-Side Rendering (SSR)
- ⚡ Static Site Generation (SSG)
- ⚡ Redis Caching
- ⚡ Database Indexing
- ⚡ Code Splitting
- ⚡ Image Optimization
- ⚡ Lazy Loading

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is proprietary and confidential.

---

## 👨‍💻 Author

**NEXUS Team**

---

## 📞 Support

For issues and questions:
- GitHub Issues: https://github.com/ulugbe29092/hr/issues
- Email: support@nexus.com

---

**Built with ❤️ using Next.js, NestJS, and TypeScript**
