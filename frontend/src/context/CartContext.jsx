import React, { createContext, useContext, useState, useEffect } from 'react';
import { playHangerClinkSound } from '../utils/audioFeedback';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('novae_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastNotification, setToastNotification] = useState(null);
  const [flyingItem, setFlyingItem] = useState(null);
  const [isCartBouncing, setIsCartBouncing] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('novae_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart to localStorage', e);
    }
  }, [cart]);

  const showToast = (message, item) => {
    setToastNotification({ message, item, id: Date.now() });
    setTimeout(() => {
      setToastNotification(null);
    }, 4000);
  };

  const addToCart = (product, selectedSize = null, selectedColor = null, quantity = 1, clickEvent = null) => {
    const size = selectedSize || (product.sizes && product.sizes[0]) || 'Standard';
    const color = selectedColor || (product.colors && product.colors[0]?.name) || 'Default';
    const cartItemId = `${product.id}-${size}-${color}`;
    const garmentImage = (product.colors && product.colors.find(c => c.name === color)?.image) || product.images?.[0] || '';

    // Calculate coordinates for the flying animation
    let startX = window.innerWidth / 2 - 45;
    let startY = window.innerHeight / 2 - 60;

    if (clickEvent) {
      startX = clickEvent.clientX - 45;
      startY = clickEvent.clientY - 60;
    }

    // Target Cart icon position in navbar
    const cartButton = document.getElementById('navbar-cart-button');
    let endX = window.innerWidth - 65;
    let endY = 25;

    if (cartButton) {
      const rect = cartButton.getBoundingClientRect();
      endX = rect.left + rect.width / 2 - 20;
      endY = rect.top + rect.height / 2 - 20;
    }

    // Trigger Flying Garment Animation
    setFlyingItem({
      id: Date.now(),
      image: garmentImage,
      startX,
      startY,
      endX,
      endY
    });

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            cartItemId,
            id: product.id,
            name: product.name,
            subtitle: product.subtitle,
            price: product.price,
            currency: product.currency || 'Rs.',
            image: garmentImage,
            size,
            color,
            quantity
          }
        ];
      }
    });

    showToast('Added to your cart', { name: product.name, size, color, price: product.price });
  };

  const handleFlightComplete = () => {
    setFlyingItem(null);
    setIsCartBouncing(true);
    playHangerClinkSound();
    setTimeout(() => {
      setIsCartBouncing(false);
    }, 500);
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = subtotal >= 5000 || subtotal === 0 ? 0 : 200;
  const grandTotal = subtotal + shippingCost;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        toastNotification,
        setToastNotification,
        totalItemsCount,
        subtotal,
        shippingCost,
        grandTotal,
        flyingItem,
        handleFlightComplete,
        isCartBouncing
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
