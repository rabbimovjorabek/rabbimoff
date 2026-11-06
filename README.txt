KREDIT TO'LOVLARI — Netlify'ga joylash
=======================================

Bu papkada ilova (public/) va ma'lumotlarni saqlaydigan funksiya (netlify/functions/state.mjs) bor.
Ma'lumotlar Netlify Blobs'da saqlanadi, shuning uchun telefon, kompyuter, istalgan brauzerda bir xil ko'rinadi.

MUHIM: Netlify "Drop" (papkani sudrab tashlash) funksiyani ishga tushirmaydi.
Quyidagi ikki usuldan birini tanlang.

1-USUL: GitHub orqali (tavsiya etiladi)
  1. GitHub'da yangi repozitoriy oching va shu papkadagi hamma faylni yuklang
     (netlify.toml, package.json, public/, netlify/ — hammasi).
  2. app.netlify.com → "Add new site" → "Import an existing project" → GitHub → repozitoriyni tanlang.
     Sozlamalarni o'zgartirmang (netlify.toml o'zi ko'rsatadi) → "Deploy".
  3. 3-qadamga o'ting.

2-USUL: Netlify CLI (kompyuterda Node.js bo'lsa)
  1. Shu papkada terminal oching:
       npm install
       npx netlify-cli login
       npx netlify-cli deploy --prod
  2. Savollarda "Create & configure a new project" ni tanlang.

3. KALITNI QO'YISH (majburiy)
  Netlify'da sayt → "Site configuration" → "Environment variables" → "Add a variable":
     Key:   ACCESS_KEY
     Value: o'zingiz o'ylagan maxfiy so'z (masalan: Kredit-2026-xyz)
  Keyin "Deploys" → "Trigger deploy" → "Deploy site" (kalit kuchga kirishi uchun).

4. TELEFONDA
  Sayt manzilini Chrome'da oching → kalitni bir marta kiriting →
  ⋮ menyu → "Bosh ekranga qo'shish" / "Ilovani o'rnatish".

Kalitni bilmagan odam sayt manzilini topsa ham ma'lumotlaringizni ko'ra olmaydi.
