# 🔐 Vercel Environment Variables

## Hozirgi Sozlash (Backend yo'q)

### Variable 1:
```
Key: NEXT_PUBLIC_API_URL
Value: https://staffiq-api.railway.app/api
Environment: Production, Preview, Development
```

### Variable 2:
```
Key: NEXT_PUBLIC_WS_URL  
Value: wss://staffiq-api.railway.app
Environment: Production, Preview, Development
```

---

## ⚠️ Muhim Eslatma:

Bu URL'lar **placeholder** - backend hali deploy qilinmagan!

Frontend ishlaydi, lekin:
- ❌ Login ishlamaydi (backend yo'q)
- ❌ Ma'lumotlar yuklanmaydi (backend yo'q)
- ✅ UI ko'rinadi va ishlaydi

---

## 🚀 Backend Deploy Qilingandan Keyin:

1. Railway.app'da backend deploy qiling
2. Backend URL'ni oling (masalan: `https://your-app.railway.app`)
3. Vercel'da Environment Variables'ni yangilang:
   - `NEXT_PUBLIC_API_URL` = `https://your-app.railway.app/api`
   - `NEXT_PUBLIC_WS_URL` = `wss://your-app.railway.app`
4. Vercel'da Redeploy qiling

---

## 📝 Qanday Sozlash:

### Vercel Dashboard'da:

1. **Settings** → **Environment Variables**
2. **EXAMPLE_NAME** ni o'chiring (- tugma)
3. **Add More** tugmasini bosing
4. Yuqoridagi 2 ta variable'ni qo'shing
5. **Deploy** tugmasini bosing

---

## 🎯 To'liq Ishlashi Uchun Kerak:

### Backend (Railway.app):
- ✅ NestJS API
- ✅ PostgreSQL database
- ✅ Redis cache
- ✅ Environment variables

### Frontend (Vercel):
- ✅ Next.js app (tayyor)
- ✅ Environment variables (sozlash kerak)
- ✅ Domain (staffiq.vercel.app)

---

## 💡 Hozirgi Holat:

| Component | Status | URL |
|-----------|--------|-----|
| Frontend | ✅ Live | https://staffiq.vercel.app |
| Backend | ❌ Not deployed | - |
| Database | ❌ Not deployed | - |
| Full System | ⏳ Waiting for backend | - |

---

**Hozircha placeholder URL'lar bilan deploy qiling - UI ishlaydi!** 🎉
