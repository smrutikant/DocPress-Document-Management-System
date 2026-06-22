const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin, isAdminOrTeamAdmin } = require('../middleware/auth');
const { uploadImage, uploadDocumentMemory, uploadPDF } = require('../services/storageService');
const multer = require('multer');

// Most admin routes require admin or team admin authentication
// Specific routes that need super admin only will use isAdmin middleware

// Dashboard - accessible by admin or team admin
router.get('/dashboard', isAdminOrTeamAdmin, adminController.dashboard);

// Subjects - accessible by admin or team admin
router.get('/subjects', isAdminOrTeamAdmin, adminController.listSubjects);
router.get('/subjects/create', isAdminOrTeamAdmin, adminController.createSubjectForm);
router.post('/subjects/create', isAdminOrTeamAdmin, uploadImage.single('coverImage'), adminController.createSubject);
router.get('/subjects/edit/:id', isAdminOrTeamAdmin, adminController.editSubjectForm);
router.post('/subjects/edit/:id', isAdminOrTeamAdmin, uploadImage.single('coverImage'), adminController.updateSubject);
router.post('/subjects/delete/:id', isAdminOrTeamAdmin, adminController.deleteSubject);

// Topics - accessible by admin or team admin
router.get('/topics', isAdminOrTeamAdmin, adminController.listTopics);
router.get('/topics/create', isAdminOrTeamAdmin, adminController.createTopicForm);
router.post('/topics/create', isAdminOrTeamAdmin, uploadImage.single('coverImage'), adminController.createTopic);
router.get('/topics/edit/:id', isAdminOrTeamAdmin, adminController.editTopicForm);
router.post('/topics/edit/:id', isAdminOrTeamAdmin, uploadImage.single('coverImage'), adminController.updateTopic);
router.post('/topics/delete/:id', isAdminOrTeamAdmin, adminController.deleteTopic);

// Concepts - accessible by admin or team admin
router.get('/concepts', isAdminOrTeamAdmin, adminController.listConcepts);
router.get('/concepts/create', isAdminOrTeamAdmin, adminController.createConceptForm);

// Multer middleware for handling both coverImage and pdfFile
const conceptUpload = multer().fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'pdfFile', maxCount: 1 }
]);

router.post('/concepts/create', isAdminOrTeamAdmin, conceptUpload, adminController.createConcept);
router.get('/concepts/edit/:id', isAdminOrTeamAdmin, adminController.editConceptForm);
router.post('/concepts/edit/:id', isAdminOrTeamAdmin, conceptUpload, adminController.updateConcept);
router.post('/concepts/move/:id', isAdminOrTeamAdmin, adminController.moveConcept);
router.post('/concepts/delete/:id', isAdminOrTeamAdmin, adminController.deleteConcept);

// File upload (uses memory storage to read content without saving to disk/S3)
router.post('/upload-file', isAdminOrTeamAdmin, uploadDocumentMemory.single('file'), adminController.uploadFile);

// AI-powered content improvement
router.post('/ai-improve', isAdminOrTeamAdmin, adminController.aiImprove);
router.post('/ai-summarize', isAdminOrTeamAdmin, adminController.aiSummarize);

module.exports = router;
