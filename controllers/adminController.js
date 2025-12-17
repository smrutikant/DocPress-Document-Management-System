const { Subject, Topic, Concept, User } = require('../models/postgres');
const Content = require('../models/mongo/Content');
const slugify = require('../utils/slugify');
const { marked } = require('marked');
const fs = require('fs').promises;

// Helper function to normalize file path
const normalizeFilePath = (filePath) => {
  if (!filePath) return null;
  // If path doesn't start with /, add it (for local storage)
  return filePath.startsWith('/') ? filePath : `/${filePath}`;
};

// Dashboard
exports.dashboard = async (req, res) => {
  try {
    const subjectsCount = await Subject.count();
    const topicsCount = await Topic.count();
    const conceptsCount = await Concept.count();
    const usersCount = await User.count({ where: { role: 'user' } });

    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      stats: { subjectsCount, topicsCount, conceptsCount, usersCount }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    req.flash('error', 'Failed to load dashboard');
    res.redirect('/');
  }
};

// Subjects
exports.listSubjects = async (req, res) => {
  try {
    const subjects = await Subject.findAll({
      include: [{ model: User, as: 'author', attributes: ['username'] }],
      order: [['displayOrder', 'ASC'], ['createdAt', 'DESC']]
    });

    res.render('admin/subjects/list', {
      title: 'Manage Subjects',
      subjects
    });
  } catch (error) {
    console.error('List subjects error:', error);
    req.flash('error', 'Failed to load subjects');
    res.redirect('/admin/dashboard');
  }
};

exports.createSubjectForm = (req, res) => {
  res.render('admin/subjects/create', { title: 'Create Subject' });
};

exports.createSubject = async (req, res) => {
  try {
    const { title, description, displayOrder, isPublished } = req.body;
    const slug = slugify(title);
    const coverImage = req.file ? normalizeFilePath(req.file.path) : null;

    await Subject.create({
      title,
      slug,
      description,
      coverImage,
      authorId: req.session.userId,
      displayOrder: displayOrder || 0,
      isPublished: isPublished === 'on'
    });

    req.flash('success', 'Subject created successfully');
    res.redirect('/admin/subjects');
  } catch (error) {
    console.error('Create subject error:', error);
    req.flash('error', 'Failed to create subject');
    res.redirect('/admin/subjects/create');
  }
};

exports.editSubjectForm = async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id);
    if (!subject) {
      req.flash('error', 'Subject not found');
      return res.redirect('/admin/subjects');
    }

    res.render('admin/subjects/edit', { title: 'Edit Subject', subject });
  } catch (error) {
    console.error('Edit subject form error:', error);
    req.flash('error', 'Failed to load subject');
    res.redirect('/admin/subjects');
  }
};

exports.updateSubject = async (req, res) => {
  try {
    const { title, description, displayOrder, isPublished } = req.body;
    const subject = await Subject.findByPk(req.params.id);

    if (!subject) {
      req.flash('error', 'Subject not found');
      return res.redirect('/admin/subjects');
    }

    const slug = slugify(title);
    const coverImage = req.file ? normalizeFilePath(req.file.path) : subject.coverImage;

    await subject.update({
      title,
      slug,
      description,
      coverImage,
      displayOrder: displayOrder || 0,
      isPublished: isPublished === 'on'
    });

    req.flash('success', 'Subject updated successfully');
    res.redirect('/admin/subjects');
  } catch (error) {
    console.error('Update subject error:', error);
    req.flash('error', 'Failed to update subject');
    res.redirect(`/admin/subjects/edit/${req.params.id}`);
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id);
    if (!subject) {
      req.flash('error', 'Subject not found');
      return res.redirect('/admin/subjects');
    }

    await subject.destroy();
    req.flash('success', 'Subject deleted successfully');
    res.redirect('/admin/subjects');
  } catch (error) {
    console.error('Delete subject error:', error);
    req.flash('error', 'Failed to delete subject');
    res.redirect('/admin/subjects');
  }
};

// Topics
exports.listTopics = async (req, res) => {
  try {
    const topics = await Topic.findAll({
      include: [{ model: Subject, as: 'subject', attributes: ['title'] }],
      order: [['displayOrder', 'ASC'], ['createdAt', 'DESC']]
    });

    res.render('admin/topics/list', {
      title: 'Manage Topics',
      topics
    });
  } catch (error) {
    console.error('List topics error:', error);
    req.flash('error', 'Failed to load topics');
    res.redirect('/admin/dashboard');
  }
};

exports.createTopicForm = async (req, res) => {
  try {
    const subjects = await Subject.findAll({ where: { isPublished: true } });
    res.render('admin/topics/create', { title: 'Create Topic', subjects });
  } catch (error) {
    console.error('Create topic form error:', error);
    req.flash('error', 'Failed to load form');
    res.redirect('/admin/topics');
  }
};

exports.createTopic = async (req, res) => {
  try {
    const { title, description, subjectId, displayOrder, isPublished } = req.body;
    const slug = slugify(title);
    const coverImage = req.file ? normalizeFilePath(req.file.path) : null;

    await Topic.create({
      title,
      slug,
      description,
      subjectId,
      coverImage,
      displayOrder: displayOrder || 0,
      isPublished: isPublished === 'on'
    });

    req.flash('success', 'Topic created successfully');
    res.redirect('/admin/topics');
  } catch (error) {
    console.error('Create topic error:', error);
    req.flash('error', 'Failed to create topic');
    res.redirect('/admin/topics/create');
  }
};

exports.editTopicForm = async (req, res) => {
  try {
    const topic = await Topic.findByPk(req.params.id);
    const subjects = await Subject.findAll({ where: { isPublished: true } });

    if (!topic) {
      req.flash('error', 'Topic not found');
      return res.redirect('/admin/topics');
    }

    res.render('admin/topics/edit', { title: 'Edit Topic', topic, subjects });
  } catch (error) {
    console.error('Edit topic form error:', error);
    req.flash('error', 'Failed to load topic');
    res.redirect('/admin/topics');
  }
};

exports.updateTopic = async (req, res) => {
  try {
    const { title, description, subjectId, displayOrder, isPublished } = req.body;
    const topic = await Topic.findByPk(req.params.id);

    if (!topic) {
      req.flash('error', 'Topic not found');
      return res.redirect('/admin/topics');
    }

    const slug = slugify(title);
    const coverImage = req.file ? normalizeFilePath(req.file.path) : topic.coverImage;

    await topic.update({
      title,
      slug,
      description,
      subjectId,
      coverImage,
      displayOrder: displayOrder || 0,
      isPublished: isPublished === 'on'
    });

    req.flash('success', 'Topic updated successfully');
    res.redirect('/admin/topics');
  } catch (error) {
    console.error('Update topic error:', error);
    req.flash('error', 'Failed to update topic');
    res.redirect(`/admin/topics/edit/${req.params.id}`);
  }
};

exports.deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findByPk(req.params.id);
    if (!topic) {
      req.flash('error', 'Topic not found');
      return res.redirect('/admin/topics');
    }

    await topic.destroy();
    req.flash('success', 'Topic deleted successfully');
    res.redirect('/admin/topics');
  } catch (error) {
    console.error('Delete topic error:', error);
    req.flash('error', 'Failed to delete topic');
    res.redirect('/admin/topics');
  }
};

// Concepts
exports.listConcepts = async (req, res) => {
  try {
    const concepts = await Concept.findAll({
      include: [
        {
          model: Topic,
          as: 'topic',
          attributes: ['title'],
          include: [{ model: Subject, as: 'subject', attributes: ['title'] }]
        }
      ],
      order: [['displayOrder', 'ASC'], ['createdAt', 'DESC']]
    });

    const topics = await Topic.findAll({
      where: { isPublished: true },
      include: [{ model: Subject, as: 'subject', attributes: ['title'] }],
      order: [['displayOrder', 'ASC']]
    });

    res.render('admin/concepts/list', {
      title: 'Manage Concepts',
      concepts,
      topics
    });
  } catch (error) {
    console.error('List concepts error:', error);
    req.flash('error', 'Failed to load concepts');
    res.redirect('/admin/dashboard');
  }
};

exports.createConceptForm = async (req, res) => {
  try {
    const topics = await Topic.findAll({
      where: { isPublished: true },
      include: [{ model: Subject, as: 'subject', attributes: ['title'] }]
    });
    const selectedTopicId = req.query.topicId || null;
    res.render('admin/concepts/create', { title: 'Create Concept', topics, selectedTopicId });
  } catch (error) {
    console.error('Create concept form error:', error);
    req.flash('error', 'Failed to load form');
    res.redirect('/admin/concepts');
  }
};

exports.createConcept = async (req, res) => {
  try {
    const { title, topicId, displayOrder, isPublished, content } = req.body;
    const slug = slugify(title);
    const coverImage = req.file ? normalizeFilePath(req.file.path) : null;

    console.log('=== CREATE CONCEPT START ===');
    console.log('Content length from form:', content ? content.length : 0);
    console.log('Content preview:', content ? content.substring(0, 100) : 'EMPTY');

    // Create concept in PostgreSQL
    const concept = await Concept.create({
      title,
      slug,
      topicId,
      coverImage,
      displayOrder: displayOrder || 0,
      isPublished: isPublished === 'on',
      lastRevisedOn: new Date()
    });

    console.log('✅ Concept created in PostgreSQL, ID:', concept.id);

    // Create content in MongoDB
    const mongoContent = await Content.create({
      conceptId: concept.id,
      htmlContent: content || '',
      rawContent: content || '',
      contentType: 'quill',
      createdBy: req.session.userId,
      lastModifiedBy: req.session.userId,
      revisions: []
    });

    console.log('✅ Content saved to MongoDB, _id:', mongoContent._id.toString());
    console.log('Content in MongoDB - htmlContent length:', mongoContent.htmlContent.length);

    // Update concept with content ID
    const updatedConcept = await concept.update({ contentId: mongoContent._id.toString() });

    console.log('✅ Concept updated with contentId:', updatedConcept.contentId);
    console.log('=== CREATE CONCEPT END ===');

    req.flash('success', 'Concept created successfully');
    res.redirect('/admin/concepts');
  } catch (error) {
    console.error('Create concept error:', error);
    req.flash('error', 'Failed to create concept');
    res.redirect('/admin/concepts/create');
  }
};

exports.editConceptForm = async (req, res) => {
  try {
    const concept = await Concept.findByPk(req.params.id);
    const topics = await Topic.findAll({
      where: { isPublished: true },
      include: [{ model: Subject, as: 'subject', attributes: ['title'] }]
    });

    if (!concept) {
      req.flash('error', 'Concept not found');
      return res.redirect('/admin/concepts');
    }

    console.log('Loading concept for edit:', {
      conceptId: concept.id,
      contentId: concept.contentId,
      title: concept.title
    });

    // Get content from MongoDB
    let content = null;
    if (concept.contentId) {
      content = await Content.findOne({ conceptId: concept.id });
      console.log('Content found in MongoDB:', {
        found: !!content,
        htmlLength: content ? content.htmlContent.length : 0,
        rawLength: content ? content.rawContent.length : 0
      });
    } else {
      console.log('No contentId set on concept');
    }

    const contentHtml = content ? content.htmlContent : '';
    console.log('Sending content to edit view, length:', contentHtml.length);

    res.render('admin/concepts/edit', {
      title: 'Edit Concept',
      concept,
      topics,
      content: contentHtml
    });
  } catch (error) {
    console.error('Edit concept form error:', error);
    req.flash('error', 'Failed to load concept');
    res.redirect('/admin/concepts');
  }
};

exports.updateConcept = async (req, res) => {
  try {
    const { title, topicId, displayOrder, isPublished, content } = req.body;
    const concept = await Concept.findByPk(req.params.id);

    if (!concept) {
      req.flash('error', 'Concept not found');
      return res.redirect('/admin/concepts');
    }

    const slug = slugify(title);
    const coverImage = req.file ? normalizeFilePath(req.file.path) : concept.coverImage;

    // Update concept
    await concept.update({
      title,
      slug,
      topicId,
      coverImage,
      displayOrder: displayOrder || 0,
      isPublished: isPublished === 'on',
      lastRevisedOn: new Date()
    });

    // Update content in MongoDB
    if (concept.contentId) {
      const existingContent = await Content.findOne({ conceptId: concept.id });
      if (existingContent) {
        // Add old content to revisions
        existingContent.revisions.push({
          content: existingContent.rawContent,
          revisedBy: req.session.userId,
          revisedAt: new Date()
        });

        existingContent.htmlContent = content || '';
        existingContent.rawContent = content || '';
        existingContent.lastModifiedBy = req.session.userId;

        // Ensure createdBy exists (for documents created before this field was required)
        if (!existingContent.createdBy) {
          existingContent.createdBy = req.session.userId;
        }

        await existingContent.save();
      }
    }

    req.flash('success', 'Concept updated successfully');
    res.redirect('/admin/concepts');
  } catch (error) {
    console.error('Update concept error:', error);
    req.flash('error', 'Failed to update concept');
    res.redirect(`/admin/concepts/edit/${req.params.id}`);
  }
};

exports.moveConcept = async (req, res) => {
  try {
    const { newTopicId } = req.body;
    const concept = await Concept.findByPk(req.params.id);

    if (!concept) {
      req.flash('error', 'Concept not found');
      return res.redirect('/admin/concepts');
    }

    // Verify new topic exists
    const newTopic = await Topic.findByPk(newTopicId);
    if (!newTopic) {
      req.flash('error', 'Target topic not found');
      return res.redirect('/admin/concepts');
    }

    // Update concept's topic
    await concept.update({
      topicId: newTopicId,
      lastRevisedOn: new Date()
    });

    req.flash('success', `Concept moved to topic "${newTopic.title}" successfully`);
    res.redirect('/admin/concepts');
  } catch (error) {
    console.error('Move concept error:', error);
    req.flash('error', 'Failed to move concept');
    res.redirect('/admin/concepts');
  }
};

exports.deleteConcept = async (req, res) => {
  try {
    const concept = await Concept.findByPk(req.params.id);
    if (!concept) {
      req.flash('error', 'Concept not found');
      return res.redirect('/admin/concepts');
    }

    // Delete content from MongoDB
    if (concept.contentId) {
      await Content.deleteOne({ conceptId: concept.id });
    }

    await concept.destroy();
    req.flash('success', 'Concept deleted successfully');
    res.redirect('/admin/concepts');
  } catch (error) {
    console.error('Delete concept error:', error);
    req.flash('error', 'Failed to delete concept');
    res.redirect('/admin/concepts');
  }
};

// Upload HTML/MD file
exports.uploadFile = async (req, res) => {
  try {
    console.log('Upload file request received');

    if (!req.file) {
      console.error('No file in request');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('File details:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      hasBuffer: !!req.file.buffer,
      hasPath: !!req.file.path
    });

    let fileContent;

    // Check if file has a buffer (multer memory storage) or path (disk storage)
    if (req.file.buffer) {
      console.log('Reading from buffer');
      fileContent = req.file.buffer.toString('utf-8');
    } else if (req.file.path) {
      console.log('Reading from path:', req.file.path);
      fileContent = await fs.readFile(req.file.path, 'utf-8');
      // Delete the uploaded file after reading (only for local storage)
      await fs.unlink(req.file.path).catch(err => console.error('Error deleting temp file:', err));
    } else {
      console.error('No buffer or path found in uploaded file');
      return res.status(400).json({ error: 'Invalid file upload' });
    }

    let htmlContent = fileContent;

    // Convert markdown to HTML if needed
    if (req.file.originalname.endsWith('.md') || req.file.originalname.endsWith('.markdown')) {
      console.log('Converting markdown to HTML');
      htmlContent = marked(fileContent);
    }

    console.log('File processed successfully, content length:', htmlContent.length);
    res.json({ success: true, content: htmlContent });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({
      error: error.message || 'Failed to process file',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
