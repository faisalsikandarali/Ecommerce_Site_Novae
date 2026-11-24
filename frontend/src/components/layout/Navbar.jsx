import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Heart, ShoppingBag, Menu, X, Shirt, Bell, Check, Truck, Package, Clock, ExternalLink } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { api } from '../../services/api';

export const Navbar = ({ currentView, setCurrentView, onOpenSearch }) => {
  const { totalItemsCount, setIsCartOpen, isCartBouncing } = useCart();
  const { wishlistCount } = useWishlist();
  const { isLoggedIn, customerUser } = useCustomerAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notifRef = useRef(null);

  // Load customer order notifications
  useEffect(() => {
    async function fetchNotifs() {
      try {
        const notifs = await api.getNotifications();
        if (Array.isArray(notifs)) {
          setNotifications(notifs);
        }
      } catch (e) {
        console.warn('Could not fetch notifications for navbar', e);
      }
    }
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 10000); // Check for new updates every 10s
    return () => clearInterval(interval);
  }, [customerUser?.email]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = async () => {
    try {
      await api.markNotificationRead('all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (e) {}
  };

  const navLinks = [
    { name: 'New Arrivals', view: 'new-arrivals' },
    { name: 'Women', view: 'women' },
    { name: 'Men', view: 'men' },
    { name: 'Accessories', view: 'accessories' },
    { name: 'Collections', view: 'collections' },
    { name: 'Hanger Rack 👔', view: 'hanger-rack', highlight: true }
  ];

  const handleNavClick = (view) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  const handleAccountClick = () => {
    if (isLoggedIn) {
      setCurrentView('account');
    } else {
      setCurrentView('login');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200/80 transition-all">
      {/* Top Announcement Bar - Clean & Centered (Admin moved exclusively to Footer) */}
      <div className="bg-[#1A1A1A] text-white text-[11px] py-1.5 px-4 text-center tracking-wider font-light flex items-center justify-center gap-2">
        <span>Complimentary Express Shipping on all orders above Rs. 5,000</span>
        <span className="opacity-40">|</span>
        <span
          className="font-semibold underline cursor-pointer hover:opacity-80"
          onClick={() => setCurrentView('hanger-rack')}
        >
          Explore Hanger Rack 👔
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Mobile hamburger button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-700 hover:text-black focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo - NOVAÉ */}
          <div className="flex-1 lg:flex-none text-center lg:text-left">
            <button
              onClick={() => setCurrentView('home')}
              className="inline-block group focus:outline-none"
            >
              <h1 className="text-2xl sm:text-3xl font-serif tracking-[0.25em] font-semibold text-stone-900 group-hover:opacity-80 transition-opacity uppercase">
                NOVAÉ
              </h1>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link, idx) => {
              const isActive = currentView === link.view;
              return (
                <button
                  key={idx}
                  onClick={() => handleNavClick(link.view)}
                  className={`text-xs sm:text-sm tracking-wide transition-all duration-200 py-1 border-b-2 ${
                    link.highlight
                      ? isActive
                        ? 'text-amber-900 font-bold border-amber-600 bg-amber-100/70 px-3 rounded-t-md'
                        : 'text-amber-800 font-semibold border-amber-500/40 hover:border-amber-600 bg-amber-50 px-2.5 rounded-t-md'
                      : isActive
                      ? 'text-stone-900 font-bold border-stone-900'
                      : 'text-stone-700 hover:text-black border-transparent hover:border-stone-900 font-medium'
                  }`}
                >
                  {link.name}
                </button>
              );
            })}
          </nav>

          {/* Action Icons (Search, Account, Wishlist, Cart) */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-stone-700 hover:text-black transition-colors rounded-full hover:bg-stone-100 flex items-center gap-1.5"
              aria-label="Search"
              title="Search"
            >
              <Search className="w-5 h-5 stroke-[1.75]" />
              <span className="hidden xl:inline text-xs font-normal text-stone-500">Search</span>
            </button>

            {/* Account (Checks Login status) */}
            <button
              onClick={handleAccountClick}
              className={`p-2 transition-colors rounded-full flex items-center gap-1.5 relative ${
                currentView === 'account' || currentView === 'login'
                  ? 'text-stone-900 bg-stone-100 font-bold'
                  : 'text-stone-700 hover:text-black hover:bg-stone-100'
              }`}
              aria-label="Account"
              title={isLoggedIn ? `Logged in as ${customerUser?.fullName}` : "Client Login"}
            >
              <div className="relative">
                <User className="w-5 h-5 stroke-[1.75]" />
                {isLoggedIn && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                )}
              </div>
              <span className="hidden xl:inline text-xs font-normal text-stone-500">
                {isLoggedIn ? 'Account' : 'Sign In'}
              </span>
            </button>

            {/* In-App Order Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setIsNotifOpen(prev => !prev)}
                className={`p-2 transition-colors rounded-full relative flex items-center gap-1.5 cursor-pointer ${
                  isNotifOpen ? 'bg-stone-100 text-stone-900' : 'text-stone-700 hover:text-black hover:bg-stone-100'
                }`}
                aria-label="Order Notifications"
                title="Client Order Notifications & Email Updates"
              >
                <Bell className="w-5 h-5 stroke-[1.75]" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-600 text-white text-[9px] font-bold flex items-center justify-center animate-pulse shadow-xs">
                    {unreadCount}
                  </span>
                )}
                <span className="hidden xl:inline text-xs font-normal text-stone-500">Alerts</span>
              </button>

              {/* Notification Dropdown Menu */}
              <AnimatePresence>
                {isNotifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-stone-200/90 z-50 overflow-hidden"
                  >
                    <div className="p-3.5 bg-stone-900 text-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold uppercase tracking-wider">Client Order Updates</span>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-[10px] text-amber-300 hover:text-white underline cursor-pointer"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-stone-100 p-1">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-stone-400">
                          No recent notifications. New order updates will show here.
                        </div>
                      ) : (
                        notifications.slice(0, 6).map((notif) => {
                          const badgeStyle = {
                            'Confirmed': 'bg-amber-100 text-amber-900',
                            'Processing': 'bg-blue-100 text-blue-900',
                            'In Transit': 'bg-purple-100 text-purple-900',
                            'Delivered': 'bg-emerald-100 text-emerald-900',
                            'Cancelled': 'bg-red-100 text-red-900'
                          }[notif.status] || 'bg-stone-100 text-stone-800';

                          return (
                            <div
                              key={notif.id}
                              onClick={() => {
                                setIsNotifOpen(false);
                                setCurrentView('account');
                              }}
                              className={`p-3 hover:bg-stone-50 transition-colors cursor-pointer rounded-xl space-y-1 ${
                                !notif.read ? 'bg-amber-50/50' : ''
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-xs font-bold text-stone-900">
                                  #{notif.orderNumber}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${badgeStyle}`}>
                                  {notif.status}
                                </span>
                              </div>
                              <p className="text-xs text-stone-700 line-clamp-2">
                                {notif.message}
                              </p>
                              <div className="flex items-center justify-between text-[10px] text-stone-400 pt-0.5">
                                <span>{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                <span className="text-indigo-600 font-semibold flex items-center gap-1">
                                  <span>Track in Account →</span>
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <div className="p-2.5 bg-stone-50 border-t border-stone-100 text-center">
                      <button
                        onClick={() => {
                          setIsNotifOpen(false);
                          setCurrentView('account');
                        }}
                        className="text-xs font-bold text-stone-900 hover:text-amber-800 transition-colors cursor-pointer"
                      >
                        View Complete Order History & Email Logs →
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist */}
            <button
              onClick={() => setCurrentView('wishlist')}
              className={`p-2 transition-colors rounded-full relative flex items-center gap-1.5 ${
                currentView === 'wishlist' ? 'text-stone-900 bg-stone-100 font-bold' : 'text-stone-700 hover:text-black hover:bg-stone-100'
              }`}
              aria-label="Wishlist"
              title="Saved Pieces"
            >
              <Heart className="w-5 h-5 stroke-[1.75]" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
              <span className="hidden xl:inline text-xs font-normal text-stone-500">Wishlist</span>
            </button>

            {/* Cart Button with ID for Flying Garment Animation Landing & Bounce */}
            <button
              id="navbar-cart-button"
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-stone-700 hover:text-black transition-colors rounded-full hover:bg-stone-100 relative flex items-center gap-1.5"
              aria-label="Cart"
              title="Shopping Cart Drawer"
            >
              <motion.div
                animate={isCartBouncing ? {
                  scale: [1, 1.4, 0.85, 1.2, 1],
                  rotate: [0, -10, 10, -5, 0]
                } : {
                  scale: 1,
                  rotate: 0
                }}
                transition={{ duration: 0.45 }}
                className="relative"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
                {totalItemsCount > 0 && (
                  <motion.span
                    key={totalItemsCount}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-stone-900 text-white text-[10px] font-bold flex items-center justify-center shadow-xs"
                  >
                    {totalItemsCount}
                  </motion.span>
                )}
              </motion.div>
              <span className="hidden xl:inline text-xs font-normal text-stone-500">Cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link, idx) => (
              <button
                key={idx}
                onClick={() => handleNavClick(link.view)}
                className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                  currentView === link.view
                    ? 'bg-stone-900 text-white font-bold'
                    : link.highlight
                    ? 'bg-amber-50 text-amber-900 font-semibold'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-stone-100 flex justify-between items-center px-2">
            <button
              onClick={() => {
                onOpenSearch();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-xs font-medium text-stone-700"
            >
              <Search className="w-4 h-4" /> Search
            </button>
            <button
              onClick={() => {
                handleAccountClick();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-xs font-medium text-stone-700"
            >
              <User className="w-4 h-4" /> {isLoggedIn ? 'My Account' : 'Sign In'}
            </button>
            <button
              onClick={() => {
                setCurrentView('wishlist');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-xs font-medium text-stone-700"
            >
              <Heart className="w-4 h-4" /> Wishlist ({wishlistCount})
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
