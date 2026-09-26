---
tags:
  - hipmora
  - ui-ux
  - audit
  - mobile
  - desktop
  - dashboard
  - chat
status: draft
related:
  - "[[Security Hardening - hipmora.my.id]]"
  - "[[Architecture Overview - hipmora.my.id]]"
  - "[[Admin Operations - hipmora.my.id]]"
  - "[[Tenant Dashboard - hipmora.my.id]]"
  - "[[Chat Moderation - hipmora.my.id]]"
---

# UI/UX Audit Report - hipmora.my.id

**Tanggal Audit**: 2026-09-26  
**Audit oleh**: Hermes Agent (via Denny)  
**Scope**: Admin Dashboard, Tenant Dashboard, Tenant Products, Tenant Orders, Chat  
**Status**: BEFORE - Dokumentasi state sebelum perbaikan  
**Branch**: `security/hardening` (commit 09cba84)

---

## Ringkasan Eksekutif

| Area | Mobile | Desktop | Prioritas |
|------|--------|---------|-----------|
| Admin Dashboard | 6.5/10 | 8/10 | P1 |
| Tenant Dashboard | 6/10 | 7.5/10 | P0 (Charts) |
| Tenant Products | 4/10 | 7/10 | **P0** (Table → Cards) |
| Tenant Orders | 4.5/10 | 7/10 | **P0** (Table → Cards) |
| Chat | 7.5/10 | 8.5/10 | P1 (Delete, Polling) |

**Kesimpulan**: Desktop sudah usable, **Mobile butuh perbaikan signifikan** terutama pada Tenant Products & Orders (table-based layout tidak mobile-friendly).

---

## Detail Findings

### 1. ADMIN DASHBOARD (`/admin`)

#### Files:
- `src/app/admin/page.js` (Server Component)
- `src/components/admin/AdminShell.js`
- `src/components/admin/Sidebar.js`
- `src/components/admin/Header.js`

#### Current State:

**Mobile (≤640px):**
- ✅ Sidebar slide-in dengan overlay, toggle button di Header
- ✅ Stats grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` → 1 kolom (terlalu tinggi, scroll panjang)
- ✅ Quick Actions: `grid-cols-2` padding besar (`py-6`), tombol terlalu tinggi
- ❌ Recent Activity: Timeline vertikal pakai `absolute left-4` garis timeline → di mobile sempit, garis numpuk konten
- ⚠️ Touch targets: Link nav `px-3 py-2.5` → perlu verifikasi ≥44px

**Desktop (≥768px):**
- ✅ Fixed sidebar 64px, responsive grid 4 kolom
- ✅ Quick Actions 2 kolom rapi
- ✅ Timeline vertikal OK

**Estetika:**
- Warna konsisten (red-600 primary, gray scale)
- Icon Heroicons inline (bisa extract ke component library)
- Border radius `rounded-xl` konsisten
- Shadow `shadow-sm` → `hover:shadow-md` transition

---

### 2. TENANT DASHBOARD (`/tenant`)

#### Files:
- `src/app/tenant/page.js` (Client Component)
- `src/components/tenant/TenantShell.js`
- `src/components/tenant/TenantSidebar.js`
- `src/components/tenant/TenantHeader.js`
- `src/components/tenant/DashboardCharts.js`

#### Current State:

**Mobile:**
- ✅ Sidebar slide-in sama admin
- ❌ Metric Cards: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` → 1 kolom scroll panjang
- ❌ **Charts (Recharts)**: `h-72` fixed height → terlalu tinggi mobile, label/legend kepotong
- ❌ `ResponsiveContainer width="100%" height="100%"` tapi parent `h-72` fixed
- ⚠️ Nav 5 item + "Tambah Produk" terpisah → mobile scroll

**Desktop:**
- ✅ 4 kolom metric, charts side-by-side
- ✅ Sidebar fixed, nav rapi

**Estetika:**
- Color-coded metrics: Red(Produk), Blue(Pesanan), Green(Pendapatan), Amber(Pending)
- Charts: AreaChart (Revenue green gradient) + BarChart (Orders blue)
- Tooltip custom styling dengan shadow
- Border `border-gray-200` konsisten

---

### 3. TENANT PRODUCTS (`/tenant/products`)

#### Files:
- `src/app/tenant/products/page.js` (Server Component)
- `src/components/admin/BulkDeleteTable.js` (Client Component)

#### Current State:

**Mobile:**
- ❌ **Horizontal scroll tabel** → UX buruk, user swipe kiri-kanan
- ✅ Search param functional
- ✅ Empty state bagus dengan CTA "Tambah Produk"
- ❌ Bulk delete actions di mobile sulit diakses

**Desktop:**
- ✅ Table rapi dengan checkbox, actions dropdown
- ✅ Bulk delete functional

**Estetika:**
- Table header `bg-gray-50`, divide-y `divide-gray-200`
- Hover row `hover:bg-gray-50`
- Status badge produk (featured/hidden) pakai icon

---

### 4. TENANT ORDERS (`/tenant/orders`)

#### Files:
- `src/app/tenant/orders/page.js` (Client Component)

#### Current State:

**Mobile:**
- ❌ **6 kolom tabel + dropdown select** → horizontal scroll parah
- ❌ Native `<select>` status kecil, UX buruk
- ❌ Buyer info `max-w-xs truncate` → alamat tersembunyi
- ❌ Produk list dalam `<ul>` truncate `max-w-[200px]`

**Desktop:**
- ✅ Table 6 kolom readable
- ✅ Status badge color-coded (amber/blue/indigo/green/red)
- ✅ Dropdown status functional

**Estetika:**
- Status badge: `px-2 inline-flex rounded-full text-xs font-semibold`
- Warna per status konsisten
- Table responsive wrapper `overflow-x-auto`

---

### 5. CHAT (`/chat`)

#### Files:
- `src/app/chat/page.js` (Client Component)
- Components: `ChatIcon`, `NotificationBell`, `UserNavMenu` (untuk akses)

#### Current State:

**Mobile:**
- ✅ Sidebar toggle + overlay, chat area full screen
- ✅ Contact list hide saat chat dibuka (`hidden md:flex`)
- ✅ Message bubbles `max-w-[85%]`
- ✅ Input area: `min-h-[44px]`, textarea auto-grow (`max-h-32`), emoji picker grid
- ✅ Image upload: preview, cancel, loading spinner
- ✅ Safe area inset: `env(safe-area-inset-top)` pada header
- ❌ **Delete message**: Hover-only (`group-hover:opacity-100`) → **tidak muncul di mobile**
- ❌ **Timestamps**: `float-right -mb-1` → bisa overlap bubble
- ❌ **Polling 3s**: `setInterval 3000ms` → battery drain mobile

**Desktop:**
- ✅ Split view sidebar 350px/400px
- ✅ Delete button visible on hover
- ✅ Timestamps aligned right
- ⚠️ Polling 3s masih berjalan (bisa pakai WebSocket)

**Estetika:**
- Background chat `bg-[#efeae2]` dengan pattern subtle `cubes.png` opacity-4
- Bubble warna: Sent `#d9fdd3` (green-light), Received `bg-white` border
- Tail bubble CSS clip-path (nice touch)
- Emoji picker grid 6 kolom
- Image preview `h-20 object-contain rounded-lg`

---

## Estetika Global Issues

| Issue | Lokasi | Severity |
|-------|--------|----------|
| **Heroicons inline** | Sidebar, Dashboard, Chat | Low (refactor ke component) |
| **Hardcoded colors** | Charts (green/blue), Status badges | Low (pakai CSS variables / tailwind config) |
| **Generic empty state SVG** | Products, Orders, Chat | Medium (custom illustration) |
| **No dark mode** | Global | Medium (tailwind `dark:` ready) |
| **Toast/alert mixing** | Chat pakai `alert()`, Orders pakai `alert()` | High (unify ke toast system) |
| **Skeleton loading missing** | Dashboard, Products, Orders | Medium (sudah ada `ProductSkeleton` component) |
| **Pull-to-refresh unused** | Component `PullToRefresh` ada tapi tidak di-integrate | Low |

---

## Prioritas Perbaikan (Roadmap)

### P0 - Critical (Mobile Blocker)
1. **Tenant Products**: Table → Card List mobile (`md:hidden` table + `md:block` cards)
2. **Tenant Orders**: Table → Card List mobile + Status Action Sheet (bukan dropdown)
3. **Tenant Dashboard Charts**: Responsive height (`h-[300px] sm:h-[400px]`), simplify tooltip

### P1 - High (Mobile UX)
4. **Admin Dashboard Stats**: Mobile 2-col grid (`sm:grid-cols-2`), compact quick actions (`py-3`)
5. **Admin Activity Timeline**: Mobile card list tanpa garis timeline
6. **Chat Delete Message**: Long-press / swipe-to-reveal actions mobile
7. **Chat Polling**: `visibilitychange` pause, upgrade ke WebSocket/SSE

### P2 - Medium (Polish)
8. **Tenant Sidebar Nav**: Collapse "Produk Saya" & "Tambah Produk" jadi accordion
9. **Touch Targets Audit**: Semua interactive ≥ 44×44px (`min-h-[44px] min-w-[44px]`)
10. **Bottom Navigation Mobile**: 5 tab sticky (Dashboard, Pesanan, Produk, Chat, Profil)

### P3 - Low (Nice to Have)
11. **Custom Empty State Illustrations** (replace heroicons)
12. **Dark Mode Toggle** + persist
13. **Toast System** (sonner/react-hot-toast) replace `alert()`
14. **Skeleton Loading** integrate ke semua fetch
15. **Pull-to-Refresh** integrate ke dashboard/orders
16. **Order Status Timeline** visual stepper
17. **Image Optimization** chat pakai `next/image` proper

---

## Files to Modify (Estimated)

| Priority | Files | Pattern |
|----------|-------|---------|
| P0 | `src/app/tenant/products/page.js`, `src/components/admin/BulkDeleteTable.js` | Conditional render table/cards |
| P0 | `src/app/tenant/orders/page.js` | Card list + ActionSheet status |
| P0 | `src/components/tenant/DashboardCharts.js` | Responsive height, responsive container |
| P1 | `src/app/admin/page.js` | Grid cols, quick actions padding |
| P1 | `src/app/admin/page.js` (Activity section) | Mobile card list |
| P1 | `src/app/chat/page.js` | Swipe actions, polling logic |
| P2 | `src/components/tenant/TenantSidebar.js` | Accordion nav |
| P2 | Global components | Touch target audit |
| P3 | `src/components/public/*` | Toast, Skeleton, DarkModeProvider |

---

## Metrics untuk Validasi (Setelah Fix)

| Metric | Target |
|--------|--------|
| Mobile Lighthouse Performance | ≥ 90 |
| Mobile Lighthouse Accessibility | ≥ 95 |
| Mobile Lighthouse Best Practices | ≥ 90 |
| Touch Target Compliance | 100% ≥ 44×44px |
| Horizontal Scroll Elimination | 0 instances pada ≤640px |
| Chart Render Time Mobile | < 500ms |
| Chat Polling Battery Impact | < 1% per jam (visibility-aware) |

---

## Catatan Teknis

- **Tailwind Breakpoints**: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`
- **Safe Area**: Sudah dipakai di Chat header (`env(safe-area-inset-top)`)
- **Recharts**: `ResponsiveContainer` butuh parent height explicit
- **Next.js Image**: Chat image pakai manual `/_next/image?url=` → migrasi ke `<Image fill sizes="...">`
- **State Management**: Chat pakai local state + polling → kandidat WebSocket/SSE

---

## Referensi Commit

- Current HEAD: `09cba84` (security/hardening branch)
- PR: #3 https://github.com/denny-wijaya-11/HIPMI-KESATUAN-CATALOG/pull/3

---

## Follow-up

- [ ] Create branch `ui/ux-mobile-optimization` dari `security/hardening`
- [ ] Implement P0 fixes first (highest impact)
- [ ] Test di device real (iOS Safari, Chrome Android)
- [ ] Update Obsidian notes per fix completion
- [ ] Deploy ke Vercel Preview untuk stakeholder review