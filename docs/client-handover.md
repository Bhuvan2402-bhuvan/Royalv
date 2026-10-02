# Royal V Properties — Client Operations & Handover Guide

Welcome to the **Royal V Properties** platform management guide. This handbook is written to help you and your staff easily manage property listings, buyer enquiries, owner submissions, password security, and day-to-day operations.

---

## 1. About Your Platform

**Royal V Properties** (Established 2006, Guntur, Andhra Pradesh) is a specialized real estate discovery and lead generation platform serving **Guntur, Vijayawada, Amaravati / AP Capital Region, Mangalagiri, Tadepalli, and Tenali**.

### Core Platform Goals:
1. **Showcase Verified Properties**: Present high-resolution listings with pricing in Indian Rupees (Lakhs & Crores) and regional area units (Sq. Yards, Cents, Sq. Feet).
2. **Generate Genuine Inquiries**: Capture high-intent buyer leads through structured forms and direct WhatsApp chat.
3. **Connect Property Owners**: Enable owners to submit properties for sale directly through the portal for staff appraisal and listing.

---

## 2. Customer Experience Overview

* **Property Discovery**: Visitors can browse, search by keyword, and filter by city, locality, property type (Apartments, Villas, Open Plots, Commercial), price range, and bedrooms without being forced to create an account.
* **Instant Consultation**: Visitors can initiate a pre-filled WhatsApp chat or submit an on-page enquiry.
* **Customer Accounts**: Customers can register to save favorite properties and track their enquiry history in a private dashboard.
* **Sell a Property**: Registered property owners can submit their property details for review by Royal V Properties consultants.

---

## 3. User Role Hierarchy & Access Matrix

```
SUPER ADMIN (Royal V)
    │
    ├── System + everything (settings, audits, full database authority)
    │
    ▼
ADMIN (Operations Admin)
    │
    ├── Office operations
    ├── Properties
    ├── Leads
    └── Team
    │
    ▼
PROPERTY MANAGER (Varun Teja)
    │
    ├── Property inventory
    ├── Approvals & reviews
    ├── Publishing live
    ├── SOLD
    └── Delete/Archive
    │
    ▼
FIELD AGENT (Bhuvana Mohan)
    │
    ├── Field work & photography
    ├── Property updates
    ├── Site visits
    ├── Direct publishing (No approval queue)
    ├── SOLD
    └── Delete/Archive
    │
    ▼
CUSTOMER (Verified Buyer / Seller)
    ├── Browse
    ├── Save
    ├── Enquire
    └── Submit property
```

---

## 4. Property Permission Matrix

| Action | Super Admin | Operations Admin | Property Manager | Field Agent | Customer |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **View Listings** | YES | YES | YES | YES | PUBLIC |
| **Create Property** | YES | YES | YES | YES | NO |
| **Edit Property** | YES | YES | YES | YES | NO |
| **Upload Photographs** | YES | YES | YES | YES | NO |
| **Save Draft** | YES | YES | YES | YES | NO |
| **Publish Now (Direct Live)** | YES | YES | YES | **YES** | NO |
| **Approve Submissions** | YES | YES | YES | NO | NO |
| **Reject Submissions** | YES | YES | YES | NO | NO |
| **Unpublish Listing** | YES | YES | YES | YES | NO |
| **Feature Listing** | YES | YES | YES | NO | NO |
| **Mark SOLD** | YES | YES | YES | YES | NO |
| **Mark UNAVAILABLE** | YES | YES | YES | YES | NO |
| **Archive (Soft Delete)** | YES | YES | YES | YES | NO |
| **Restore Archived Property** | YES | YES | YES | YES | NO |
| **Permanent Delete (DB)** | **YES** | NO | NO | NO | NO |

---

## 5. Staff & Administrator Role Accounts

| Role | Display Name | Title | Initial Email | Initial Password Status | Responsibilities |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **SUPER_ADMIN** | **Royal V** | Executive Admin | `<Configured at Deployment>` | Configured via `INITIAL_SUPER_ADMIN_PASSWORD` | Overall business & platform authority, master settings, audits, permanent deletion |
| **ADMIN** | **Operations Admin** | Operations Admin | `<Created by Super Admin>` | Set upon account creation by Super Admin | Runs the office and coordinates operations, leads, submissions & staff team |
| **PROPERTY_MANAGER** | **Varun Teja** | Property Manager | `<Created by Super Admin>` | Set upon account creation by Super Admin | Manages property inventory, listings, pricing & publishing |
| **FIELD_AGENT** | **Bhuvana Mohan** | Field Agent | `<Created by Super Admin>` | Set upon account creation by Super Admin | Field operations, site visits, property verification & direct publishing |
| **CUSTOMER** | **Customer Account** | Customer | Registered via `/signup` | User Created | Discovers properties, enquires and submits properties |

> [!IMPORTANT]
> All users log in via `/login`. Staff accounts are automatically routed to `/admin` and customer accounts to `/dashboard`.

---

## 6. Password Management & Security Architecture

### Self-Service Password Change
* Accessible in `/dashboard/profile` and `/admin/settings`.
* Requires current password verification.
* Enforces minimum 8 characters with strength validation.
* Prevents reuse of the current password.
* **Instant Session Invalidation**: Incrementing `sessionVersion` automatically terminates active sessions on all other devices.

### Secure Password Recovery (`/forgot-password` & `/reset-password`)
* Secure, single-use cryptographically random tokens stored as SHA-256 hashes.
* 1-hour expiration.
* Generic responses to prevent account enumeration.

### Admin Password Reset
* Super Admin and Operations Admin can trigger "Reset Pass" from the **Team & Staff** page (`/admin/team`) without ever viewing or setting plaintext passwords.

---

## 7. Step-by-Step Staff Workflows

### How to Add & Publish a Property (Direct Publishing)
1. Log in to the Operations Portal at `/login`.
2. Click **Add & Publish Property** in the top navigation or sidebar.
3. Complete the form:
   * **Title & Description**: Enter clear highlights, location landmarks, and title clarity.
   * **Pricing**: Enter price in INR (or check *Price on Request*).
   * **Location**: Select City (*Guntur, Vijayawada, Mangalagiri, etc.*) and enter locality and physical address.
   * **Specifications**: Enter bedrooms, bathrooms, and area dimensions (Built-up Sq.Ft, Plot Sq.Yards, or Cents).
   * **Amenities**: Check all matching facilities (e.g. *24/7 Security, Lift, Power Backup*).
   * **Photos**: Paste high-resolution photo URLs and select a primary image.
4. Click **Publish Now (Live)**: The listing immediately becomes live on the website without any approval queue! Or click **Save as Draft** to keep it private for further updates.

---

### How to Mark a Property as SOLD, UNAVAILABLE, or Archive
1. Navigate to **Property Inventory** in the admin sidebar.
2. Find the listing and click the three-dots action menu (`...`).
3. Select **Mark as SOLD** when a transaction completes. The property is preserved in records but marked as SOLD.
4. Select **Archive (Soft Delete)** to remove it from active listings while preserving all inquiries and audit history.
5. If an archived property needs to be reactivated, select **Restore Property**.

---

### How to Review Customer Property Submissions
1. Click **Customer Submissions** in the sidebar.
2. Review the owner's expected price and property details.
3. Click **Review & Convert** to record valuation notes or assign a Field Agent.
4. Click **Convert to Property Draft** to automatically generate an internal property draft ready for final publishing.

---

## 8. Routine Backup & Maintenance

### Daily Database Backup Command
```bash
docker exec -t royalv_postgres pg_dump -U postgres -d royal_v_properties | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz
```

### Restore Database Backup Command
```bash
gunzip < backup_YYYYMMDD_HHMMSS.sql.gz | docker exec -i royalv_postgres psql -U postgres -d royal_v_properties
```

---

## 9. Official Contact Channels & Leadership

* **Founder & Chairman**: Shri V.V.S.R.Krishna Prasad
* **Company**: Royal V Properties (Established 2006)
* **Head Office**: SVN Colony, Guntur, Andhra Pradesh – 522006, India
* **Primary Hotline**: +91 98858 39645
* **Secondary Hotlines**: +91 97000 71279, +91 94917 96224
* **Official WhatsApp**: +91 98858 39645
* **Email**: royalvproperties@gmail.com
