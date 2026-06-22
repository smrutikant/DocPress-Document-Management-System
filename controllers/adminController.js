const { Subject, Topic, Concept, User, Team, TeamMember } = require('../models/postgres');
const Content = require('../models/mongo/Content');
const slugify = require('../utils/slugify');
const { marked } = require('marked');
const fs = require('fs').promises;
const { Op } = require('sequelize');
const { uploadImage, uploadPDF } = require('../services/storageService');
const path = require('path');
const aiService = require('../services/aiService');

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
    let whereClause = {
      isPublished: true  // Only show published subjects
    };

    // If user is team admin (not super admin), filter by their teams
    if (req.isTeamAdmin && !req.isGlobalAdmin) {
      const userTeams = await TeamMember.findAll({
        where: { userId: req.session.userId, role: 'admin' },
        attributes: ['teamId']
      });
      const teamIds = userTeams.map(tm => tm.teamId);

      whereClause = {
        isPublished: true,  // Only show published subjects
        [Op.or]: [
          { visibility: 'public' },
          { teamId: { [Op.in]: teamIds } }
        ]
      };
    }

    const subjects = await Subject.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'author', attributes: ['username'] },
        { model: Team, as: 'team', attributes: ['name'], required: false }
      ],
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

exports.createSubjectForm = async (req, res) => {
  try {
    // Get user's teams if they're a team admin
    let userTeams = [];
    if (req.isTeamAdmin && !req.isGlobalAdmin) {
      const memberships = await TeamMember.findAll({
        where: { userId: req.session.userId, role: 'admin' },
        include: [{ model: Team, as: 'team', attributes: ['id', 'name'] }]
      });
      userTeams = memberships.map(m => m.team);
    }

    res.render('admin/subjects/create', {
      title: 'Create Subject',
      userTeams,
      isGlobalAdmin: req.isGlobalAdmin || false
    });
  } catch (error) {
    console.error('Create subject form error:', error);
    req.flash('error', 'Failed to load form');
    res.redirect('/admin/subjects');
  }
};

exports.createSubject = async (req, res) => {
  try {
    const { title, description, displayOrder, isPublished, visibility, teamId } = req.body;
    const slug = slugify(title);
    const coverImage = req.file ? normalizeFilePath(req.file.path) : null;

    let requiresApproval = false;

    // Check if user is team member (requires approval) or team admin (no approval)
    if (visibility === 'team' && teamId) {
      const membership = await TeamMember.findOne({
        where: {
          userId: req.session.userId,
          teamId: teamId
        }
      });

      if (membership) {
        // Team members need approval from team admin
        if (membership.role === 'member') {
          requiresApproval = true;
        }
      } else if (!req.isGlobalAdmin) {
        // Not a member and not super admin
        req.flash('error', 'You can only create documentation for teams you belong to');
        return res.redirect('/admin/subjects/create');
      }
    }

    await Subject.create({
      title,
      slug,
      description,
      coverImage,
      authorId: req.session.userId,
      teamId: visibility === 'team' ? teamId : null,
      visibility: visibility || 'public',
      displayOrder: displayOrder || 0,
      isPublished: requiresApproval ? false : (isPublished === 'on'),
      requiresApproval: requiresApproval
    });

    if (requiresApproval) {
      req.flash('success', 'Subject created and submitted for team admin approval');
    } else {
      req.flash('success', 'Subject created successfully');
    }

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
    const { title, description, displayOrder, isPublished, visibility, teamId } = req.body;
    const subject = await Subject.findByPk(req.params.id);

    if (!subject) {
      req.flash('error', 'Subject not found');
      return res.redirect('/admin/subjects');
    }

    // Validate team admin can only edit their team's content
    if (req.isTeamAdmin && !req.isGlobalAdmin) {
      if (subject.teamId) {
        const canManage = await TeamMember.findOne({
          where: {
            userId: req.session.userId,
            teamId: subject.teamId,
            role: 'admin'
          }
        });

        if (!canManage) {
          req.flash('error', 'You can only edit documentation for teams you manage');
          return res.redirect('/admin/subjects');
        }
      }

      // Also validate new team if changing
      if (visibility === 'team' && teamId && teamId !== subject.teamId) {
        const canManageNewTeam = await TeamMember.findOne({
          where: {
            userId: req.session.userId,
            teamId: teamId,
            role: 'admin'
          }
        });

        if (!canManageNewTeam) {
          req.flash('error', 'You can only assign documentation to teams you manage');
          return res.redirect(`/admin/subjects/edit/${req.params.id}`);
        }
      }
    }

    const slug = slugify(title);
    const coverImage = req.file ? normalizeFilePath(req.file.path) : subject.coverImage;

    await subject.update({
      title,
      slug,
      description,
      coverImage,
      teamId: visibility === 'team' ? teamId : null,
      visibility: visibility || 'public',
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

    // Validate team admin can only delete their team's content
    if (req.isTeamAdmin && !req.isGlobalAdmin) {
      if (subject.teamId) {
        const canManage = await TeamMember.findOne({
          where: {
            userId: req.session.userId,
            teamId: subject.teamId,
            role: 'admin'
          }
        });

        if (!canManage) {
          req.flash('error', 'You can only delete documentation for teams you manage');
          return res.redirect('/admin/subjects');
        }
      } else {
        // Team admins cannot delete public content
        req.flash('error', 'You cannot delete public documentation');
        return res.redirect('/admin/subjects');
      }
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
    const selectedSubjectId = req.query.subjectId || null;
    res.render('admin/topics/create', { title: 'Create Topic', subjects, selectedSubjectId });
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
    // Fetch all published subjects with their topics and concepts
    const subjects = await Subject.findAll({
      where: { isPublished: true },
      include: [
        {
          model: Topic,
          as: 'topics',
          include: [
            {
              model: Concept,
              as: 'concepts',
              order: [['displayOrder', 'ASC'], ['createdAt', 'DESC']]
            }
          ]
        }
      ],
      order: [
        ['displayOrder', 'ASC'],
        [{ model: Topic, as: 'topics' }, 'displayOrder', 'ASC']
      ]
    });

    // Fetch all topics for the move modal
    const topics = await Topic.findAll({
      where: { isPublished: true },
      include: [{ model: Subject, as: 'subject', attributes: ['title'] }],
      order: [['displayOrder', 'ASC']]
    });

    res.render('admin/concepts/list', {
      title: 'Manage Concepts',
      subjects,
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
    const { title, topicId, displayOrder, isPublished, content, contentType } = req.body;
    const slug = slugify(title);

    // Handle coverImage from req.files
    let coverImage = null;
    if (req.files && req.files.coverImage && req.files.coverImage[0]) {
      // Process cover image using uploadImage middleware
      const coverFile = req.files.coverImage[0];
      const uploadDir = process.env.STORAGE_TYPE === 's3' ? null : 'uploads';

      if (!uploadDir || process.env.STORAGE_TYPE !== 's3') {
        const uploadPath = path.join('uploads', `coverImage-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(coverFile.originalname)}`);
        await fs.writeFile(uploadPath, coverFile.buffer);
        coverImage = normalizeFilePath(uploadPath);
      }
    }

    console.log('=== CREATE CONCEPT START ===');
    console.log('Content Type:', contentType);

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

    let mongoContent;

    // Check if PDF or Editor content
    if (contentType === 'pdf' && req.files && req.files.pdfFile && req.files.pdfFile[0]) {
      // Handle PDF upload
      const pdfFile = req.files.pdfFile[0];
      const contentStorageType = process.env.CONTENT_STORAGE_TYPE || process.env.STORAGE_TYPE || 'local';

      let pdfUrl, pdfFilename;

      if (contentStorageType === 's3') {
        // TODO: Upload to S3 (implement later)
        throw new Error('S3 upload for PDF not yet implemented');
      } else {
        // Save to local storage: uploads/content/
        const contentDir = 'uploads/content';
        await fs.mkdir(contentDir, { recursive: true });

        pdfFilename = `pdf-${Date.now()}-${Math.round(Math.random() * 1E9)}.pdf`;
        const pdfPath = path.join(contentDir, pdfFilename);

        await fs.writeFile(pdfPath, pdfFile.buffer);
        pdfUrl = `/uploads/content/${pdfFilename}`;
      }

      console.log('✅ PDF saved:', pdfUrl);

      // Create content in MongoDB with PDF type
      mongoContent = await Content.create({
        conceptId: concept.id,
        htmlContent: '', // Empty for PDF
        rawContent: '', // Empty for PDF
        contentType: 'pdf',
        pdfUrl: pdfUrl,
        pdfFilename: pdfFilename,
        createdBy: req.session.userId,
        lastModifiedBy: req.session.userId,
        revisions: []
      });
    } else {
      // Handle regular editor content
      console.log('Content length from form:', content ? content.length : 0);
      console.log('Content preview:', content ? content.substring(0, 100) : 'EMPTY');

      mongoContent = await Content.create({
        conceptId: concept.id,
        htmlContent: content || '',
        rawContent: content || '',
        contentType: 'quill',
        createdBy: req.session.userId,
        lastModifiedBy: req.session.userId,
        revisions: []
      });
    }

    console.log('✅ Content saved to MongoDB, _id:', mongoContent._id.toString());

    // Update concept with content ID
    await concept.update({ contentId: mongoContent._id.toString() });

    console.log('✅ Concept updated with contentId');
    console.log('=== CREATE CONCEPT END ===');

    req.flash('success', 'Concept created successfully');
    res.redirect('/admin/concepts');
  } catch (error) {
    console.error('Create concept error:', error);
    req.flash('error', 'Failed to create concept: ' + error.message);
    res.redirect('/admin/concepts/create');
  }
};

exports.editConceptForm = async (req, res) => {
  try {
    const concept = await Concept.findByPk(req.params.id, {
      include: [
        {
          model: Topic,
          as: 'topic',
          include: [{ model: Subject, as: 'subject' }]
        }
      ]
    });
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
      content: content || { htmlContent: '', contentType: 'quill' }
    });
  } catch (error) {
    console.error('Edit concept form error:', error);
    req.flash('error', 'Failed to load concept');
    res.redirect('/admin/concepts');
  }
};

exports.updateConcept = async (req, res) => {
  try {
    const { title, topicId, displayOrder, isPublished, content, contentType } = req.body;
    const concept = await Concept.findByPk(req.params.id);

    if (!concept) {
      req.flash('error', 'Concept not found');
      return res.redirect('/admin/concepts');
    }

    const slug = slugify(title);

    // Handle coverImage from req.files
    let coverImage = concept.coverImage;
    if (req.files && req.files.coverImage && req.files.coverImage[0]) {
      const coverFile = req.files.coverImage[0];
      const uploadPath = path.join('uploads', `coverImage-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(coverFile.originalname)}`);
      await fs.writeFile(uploadPath, coverFile.buffer);
      coverImage = normalizeFilePath(uploadPath);
    }

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
        // Check if switching content types
        if (contentType === 'pdf' && req.files && req.files.pdfFile && req.files.pdfFile[0]) {
          // Switching to PDF or updating PDF
          const pdfFile = req.files.pdfFile[0];
          const contentStorageType = process.env.CONTENT_STORAGE_TYPE || process.env.STORAGE_TYPE || 'local';

          let pdfUrl, pdfFilename;

          if (contentStorageType === 's3') {
            throw new Error('S3 upload for PDF not yet implemented');
          } else {
            const contentDir = 'uploads/content';
            await fs.mkdir(contentDir, { recursive: true });

            pdfFilename = `pdf-${Date.now()}-${Math.round(Math.random() * 1E9)}.pdf`;
            const pdfPath = path.join(contentDir, pdfFilename);

            await fs.writeFile(pdfPath, pdfFile.buffer);
            pdfUrl = `/uploads/content/${pdfFilename}`;
          }

          // Add old content to revisions if changing from editor to PDF
          if (existingContent.contentType !== 'pdf') {
            existingContent.revisions.push({
              content: existingContent.rawContent,
              revisedBy: req.session.userId,
              revisedAt: new Date()
            });
          }

          existingContent.htmlContent = '';
          existingContent.rawContent = '';
          existingContent.contentType = 'pdf';
          existingContent.pdfUrl = pdfUrl;
          existingContent.pdfFilename = pdfFilename;
          existingContent.lastModifiedBy = req.session.userId;

        } else if (contentType === 'editor' || !contentType) {
          // Using editor content
          // Add old content to revisions
          existingContent.revisions.push({
            content: existingContent.rawContent,
            revisedBy: req.session.userId,
            revisedAt: new Date()
          });

          existingContent.htmlContent = content || '';
          existingContent.rawContent = content || '';
          existingContent.contentType = 'quill';
          existingContent.pdfUrl = null;
          existingContent.pdfFilename = null;
          existingContent.lastModifiedBy = req.session.userId;
        }

        // Ensure createdBy exists
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
    req.flash('error', 'Failed to update concept: ' + error.message);
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

// AI-powered content improvement
exports.aiImprove = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, error: 'No content provided' });
    }

    const improvedContent = await aiService.improveContent(content);

    res.json({
      success: true,
      improvedContent: improvedContent
    });
  } catch (error) {
    console.error('AI improve error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to improve content with AI'
    });
  }
};

// AI-powered content summarization
exports.aiSummarize = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, error: 'No content provided' });
    }

    const summary = await aiService.summarizeContent(content);

    res.json({
      success: true,
      summary: summary
    });
  } catch (error) {
    console.error('AI summarize error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to summarize content'
    });
  }
};
