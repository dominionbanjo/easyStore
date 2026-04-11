# 🛍️ EasyStore — Next-Gen Multi-Tenant E-Commerce Platform

[![Live Demo](https://img.shields.io/badge/Live-eazystore.com.ng-00D1FF?style=for-the-badge&logo=appveyor)](https://eazystore.com.ng)
![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Tailwind 4](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)

EasyStore is a robust, production-grade e-commerce ecosystem designed to empower vendors with high-performance storefronts and provide buyers with a seamless shopping experience. Built with **React 19**, **TypeScript**, and **Tailwind CSS 4**, it utilizes a sophisticated multi-tenant architecture to support thousands of independent stores under one umbrella.

---

## 🌐 Live Platform
The platform is accessible at: **[eazystore.com.ng](https://eazystore.com.ng)**

---

## 🏗️ Technical Architecture

EasyStore employs a **Subdomain-Based Multi-Tenancy** strategy, allowing distinct user experiences across different domains:

- **Main Platform (`eazystore.com.ng`)**: The discovery engine where buyers find products, stores, and categories.
- **Vendor Dashboard (`vendor.eazystore.com.ng`)**: A high-performance command center for sellers to manage inventory, orders, and analytics.
- **Admin Suite (`admin.eazystore.com.ng`)**: Super-administrator tools for platform-wide monitoring and vendor management.
- **Dynamic Storefronts (`{store-slug}.eazystore.com.ng`)**: Personalized, white-labeled shopping experiences for individual vendors.

### Core Architecture Pillars
- **React 19 Framework**: Leveraging the latest features for optimized rendering and concurrent mode.
- **Redux Toolkit + Persist**: Centralized state management with persistent storage for carts and user sessions.
- **Micro-Frontend Pattern**: Logically separated modules (`auth`, `vendor`, `admin`, `website`) to ensure scalability.
- **Responsive Layouts**: Utility-first styling with Tailwind CSS 4 and Shadcn UI for a premium, mobile-first design.

---

## 🚀 Key Modules & Features

### 🛒 Public Website & Discovery
- **Dynamic Landing Page**: Showcasing featured products, categories, and top-performing stores.
- **Search & Filter Engine**: Real-time product discovery with complex filtering (price, category, ratings).
- **Category Intelligence**: Deep-diving into specific product niches with breadcrumb navigation.
- **Responsive Shopping Cart**: Persisted cart state across sessions for a frictionless checkout process.

### 👩‍💼 Vendor Command Center (The "Seller Hub")
- **Advanced Dashboard**: Real-time business metrics (Revenue, Order volume, Growth rates) powered by **Recharts**.
- **Product Lifecycle Management**: 
    - Full CRUD interface for products with variant support.
    - Cloudinary-integrated media uploads.
    - Live product previews before publishing.
- **Customer Insights**: Detailed customer lists with order history and lifetime value tracking.
- **Order Processing**: End-to-end management from "Pending" to "Delivered" with live status updates.
- **Store Customization**: Tools for updating store themes, logos, and contact information.

### 🛡️ Administrative Portal
- **Vendor Oversight**: Vetting and approving new store registrations.
- **Transaction Monitoring**: Global view of all platform financial movements.
- **System Health**: Access to server logs, notification history, and platform-wide analytics.
- **Access Control**: Fine-grained RBAC management for internal staff.

### 👤 Buyer Experience
- **Unified Profile**: Management of personal info, addresses, and security settings.
- **Order Tracking**: Detailed history of all purchases with payment verification states.
- **Wishlist**: Save-for-later functionality tied to the user account.

---

## 🧱 Technical Specification

| Layer | Technology |
|-------|-------------|
| **Framework** | React 19 (Vite) |
| **Language** | TypeScript |
| **State Management** | Redux Toolkit |
| **Routing** | React Router DOM |
| **Styling** | Tailwind CSS 4 + Shadcn UI |
| **Animations** | Framer Motion |
| **Data Viz** | Recharts |
| **Forms** | React Hook Form + Zod |
| **API Client** | Axios (with Interceptors) |
| **Notifications** | Sonner |

---

## 🗂️ Project Structure

```bash
src/
 ├── modules/             # Core Feature Modules
 │   ├── auth/            # Auth pages (Login, OTP, Reset)
 │   ├── vendor/          # Vendor-specific dashboards & logic
 │   ├── admin/           # Super-administrator tools
 │   └── website/         # Public discovery pages
 ├── services/            # API integration layer (Axios)
 ├── store/               # Redux slices & configuration
 ├── components/
 │   ├── ui/              # Shadcn primitive components
 │   ├── shared/          # Reusable cross-module components
 │   └── layout/          # Layout wrappers (Vendor, Admin, Website)
 ├── hooks/               # Custom React hooks
 ├── providers/           # Context & State providers
 ├── routes/              # Centralized routing & lazy loads
 ├── types/               # Global TypeScript definitions
 └── utils/               # Helper functions (Subdomain logic, formatting)
```

---

## ⚙️ Setup & Installation

### 1. Prerequisites
- Node.js (v20+ recommended)
- npm or yarn

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
VITE_API_URL=https://api.eazystore.com.ng
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_APP_URL=eazystore.com.ng
```

### 3. Quick Start
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 🧑‍💻 Author
**Dominion Adebanjo**  
[GitHub](https://github.com/dominionbanjo) | [Twitter](https://twitter.com/j_d_banjo)

---
License: MIT
