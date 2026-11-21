# NOVAÉ — Luxury Everyday Living & Interactive Hanger Wardrobe

A high-end, responsive e-commerce web application inspired by luxury boutique aesthetics, built with **React.js, Node.js, Express, Tailwind CSS, and Framer Motion**.

---

## 👔 Signature Feature: Realistic Clothes Hanger Animations

As requested, garments are presented hanging on authentic wooden and metallic coat hangers suspended from a chrome closet rail.

- **Pendulum Sway Physics**: When hovering, sliding, or triggering the "Gentle Breeze", clothes sway with realistic organic pendulum physics with the pivot point anchored at the top hook.
- **3D Tilt & Parallax**: On the Product Detail Page (PDP), moving your cursor tilts the hanging garment in 3D perspective with realistic dynamic floor shadows.
- **Closet Rail Sound Effects**: Subtle metallic slide and hanger clink sounds synthesized via the browser's Web Audio API.
- **Boutique Mode Toggle**: Switch between traditional Grid Mode and **Hanger Wardrobe Mode** across the catalog.

---

## 🔐 Admin Dashboard & Operations Console

Access the administrative console from the top bar **"🔐 Admin HQ"** or the footer **"🔐 Store Admin"**:
- **URL**: Navigate to `/admin` within the web app
- **Default Credentials**:
  - **Email**: `admin@novae.com`
  - **Password**: `admin123` *(Quick 'Fill Demo' button available)*

### Capabilities:
1. **Analytics Dashboard**: Live total revenue (Rs.), total orders count, inventory count, and active hanger models.
2. **Product & Hanger CRUD**: Add new garments with full hanger specs (fabric weight, hanger wood type, cut silhouette, price, images), edit prices, toggle stock status, and delete items.
3. **Order Management**: Real-time order pipeline with live order status updates (`Confirmed` → `Processing` → `In Transit` → `Delivered` → `Cancelled`).
4. **Wardrobe & Rail Config**: Hanger woods and hook metals configuration.

---

## 📁 Professional Folder Structure

```
d:\New folder\
├── backend/                  # Node.js + Express API
│   ├── src/
│   │   ├── controllers/      # Product & Order business logic
│   │   │   ├── productController.js
│   │   │   └── orderController.js
│   │   ├── routes/           # REST API endpoints
│   │   │   ├── productRoutes.js
│   │   │   └── orderRoutes.js
│   │   ├── data/             # JSON Database
│   │   │   ├── products.json # 12 curated products matching design
│   │   │   └── orders.json   # Persistent order storage
│   │   └── middleware/
│   ├── .env                  # Port & Environment configuration (Port 5050)
│   ├── package.json
│   └── server.js
│
└── frontend/                 # React 18 + Vite + Tailwind CSS
    ├── src/
    │   ├── components/
    │   │   ├── layout/       # Navbar, Footer, NotificationToast
    │   │   ├── hanger/       # HangerSvg, HangerCard, HangerRackShowcase, InteractiveHangerViewer
    │   │   ├── shop/         # ProductCard, FilterSidebar, SearchModal
    │   │   ├── cart/         # CartDrawer, CartItem
    │   │   └── common/       # TrustBadges, RatingStars
    │   ├── context/          # CartContext, WishlistContext
    │   ├── pages/            # HomePage, ShopPage, ProductDetailPage, CheckoutPage, OrderConfirmationPage, WishlistPage
    │   ├── services/         # api.js client
    │   ├── utils/            # audioFeedback.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Running the Project

### 1. Backend Server
```powershell
cd "d:\New folder\backend"
npm start
# Running on http://localhost:5050
```

### 2. Frontend Application
```powershell
cd "d:\New folder\frontend"
npm run dev
# Running on http://localhost:3000
```

---

## 🎨 Screens Implemented (Matching Reference Mockup)

1. **Screen A (Home Page)**:
   - Hero banner with headline: *"Designed for everyday living"*
   - Trust badges bar: Free Shipping, Secure Checkout, Easy Returns, Customer Support
   - Signature Hanger Boutique Rack with interactive clothes sliding on the rail
   - Best Sellers 5-column product grid
   - Secondary promo banner: *"New banner lead /shop"*

2. **Screen B (Catalog / Shop Page)**:
   - Filter sidebar: Categories, Department, Price ranges, Size pills, Color swatches, and Hanger-only filter
   - Live search input & sorting dropdown
   - Toggle between standard Grid and interactive **Hanger Wardrobe View**

3. **Screen C (Product Detail Page)**:
   - 3D interactive hanger stage with natural mouse sway & tilt physics
   - Thumbnail gallery
   - Size selector pills (XS, S, M, L, XL) & color swatches
   - Quantity stepper, "Add to Cart", "Buy Now", "Add to Wishlist"
   - Floating notification toast: *"Added to your cart"*
   - Product Details, Shipping, and Returns accordions

4. **Screen D (Cart Drawer & Empty State)**:
   - Slide-over drawer with item thumbnails, quantities, price calculations
   - Free shipping progress bar (Free for orders over Rs. 5,000)
   - Empty cart state with shopping bag illustration

5. **Screen F (Checkout Page)**:
   - Customer Information form (Full Name, Phone, Email, Delivery City, Address)
   - Delivery Method (Standard Delivery)
   - Payment Method selection (Cash on Delivery / Online Card)
   - Order summary with full item breakdown

6. **Screen G (Order Confirmation)**:
   - Green confirmation checkmark with celebratory confetti
   - Generated order reference number (e.g., `NV-2120`)
   - Customer summary, delivery city, and breakdown
