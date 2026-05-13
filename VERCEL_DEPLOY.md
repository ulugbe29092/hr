# 🚀 Vercel Deployment Guide

## ✅ Production Checklist

### 1. Connect Git Repository
- ✅ Repository: https://github.com/ulugbe29092/hr
- ✅ Branch: main
- ✅ Auto-deploy: Enabled

### 2. Environment Variables
Go to Vercel Dashboard → Settings → Environment Variables

**Required Variables:**
```env
NEXT_PUBLIC_API_URL=https://your-backend-api.railway.app/api
NEXT_PUBLIC_WS_URL=wss://your-backend-api.railway.app
```

**For Development (Optional):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

### 3. Build Settings
- ✅ Framework Preset: Next.js
- ✅ Root Directory: `frontend`
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `.next`
- ✅ Install Command: `npm install`

### 4. Domain Settings
- ✅ Production Domain: staffiq.vercel.app
- 🔄 Custom Domain: (Optional) your-domain.com

### 5. Performance Settings
- ✅ Enable Speed Insights
- ✅ Enable Web Analytics
- ✅ Enable Edge Functions (if needed)

---

## 🔧 Current Deploy Error Fix

### Error: "No Production Deployment"
**Reason:** Production domain not serving traffic

**Solution:**
1. Go to Vercel Dashboard
2. Click on "Deployments" tab
3. Find the latest successful deployment
4. Click "..." menu → "Promote to Production"

OR

1. Go to "Settings" → "Domains"
2. Make sure `staffiq.vercel.app` is set as Production domain
3. Redeploy from "Deployments" tab

---

## 📝 Deployment Steps

### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "fix: remove Redux provider, optimize for production"
git push origin main
```

### Step 2: Vercel Auto-Deploy
- Vercel automatically detects push
- Starts build process
- Deploys to production

### Step 3: Check Deployment Status
- Go to: https://vercel.com/ulugbe29092-7612/projects
- Click on your project
- Check "Deployments" tab
- Wait for "Ready" status

### Step 4: Visit Production URL
- https://staffiq.vercel.app

---

## 🐛 Troubleshooting

### Build Failed
1. Check build logs in Vercel dashboard
2. Fix TypeScript errors locally first
3. Test build locally: `npm run build`
4. Push fixes to GitHub

### Environment Variables Not Working
1. Make sure variables start with `NEXT_PUBLIC_`
2. Redeploy after adding variables
3. Check variable names (case-sensitive)

### Domain Not Working
1. Check DNS settings
2. Wait for DNS propagation (up to 48 hours)
3. Use Vercel's default domain first

### Slow Performance
1. Enable Speed Insights
2. Check bundle size: `npm run analyze`
3. Optimize images
4. Use dynamic imports for large components

---

## 📊 Monitoring

### Analytics
- Go to Vercel Dashboard → Analytics
- Track page views, performance, errors

### Logs
- Go to Vercel Dashboard → Logs
- Real-time server logs
- Error tracking

### Speed Insights
- Go to Vercel Dashboard → Speed Insights
- Core Web Vitals
- Performance metrics

---

## 🔄 Redeploy

### Manual Redeploy
1. Go to Vercel Dashboard
2. Click "Deployments" tab
3. Click "..." on latest deployment
4. Click "Redeploy"

### Automatic Redeploy
- Push to `main` branch
- Vercel auto-deploys

---

## 🎯 Next Steps

1. ✅ Fix Redux error (Done)
2. 🔄 Deploy to Vercel
3. ⏳ Wait for build (2-3 minutes)
4. ✅ Check production URL
5. 🚀 Backend deployment (Railway.app)

---

**Current Status:** Fixing Redux error, ready to deploy
