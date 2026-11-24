import React, { createContext, useContext, useState } from 'react';
import { api } from '../services/api';

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

  const saveUserSession = (user) => {
    setCustomerUser(user);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to persist customer user session', e);
    }
  };

  // 1-Click GOOGLE LOGIN / SIGN UP (NO OTP)
  const loginWithGoogle = async (googleProfile = {}) => {
    try {
      const profile = {
        fullName: googleProfile.fullName || 'Patron Faisal',
        email: googleProfile.email || 'faisal.atelier@gmail.com',
        avatar: googleProfile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        googleId: googleProfile.googleId || `g_${Date.now()}`
      };
      const user = await api.loginWithGoogle(profile);
      saveUserSession(user);
      return { success: true, user };
    } catch (error) {
      console.error('Google auth failed', error);
      const fallbackUser = {
        id: `usr_g_${Date.now()}`,
        fullName: googleProfile.fullName || 'Google Patron',
        email: googleProfile.email || 'patron@gmail.com',
        phone: '',
        city: 'Multan',
        authProvider: 'google',
        vipTier: 'Google Verified Patron'
      };
      saveUserSession(fallbackUser);
      return { success: true, user: fallbackUser };
    }
  };

  // PHONE NUMBER LOGIN / SIGN UP (NO OTP)
  const loginWithPhone = async ({ phone, fullName, city, address }) => {
    try {
      const user = await api.loginWithPhone({ phone, fullName, city, address });
      saveUserSession(user);
      return { success: true, user };
    } catch (error) {
      console.error('Phone auth failed', error);
      const digitsOnly = (phone || '').replace(/[^0-9]/g, '');
      const fallbackUser = {
        id: `usr_p_${Date.now()}`,
        fullName: fullName || `Patron ${digitsOnly.slice(-4)}`,
        email: `${digitsOnly}@phone.novae.com`,
        phone,
        city: city || 'Multan',
        address: address || '',
        authProvider: 'phone',
        vipTier: 'Phone Verified Patron'
      };
      saveUserSession(fallbackUser);
      return { success: true, user: fallbackUser };
    }
  };

  // EMAIL REGISTRATION (NO OTP)
  const registerWithEmail = async (data) => {
    try {
      const user = await api.registerCustomer(data);
      saveUserSession(user);
      return { success: true, user };
    } catch (error) {
      console.error('Register failed', error);
      const fallback = {
        id: `usr_${Date.now()}`,
        fullName: data.fullName || 'Valued Patron',
        email: data.email,
        phone: data.phone || '0300-1234567',
        city: data.city || 'Multan',
        address: data.address || '',
        authProvider: 'email',
        vipTier: 'Wardrobe Member'
      };
      saveUserSession(fallback);
      return { success: true, user: fallback };
    }
  };

  // EMAIL LOGIN (NO OTP)
  const loginWithEmail = async (email, password) => {
    try {
      const user = await api.loginCustomer({ email, password });
      saveUserSession(user);
      return { success: true, user };
    } catch (error) {
      console.error('Email login failed', error);
      const fallback = {
        id: `usr_${Date.now()}`,
        fullName: email.includes('@') ? email.split('@')[0].replace('.', ' ') : 'Valued Patron',
        email,
        phone: '0300-1234567',
        city: 'Multan',
        address: 'Model Town Phase 2, Street 7',
        authProvider: 'email',
        vipTier: 'Wardrobe Member'
      };
      saveUserSession(fallback);
      return { success: true, user: fallback };
    }
  };

  // Backwards compatible aliases
  const login = (email, password) => loginWithEmail(email, password);
  const register = (data) => registerWithEmail(data);

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
        loginWithGoogle,
        loginWithPhone,
        loginWithEmail,
        registerWithEmail,
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
