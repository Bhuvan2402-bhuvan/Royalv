# Royal V Properties

**Trusted Real Estate Advisory & Property Discovery Since 2006**  
*Branch of Varunya Tech · Developed & Hosted by VarunyaTech (varunyatech.in)*

Production Portal: [https://royalv.varunyatech.in](https://royalv.varunyatech.in)

---

## 1. Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router with Server Actions) |
| **Language** | TypeScript 5 (Strict Mode) |
| **Styling** | Tailwind CSS v4 + Vanilla CSS Design Tokens |
| **Database** | PostgreSQL 16 (Prisma ORM v6) |
| **Authentication** | JWT (JOSE HS256) + HTTP-Only Secure Cookies |
| **Password Security** | bcryptjs (12 Salt Rounds) |
| **Validation** | Zod Schema Validation |
| **Storage Engine** | Extensible Storage Provider (Local Persistent Volume / S3 / Cloudflare R2) |
| **Rate Limiting** | Sliding Window In-Memory Rate Limiting |
| **Containerization**| Multi-stage Dockerfile + Docker Compose |

---

## 2. Project Architecture & Directory Structure

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
│   ├── contact/page.tsx            # Contact: Office address, phone, email, WhatsApp, hours
│   ├── login/page.tsx              # User/Staff Login with role-based routing
│   ├── signup/page.tsx             # Customer Registration (Strictly creates CUSTOMER role)
│   ├── forgot-password/page.tsx    # Secure password recovery request flow
│   ├── not-found.tsx               # Custom branded 404 page
│   ├── error.tsx                   # Global error boundary
│   ├── loading.tsx                 # Global loading state
│   ├── robots.ts                   # Dynamic robots.txt
│   ├── sitemap.ts                  # Dynamic sitemap.xml with live property URLs
│   ├── api/
│   │   ├── health/route.ts         # System & PostgreSQL health check endpoint
│   │   └── upload/route.ts         # Secure media upload endpoint with MIME validation
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
│   ├── auth/                       # LoginForm, SignupForm, LogoutButton, ChangePasswordForm
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
* **Docker Desktop**: For local PostgreSQL
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

### Step 3: Start PostgreSQL Container
```bash
docker compose up postgres -d
```

### Step 4: Synchronize Database & Seed Local Data
```bash
npm run db:generate   # Generates Prisma Client
npm run db:push       # Synchronizes Prisma schema with PostgreSQL
npm run db:seed       # Local test seed (Mock Super Admin, Staff, and Sample Properties)
```

### Step 5: Run Development Server
```bash
npm run dev
# Open http://localhost:3000
```

---

## 4. Role-Based Access Control (RBAC) Architecture

| Role | Access Level | Primary Responsibilities |
| :--- | :--- | :--- |
| **SUPER_ADMIN** | Executive Admin | Full system authority: team administration, audit logs, permanent deletions, company settings |
| **ADMIN** | Operations Admin | Day-to-day office operations, lead management, staff coordination, property publishing |
| **PROPERTY_MANAGER** | Property Manager | Property catalog management, submissions review, direct publishing, status updates (SOLD/Archive) |
| **FIELD_AGENT** | Field Agent | Field verification, direct property publishing, site visit logging, listing maintenance |
| **CUSTOMER** | Customer / Buyer | Browse listings, save favorites, submit purchase inquiries, submit properties for sale |

> 🔒 **Security Standard**: Initial staff accounts and credentials are created by the Super Admin via the Admin Portal (`/admin/team`) or during deployment bootstrap via environment variables. Plaintext passwords are never stored or tracked in public repositories.

---

## 5. Production Deployment Guide (Ubuntu / Docker / Cloudflare)

### Step 1: Server Setup
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install docker.io docker-compose-v2 git -y
sudo systemctl enable docker
sudo systemctl start docker
```

### Step 2: Clone Repository & Configure Environment
```bash
sudo git clone <repo-url> /var/www/royal-v-properties
cd /var/www/royal-v-properties
cp .env.example .env
```

Generate a secure random 32-character key for session authentication:
```bash
openssl rand -base64 32
```

Edit `/var/www/royal-v-properties/.env` and configure:
```ini
NODE_ENV="production"
PORT="3000"
NEXT_PUBLIC_SITE_URL="https://royalv.varunyatech.in"
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="<STRONG_RANDOM_POSTGRES_PASSWORD>"
POSTGRES_DB="royal_v_properties"
DATABASE_URL="postgresql://postgres:<STRONG_RANDOM_POSTGRES_PASSWORD>@postgres:5432/royal_v_properties?schema=public"
AUTH_SECRET="<GENERATED_32_CHAR_SECRET_KEY>"
INITIAL_SUPER_ADMIN_EMAIL="<ADMIN_EMAIL>"
INITIAL_SUPER_ADMIN_PASSWORD="<STRONG_ADMIN_PASSWORD>"
```

### Step 3: Launch Docker Containers
```bash
docker compose --profile full-stack up --build -d
```

> 🛡️ **Network Isolation**: PostgreSQL is exposed **only** within the internal Docker bridge network and is NOT accessible to the public internet on host port `5432`.

### Step 4: Production Database Initialization (Zero Demo Data)
Run the clean database migration/push and bootstrap ONLY the initial Super Admin account:
```bash
# Apply database migrations cleanly without running demo seeds
docker exec -it royalv_web npx prisma migrate deploy

# (Or alternatively for fresh initial schema sync)
# docker exec -it royalv_web npx prisma db push

# Bootstrap the initial Super Admin account from .env configuration
docker exec -it royalv_web npm run db:init-admin
```

### Step 5: Reverse Proxy & Cloudflare HTTPS Configuration

Configure Nginx to forward client requests with proper HTTPS headers to container port 3000:

```nginx
server {
    listen 80;
    server_name royalv.varunyatech.in;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name royalv.varunyatech.in;

    # SSL certificates (or Cloudflare Origin Certificate)
    ssl_certificate /etc/ssl/certs/royalv.varunyatech.in.crt;
    ssl_certificate_key /etc/ssl/private/royalv.varunyatech.in.key;

    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
    }
}
```

---

## 6. Persistent Media Storage & Backups

### Upload Storage Persistence
Uploaded property photographs are written to `/app/public/uploads` and mounted to the Docker named volume `royalv_uploads`, ensuring uploads persist across container updates and restarts.

### Database Backup
```bash
docker exec -t royalv_postgres pg_dump -U postgres -d royal_v_properties | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz
```

### Database Restore
```bash
gunzip < backup_filename.sql.gz | docker exec -i royalv_postgres psql -U postgres -d royal_v_properties
```

---

## 7. Build Verification & Quality Checks

```bash
npm run lint          # ESLint code style and security rules check
npx tsc --noEmit      # TypeScript strict compilation check
npm run build         # Next.js production build validation
```

---

*Royal V Properties — Guntur, Andhra Pradesh, India. Established 2006. Branch of Varunya Tech.*
