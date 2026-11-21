import React, { createContext, useContext, useState, useEffect } from 'react';

const CustomerAuthContext = createContext();

const STORAGE_KEY = 'novae_customer_user';

export const CustomerAuthProvider = ({ children }) => {
  const [customerUser, setCustomerUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = (email, password) => {
    // Client-side authentication logic
    const user = {
      id: `usr_${Date.now()}`,
      fullName: email.includes('@') ? email.split('@')[0].replace('.', ' ') : 'Valued Client',
      email,
      phone: '0300-1234567',
      city: 'Multan',
      address: 'Model Town Phase 2, Street 7',
      memberSince: '2026',
      vipTier: 'Gold Wardrobe Tier',
      measurements: {
        shoulder: '48 cm',
        chest: '104 cm',
        waist: '32 in',
        recommendedSize: 'M Relaxed'
      }
    };

    setCustomerUser(user);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
    return { success: true, user };
  };

  const register = (data) => {
    const user = {
      id: `usr_${Date.now()}`,
      fullName: data.fullName || 'Valued Client',
      email: data.email,
      phone: data.phone || '0300-1234567',
      city: data.city || 'Multan',
      address: data.address || 'Standard Delivery Address',
      memberSince: '2026',
      vipTier: 'New Member',
      measurements: {
        shoulder: '48 cm',
        chest: '104 cm',
        waist: '32 in',
        recommendedSize: 'M'
      }
    };

    setCustomerUser(user);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
    return { success: true, user };
  };

  const logout = () => {
    setCustomerUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        customerUser,
        isLoggedIn: !!customerUser,
        login,
        register,
        logout
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within CustomerAuthProvider');
  }
  return context;
};
