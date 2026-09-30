# PrintMarket NG – Complete Technical Overview

This document is a structured technical overview of the PrintMarket NG Next.js project so another AI or developer can fully understand the system without direct repository access.

---

## 1. PROJECT OVERVIEW

### What the project does
**PrintMarket NG** is a B2B marketplace and community platform for Nigeria’s printing and graphics communications industry. It connects buyers and sellers of printing equipment, services, and consumables; supports agreements and disputes; and provides forums, demonstrations, and vendor profiles.

### Target users
- **Sellers**: Print service providers, manufacturers, dealers, distributors (many granular roles).
- **Buyers**: Corporate/government/retail buyers, event planners, agencies, etc.
- **Admins**: Platform administrators (verifications, demo access, disputes, migrations).

### Core features
- **Marketplace**: Product listings with categories, filters (condition, brand), search, pagination; vendor profiles and product detail pages; buyer/seller mode and seller-only marketplace access.
- **Agreements**: Create proposals between users; lifecycle (PROPOSED → ACTIVE → COMPLETED / DISPUTED); dispute flow with evidence and resolution.
- **Messaging**: Per-user conversation threads; optional product context; read state; layout-protected routes.
- **Forum**: Categories, threads, posts, replies; create thread/post; guidelines and highlights.
- **Demonstrations**: Regular demos (DemoClass) and **Featured Live Demo** flow: users apply for demo access (title/description, optional preferred date); admin approves; user creates full demo (date/time, platform, images); admin approves demo; homepage “Featured Live Demo” section.
- **Demo access & slots**: Admin-managed **AvailableDemoDate** slots; users pick a slot when applying; slot is reserved (isAvailable=false, assignedTo) so it cannot be requested twice; users can have up to 2 active demo access requests; “already requested this day” error when re-requesting.
- **Vendor profiles**: Company info, bio (HTML), video (URL/embed), gallery, specialties, certifications, satisfaction rate (from agreements); vendor setup page with ImageKit uploads.
- **Auth & roles**: Credentials login; JWT session; rich role set (manufacturers, printers, buyers, agencies, ADMIN); role-based UI (e.g. seller vs buyer dashboard, marketplace access).
- **Admin**: Dashboard, verifications, demo access requests, featured demos, disputed agreements, demo dates management, migrations, user profile inspection.

### Business logic summary
- **Seller vs buyer**: Determined by role (buyer roles list in `lib/user-roles.ts`); sellers can list products and demos; buyers cannot. Marketplace and some routes redirect sellers in “seller mode” to dashboard unless they switch to “buyer” (cookie/localStorage).
- **Agreements**: Initiator proposes to receiver; status progression; complaints link to agreements; dispute has evidence/resolution.
- **Featured demos**: Gated by demo access (apply → admin approve → create full demo → admin approve demo).
- **Slots**: One slot = one request globally; reserved at request time; returned lists filter by `isAvailable = true` and `assignedTo` null/empty.

---

## 2. TECH STACK

| Layer | Technology |
|-------|------------|
| Framework | Next.js **15.2.4** (App Router) |
| React | **19** |
| Language | **TypeScript** (strict; path alias `@/*` → project root) |
| Styling | **Tailwind CSS** 3.4, **tailwindcss-animate**, **@tailwindcss/typography**, theme via CSS variables |
| Backend / DB | **PostgreSQL** (Supabase or generic); **Prisma** 6 (ORM + migrations); **pg** for raw SQL in API routes |
| Auth | **NextAuth** (latest), Credentials provider, **JWT** strategy, **bcryptjs** for passwords |
| File upload / media | **ImageKit** (@imagekit/nodejs) – uploads in API; **Cloudinary** package present but primary upload is ImageKit |
| Forms / validation | **react-hook-form**, **@hookform/resolvers**, **zod** |
| UI components | **Radix UI** (Dialog, Select, Tabs, etc.), **shadcn/ui**-style in `components/ui/` |
| Rich text | **TipTap** (@tiptap/react, starter-kit, placeholder) |
| Icons | **lucide-react**, **@heroicons/react**, **react-icons** |
| Date | **date-fns**, **react-day-picker** 9 |
| State | **React Context** (Theme); client-side useState/useEffect dominant |
| Misc | **next-themes**, **sonner** toasts, **recharts**, **framer-motion**, **embla-carousel-react**, **uuid**, **nodemailer** |

- **Build**: `prisma generate && next build`; Next config: ESLint/TypeScript errors ignored in build; images unoptimized; `pg` externals on server.
- **Deployment**: Vercel-oriented (`vercel.json`: buildCommand, outputDirectory `.next`, framework nextjs).

---

## 3. PROJECT STRUCTURE

```
/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout: Inter font, AuthProvider, ThemeProvider, Toaster
│   ├── page.tsx            # Home: hero, featured vendors/products, featured live demo, forum CTA, footer
│   ├── globals.css         # Tailwind + CSS variables (theme)
│   ├── about/
│   ├── admin/              # Admin-only: dashboard, verifications, demo-access, featured-demos, demo-access/dates, categories, migrations
│   ├── agreements/         # List, new, [id], [id]/dispute
│   ├── api/                # All API routes (see Section 6)
│   ├── bookmarks/
│   ├── components/         # App-specific (e.g. floating-forum, footer)
│   ├── dashboard/
│   ├── demo-access/        # apply, my-requests
│   ├── demonstrations/    # List, new, [id], [id]/edit
│   ├── featured-demonstration/  # new, [id]
│   ├── forum/              # List, new, thread/[id], thread/new, post/[id]
│   ├── login/, register/
│   ├── marketplace/        # Main marketplace, product/[id], vendor/[id], my-products, my-products/new, my-products/[id]/edit, vendor/setup, contact
│   ├── messages/           # List, [id]; layout enforces auth
│   ├── pricing/, subscription/
│   ├── profile/, profile/verification/
│   ├── settings/
│   └── users/[id]/trust/
├── components/             # Shared React components
│   ├── ui/                 # shadcn-style primitives (button, card, dialog, form, input, etc.)
│   ├── auth-provider.tsx   # SessionProvider wrapper
│   ├── main-nav.tsx, footer.tsx, search.tsx, user-account-nav.tsx
│   ├── dashboard/          # dashboard-header, unified-dashboard, active-agreements, recent-messages, etc.
│   ├── forum/              # thread-form, post-detail, reply lists/forms, guidelines, category-list
│   ├── marketplace/        # product-card, vendor-card, product-detail, product-form, vendor-profile, product-chat-button, etc.
│   ├── messaging/          # message-list, message-detail, message-input, contact-list, trustworthiness-check
│   ├── agreements/         # agreement-detail, dispute-form, status-timeline, dispute-guidelines
│   ├── sidebar/            # admin-sidebar
│   └── ...
├── hooks/                  # use-media-query, use-mobile
├── lib/                    # Core utilities and config
│   ├── db.ts               # PostgreSQL pool (Supabase-aware), query() with ? → $1,$2, transaction, clientQuery
│   ├── prisma.ts           # PrismaClient singleton (Supabase pooler connection_limit=1)
│   ├── utils.ts            # cn() (clsx + tailwind-merge)
│   ├── user-roles.ts       # Role groups, isSeller(), requiresCompanyName(), getRoleDisplayName(), etc.
│   ├── imagekit-utils.ts   # ImageKit client init
│   └── subscription.ts
├── prisma/
│   ├── schema.prisma       # Full data model (PostgreSQL)
│   ├── migrations/         # Prisma migrations + custom SQL (e.g. add_demo_access_requests.sql)
│   └── seed*.ts / seed.ts
├── scripts/                # Node scripts: migrate-*.js (run SQL migrations), seed-*.sh
├── public/                 # Static assets, images, printer assets
├── middleware.ts           # Auth redirect for /messages, marketplace seller-mode redirect
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

- **app**: All routes and route-specific UI; most pages are client components (`"use client"`).
- **components**: Reusable UI and feature components; `components/ui` = design system.
- **lib**: DB access (Prisma + raw `pg` via `lib/db`), auth helpers, role helpers, ImageKit.
- **prisma**: Single source of truth for schema; some features use raw SQL in API (e.g. messages table creation, demo-access CTE).

---

## 4. ROUTING SYSTEM

| Route | Purpose | Key components / data |
|-------|--------|------------------------|
| `/` | Home | Hero, FeaturedVendors, FeaturedProducts, FeaturedLiveDemo, UpcomingDemos, FloatingForum, Footer |
| `/login`, `/register` | Auth | Credentials form; register uses account type (Company / Industry Professional), company name optional for professionals |
| `/dashboard` | User dashboard | UnifiedDashboard (Overview, My Listings, Messages, Agreements, Demonstrations, Forum Activity, Analytics, Verification); ActiveAgreements, RecentMessages, UserProfileSummary |
| `/marketplace` | Browse products/vendors | Tabs (products / vendors); ProductCategoryFilter, ProductCard, VendorCard; filters, search, pagination |
| `/marketplace/product/[id]` | Product detail | Product detail, gallery, vendor card, video, ProductChatButton (floating chat) |
| `/marketplace/vendor/[id]` | Vendor profile | Vendor profile, bio (HTML), video, gallery, satisfaction rate, products |
| `/marketplace/my-products`, `.../new`, `.../[id]/edit` | Listings CRUD | ProductForm, ImageKit uploads, categories |
| `/marketplace/vendor/setup` | Vendor profile edit | Tabs: company, video, gallery; ImageKit; products tab from API |
| `/marketplace/contact` | Contact (e.g. vendor) | — |
| `/agreements` | Agreements list | — |
| `/agreements/new` | Create agreement | Select receiver, terms, notes |
| `/agreements/[id]` | Agreement detail | AgreementDetail; status; dispute entry |
| `/agreements/[id]/dispute` | Raise dispute | DisputeForm, evidence, guidelines |
| `/messages`, `/messages/[id]` | Inbox and thread | MessageList, MessageDetail, MessageInput; layout redirects unauthenticated to login |
| `/forum` | Forum categories/threads | ForumCategoryList, ForumThreadList, guidelines |
| `/forum/new`, `/forum/thread/new` | Create thread | ThreadForm |
| `/forum/thread/[id]` | Thread view | ThreadHeader, replies, ThreadReplyForm |
| `/forum/post/[id]` | Post view | PostDetail, replies |
| `/demonstrations` | Weekly programme hub | Featured + upcoming approved pipeline; `GET /api/demos` |
| `/demonstrations/new` | **Redirect** | → `/demo-access/apply?redirect=/featured-demonstration/new` (no direct creation) |
| `/demonstrations/[id]`, `.../edit` | Session detail / host manage | Weekly model; leads |
| `/demo-access/my-requests` | User dashboard for application-first weekly demo lifecycle | View requests, setup CTA, demo actions |
| `/demo-access/apply` | **Only** official host entry | `?redirect=/featured-demonstration/new`; application → approval → finalize on featured-demonstration/new |
| `/demo-access/my-requests` | My demo access requests | List from API; status badges; link to create demonstration when approved |
| `/featured-demonstration/new` | Post-approval finalization only (gated) | Requires approved demo access; not a parallel “create anywhere” flow |
| `/featured-demonstration/[id]` | Featured demo detail | — |
| `/profile`, `/profile/verification` | Profile and verification | ProfileForm, CIPPON verification |
| `/settings` | Settings | Account, profile, security, notifications |
| `/pricing`, `/subscription` | Plans / subscription | — |
| `/bookmarks` | Bookmarks | — |
| `/about` | About | — |
| `/admin/dashboard` | Admin overview | Tabs: demo access, verifications, demos, disputes; links to sub-pages |
| `/admin/verifications` | Printer verification queue | — |
| `/admin/demo-access` | Demo access requests | List, filters; approve/reject; assign slot; view user profile (bio HTML) |
| `/admin/demo-access/dates` | Manage available demo dates | CRUD AvailableDemoDate |
| `/admin/featured-demos` | Featured demos queue | Approve/reject demos |
| `/admin/categories` | Categories (e.g. product) | — |
| `/admin/migrations` | Run migrations | — |
| `/users/[id]/trust` | Trust (e.g. trustworthiness) | — |

Dynamic segments: `[id]` for product, vendor, agreement, thread, post, message, demo, featured-demo, user.

---

## 5. DATABASE ARCHITECTURE

**Database**: PostgreSQL (Supabase or standalone). **ORM**: Prisma. **Raw SQL**: `lib/db` with `query()`, `transaction()`, `clientQuery()`; `?` placeholders converted to `$1,$2,...`.

### Tables (Prisma schema)

- **Account** – NextAuth OAuth (provider, providerAccountId, tokens); `userId` → User.
- **Session** – NextAuth sessions; `userId` → User.
- **VerificationToken** – NextAuth verification.
- **User** – Core user: name, email, password, image, role (enum), isVerified, CIPPON fields, company/job/website, location/cityState/country, bio (text), videoUrl, videoDescription, gallery/specialties/certifications (JSON text), yearsInBusiness, teamSize, linkedinUrl, twitterUrl, satisfactionRate. Legacy demo columns (`demoAccessStatus`, etc.) exist on the table but are **deprecated** — **DemoAccessRequest** is the source of truth for the weekly programme. Relations: accounts, sessions, products, initiatedAgreements, receivedAgreements, forumThreads, forumPosts, demoClasses, complaints, subscriptions, demoAccessRequests.
- **ProductCategory** – name, slug, description, icon, parentId (self), isActive, sortOrder; products.
- **Product** – title, description, categoryId, images (JSON text), contactInfo, condition (NEW/USED), brand, location, specifications (JSON text), videoUrl, ownerId → User.
- **Agreement** – initiatorId, receiverId → User; status (PROPOSED, ACTIVE, COMPLETED, DISPUTED), terms, notes; complaints.
- **ForumCategory** – name, description; threads.
- **ForumThread** – title, content, authorId → User, categoryId → ForumCategory; likes; posts.
- **ForumPost** – content, authorId → User, threadId → ForumThread; likes.
- **DemoClass** – Curated weekly **DemoClass** rows (not an on-demand library): title, description, optional videoUrl for **live/week promo** (evergreen product video stays on **Product**). schedule, price, isPaid, status (`DemoStatus`: workflow includes DRAFT → SUBMITTED / UNDER_REVIEW → APPROVED → SCHEDULED / LIVE / COMPLETED; `PENDING`/`REJECTED` retained for legacy rows), manufacturerId → User, category, location, maxAttendees, metadata (JSON), headerImage, advertImage, featuredWeekStart, isFeatured.
- **AvailableDemoDate** – Admin-offered dates/times for applicants to reserve; supports weekly curation (not generic “inventory”). date (unique), time, isAvailable, assignedTo (user id), createdBy.
- **DemoAccessRequest** – Application queue: userId → User, title, description, `applicationPayload` (JSON text), **status** (`DemoAccessRequestStatus` enum: PENDING, APPROVED, REJECTED), preferredDate, assignedDate, assignedDateId (→ AvailableDemoDate), requestedAt, approvedAt, rejectedAt.
- **Complaint** – title, description, status, userId → User, agreementId → Agreement (optional), evidence, resolution.
- **SubscriptionPlan** – name, tier, price, interval, features (JSON).
- **UserSubscription** – userId → User, planId → SubscriptionPlan, startDate, endDate, status, autoRenew.

**Messages** (not in Prisma): Created and used via raw SQL in `app/api/messages/route.ts`: table `messages` with id, content, senderId, receiverId, isRead, productId, createdAt; FKs to User and Product.

### Relationships (summary)
- User ↔ Account, Session; User → Products, Agreements (initiator/receiver), ForumThreads, ForumPosts, DemoClasses, Complaints, DemoAccessRequests.
- Product → ProductCategory, User (owner).
- Agreement → User (initiator, receiver), Complaints.
- ForumThread → User (author), ForumCategory, ForumPosts.
- DemoAccessRequest → User; logically links to AvailableDemoDate via assignedDateId.
- AvailableDemoDate: assignedTo stores User id when slot is reserved.

### Indexes / constraints
- Prisma defaults: primary keys, unique (email, provider+providerAccountId, VerificationToken identifier+token, ProductCategory slug, AvailableDemoDate date).
- Foreign keys and cascades as in schema (e.g. User delete cascades to Products, DemoAccessRequest).
- Custom indexes in migration SQL (e.g. DemoAccessRequest userId, status).

### RLS / triggers
- No Row Level Security or triggers described in codebase; authorization is done in API and middleware (session, role checks).

---

## 6. API ARCHITECTURE

Base path: `/api`. Auth: `getServerSession(authOptions)`; many routes require session and some require `session.user.role === "ADMIN"` or `isSeller(session.user.role)`.

| Route | Method | Purpose | Request / response | Auth |
|-------|--------|--------|--------------------|------|
| `/api/auth/[...nextauth]` | GET, POST | NextAuth (session, login, logout) | — | — |
| `/api/register` | POST | Register user | body: email, password, name, role, ... | — |
| `/api/users/profile` | GET, PATCH | Get/update current user profile | — | Session |
| `/api/users/password` | PATCH | Change password | body: currentPassword, newPassword | Session |
| `/api/users/email` | PATCH | Change email | — | Session |
| `/api/users/become-seller` | POST | Role/company update (e.g. become seller) | — | Session |
| `/api/users/[id]/trust` or `trustworthiness` | GET | Trustworthiness (e.g. for messaging) | — | Session |
| `/api/products` | GET, POST | List (filter, paginate) / create product | GET: query params; POST: body product | POST: Session, seller |
| `/api/products/[id]` | GET, PATCH, DELETE | Product CRUD | — | PATCH/DELETE: owner |
| `/api/products/categories` | GET | Category tree/list | — | — |
| `/api/products/brands` | GET | Brands list | — | — |
| `/api/vendors` | GET | Vendors list (e.g. for marketplace) | query | — |
| `/api/vendors/[id]` | GET | Vendor profile | — | — |
| `/api/vendors/[id]/products` | GET | Products by vendor | — | — |
| `/api/vendors/setup` | GET, PUT | Get/update current user vendor profile | — | Session |
| `/api/agreements` | GET, POST | List / create agreement | — | Session |
| `/api/agreements/[id]` | GET, PATCH | Get / update agreement (e.g. status) | — | Session, party to agreement |
| `/api/agreements/[id]/dispute` | POST | Create complaint/dispute | body: title, description, evidence | Session |
| `/api/messages` | GET, POST | List conversations / send message | GET: contactId, unreadOnly; POST: receiverId, content, productId? | Session |
| `/api/messages/[id]/read` | PATCH | Mark read | — | Session |
| `/api/messages/read` | POST | Mark many read | — | Session |
| `/api/messages/create-table` | POST | Ensure messages table exists | — | Session (or admin) |
| `/api/forum/categories` | GET | Forum categories | — | — |
| `/api/forum/threads` | GET, POST | Threads list / create | — | POST: Session |
| `/api/forum/posts` | GET, POST | Posts (e.g. by thread) / create | — | POST: Session |
| `/api/demos` | GET, POST | DemoClass list / create | — | POST: Session, seller |
| `/api/featured-demonstration` | GET, POST | Featured demos (DemoClass category) list / create | POST: schema (title, description, date, time, platform, images, etc.) | POST: Session, seller |
| `/api/available-demo-dates` | GET | Public list of available slots | — | — |
| `/api/demo-access/status` | GET | Current user demo access status (derived from DemoAccessRequest counts) | — | Session |
| `/api/demo-access/apply` | POST | Submit demo access request; optionally reserve slot | body: title, description, preferredDate?, preferredDateId? | Session |
| `/api/demo-access/my-requests` | GET | Current user DemoAccessRequest list | — | Session |
| `/api/admin/demo-access` | GET, POST | List **DemoAccessRequest** rows (joined with User) / approve or reject (optional slot assign) | POST: **requestId**, action (`approve` \| `reject`), dateId? | Admin |
| `/api/admin/available-demo-dates` | GET, POST, DELETE | List / add / remove AvailableDemoDate | POST: date, time?; DELETE: id | Admin |
| `/api/admin/verify-printer` | POST | Verify printer (user) | — | Admin |
| `/api/admin/approve-demo` | POST | Approve DemoClass (featured) | — | Admin |
| `/api/admin/pending-demos` | GET | Pending demos | — | Admin |
| `/api/admin/pending-verifications` | GET | Pending verifications | — | Admin |
| `/api/admin/disputed-agreements` | GET | Disputed agreements | — | Admin |
| `/api/admin/users/[id]` | GET | Full user profile (for admin) | — | Admin |
| `/api/admin/stats` | GET | Dashboard stats | — | Admin |
| `/api/upload/cloudinary` | POST | Upload file (ImageKit) | formData: file, folder? | Session |
| `/api/upload/cloudinary/cleanup` | POST | Delete/cleanup uploaded files | — | Session |
| `/api/migrations/add-featured-demo-images` | POST | Run migration (add columns) | — | — |
| `/api/migrations/run-featured-demo-migration` | POST | Run migration | — | — |
| `/api/test-db`, `/api/test-fetch` | GET | Health/DB connectivity | — | — |

**Apply flow (demo access with slot)**: On POST with preferredDateId or preferredDate, API runs a CTE: UPDATE AvailableDemoDate SET isAvailable=false, assignedTo=userId WHERE id=… or DATE(date)=… RETURNING …; INSERT DemoAccessRequest from that row; if UPDATE affects 0 rows, returns 400 “slot already requested” or “You've already requested this day” if assignedTo is current user. New flows do **not** mirror status into `User.demoAccess*`.

**Admin demo access**: GET returns one row per **DemoAccessRequest** (not per User). POST updates the request row and optional **AvailableDemoDate**; notifications still target the applicant `userId`.

---

## 7. AUTHENTICATION SYSTEM

- **Provider**: NextAuth with **Credentials** (email + password). No OAuth in code.
- **Adapter**: PrismaAdapter (Account, Session, User, VerificationToken).
- **Strategy**: **JWT**. Session contains: user.id, name, email, role, isVerified (and any custom fields added in callbacks).
- **Login flow**: User submits credentials → CredentialsProvider authorize() → prisma.user.findUnique by email, bcrypt.compare password → return user object → jwt callback stores id, name, email, role, isVerified from DB → session callback attaches to session.
- **Session handling**: Session stored in JWT cookie. `getServerSession(authOptions)` in API routes; `useSession()` in client. Pages use redirect to `/login?callbackUrl=...` when unauthenticated (e.g. messages layout, demo-access/apply).
- **Middleware**: Runs on `/messages/*`, `/marketplace/*`, `/demonstrations/*`. For messages: no token → redirect to login. Marketplace and demonstrations are available to all authenticated users (unified B2B experience).
- **Role system**: Enum in Prisma (UserRole); helpers in `lib/user-roles.ts`: isSeller(role), requiresCompanyName(role), getRoleDisplayName(role), etc. Registration UI uses account type (Company → COMMERCIAL_PRINTER, Industry Professional → END_USER_PRINTER); backend roles unchanged.

---

## 8. STATE MANAGEMENT

- **Server state**: No global server state library. Data fetched in client via fetch() to API routes or in server components where used.
- **Client state**: React useState/useEffect dominant. Context: **ThemeProvider** (next-themes); **SessionProvider** (AuthProvider) from NextAuth. No buyer/seller mode; single unified dashboard.
- **Zustand**: In package.json but not referenced in key paths; likely optional/local.
- **Forms**: react-hook-form + zod per form; no global form state.
- **Server components**: Used sparingly; many pages are client components for interactivity and auth checks.

---

## 9. FEED / CONTENT SYSTEM

- **Marketplace “feed”**: Products and vendors from `/api/products`, `/api/vendors` with filters (category, condition, brand, search, verified-only, etc.). **Pagination**: page, itemsPerPage (e.g. 24); API returns list and pagination meta.
- **Forum**: Categories → threads → posts; no infinite scroll in overview; create thread/post via API.
- **Homepage**: Featured vendors/products and featured live demo from API or props; no personalized feed algorithm.
- **Sorting**: Typically by date (e.g. createdAt, schedule); marketplace may support sort params in API.
- **No recommendation engine** in codebase.

---

## 10. UI ARCHITECTURE

- **Layout**: Root layout wraps all with providers and Toaster. Most routes use their own header (MainNav + Search + UserAccountNav) and optional footer (Footer).
- **Design system**: Tailwind + CSS variables (--background, --foreground, --primary, etc.). Theme: light forced; brand colors in tailwind.config (brand-primary #326de0, brand-secondary #ff9017, etc.).
- **Component hierarchy**: Page → feature sections → components from `components/` (e.g. ProductCard, VendorCard, MessageList). Shared primitives in `components/ui/` (Button, Card, Dialog, Form, Input, Select, Tabs, etc.).
- **Modals**: Radix Dialog (and AlertDialog); used for confirmations, forms, admin user profile.
- **Navigation**: MainNav (links), UserAccountNav (dropdown), AdminSidebar on admin pages, Breadcrumbs on some pages.
- **Cards**: ProductCard, VendorCard, DemoCard, Agreement cards, Forum thread/post cards; consistent Card from ui.

---

## 11. MEDIA HANDLING

- **Upload**: POST to `/api/upload/cloudinary` with FormData (file, optional folder). Server uses **ImageKit** SDK (IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT). Validates type (image/* or video/*) and size (e.g. 5MB images, 100MB videos). Folder examples: `/printmarket/products/`, `/printmarket/videos/`, `/printmarket/featured-demos/`. Returns URL (and fileId/path) for storage in DB.
- **Storage**: URLs stored in DB (Product.images JSON, User.gallery, DemoClass headerImage/advertImage, etc.). No direct Supabase Storage or S3 in code; ImageKit is the CDN/store.
- **Optimization**: next.config has `images: { unoptimized: true }`; ImageKit can do transforms via URL params if needed.
- **Cleanup**: `/api/upload/cloudinary/cleanup` for deleting/cleanup (e.g. remove from ImageKit when product/image is removed).

---

## 12. PERFORMANCE STRATEGY

- **Caching**: No explicit cache headers or ISR documented in route handlers; default Next.js behavior.
- **Server components**: Used where applicable; many pages are client for auth and interactivity.
- **SSR/SSG/ISR**: Not heavily used; app is mostly dynamic (auth, listings).
- **Lazy loading**: Some components may be dynamically imported; not systematic.
- **Images**: Unoptimized in config; ImageKit URLs used directly (img or Next Image with unoptimized).

---

## 13. ENVIRONMENT VARIABLES

| Variable | Purpose |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (e.g. https://xxx.supabase.co). Required. Used by Supabase JS client and to derive Postgres URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key. Required. Used by Supabase JS client (REST/Auth/Storage). |
| `SUPABASE_DB_PASSWORD` | Database password (Supabase dashboard). Required for app and scripts; Postgres URL is derived from this + NEXT_PUBLIC_SUPABASE_URL. |
| `SUPABASE_POOLER_HOST` | Optional. Pooler host (e.g. aws-1-eu-west-1.pooler.supabase.com) for connection string. |
| `SUPABASE_POOLER_PORT` | Optional. Pooler port (default 5432). |
| `NEXTAUTH_SECRET` | NextAuth JWT signing. Required in production. |
| `NEXTAUTH_URL` | Base URL of the app (e.g. for callbacks). |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit API public key. |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit API private key. |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit URL endpoint (e.g. https://ik.imagekit.io/...). |

No `DATABASE_URL` is used; the app and scripts derive the Postgres URL from Supabase env vars via `resolveDatabaseUrl()` (app) or `scripts/load-supabase-env.js` (Node scripts). For Prisma CLI (migrate/generate), run: `node scripts/with-supabase-env.js npx prisma migrate deploy`.

---

## 14. SECURITY

- **Authentication**: All sensitive routes and API endpoints check session via getServerSession or useSession; unauthenticated users redirected or 401.
- **API protection**: Admin routes check `session.user.role === "ADMIN"`. Seller-only actions check role (e.g. isSeller) or ownership (e.g. product ownerId === session.user.id).
- **Input validation**: Zod schemas in register, messages, agreements, and other POST bodies; Prisma and parameterized raw SQL to avoid injection.
- **Passwords**: Hashed with bcrypt on register; compared in authorize().
- **RLS**: Not used; authorization is application-level in API and middleware.
- **File upload**: Type and size checks; upload API requires session.

---

## 15. KNOWN LIMITATIONS

- **Messages table**: Not in Prisma; created/managed via raw SQL; schema drift possible if Prisma and SQL diverge.
- **Build**: TypeScript and ESLint errors ignored in build (ignoreDuringBuilds / ignoreBuildErrors); not ideal for production quality.
- **Images**: next.config has images unoptimized; no Next.js image optimization.
- **Middleware**: Only messages, marketplace, demonstrations; other protected routes rely on page/layout redirects.
- **Demo access**: User table still has legacy demo access fields; source of truth for “status” is DemoAccessRequest aggregates in /api/demo-access/status.
- **i18n**: No internationalization; English only.

---

## 16. CRITICAL FILES

| File | Purpose |
|------|--------|
| `app/layout.tsx` | Root layout, providers, metadata. |
| `app/api/auth/[...nextauth]/route.ts` | NextAuth config: Credentials, JWT/session callbacks, Prisma adapter. |
| `middleware.ts` | Auth redirect for messages; marketplace seller-mode redirect. |
| `lib/supabase.ts` | Supabase client (createSupabaseClient, getSupabaseServerClient, createSupabaseBrowserClient), resolveDatabaseUrl(), getSupabaseDatabaseUrl() from NEXT_PUBLIC_SUPABASE_* and optional SUPABASE_DB_PASSWORD. |
| `lib/db.ts` | PostgreSQL pool; uses resolveDatabaseUrl() then query(), transaction(), convertQuery ?→$n. |
| `lib/prisma.ts` | PrismaClient singleton; uses resolveDatabaseUrl(), Supabase pooler connection_limit. |
| `lib/user-roles.ts` | Role groups, isSeller(), buyer list, display names. |
| `prisma/schema.prisma` | Full DB schema (PostgreSQL). |
| `app/api/demo-access/apply/route.ts` | Demo access request + slot reservation (CTE), 2-request limit, “already requested this day” error. |
| `app/api/upload/cloudinary/route.ts` | ImageKit upload entry point. |
| `app/api/messages/route.ts` | Messages list/send; ensures messages table exists. |
| `app/marketplace/page.tsx` | Main marketplace UI; products/vendors tabs and filters. |
| `app/demo-access/apply/page.tsx` | Demo access form; calendar for slot; preferredDateId + preferredDate sent to API. |
| `components/auth-provider.tsx` | SessionProvider wrapper. |
| `next.config.mjs` | ESLint/TS ignore, images unoptimized, pg externals. |

---

## 17. DATA FLOW

- **User → UI → API → Database → UI**  
  1. User action (e.g. submit demo access with date).  
  2. Client component calls fetch(`/api/demo-access/apply`, { method: 'POST', body: JSON.stringify({...}) }).  
  3. API route gets session (getServerSession), validates body, runs business logic (e.g. reserve slot via raw SQL/Prisma), updates DB.  
  4. API returns JSON (success or error).  
  5. Client updates state (e.g. toast, redirect to my-requests) or refetches (e.g. available dates list) so UI reflects new data.

- **Listing pages**: Page load → fetch to API (e.g. GET /api/products?page=1&categoryId=…) → API uses Prisma or query() → returns JSON → setState(products) → render list. Pagination/filters trigger new fetch with new params.

- **Auth**: Login POST to NextAuth → authorize() → Prisma User lookup, bcrypt → JWT issued → cookie set → subsequent requests carry session; API routes use getServerSession to read user.

---

## 18. BUILD & DEPLOYMENT

- **Build**: `npm run build` → `node scripts/with-supabase-env.js npx prisma generate && next build`. Output: `.next`. DATABASE_URL is derived from Supabase env vars during build.
- **Deploy**: Configured for Vercel (vercel.json: buildCommand, outputDirectory `.next`, framework nextjs). Set NEXT_PUBLIC_SUPABASE_* and SUPABASE_DB_PASSWORD in Vercel env.
- **Migrations**: Run with Supabase env set: `node scripts/with-supabase-env.js npx prisma migrate deploy`. One-off SQL scripts use `scripts/load-supabase-env.js` to set DATABASE_URL from Supabase vars.
- **Seeding**: `prisma/seed.ts` and optional seed-*.ts scripts; not part of standard build.

---

*End of technical overview. Use this document to reason about the system, onboard another AI, or plan changes without browsing the repository.*
