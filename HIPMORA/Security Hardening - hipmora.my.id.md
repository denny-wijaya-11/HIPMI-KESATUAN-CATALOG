---
tags:
  - hipmora
  - security
  - hardening
  - agent-rules
status: aktif
related:
  - "[[Maintenance Agent Guide - hipmora.my.id]]"
  - "[[API Route Map - hipmora.my.id]]"
  - "[[Auth and Session Security - hipmora.my.id]]"
---
# Security Hardening - hipmora.my.id

Catatan ini wajib dibaca agent sebelum mengubah kode yang menyentuh API, auth, input user, database, checkout, tenant, admin, atau deployment. Prioritas utama: aman dulu, baru cepat.

## Aturan Utama untuk Agent
- Jangan asal mengubah file penting tanpa membaca file terkait dan alur datanya.
- Jangan menonaktifkan validasi, auth, role check, middleware, rate limit, atau error handling demi membuat bug cepat hilang.
- Jangan memasukkan secret ke kode, log, commit, catatan publik, atau response API.
- Jangan memakai `dangerouslySetInnerHTML` kecuali benar-benar perlu dan input sudah disanitasi.
- Jangan mengubah konfigurasi deployment, domain, DNS, environment variable, atau cache production tanpa konfirmasi denny.
- Jika ragu antara solusi cepat dan aman, pilih aman lalu jelaskan trade-off ke user.

## Checklist Anti Injection
- [ ] Semua input dari body, query, params, cookie, dan header divalidasi sebelum dipakai.
- [ ] Query database tidak memakai input mentah tanpa validasi tipe dan ownership.
- [ ] Update/delete selalu cek user, role, tenant, atau ownership.
- [ ] Jangan expose filter database yang bisa dimanipulasi user secara bebas.
- [ ] Error database tidak dikirim mentah ke client.

## Checklist Anti XSS
- [ ] Jangan render HTML dari user tanpa sanitasi.
- [ ] Escape output teks di UI; biarkan React menangani string biasa.
- [ ] Sanitasi field seperti nama produk, deskripsi, profile, pesan chat, alamat, dan konten tenant jika dapat berisi markup.
- [ ] Hindari menyimpan token atau data sensitif di `localStorage` jika bisa memakai cookie aman.
- [ ] Jika menambah rich text, tentukan library sanitasi dan whitelist tag yang aman.

## Checklist Anti Brute Force dan Abuse
- [ ] Login, register, forgot password, resend verification, checkout, dan endpoint sensitif perlu rate limit.
- [ ] Jangan bocorkan apakah email/user tertentu terdaftar lewat pesan error yang terlalu spesifik.
- [ ] Tambahkan delay, lockout sementara, captcha, atau proteksi lain jika terjadi abuse.
- [ ] Batasi payload size untuk API yang menerima input besar.
- [ ] Log percobaan mencurigakan tanpa menyimpan password, token, atau secret.

## Checklist Auth dan Session
- [ ] Cookie auth harus `httpOnly`.
- [ ] Cookie auth harus `secure` di production HTTPS.
- [ ] Cookie auth harus punya `sameSite` yang sesuai.
- [ ] `JWT_SECRET` wajib kuat dan tersedia di Vercel environment.
- [ ] Token expiry harus jelas dan tidak membuat user logout mendadak tanpa alasan.
- [ ] Role check dilakukan di server/API, bukan hanya di UI.

## Checklist Header dan Browser Security
- [ ] Pertimbangkan `Content-Security-Policy` untuk mengurangi risiko XSS.
- [ ] Gunakan `X-Frame-Options` atau `frame-ancestors` agar tidak mudah di-clickjack.
- [ ] Gunakan `X-Content-Type-Options: nosniff`.
- [ ] Pastikan CORS tidak dibuka bebas kecuali benar-benar diperlukan.
- [ ] Jangan mengizinkan origin liar untuk endpoint yang membawa cookie.

## Area Paling Sensitif
- [[Auth and Session Security - hipmora.my.id]] untuk login, cookie, JWT, dan role.
- [[Checkout and Order Flow - hipmora.my.id]] untuk order, harga, dan data user.
- [[Tenant Dashboard - hipmora.my.id]] untuk ownership produk/order tenant.
- [[API Route Map - hipmora.my.id]] untuk semua endpoint backend.
- [[Deployment Checklist - hipmora.my.id]] untuk environment dan production.

## Catatan untuk Debugging
Saat memperbaiki bug security, dokumentasikan:
- gejala,
- dampak,
- file yang disentuh,
- validasi yang dilakukan,
- risiko sisa,
- apakah perlu rotasi secret atau invalidasi session.

---

## 2026-09-26 — Security Hardening Sprint 1 (C-1 to C-7)
- **Issue**: Hardcoded JWT_SECRET fallbacks in 12+ files, missing rate limits on auth endpoints, user enumeration via error messages, weak OTP (Math.random, no attempt tracking), inconsistent cookie settings (lax vs strict, secure only in prod), missing security headers (X-Frame-Options, CSP, etc.), hardcoded API keys (imgbb, Resend dummy)
- **Fix**: 
  - Centralized `getJwtSecret()` in `src/lib/auth.js` — throws if JWT_SECRET not set
  - Added rate limits: register 3/hr/email, forgot-password 2/hr/email
  - Generic error messages to prevent user enumeration ("Jika email terdaftar, OTP telah dikirim")
  - OTP hardening: `crypto.randomInt`, `attempts` field (max 5) in VerificationToken model
  - Password policy: min 8 chars, uppercase, lowercase, number, symbol, bcrypt cost 12
  - Cookie hardening: `secure: true`, `sameSite: 'strict'` always
  - Security headers via `next.config.mjs`: X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy, Permissions-Policy
  - Removed hardcoded imgbb API key fallback, Resend dummy fallback
  - Generic 500 error messages (no internal details leaked)
  - Fixed build error: removed `'use server'` from auth lib, added `/api/auth/me` endpoint for client components
  - Added `robots.txt` to block AI crawlers (GPTBot, ClaudeBot, PerplexityBot, etc.)
  - Updated `.gitignore` to exclude Obsidian local workspace
- **Files Modified**: 14 files (src/lib/auth.js, src/middleware.js, src/app/api/auth/*, src/app/api/chat/upload/route.js, src/app/api/orders/route.js, src/models/VerificationToken.js, next.config.mjs, public/robots.txt, .gitignore, src/app/api/auth/me/route.js, src/app/wishlist/page.js)
- **Commits**: a169dfe (critical fixes), f50791e (build fix), plus robots.txt & gitignore updates
- **PR**: #3 security/hardening
- **Follow-up**: Set JWT_SECRET, NEXT_PUBLIC_IMGBB_API_KEY, RESEND_API_KEY in Vercel ENV; test HTTPS locally with mkcert; monitor Vercel CI
