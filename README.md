[README.md](https://github.com/user-attachments/files/22991690/README.md)
# 🛍️ EasyStore — Modern E-Commerce Platform (React + TypeScript + Shadcn UI)

EasyStore is a modern, full-featured e-commerce platform built with **React**, **TypeScript**, **Vite**, and **Shadcn UI**.  
It supports both **regular buyers** and **sellers (hosts)** with dedicated flows — including authentication, product listings, shopping, order management, and a clean, responsive seller dashboard.

---

## 🚀 Features

### 🏠 Public Website
- Beautiful **landing page** showcasing categories and featured products  
- **Shop** page with product search and category filters  
- **Product details** page with ratings, reviews, and add-to-cart functionality  
- **Favourites** and **Orders** pages for buyers  
- Fully responsive layout powered by **Shadcn UI** and **TailwindCSS**

### 👩‍💼 Seller Dashboard
- Dedicated **dashboard for sellers/hosts** upon login  
- Clean layout with **sidebar + header**  
- Dashboard home with **analytics cards** (revenue, orders, rating, growth)  
- **My Store** page listing all uploaded products  
- **Orders** page showing all sales with statuses (Pending, Shipped, Delivered)  
- **Profile** and **Settings** pages for personal & store customization  
- Reusable UI components for cards, metrics, and modals  

### 💅 Built-In UI Components
- Fully typed and composable **React components** using Shadcn UI  
- **Zod + React Hook Form** for validation and form management  
- **Lucide Icons** for clean iconography  
- **Framer Motion** support for subtle animations  
- Toast notifications and loading skeletons included

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend Framework | **React 18 + Vite** |
| Language | **TypeScript** |
| Styling | **TailwindCSS + Shadcn UI** |
| Form Handling | **React Hook Form + Zod** |
| Icons | **Lucide React** |
| State & Routing | **React Router DOM v6** |
| Charts (optional) | **Recharts** |
| Notifications | **Sonner / Toastify** |

---

## 🗂️ Folder Structure

```
src/
 ├── components/
 │   ├── layout/
 │   │   ├── homepage/
 │   │   │   └── HomePageLayout.tsx
 │   │   └── dashboard/
 │   │       ├── DashboardLayout.tsx
 │   │       ├── Sidebar.tsx
 │   │       └── DashboardHeader.tsx
 │   ├── cards/
 │   │   ├── OrderCard.tsx
 │   │   └── ProductCard.tsx
 │   └── ui/...
 │
 ├── pages/
 │   ├── website/
 │   │   ├── LandingPage.tsx
 │   │   ├── AboutPage.tsx
 │   │   ├── ShopPage.tsx
 │   │   └── ProductDetails.tsx
 │   ├── auth/
 │   │   ├── Login.tsx
 │   │   └── Signup.tsx
 │   ├── buyer/
 │   │   ├── FavouritesPage.tsx
 │   │   └── OrdersPage.tsx
 │   └── dashboard/
 │       ├── DashboardHome.tsx
 │       ├── MyStore.tsx
 │       ├── Orders.tsx
 │       ├── Profile.tsx
 │       └── Settings.tsx
 │
 ├── constants/
 │   └── routes.ts
 │
 ├── lib/
 │   └── utils.ts
 │
 └── App.tsx
```

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/easystore.git
cd easystore
```

### 2️⃣ Install Dependencies
```bash
npm install
# or
yarn install
```

### 3️⃣ Start the Development Server
```bash
npm run dev
# or
yarn dev
```

### 4️⃣ Build for Production
```bash
npm run build
```

---

## 🧩 Environment Variables

Create a `.env` file in the project root:

```
VITE_API_BASE_URL=https://api.easystore.com
VITE_CLOUDINARY_KEY=your_key_here
VITE_CLOUDINARY_SECRET=your_secret_here
VITE_STRIPE_PUBLIC_KEY=your_public_key_here
```

---

## 🎨 UI & Components

- Built entirely with **Shadcn UI** + **TailwindCSS**
- Reusable design system:
  - `Button`, `Card`, `Badge`, `Input`, `Separator`
  - `Sheet`, `Dialog`, `Toast`, `Skeleton`
- Consistent brand theme (`bg-primary`, `text-secondary`)

---

## 🧠 Key Components

| Component | Purpose |
|------------|----------|
| `ProductCard` | Displays a product with image, rating, and like button |
| `OrderCard` | Displays a user’s or seller’s order summary |
| `DashboardLayout` | Base layout for all seller pages |
| `Sidebar` | Seller dashboard navigation |
| `DashboardHeader` | Top header with avatar and actions |

---

## 🧪 Roadmap

- [ ] Integrate Paystack/Stripe payments  
- [ ] Add cart and checkout flow  
- [ ] Connect backend (Node.js )  
- [ ] Add product analytics charts  
- [ ] Seller revenue breakdowns  
- [ ] Live notifications and real-time updates  

---

## 🧑‍💻 Developer

**Author:** [Dominion Adebanjo](https://github.com/dominionbanjo)  
**Email:** dominionbanjo@gmail.com  
**Twitter:** [@j_d_banjo](https://twitter.com/j_d_banjo)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

