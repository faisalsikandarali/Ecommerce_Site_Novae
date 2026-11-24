const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../data/users.json');

const readUsers = () => {
  try {
    if (!fs.existsSync(usersFilePath)) {
      fs.writeFileSync(usersFilePath, JSON.stringify([]));
      return [];
    }
    return JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
};

const saveUsers = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

// 1-Click GOOGLE SIGN IN / SIGN UP (NO OTP)
exports.loginWithGoogle = (req, res) => {
  try {
    const { email, fullName, avatar, googleId } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Google email address is required' });
    }

    const users = readUsers();
    const normalizedEmail = email.toLowerCase().trim();
    let user = users.find(u => u.email && u.email.toLowerCase().trim() === normalizedEmail);

    if (user) {
      // User exists, update avatar or last active
      user.lastLoginAt = new Date().toISOString();
      if (avatar && !user.avatar) user.avatar = avatar;
      if (!user.authProvider) user.authProvider = 'google';
      saveUsers(users);

      return res.json({
        success: true,
        message: 'Welcome back! Signed in with Google account',
        data: user
      });
    }

    // Auto-create patron account immediately (NO OTP)
    const newUser = {
      id: `usr_g_${Date.now()}`,
      fullName: fullName || email.split('@')[0].replace('.', ' '),
      email: normalizedEmail,
      phone: '',
      city: 'Multan',
      address: '',
      authProvider: 'google',
      googleId: googleId || `gid_${Date.now()}`,
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      registeredAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      totalSpent: 0,
      totalOrders: 0,
      vipTier: 'Google Verified Patron',
      measurements: {
        shoulder: '48 cm',
        chest: '104 cm',
        waist: '32 in',
        recommendedSize: 'M Relaxed'
      }
    };

    users.unshift(newUser);
    saveUsers(users);

    res.status(201).json({
      success: true,
      message: 'Account created instantly with Google (Zero OTP)',
      data: newUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Google authentication error', error: error.message });
  }
};

// PHONE NUMBER SIGN IN / SIGN UP (NO OTP)
exports.loginWithPhone = (req, res) => {
  try {
    const { phone, fullName, city, address } = req.body;

    if (!phone || !phone.trim()) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    const cleanPhone = phone.trim();
    const digitsOnly = cleanPhone.replace(/[^0-9]/g, '');

    const users = readUsers();
    let user = users.find(u => {
      if (!u.phone) return false;
      const uDigits = u.phone.replace(/[^0-9]/g, '');
      return uDigits === digitsOnly || u.phone === cleanPhone;
    });

    if (user) {
      user.lastLoginAt = new Date().toISOString();
      if (fullName && (!user.fullName || user.fullName.startsWith('Patron '))) {
        user.fullName = fullName;
      }
      if (city) user.city = city;
      if (address) user.address = address;
      saveUsers(users);

      return res.json({
        success: true,
        message: 'Logged in successfully with Phone number',
        data: user
      });
    }

    // Auto-create patron account immediately (NO OTP)
    const newUser = {
      id: `usr_p_${Date.now()}`,
      fullName: fullName || `Patron ${cleanPhone.slice(-4)}`,
      email: `${digitsOnly}@phone.novae.com`,
      phone: cleanPhone,
      city: city || 'Multan',
      address: address || '',
      authProvider: 'phone',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      registeredAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      totalSpent: 0,
      totalOrders: 0,
      vipTier: 'Phone Verified Patron',
      measurements: {
        shoulder: '48 cm',
        chest: '104 cm',
        waist: '32 in',
        recommendedSize: 'M Relaxed'
      }
    };

    users.unshift(newUser);
    saveUsers(users);

    res.status(201).json({
      success: true,
      message: 'Account registered instantly via Phone number (Zero OTP)',
      data: newUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Phone authentication error', error: error.message });
  }
};

// STANDARD EMAIL REGISTRATION (NO OTP)
exports.register = (req, res) => {
  try {
    const { fullName, email, phone, city, address, password } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required' });
    }

    const users = readUsers();
    const normalizedEmail = email.toLowerCase().trim();
    let existing = users.find(u => u.email && u.email.toLowerCase().trim() === normalizedEmail);

    if (existing) {
      // If user exists, log them in directly
      existing.lastLoginAt = new Date().toISOString();
      if (fullName) existing.fullName = fullName;
      if (phone) existing.phone = phone;
      if (city) existing.city = city;
      if (address) existing.address = address;
      saveUsers(users);

      return res.json({
        success: true,
        message: 'Existing account authenticated successfully',
        data: existing
      });
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      fullName: fullName || 'Valued Patron',
      email: normalizedEmail,
      phone: phone || '',
      city: city || 'Multan',
      address: address || '',
      authProvider: 'email',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      registeredAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      totalSpent: 0,
      totalOrders: 0,
      vipTier: 'Wardrobe Member',
      measurements: {
        shoulder: '46 cm',
        chest: '100 cm',
        waist: '32 in',
        recommendedSize: 'M'
      }
    };

    users.unshift(newUser);
    saveUsers(users);

    res.status(201).json({
      success: true,
      message: 'Account created instantly (No OTP)',
      data: newUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during registration', error: error.message });
  }
};

// STANDARD EMAIL LOGIN (NO OTP)
exports.login = (req, res) => {
  try {
    const { email, identifier } = req.body;
    const loginTarget = (email || identifier || '').trim();

    if (!loginTarget) {
      return res.status(400).json({ success: false, message: 'Email or phone identifier is required' });
    }

    const users = readUsers();
    const normalized = loginTarget.toLowerCase();
    const digitsOnly = loginTarget.replace(/[^0-9]/g, '');

    let user = users.find(u => 
      (u.email && u.email.toLowerCase() === normalized) ||
      (u.phone && u.phone.replace(/[^0-9]/g, '') === digitsOnly && digitsOnly.length >= 7)
    );

    if (!user) {
      // Auto-provision demo/instant account without OTP
      user = {
        id: `usr_${Date.now()}`,
        fullName: loginTarget.includes('@') ? loginTarget.split('@')[0].replace('.', ' ') : `Patron ${loginTarget.slice(-4)}`,
        email: loginTarget.includes('@') ? normalized : `${digitsOnly}@phone.novae.com`,
        phone: loginTarget.includes('@') ? '0300-1234567' : loginTarget,
        city: 'Multan',
        address: 'Model Town Phase 2',
        authProvider: loginTarget.includes('@') ? 'email' : 'phone',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
        registeredAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        totalSpent: 0,
        totalOrders: 0,
        vipTier: 'Wardrobe Member',
        measurements: {
          shoulder: '48 cm',
          chest: '104 cm',
          waist: '32 in',
          recommendedSize: 'M'
        }
      };
      users.unshift(user);
      saveUsers(users);
    } else {
      user.lastLoginAt = new Date().toISOString();
      saveUsers(users);
    }

    res.json({
      success: true,
      message: 'Logged in successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
  }
};

// GET ALL REGISTERED PATRONS / USERS (For Admin Dashboard)
exports.getAllUsers = (req, res) => {
  try {
    const users = readUsers();
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching users', error: error.message });
  }
};

// DELETE PATRON (Admin)
exports.deleteUser = (req, res) => {
  try {
    const { id } = req.params;
    const users = readUsers();
    const index = users.findIndex(u => u.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const deleted = users.splice(index, 1)[0];
    saveUsers(users);

    res.json({
      success: true,
      message: `Patron account '${deleted.fullName}' removed`,
      data: deleted
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting user', error: error.message });
  }
};
