const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/auth');

// Public routes
router.get('/', userController.home);
router.get('/browse', userController.browseSubjects);
router.get('/search', userController.search);
router.get('/api/search-concepts', userController.searchConcepts);
router.get('/subject/:subjectSlug', userController.viewSubject);
router.get('/topic/:topicSlug', userController.viewTopic);
router.get('/docs/:subjectSlug/:topicSlug/:conceptSlug', userController.viewConcept);

// Protected routes (require authentication)
router.post('/rate-concept/:id', isAuthenticated, userController.rateConcept);
router.post('/rate-topic/:id', isAuthenticated, userController.rateTopic);
router.get('/profile', isAuthenticated, userController.viewProfile);

module.exports = router;
