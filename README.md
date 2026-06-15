# ระบบแจ้งซ่อมออนไลน์ (Hotel Maintenance Desk)

ระบบแจ้งซ่อมงานช่าง & ไอที สำหรับโรงแรม 7 สาขา รองรับ 2 ภาษา (ไทย/อังกฤษ)
สร้างด้วย React + Vite

> **หมายเหตุสำคัญ:** เวอร์ชันนี้เก็บข้อมูลใน `localStorage` ของเบราว์เซอร์
> (ข้อมูลอยู่เฉพาะในเครื่อง/เบราว์เซอร์นั้น ๆ ไม่แชร์ข้ามอุปกรณ์)
> เหมาะสำหรับ **เดโม / นำเสนอ** ก่อนต่อ backend จริง

---

## บัญชีทดลอง (รหัสผ่านทุกบัญชี = 1234)

| Username | บทบาท |
|----------|-------|
| front1 / house1 | ผู้แจ้ง (ฟรอนต์ / แม่บ้าน) |
| tech1 | ช่าง · it1 ไอที |
| sup1 | หัวหน้าช่าง · supit1 หัวหน้าไอที |
| gm1 | ผู้จัดการ (เห็นทุกสาขา) |
| admin | ผู้ดูแลระบบ |

---

## วิธีรันบนเครื่อง

```bash
npm install
npm run dev      # เปิด http://localhost:5173
npm run build    # สร้างไฟล์ production ในโฟลเดอร์ dist/
```

---

## วิธี Deploy ขึ้น Netlify

### วิธีที่ 1 — ลากวางง่ายสุด (ไม่ต้องใช้ Git)
1. รัน `npm install && npm run build` บนเครื่อง จะได้โฟลเดอร์ `dist/`
2. เข้า https://app.netlify.com/drop
3. ลากโฟลเดอร์ `dist/` ทั้งโฟลเดอร์ไปวาง — เว็บขึ้นทันที

### วิธีที่ 2 — ผ่าน GitHub (อัปเดตอัตโนมัติ แนะนำ)
1. push โปรเจกต์นี้ขึ้น GitHub repo
2. Netlify → Add new site → Import an existing project → เลือก repo
3. Netlify จะอ่านค่าจาก `netlify.toml` ให้เอง:
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`
4. กด Deploy — ทุกครั้งที่ push จะ deploy ใหม่อัตโนมัติ

### วิธีที่ 3 — Netlify CLI
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

---

## โครงสร้างโปรเจกต์

```
hotel-fix/
├─ index.html          # โหลด Tailwind ผ่าน CDN
├─ netlify.toml        # ตั้งค่า build + SPA redirect
├─ vite.config.js
├─ package.json
└─ src/
   ├─ main.jsx         # entry
   └─ App.jsx          # ทั้งระบบอยู่ในไฟล์นี้
```

## ก้าวต่อไปสู่ระบบจริง
- ฐานข้อมูลจริง (PostgreSQL / Supabase) แทน localStorage
- ระบบล็อกอินปลอดภัย (hash รหัสผ่าน, JWT)
- เชื่อม LINE Messaging API สำหรับแจ้งเตือน
- สรุปรายวันส่งเข้า LINE กลุ่มอัตโนมัติ
