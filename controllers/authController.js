const bcrypt = require('bcryptjs');
const { User } = require('../models/postgres');
const axios = require('axios');

exports.showRegister = (req, res) => {
  // Redirect to profile if already logged in
  if (req.session && req.session.userId) {
    return res.redirect('/profile');
  }
  res.render('auth/register', { title: 'Register' });
};

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      req.flash('error', 'Email already registered');
      return res.redirect('/register');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    req.flash('success', 'Registration successful! Please login.');
    res.redirect('/login');
  } catch (error) {
    console.error('Registration error:', error);
    req.flash('error', 'Registration failed. Please try again.');
    res.redirect('/register');
  }
};

exports.showLogin = (req, res) => {
  // Redirect to profile if already logged in
  if (req.session && req.session.userId) {
    return res.redirect('/profile');
  }
  res.render('auth/login', { title: 'Login' });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email, isActive: true } });
    if (!user) {
      req.flash('error', 'Invalid credentials');
      return res.redirect('/login');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      req.flash('error', 'Invalid credentials');
      return res.redirect('/login');
    }

    // Set session
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.userRole = user.role;
    req.session.profilePicture = user.profilePicture;

    // Redirect based on role
    if (user.role === 'admin') {
      res.redirect('/admin/dashboard');
    } else {
      res.redirect('/');
    }
  } catch (error) {
    console.error('Login error:', error);
    req.flash('error', 'Login failed. Please try again.');
    res.redirect('/login');
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/login');
  });
};

// Google OAuth
exports.googleAuth = (req, res) => {
  const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_CALLBACK_URL,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent'
  });
  res.redirect(`${googleAuthUrl}?${params}`);
};

exports.googleCallback = async (req, res) => {
  try {
    const { code, error } = req.query;

    // Check if user denied access
    if (error) {
      req.flash('error', 'Google authentication was cancelled');
      return res.redirect('/login');
    }

    if (!code) {
      req.flash('error', 'Google authentication failed - no code received');
      return res.redirect('/login');
    }

    // Validate environment variables
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.error('Missing Google OAuth credentials in environment');
      req.flash('error', 'OAuth configuration error');
      return res.redirect('/login');
    }

    // Debug logging
    console.log('=== Google OAuth Debug ===');
    console.log('Callback URL from env:', process.env.GOOGLE_CALLBACK_URL);
    console.log('Client ID:', process.env.GOOGLE_CLIENT_ID.substring(0, 30) + '...');
    console.log('Has code:', !!code);
    console.log('==========================');

    // Exchange code for tokens
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token',
      new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL,
        grant_type: 'authorization_code'
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const { access_token } = tokenResponse.data;

    // Get user info
    const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const { id, email, name, picture } = userInfoResponse.data;

    // Find or create user
    let user = await User.findOne({ where: { email } });

    if (!user) {
      // Generate a unique username
      let username = (name || email.split('@')[0])
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '_') // Replace invalid chars with underscore
        .substring(0, 50); // Limit to 50 chars

      // Check if username exists and make it unique
      let usernameExists = await User.findOne({ where: { username } });
      let counter = 1;
      const originalUsername = username;

      while (usernameExists) {
        username = `${originalUsername}_${counter}`;
        if (username.length > 50) {
          username = `${originalUsername.substring(0, 45)}_${counter}`;
        }
        usernameExists = await User.findOne({ where: { username } });
        counter++;
      }

      user = await User.create({
        username,
        email,
        password: null,
        provider: 'google',
        providerId: id,
        profilePicture: picture,
        role: 'user'
      });
    } else if (user.provider !== 'google') {
      // Link Google account to existing user
      await user.update({
        provider: 'google',
        providerId: id,
        profilePicture: picture
      });
    }

    // Set session
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.userRole = user.role;
    req.session.profilePicture = user.profilePicture;

    req.flash('success', 'Successfully logged in with Google!');
    res.redirect(user.role === 'admin' ? '/admin/dashboard' : '/');
  } catch (error) {
    console.error('Google OAuth error:', error.response?.data || error.message);
    console.error('Full error:', error);

    if (error.response?.data?.error === 'invalid_client') {
      req.flash('error', 'OAuth configuration error. Please check credentials.');
    } else if (error.response?.data?.error === 'redirect_uri_mismatch') {
      req.flash('error', 'Redirect URI mismatch. Please check configuration.');
    } else if (error.name === 'SequelizeValidationError') {
      console.error('Validation error details:', error.errors);
      req.flash('error', 'Account creation failed. Please try again.');
    } else if (error.name === 'SequelizeUniqueConstraintError') {
      console.error('Unique constraint error:', error.errors);
      req.flash('error', 'An account with this information already exists.');
    } else {
      req.flash('error', 'Google authentication failed. Please try again.');
    }

    res.redirect('/login');
  }
};

