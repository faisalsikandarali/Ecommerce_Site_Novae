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

exports.register = (req, res) => {
  try {
    const { fullName, email, phone, city, address, password } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required' });
    }

    const users = readUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      fullName: fullName || 'Valued Client',
      email: email.toLowerCase().trim(),
      phone: phone || '',
      city: city || 'Multan',
      address: address || '',
      registeredAt: new Date().toISOString(),
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
      message: 'Account created successfully',
      data: newUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during registration', error: error.message });
  }
};

exports.login = (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const users = readUsers();
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());

    if (!user) {
      // Auto-provision demo account if not exists
      user = {
        id: `usr_${Date.now()}`,
        fullName: email.split('@')[0].replace('.', ' '),
        email: email.toLowerCase().trim(),
        phone: '0300-1234567',
        city: 'Multan',
        address: 'Model Town Phase 2',
        registeredAt: new Date().toISOString(),
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
      users.push(user);
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

exports.getAllUsers = (req, res) => {
  try {
    const users = readUsers();
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching users', error: error.message });
  }
};
