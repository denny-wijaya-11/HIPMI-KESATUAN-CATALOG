---
tags:
  - hipmora
  - security
  - audit
  - hardening
status: completed
related:
  - "[[Auth and Session Security - hipmora.my.id]]"
  - "[[Security Hardening - hipmora.my.id]]"
  - "[[Architecture Overview - hipmora.my.id]]"
  - "[[Deployment Checklist - hipmora.my.id]]"
---

# Security Audit Report - hipmora.my.id

**Tanggal Audit**: 2026-09-26  
**Branch Fix**: `security/hardening`  
**PR**: https://github.com/denny-wijaya-11/HIPMI-KESATUAN-CATALOG/pull/new/security/hardening  
**Status**: ✅ Critical fixes applied, pushed to GitHub

---

## Ringkasan Eksekutif

Audit keamanan statis dilakukan pada codebase Hipmora (Next.js 16, MongoDB, Vercel). Ditemukan **7 Critical (C-1 to C-7)**, **8 High (H-1 to H-8)**, **8 Medium (M-1 to M-8)**, **8 Low (L-1 to L-8)**.

**Sprint 1 (Critical) - SELESAI**: Semua 7 Critical findings telah diperbaiki dan di-push ke branch `security/hardening`.

---

## ✅ Critical Fixes Applied (C-1 to C-7)

| ID | Finding | Files Modified | Fix Summary |
|----|---------|----------------|-------------|
| **C-1** | Hardcoded JWT_SECRET fallback | `src/lib/auth.js`, `src/middleware.js`, `src/app/api/auth/login/route.js`, `src/app/api/auth/verify-otp/route.js`, `src/app/api/orders/route.js`, `src/app/api/chat/upload/route.js` | Removed all fallbacks; added `getJwtSecret()` helper that throws if `JWT_SECRET` not set |
| **C-2** | No rate limiting on auth endpoints | `src/app/api/auth/register/route.js`, `src/app/api/auth/forgot-password/route.js` | Added rate limits: register 3/hr/email, forgot-password 2/hr/email |
| **C-3** | User enumeration via error messages | `src/app/api/auth/register/route.js`, `src/app/api/auth/forgot-password/route.js` | Generic messages: "Jika email terdaftar, OTP telah dikirim" (always 200) |
| **C-4** | Weak OTP (Math.random, no rate limit, no attempt tracking) | `src/models/VerificationToken.js`, `src/app/api/auth/register/route.js`, `src/app/api/auth/verify-otp/route.js`, `src/app/api/auth/forgot-password/route.js`, `src/app/api/auth/reset-password/route.js` | `crypto.randomInt`, `attempts` field (max 5), rate limiting on requests |
| **C-5** | Inconsistent cookie settings (lax vs strict, secure only in prod) | `src/app/api/auth/login/route.js`, `src/app/api/auth/verify-otp/route.js` | Standardized: `secure: true`, `sameSite: 'strict'` always |
| **C-6** | Missing security headers | `next.config.mjs` | Added: X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy, Permissions-Policy |
| **C-7** | Hardcoded API keys (imgbb, Resend dummy) | `src/app/api/chat/upload/route.js`, `src/app/api/orders/route.js` | Removed fallbacks; validate ENV at runtime |

---

## 🔄 High Priority - Next Sprint (H-1 to H-8)

| ID | Finding | Files to Fix | Effort |
|----|---------|--------------|--------|
| **H-1** | IDOR potential in admin products (operator scope) | `src/app/api/admin/products/[id]/route.js` | Low |
| **H-2** | Mass assignment in admin users PUT | `src/app/api/admin/users/[id]/route.js` | Medium |
| **H-3** | No input sanitization (description, comment, chat) | Product, Order, Message models + API | Medium |
| **H-4** | Google OAuth missing `state` parameter | `src/app/api/auth/google/login/route.js`, `callback/route.js` | Low |
| **H-5** | Audit logging missing for sensitive actions | New `AuditLog` model + middleware | Medium |
| **H-6** | Password reset token mixed with registration OTP | New `PasswordResetToken` model | Medium |
| **H-7** | CORS/origin validation absent | Middleware or API wrapper | Low |
| **H-8** | Dependency `jsonwebtoken` unused | `package.json` | Trivial |

---

## 📋 Medium Priority (M-1 to M-8)

| ID | Finding | Action |
|----|---------|--------|
| **M-1** | Duplicated `getUserPayload()` in 15+ files | Use centralized `src/lib/auth.js` (DONE for auth routes) |
| **M-2** | Error messages leak internal details | Generic 500 messages (PARTIAL DONE) |
| **M-3** | Password complexity policy | Min 8, uppercase, lowercase, number, symbol (DONE) |
| **M-4** | bcrypt cost factor 10 → 12 | Updated in reset-password (DONE) |
| **M-5** | Session fixation prevention | Delete cookie before set (optional) |
| **M-6** | `allowedDevOrigins` hardcoded IPs | Move to ENV |
| **M-7** | No security.txt | Add `public/.well-known/security.txt` |
| **M-8** | Uninstall unused `jsonwebtoken` | `npm uninstall jsonwebtoken` |

---

## 🛠 Files Modified in This Sprint

```
src/lib/auth.js                    # Centralized JWT secret handling
src/middleware.js                  # Removed JWT_SECRET fallback
src/app/api/auth/login/route.js    # secure: true, sameSite: strict, generic errors
src/app/api/auth/register/route.js # crypto OTP, rate limit, generic messages
src/app/api/auth/verify-otp/route.js # attempts tracking, secure cookies, centralized secret
src/app/api/auth/forgot-password/route.js # crypto OTP, rate limit, generic messages
src/app/api/auth/reset-password/route.js # password policy, bcrypt 12, attempts tracking
src/app/api/chat/upload/route.js   # Removed imgbb key fallback, centralized secret
src/app/api/orders/route.js        # Removed Resend dummy fallback, centralized secret
src/models/VerificationToken.js    # Added attempts field (max 5)
next.config.mjs                    # Security headers
```

---

## ⚠️ Prasyarat Deploy Production

Sebelum merge ke `main` dan deploy:

1. **Set `JWT_SECRET` di Vercel Environment Variables** (min 32 char random):
   ```bash
   openssl rand -base64 32
   ```

2. **Set required ENV vars di Vercel**:
   - `JWT_SECRET` (wajib)
   - `NEXT_PUBLIC_IMGBB_API_KEY` (wajib untuk upload gambar)
   - `RESEND_API_KEY` (wajib untuk email)
   - `RESEND_FROM_EMAIL` (optional, default: sistem@hipmora.my.id)
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (untuk OAuth)
   - `MONGODB_URI` (sudah ada)
   - `SMTP_*` (fallback email)

3. **Test lokal dengan HTTPS**:
   ```bash
   npx mkcert localhost
   next dev --experimental-https
   ```

4. **Deploy ke Vercel Preview** → test end-to-end:
   - Register → OTP → login
   - Forgot password → reset
   - Checkout order → email notif
   - Upload gambar chat
   - Admin panel access

---

## 📝 Catatan untuk Tim

- **Tidak ada perubahan UI** — semua fix di backend/API layer
- **Cookie `secure: true`** → development perlu HTTPS (mkcert atau tunnel)
- **Rate limit** dev-friendly (3/hr, 2/hr) — bisa di-tune untuk production
- **Generic error messages** → frontend sudah handle error generic, tidak breaking
- **Security headers** mode `report-only` dulu disarankan sebelum enforce

---

## 🔗 Referensi

- PR: https://github.com/denny-wijaya-11/HIPMI-KESATUAN-CATALOG/pull/new/security/hardening
- OWASP Top 10 2021 mapping: A01, A02, A03, A07, A09
- Next.js Security Headers: https://nextjs.org/docs/app/api-reference/next-config-js/headers