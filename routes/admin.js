const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middleware/auth');
const { uploadImage, uploadDocumentMemory } = require('../services/storageService');

// All admin routes require admin authentication
router.use(isAdmin);

// Dashboard
router.get('/dashboard', adminController.dashboard);

// Subjects
router.get('/subjects', adminController.listSubjects);
router.get('/subjects/create', adminController.createSubjectForm);
router.post('/subjects/create', uploadImage.single('coverImage'), adminController.createSubject);
router.get('/subjects/edit/:id', adminController.editSubjectForm);
router.post('/subjects/edit/:id', uploadImage.single('coverImage'), adminController.updateSubject);
router.post('/subjects/delete/:id', adminController.deleteSubject);

// Topics
router.get('/topics', adminController.listTopics);
router.get('/topics/create', adminController.createTopicForm);
router.post('/topics/create', uploadImage.single('coverImage'), adminController.createTopic);
router.get('/topics/edit/:id', adminController.editTopicForm);
router.post('/topics/edit/:id', uploadImage.single('coverImage'), adminController.updateTopic);
router.post('/topics/delete/:id', adminController.deleteTopic);

// Concepts
router.get('/concepts', adminController.listConcepts);
router.get('/concepts/create', adminController.createConceptForm);
router.post('/concepts/create', uploadImage.single('coverImage'), adminController.createConcept);
router.get('/concepts/edit/:id', adminController.editConceptForm);
router.post('/concepts/edit/:id', uploadImage.single('coverImage'), adminController.updateConcept);
router.post('/concepts/move/:id', adminController.moveConcept);
router.post('/concepts/delete/:id', adminController.deleteConcept);

// File upload (uses memory storage to read content without saving to disk/S3)
router.post('/upload-file', uploadDocumentMemory.single('file'), adminController.uploadFile);

module.exports = router;
