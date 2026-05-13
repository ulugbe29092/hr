# 🚀 LOCAL DEVELOPMENT SETUP

## Prerequisites
- Node.js 20+ (https://nodejs.org/)
- Docker Desktop (https://www.docker.com/products/docker-desktop/)
- Git

---

## 📦 QUICK START (5 minutes)

### 1️⃣ Start Database Services (Docker)
```bash
# Start PostgreSQL + Redis + Elasticsearch
docker-compose up -d postgres redis elasticsearch

# Check if services are running
docker ps
```

### 2️⃣ Install Backend Dependencies
```bash
cd backend
npm install
```

### 3️⃣ Start Backend Server
```bash
# Development mode with hot reload
npm run start:dev

# Backend will run on: http://localhost:3001
# API Docs (Swagger): http://localhost:3001/api/docs
```

### 4️⃣ Install Frontend Dependencies (New Terminal)
```bash
cd frontend
npm install
```

### 5️⃣ Start Frontend Server
```bash
npm run dev

# Frontend will run on: http://localhost:3000
```

---

## 🌐 Access URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Next.js App |
| **Backend API** | http://localhost:3001/api | NestJS API |
| **API Docs** | http://localhost:3001/api/docs | Swagger UI |
| **PostgreSQL** | localhost:5432 | Database |
| **Redis** | localhost:6379 | Cache |
| **Elasticsearch** | http://localhost:9200 | Search Engine |

---

## 🔑 Default Credentials

### Database
- **Host**: localhost
- **Port**: 5432
- **Database**: nexus_db
- **User**: nexus_user
- **Password**: nexus_secure_2024

### Redis
- **Host**: localhost
- **Port**: 6379
- **Password**: redis_secure_2024

### Test User (After Seeding)
- **Email**: admin@nexus.com
- **Password**: Admin123!

---

## 🛠️ Useful Commands

### Backend
```bash
# Development mode
npm run start:dev

# Build for production
npm run build

# Run production build
npm run start:prod

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format

# Generate migration
npm run migration:generate -- -n MigrationName

# Run migrations
npm run migration:run

# Seed database
npm run seed
```

### Frontend
```bash
# Development mode
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Type check
npm run type-check

# Lint
npm run lint
```

### Docker
```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d postgres

# Stop all services
docker-compose down

# View logs
docker-compose logs -f backend

# Restart service
docker-compose restart backend

# Remove all data (⚠️ WARNING: Deletes all data)
docker-compose down -v
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows - Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Kill process on port 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Database Connection Error
```bash
# Check if PostgreSQL is running
docker ps | findstr postgres

# Restart PostgreSQL
docker-compose restart postgres

# View PostgreSQL logs
docker-compose logs postgres
```

### Redis Connection Error
```bash
# Check if Redis is running
docker ps | findstr redis

# Restart Redis
docker-compose restart redis
```

### Frontend Build Error
```bash
# Clear Next.js cache
cd frontend
rmdir /s /q .next
npm run dev
```

### Backend Build Error
```bash
# Clear dist folder
cd backend
rmdir /s /q dist
npm run build
```

---

## 📝 Environment Variables

### Backend (.env)
- ✅ Already configured in `backend/.env`
- Database, Redis, JWT secrets are set

### Frontend (.env.local)
- ✅ Already configured in `frontend/.env.local`
- API URL: http://localhost:3001/api
- WebSocket URL: ws://localhost:3001

---

## 🎯 Development Workflow

1. **Start Docker services** (PostgreSQL, Redis, Elasticsearch)
2. **Start Backend** (`npm run start:dev` in backend folder)
3. **Start Frontend** (`npm run dev` in frontend folder)
4. **Open browser** → http://localhost:3000
5. **Make changes** → Hot reload automatically updates

---

## 🚢 Production Deployment

### Frontend (Vercel)
- ✅ Already deployed: https://staffiq.vercel.app
- Auto-deploys on push to `main` branch

### Backend (Railway.app)
- 📋 TODO: Deploy backend to Railway
- Environment variables need to be configured

---

## 📚 Tech Stack

### Backend
- **Framework**: NestJS 10
- **Database**: PostgreSQL 16
- **ORM**: TypeORM
- **Cache**: Redis 7
- **Search**: Elasticsearch 8
- **Auth**: JWT + OAuth2 (Google)
- **AI**: OpenAI GPT-4
- **WebSocket**: Socket.io

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI**: Tailwind CSS + Shadcn/ui
- **State**: Zustand + React Query
- **Animation**: Framer Motion + GSAP
- **Charts**: Recharts
- **Drag & Drop**: dnd-kit

---

## 🔐 Security Notes

- ⚠️ `.env` files contain development credentials
- ⚠️ DO NOT commit `.env` files to Git
- ⚠️ Change passwords in production
- ⚠️ Use strong JWT secrets in production

---

## 📞 Support

If you encounter any issues:
1. Check Docker services are running: `docker ps`
2. Check backend logs: `docker-compose logs backend`
3. Check frontend terminal for errors
4. Clear cache and restart services

---

**Happy Coding! 🎉**
