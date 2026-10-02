# Royal V Properties — Technical Architecture Specification

## 1. Architectural Overview

**Royal V Properties** is built on a modern **Next.js (App Router)** and **PostgreSQL (Prisma ORM)** architecture, deployed in a containerized **Docker** environment on Linux/Ubuntu.

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Tier (Browser)                    │
│      Public Portal    ·    Customer Hub    ·    Admin UI    │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / JSON / Server Actions
┌──────────────────────────────▼──────────────────────────────┐
│                    Next.js Application Tier                 │
│  ├── Edge Proxy / Route Guards (src/proxy.ts)               │
│  ├── React Server Components (RSC) + Client Island Pattern  │
│  ├── Server Actions & Type-Safe Mutations (Zod Validation)  │
│  ├── RBAC & Session Verification (JOSE / HMAC SHA-256)      │
│  └── Storage & Media Engine (Local / S3 / Cloudflare R2)    │
└──────────────────────────────┬──────────────────────────────┘
                               │ Prisma Connection Pool
┌──────────────────────────────▼──────────────────────────────┐
│               Data Persistence Tier (PostgreSQL)            │
│  ├── Users & Role-Based Access Control                      │
│  ├── Properties, Images & Multi-Unit Specifications         │
│  ├── Customer Saved Properties & Direct Enquiries           │
│  ├── Sell Property Submissions & Lead Workflow              │
│  └── Immutable Audit Logs                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Authentication & Authorization Security Model

### Session Management
* **Stateless JWT Tokens**: Signed using `HS256` HMAC via the `jose` cryptographic library.
* **HTTP-Only Cookies**: Tokens are stored with `httpOnly: true`, `sameSite: "lax"`, and `secure: true` (in production), preventing XSS token exfiltration.
* **Session Lifetime**: 7-day sliding expiration.
* **Password Hashing**: Cryptographic password hashing using `bcryptjs` with 12 salt rounds.

### Role-Based Access Control (RBAC) Architecture
```
SUPER ADMIN
    │
    ├── System + everything (System settings, Audit logs, Full operations)
    │
    ▼
ADMIN
    │
    ├── Office operations
    ├── Properties (Inventory, Lifecycles)
    ├── Leads (Enquiries, Assignments)
    └── Team (Staff management & roles)
    │
    ▼
PROPERTY MANAGER (Varun Teja)
    │
    ├── Property inventory
    ├── Approvals (Review pending listings)
    ├── Publishing (Live deployment)
    ├── SOLD status
    └── Delete/Archive
    │
    ▼
FIELD AGENT (Bhuvana Mohan)
    │
    ├── Field work
    ├── Property updates
    ├── Site visits & customer lead follow-ups
    ├── SOLD status
    └── Delete/Archive
    │
    ▼
CUSTOMER
    ├── Browse & search properties
    ├── Save favorite listings
    ├── Enquire on properties
    └── Submit property for sale
```

* **Server-Side Guard Functions** ([`src/lib/auth/permissions.ts`](file:///e:/royal%20v/src/lib/auth/permissions.ts)):
  * `requireAuth()`: Ensures user session is present and active with matching `sessionVersion`.
  * `requireStaff()`: Allows `SUPER_ADMIN`, `ADMIN`, `PROPERTY_MANAGER`, `FIELD_AGENT` (Direct Publishing, Mark SOLD, Archive, Restore).
  * `requireSubmissionReviewer()`: Allows `SUPER_ADMIN`, `ADMIN`, `PROPERTY_MANAGER` (Customer Submissions).
  * `requireAdmin()`: Allows `SUPER_ADMIN`, `ADMIN` (Team & Staff Management).
  * `requireSuperAdmin()`: Allows `SUPER_ADMIN` only (Permanent database deletes, critical configuration).
* **Edge Proxy Route Protection**:
  * [`src/proxy.ts`](file:///e:/royal%20v/src/proxy.ts) intercepts requests at the network edge:
    * `/admin/*` $\rightarrow$ Redirects unauthorized customers to `/dashboard`.
    * `/dashboard/*` $\rightarrow$ Redirects unauthenticated visitors to `/login`.
    * Injects HTTP security headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`).

---

## 3. Data Schema & Relationships

### Core Relational Models:
1. **`User`**: Core identity table storing roles, hashed credentials, and relation links.
2. **`Property`**: Comprehensive property entity with INR pricing, regional area units (Sq. Yards, Cents, Sq. Ft), workflow status, and audit relations.
3. **`PropertyImage`**: Cascading image entity with display order and featured flag.
4. **`PropertyEnquiry`**: Buyer lead tracking linked to properties and assigned agents.
5. **`SellPropertySubmission`**: Owner property listings submitted for review.
6. **`SavedProperty`**: Composite unique index `[userId, propertyId]` for bookmarks.
7. **`AuditLog`**: Immutable logging of administrative operations with actor metadata.

---

## 4. Operational Lifecycles

### Property Publication Lifecycle
```
[DRAFT] ──(Submit)──> [PENDING_APPROVAL] ──(Admin Review)──┬──(Approve)──> [APPROVED] ──(Publish)──> [PUBLISHED (Live)]
                                                           │
                                                           └──(Reject)───> [REJECTED (with Reason)]
```

### Customer Lead & Enquiry Lifecycle
```
[NEW] ──> [IN_REVIEW] ──> [CONTACTED] ──> [SCHEDULED_VISIT] ──> [CLOSED_CONVERTED] / [CLOSED_LOST]
```

### Owner Submission Review Lifecycle
```
[PENDING] ──> [UNDER_REVIEW] ──> [CONTACTED] ──> [SITE_VISIT_SCHEDULED] ──> [APPROVED_FOR_LISTING] (Convert to Draft)
```

---

## 5. Storage Abstraction Layer

* **Interface**: `StorageProvider` in [`src/lib/storage/storage-provider.ts`](file:///e:/royal%20v/src/lib/storage/storage-provider.ts).
* **Validation**:
  * Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`.
  * Max size: 5 MB per file.
  * Executable and script uploads strictly blocked.
* **Storage Engines**:
  * `LocalDiskStorageProvider`: Stores validated files in `public/uploads/`.
  * `S3StorageProvider` / `R2StorageProvider`: Easily activated via `STORAGE_DRIVER=s3` environment variable.

---

## 6. Deployment & Container Architecture

* **Multi-Stage Dockerfile**:
  * `deps`: Minimal alpine dependencies + openssl.
  * `builder`: Next.js standalone optimized production compilation.
  * `runner`: Non-root `nextjs:nodejs` user, minimal runtime container.
* **Production Docker Compose**:
  * `postgres`: PostgreSQL 16 Alpine with healthcheck and persistent volume `royalv_pgdata`.
  * `web`: Next.js production service on internal port 3000.
