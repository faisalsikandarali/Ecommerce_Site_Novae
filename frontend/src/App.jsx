import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { NotificationToast } from './components/layout/NotificationToast';
import { SearchModal } from './components/shop/SearchModal';
import { FlyingGarmentAnimation } from './components/common/FlyingGarmentAnimation';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { NewArrivalsPage } from './pages/NewArrivalsPage';
import { WomenPage } from './pages/WomenPage';
import { MenPage } from './pages/MenPage';
import { AccessoriesPage } from './pages/AccessoriesPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { HangerRackPage } from './pages/HangerRackPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { WishlistPage } from './pages/WishlistPage';
import { CartPage } from './pages/CartPage';
import { AccountPage } from './pages/AccountPage';
import { CustomerLoginPage } from './pages/CustomerLoginPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { useAdminAuth } from './context/AdminAuthContext';
import { useCustomerAuth } from './context/CustomerAuthContext';
import { useCart } from './context/CartContext';
import { api } from './services/api';
import { Loader2 } from 'lucide-react';

export function App() {
  const [currentView, setCurrentView] = useState('home');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [shopFilters, setShopFilters] = useState({});
  const [lastOrder, setLastOrder] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const { isAuthenticated } = useAdminAuth();
  const { isLoggedIn } = useCustomerAuth();
  const { flyingItem, handleFlightComplete } = useCart();

  // Load products (works both with backend API or self-contained client-side data)
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await api.getProducts();
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const navigateTo = (view, extra = {}) => {
    setCurrentView(view);
    if (extra && view === 'shop') {
      setShopFilters(extra);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (prod) => {
    setSelectedProduct(prod);
    navigateTo('product');
  };

  const handleOrderSuccess = (order) => {
    setLastOrder(order);
    navigateTo('confirmation');
  };

  // If in admin mode, show Admin Dashboard or Login Guard
  if (currentView === 'admin') {
    if (isAuthenticated) {
      return (
        <AdminDashboardPage
          onNavigateToStore={() => navigateTo('home')}
        />
      );
    } else {
      return (
        <AdminLoginPage
          onLoginSuccess={() => navigateTo('admin')}
          onBackToStore={() => navigateTo('home')}
        />
      );
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#1A1A1A] antialiased">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={navigateTo}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Signature Flying Garment To Cart Animation */}
      <FlyingGarmentAnimation
        flyingItem={flyingItem}
        onAnimationComplete={handleFlightComplete}
      />

      {/* Global Toast Notification */}
      <NotificationToast />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        onNavigateToCheckout={() => navigateTo('checkout')}
        onNavigateToShop={() => navigateTo('shop')}
        onNavigateToCart={() => navigateTo('cart')}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={handleSelectProduct}
      />

      {/* Main Routed Page Content */}
      <main className="flex-1">
        {loading ? (
          <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-stone-800 animate-spin" />
            <p className="text-xs uppercase tracking-widest font-semibold text-stone-500">
              Loading Boutique & Hanger Physics...
            </p>
          </div>
        ) : (
          <>
            {currentView === 'home' && (
              <HomePage
                products={products}
                onSelectProduct={handleSelectProduct}
                onNavigate={navigateTo}
              />
            )}

            {currentView === 'new-arrivals' && (
              <NewArrivalsPage
                products={products}
                onSelectProduct={handleSelectProduct}
                onNavigate={navigateTo}
              />
            )}

            {currentView === 'women' && (
              <WomenPage
                products={products}
                onSelectProduct={handleSelectProduct}
                onNavigate={navigateTo}
              />
            )}

            {currentView === 'men' && (
              <MenPage
                products={products}
                onSelectProduct={handleSelectProduct}
                onNavigate={navigateTo}
              />
            )}

            {currentView === 'accessories' && (
              <AccessoriesPage
                products={products}
                onSelectProduct={handleSelectProduct}
                onNavigate={navigateTo}
              />
            )}

            {currentView === 'collections' && (
              <CollectionsPage
                products={products}
                onSelectProduct={handleSelectProduct}
                onNavigate={navigateTo}
              />
            )}

            {currentView === 'hanger-rack' && (
              <HangerRackPage
                products={products}
                onSelectProduct={handleSelectProduct}
                onNavigate={navigateTo}
              />
            )}

            {currentView === 'shop' && (
              <ShopPage
                products={products}
                onSelectProduct={handleSelectProduct}
                initialFilters={shopFilters}
              />
            )}

            {currentView === 'product' && selectedProduct && (
              <ProductDetailPage
                product={selectedProduct}
                allProducts={products}
                onSelectProduct={handleSelectProduct}
                onNavigate={navigateTo}
              />
            )}

            {currentView === 'cart' && (
              <CartPage
                onNavigate={navigateTo}
              />
            )}

            {/* Customer Login / Register View */}
            {currentView === 'login' && (
              <CustomerLoginPage
                onLoginSuccess={() => navigateTo('account')}
                onBackToStore={() => navigateTo('home')}
              />
            )}

            {/* Customer Account / Orders View */}
            {currentView === 'account' && (
              isLoggedIn ? (
                <AccountPage
                  onNavigate={navigateTo}
                />
              ) : (
                <CustomerLoginPage
                  onLoginSuccess={() => navigateTo('account')}
                  onBackToStore={() => navigateTo('home')}
                  redirectReason="Please sign in to view your orders and wardrobe profile."
                />
              )
            )}

            {currentView === 'wishlist' && (
              <WishlistPage
                onSelectProduct={handleSelectProduct}
                onNavigate={navigateTo}
              />
            )}

            {currentView === 'checkout' && (
              <CheckoutPage
                onOrderPlaced={handleOrderSuccess}
                onBack={() => navigateTo('shop')}
                onNavigateToLogin={() => navigateTo('login')}
              />
            )}

            {currentView === 'confirmation' && (
              <OrderConfirmationPage
                order={lastOrder}
                onNavigate={navigateTo}
              />
            )}
          </>
        )}
      </main>

      {/* Footer with Store Admin shortcut */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
}

export default App;
