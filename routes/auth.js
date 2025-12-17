const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/register', authController.showRegister);
router.post('/register', authController.register);

router.get('/login', authController.showLogin);
router.post('/login', authController.login);

router.get('/logout', authController.logout);

// Google OAuth routes (only if OAUTH_ENABLED=true)
const isOAuthEnabled = process.env.OAUTH_ENABLED === 'true';

if (isOAuthEnabled) {
  router.get('/google', authController.googleAuth);
  router.get('/google/callback', authController.googleCallback);
} else {
  // Return 404 for OAuth routes when disabled
  router.get('/google', (req, res) => {
    res.status(404).send('OAuth login is disabled');
  });
  router.get('/google/callback', (req, res) => {
    res.status(404).send('OAuth login is disabled');
  });
}

module.exports = router;
