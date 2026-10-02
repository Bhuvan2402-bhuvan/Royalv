# Royal V Properties

**Trusted Real Estate Advisory & Property Discovery Since 2006**

A production-grade full-stack real estate web platform for **Royal V Properties** — established in 2006, headquartered in Guntur, Andhra Pradesh, serving Guntur, Vijayawada, Amaravati / AP Capital Region, Mangalagiri, Tadepalli, and Tenali.

---

## 1. Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router with Server Actions) |
| **Language** | TypeScript 5 (Strict Mode) |
| **Styling** | Tailwind CSS v4 + Vanilla CSS Design Tokens |
| **Database** | PostgreSQL 16 |
| **ORM** | Prisma ORM v6 |
| **Authentication** | JWT (JOSE HS256) + HTTP-Only Secure Cookies |
| **Password Security** | bcryptjs (12 Salt Rounds) |
| **Validation** | Zod Schema Validation |
| **Storage Engine** | Extensible Storage Provider (Local Disk / S3 / Cloudflare R2) |
| **Rate Limiting** | Sliding Window In-Memory Rate Limiting |
| **Containerization**| Multi-stage Dockerfile + Docker Compose |

---

## 2. Project Architecture & Routes

```
src/
├── app/
│   ├── page.tsx                    # Homepage: Hero search, featured listings, regions, stats
│   ├── properties/
│   │   ├── page.tsx                # Discovery & Filter: Multi-attribute search, pagination
│   │   └── [slug]/
│   │       └── page.tsx            # Property Details: Gallery, INR specs, WhatsApp CTA, enquiry form
│   ├── about/page.tsx              # About Us (Est. 2006, local market expertise)
│   ├── services/page.tsx           # Services: Buyer advisory, owner listing, site visits, legal checks
│   ├── contact/page.tsx            # Contact: Guntur office address, phone, email, WhatsApp, hours
│   ├── login/page.tsx              # Customer Login with callbackUrl redirection
│   ├── signup/page.tsx             # Customer Registration (Strictly creates CUSTOMER role)
│   ├── forgot-password/page.tsx    # Password recovery request flow
│   ├── not-found.tsx               # Custom branded 404 page
│   ├── error.tsx                   # Global error boundary
│   ├── loading.tsx                 # Global loading state
│   ├── robots.ts                   # Dynamic robots.txt
│   ├── sitemap.ts                  # Dynamic sitemap.xml with live property URLs
│   ├── api/
│   │   ├── health/route.ts         # System & PostgreSQL health check endpoint
│   │   └── upload/route.ts         # Secure media upload endpoint
│   ├── dashboard/                  # Customer Portal
│   │   ├── page.tsx                # Dashboard metrics (saved count, enquiries, submissions)
│   │   ├── saved-properties/       # Real-time saved/favorited properties manager
│   │   ├── enquiries/              # Enquiry tracking with workflow status badges
│   │   ├── submit-property/        # Owner property submission form
│   │   └── profile/                # Customer profile details
│   └── admin/                      # Operations & Admin Portal
│       ├── page.tsx                # Executive Dashboard with live KPIs & urgent action stream
│       ├── properties/             # Property inventory management (Search, filter, status tabs)
│       ├── properties/new/         # Add property form (Draft, Submit for Approval, Direct Publish)
│       ├── properties/[id]/        # Property lifecycle editor, image manager, audit trail
│       ├── properties/pending/     # Approval Center with live buyer card preview & rejection modal
│       ├── enquiries/              # Enquiry & Lead Management with pipeline stages & internal notes
│       ├── submissions/            # Customer Submissions review & 1-click conversion to Property Draft
│       ├── team/                   # Team & Staff Management (Field Agents, Property Managers, Admins)
│       ├── audit-logs/             # Immutable system audit trail
│       └── settings/               # Platform settings, company metadata, and infrastructure info
├── components/
│   ├── admin/                      # AdminNav, PropertyActions, PropertyForm, ApprovalCard, Drawers
│   ├── auth/                       # LoginForm, SignupForm, LogoutButton
│   ├── dashboard/                  # DashboardNav, SellPropertyForm
│   ├── layout/                     # Header, Footer, BrandLogo, MobileNav
│   ├── properties/                 # PropertyFilters, SavePropertyButton, EnquiryForm
│   └── ui/                         # Badge, Button, Input, Select, Textarea, PropertyCard, DropdownMenu
├── lib/
│   ├── actions/                    # Next.js Server Actions (auth, properties, admin)
│   ├── audit/                      # Immutable audit logger (logAudit)
│   ├── auth/                       # Session management, bcrypt passwords, RBAC permissions
│   ├── db/                         # Prisma Client singleton
│   ├── queries/                    # Database queries (properties, customer, admin)
│   ├── security/                   # Rate limiting utility
│   ├── storage/                    # StorageProvider abstraction layer
│   ├── utils/                      # formatters (INR Lakhs/Crores, Sq.Ft, Sq.Yards, Cents), cn
│   └── validators/                 # Zod validation schemas
└── proxy.ts                        # Edge Proxy: RBAC route protection & HTTP security headers
```

---

## 3. Local Development Setup

### Prerequisites
* **Node.js**: v20.x or v22.x
* **Docker Desktop**: For PostgreSQL
* **npm**: Package manager

### Step 1: Clone & Install
```bash
git clone <repository-url>
cd royal-v-properties
npm install
```

### Step 2: Configure Environment
```bash
cp .env.example .env
# Edit .env and verify DATABASE_URL and AUTH_SECRET
```

### Step 3: Start PostgreSQL (Docker)
```bash
docker compose up postgres -d
```

### Step 4: Run Database Migrations & Seed
```bash
npm run db:generate   # Generates Prisma Client
npm run db:push       # Syncs Prisma schema with PostgreSQL
npm run db:seed       # Seeds Super Admin, Property Manager, Field Agent & Sample Listings
```

### Step 5: Start Local Development Server
```bash
npm run dev
# Open http://localhost:3000
```

---

## 4. Default Seed Credentials & Role Hierarchy

| Account & Name | Email | Password | Role | Responsibilities |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** (Royal V Admin) | `admin@royalvproperties.com` | `Admin@RoyalV2006!` | `SUPER_ADMIN` | System + everything (settings, audit logs, all operations) |
| **Admin** (Office Admin) | `admin@royalvproperties.com` | `Admin@RoyalV2006!` | `ADMIN` | Office operations, Properties, Leads, Team management |
| **Property Manager** (Varun Teja) | `manager@royalvproperties.com` | `Manager@RoyalV2006!` | `PROPERTY_MANAGER` | Property inventory, Approvals, Publishing, SOLD, Archive/Delete |
| **Field Agent** (Bhuvana Mohan) | `agent@royalvproperties.com` | `Agent@RoyalV2006!` | `AGENT` | Field work, Property updates, Site visits, SOLD, Archive/Delete |
| **Customer** | Registered via `/signup` | User Created | `CUSTOMER` | Browse, Save, Enquire, Submit property |

> ⚠️ **Notice**: Change default passwords before deploying to production environments.

---

## 5. Production Deployment Guide (Ubuntu Server)

### Prerequisites on Ubuntu Server:
```bash
# Update and install Docker + Docker Compose
sudo apt update && sudo apt upgrade -y
sudo apt install docker.io docker-compose-v2 git -y
sudo systemctl enable docker
sudo systemctl start docker
```

### Deployment Steps:
1. Clone the project repository to `/var/www/royal-v-properties`:
   ```bash
   sudo git clone <repo-url> /var/www/royal-v-properties
   cd /var/www/royal-v-properties
   ```
2. Create production `.env`:
   ```bash
   cp .env.example .env
   # Generate secure random secret:
   openssl rand -base64 32
   # Add your production AUTH_SECRET, NEXT_PUBLIC_SITE_URL, and database credentials
   ```
3. Build and launch Docker containers:
   ```bash
   docker compose --profile full-stack up --build -d
   ```
4. Run initial database migration & seed:
   ```bash
   docker exec -it royalv_web npx prisma db push
   docker exec -it royalv_web npm run db:seed
   ```
5. Configure Nginx Reverse Proxy & SSL (Certbot):
   ```nginx
   server {
       server_name royalvproperties.com www.royalvproperties.com;

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```
   ```bash
   sudo certbot --nginx -d royalvproperties.com -d www.royalvproperties.com
   ```

---

## 6. Database Backup & Restore Procedures

### Database Backup
```bash
docker exec -t royalv_postgres pg_dump -U postgres -d royal_v_properties | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz
```

### Database Restore
```bash
gunzip < backup_filename.sql.gz | docker exec -i royalv_postgres psql -U postgres -d royal_v_properties
```

---

## 7. Quality Checks & Testing

Run all automated checks locally or in CI/CD:
```bash
npm run lint          # ESLint code style check
npx tsc --noEmit      # TypeScript strict type check
npm run build         # Next.js production compilation
```

---

*Royal V Properties — Guntur, Andhra Pradesh, India. Established 2006.*
