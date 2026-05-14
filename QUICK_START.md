# 🚀 Quick Start Guide

## ⚠️ NPM Install Muammosi

Agar `npm install` juda sekin ishlasa yoki to'xtab qolsa:

### Yechim 1: Vercel Production Saytni Ishlatish (Tavsiya etiladi)

```
https://staffiq.vercel.app
```

✅ **Afzalliklari:**
- Juda tez (Vercel CDN)
- Barcha xatolar tuzatilgan
- Professional optimizatsiya
- Avtomatik deploy (GitHub push)

---

### Yechim 2: NPM Registry O'zgartirish

```bash
# Taobao mirror (Xitoy, tez)
npm config set registry https://registry.npmmirror.com

# Yoki Yarn ishlatish
npm install -g yarn
cd frontend
yarn install
yarn dev
```

---

### Yechim 3: Node Modules Arxivdan Yuklash

Agar internet juda sekin bo'lsa:

1. Boshqa kompyuterda `npm install` qiling
2. `node_modules` papkasini zip qiling
3. Shu kompyuterga ko'chiring
4. `frontend` papkasiga extract qiling
5. `npm run dev` ishga tushiring

---

### Yechim 4: Docker Ishlatish

```bash
# Docker Desktop o'rnatilgan bo'lishi kerak
docker-compose up frontend
```

---

## 🌐 Hozirgi Holat

### ✅ Production (Ishlayapti):
- **URL**: https://staffiq.vercel.app
- **Status**: Live
- **Deploy**: Avtomatik (GitHub)

### ❌ Local Development (Muammo):
- **Issue**: npm install timeout
- **Reason**: Sekin internet yoki npm registry
- **Solution**: Yuqoridagi yechimlardan birini tanlang

---

## 📝 Tavsiya

**Hozircha Vercel production saytni ishlatishni tavsiya qilamiz:**

1. ✅ Tez ishlaydi
2. ✅ Barcha xatolar tuzatilgan
3. ✅ Professional
4. ✅ Bepul hosting

**Backend deploy qilgandan keyin:**
- Railway.app'da backend deploy qiling
- Environment variables sozlang
- To'liq ishlaydigan sayt tayyor bo'ladi

---

## 🔧 NPM Registry Tezligini Tekshirish

```bash
# Current registry
npm config get registry

# Test download speed
npm install express --dry-run

# Change to faster mirror
npm config set registry https://registry.npmmirror.com
```

---

## 💡 Keyingi Qadamlar

1. **Backend Deploy** (Railway.app)
   ```bash
   cd backend
   # Railway CLI bilan deploy
   ```

2. **Environment Variables** (Vercel)
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
   NEXT_PUBLIC_WS_URL=wss://your-backend.railway.app
   ```

3. **Database Setup** (Railway)
   - PostgreSQL
   - Redis
   - Elasticsearch

---

**Hozir https://staffiq.vercel.app ni oching! 🎉**
