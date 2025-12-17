const { Subject, Topic, Concept, User, Rating } = require('../models/postgres');
const Content = require('../models/mongo/Content');
const { Op } = require('sequelize');

// Home page
exports.home = async (req, res) => {
  try {
    const subjects = await Subject.findAll({
      where: { isPublished: true },
      include: [{ model: User, as: 'author', attributes: ['username'] }],
      order: [['displayOrder', 'ASC']],
      limit: 10
    });

    // Get recently updated concepts
    const recentConcepts = await Concept.findAll({
      where: { isPublished: true },
      include: [
        {
          model: Topic,
          as: 'topic',
          attributes: ['title', 'slug'],
          include: [{ model: Subject, as: 'subject', attributes: ['title', 'slug'] }]
        }
      ],
      order: [['lastRevisedOn', 'DESC']],
      limit: 5
    });

    res.render('user/home', {
      title: 'DocPress - Documentation Hub',
      subjects,
      recentConcepts
    });
  } catch (error) {
    console.error('Home page error:', error);
    req.flash('error', 'Failed to load home page');
    res.render('user/home', { title: 'DocPress', subjects: [], recentConcepts: [] });
  }
};

// Browse subjects
exports.browseSubjects = async (req, res) => {
  try {
    const subjects = await Subject.findAll({
      where: { isPublished: true },
      include: [
        { model: User, as: 'author', attributes: ['username'] },
        { model: Topic, as: 'topics', where: { isPublished: true }, required: false }
      ],
      order: [['displayOrder', 'ASC'], ['title', 'ASC']]
    });

    res.render('user/browse', {
      title: 'Browse Documentation',
      subjects
    });
  } catch (error) {
    console.error('Browse subjects error:', error);
    req.flash('error', 'Failed to load subjects');
    res.redirect('/');
  }
};

// View subject
exports.viewSubject = async (req, res) => {
  try {
    const subject = await Subject.findOne({
      where: { slug: req.params.subjectSlug, isPublished: true },
      include: [
        { model: User, as: 'author', attributes: ['username'] },
        {
          model: Topic,
          as: 'topics',
          where: { isPublished: true },
          required: false,
          order: [['displayOrder', 'ASC']]
        }
      ]
    });

    if (!subject) {
      req.flash('error', 'Subject not found');
      return res.redirect('/browse');
    }

    res.render('user/subject', {
      title: subject.title,
      subject
    });
  } catch (error) {
    console.error('View subject error:', error);
    req.flash('error', 'Failed to load subject');
    res.redirect('/browse');
  }
};

// View topic
exports.viewTopic = async (req, res) => {
  try {
    const topic = await Topic.findOne({
      where: { slug: req.params.topicSlug, isPublished: true },
      include: [
        {
          model: Subject,
          as: 'subject',
          where: { isPublished: true }
        },
        {
          model: Concept,
          as: 'concepts',
          where: { isPublished: true },
          required: false,
          order: [['displayOrder', 'ASC']]
        }
      ]
    });

    if (!topic) {
      req.flash('error', 'Topic not found');
      return res.redirect('/browse');
    }

    // Get average rating
    const ratings = await Rating.findAll({
      where: { topicId: topic.id },
      attributes: ['rating']
    });

    const avgRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;

    // Get user's rating if logged in
    let userRating = null;
    if (req.session.userId) {
      userRating = await Rating.findOne({
        where: { topicId: topic.id, userId: req.session.userId }
      });
    }

    res.render('user/topic', {
      title: topic.title,
      topic,
      avgRating: avgRating.toFixed(1),
      ratingsCount: ratings.length,
      userRating: userRating ? userRating.rating : 0
    });
  } catch (error) {
    console.error('View topic error:', error);
    req.flash('error', 'Failed to load topic');
    res.redirect('/browse');
  }
};

// View concept (documentation page)
exports.viewConcept = async (req, res) => {
  try {
    const concept = await Concept.findOne({
      where: { slug: req.params.conceptSlug, isPublished: true },
      include: [
        {
          model: Topic,
          as: 'topic',
          where: { isPublished: true },
          include: [
            {
              model: Subject,
              as: 'subject',
              where: { isPublished: true }
            }
          ]
        }
      ]
    });

    if (!concept) {
      req.flash('error', 'Concept not found');
      return res.redirect('/browse');
    }

    // Get content from MongoDB
    const content = await Content.findOne({ conceptId: concept.id });

    // Get all concepts in the same topic for navigation
    const allConcepts = await Concept.findAll({
      where: { topicId: concept.topicId, isPublished: true },
      order: [['displayOrder', 'ASC']],
      attributes: ['id', 'title', 'slug', 'displayOrder']
    });

    // Find current, previous, and next concepts
    const currentIndex = allConcepts.findIndex(c => c.id === concept.id);
    const previousConcept = currentIndex > 0 ? allConcepts[currentIndex - 1] : null;
    const nextConcept = currentIndex < allConcepts.length - 1 ? allConcepts[currentIndex + 1] : null;

    // Get sidebar topics for navigation
    const sidebarTopics = await Topic.findAll({
      where: { subjectId: concept.topic.subjectId, isPublished: true },
      include: [
        {
          model: Concept,
          as: 'concepts',
          where: { isPublished: true },
          required: false,
          attributes: ['id', 'title', 'slug']
        }
      ],
      order: [['displayOrder', 'ASC'], [{ model: Concept, as: 'concepts' }, 'displayOrder', 'ASC']]
    });

    // Get related topics for right sidebar
    const relatedTopics = await Topic.findAll({
      where: {
        subjectId: concept.topic.subjectId,
        isPublished: true,
        id: { [Op.ne]: concept.topicId }
      },
      attributes: ['id', 'title', 'slug', 'description'],
      limit: 5
    });

    // Get average rating
    const ratings = await Rating.findAll({
      where: { conceptId: concept.id },
      attributes: ['rating']
    });

    const avgRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;

    // Get user's rating if logged in
    let userRating = null;
    if (req.session.userId) {
      userRating = await Rating.findOne({
        where: { conceptId: concept.id, userId: req.session.userId }
      });
    }

    // Get all ratings with comments and user info
    const ratingsWithComments = await Rating.findAll({
      where: {
        conceptId: concept.id,
        comment: {
          [Op.ne]: null,
          [Op.ne]: ''
        }
      },
      include: [{
        model: User,
        as: 'user',
        attributes: ['username', 'profilePicture']
      }],
      order: [['createdAt', 'DESC']]
    });

    // console.log('Fetching ratings for concept:', concept.id);
    // console.log('Ratings with comments found:', ratingsWithComments.length);

    res.render('user/concept', {
      title: concept.title,
      concept,
      content: content ? content.htmlContent : '',
      previousConcept,
      nextConcept,
      sidebarTopics,
      relatedTopics,
      avgRating: avgRating.toFixed(1),
      ratingsCount: ratings.length,
      userRating: userRating ? userRating.rating : 0,
      ratingsWithComments: ratingsWithComments || []
    });
  } catch (error) {
    console.error('View concept error:', error);
    req.flash('error', 'Failed to load concept');
    res.redirect('/browse');
  }
};

// Search
exports.search = async (req, res) => {
  try {
    const { q, author, topic } = req.query;
    let concepts = [];

    if (q) {
      // Search in MongoDB content
      const contentResults = await Content.find(
        { $text: { $search: q } },
        { score: { $meta: 'textScore' } }
      ).sort({ score: { $meta: 'textScore' } }).limit(50);

      const conceptIds = contentResults.map(c => c.conceptId);

      // Get concept details from PostgreSQL
      concepts = await Concept.findAll({
        where: {
          id: { [Op.in]: conceptIds },
          isPublished: true
        },
        include: [
          {
            model: Topic,
            as: 'topic',
            attributes: ['title', 'slug'],
            include: [{ model: Subject, as: 'subject', attributes: ['title', 'slug'] }]
          }
        ]
      });
    }

    // Search by author
    if (author) {
      const subjects = await Subject.findAll({
        where: { isPublished: true },
        include: [
          {
            model: User,
            as: 'author',
            where: { username: { [Op.iLike]: `%${author}%` } }
          },
          {
            model: Topic,
            as: 'topics',
            where: { isPublished: true },
            required: false,
            include: [
              {
                model: Concept,
                as: 'concepts',
                where: { isPublished: true },
                required: false
              }
            ]
          }
        ]
      });

      // Flatten concepts from subjects
      subjects.forEach(subject => {
        subject.topics.forEach(t => {
          concepts.push(...t.concepts);
        });
      });
    }

    // Search by topic
    if (topic) {
      const topicResults = await Topic.findAll({
        where: {
          title: { [Op.iLike]: `%${topic}%` },
          isPublished: true
        },
        include: [
          {
            model: Concept,
            as: 'concepts',
            where: { isPublished: true },
            required: false,
            include: [
              {
                model: Topic,
                as: 'topic',
                attributes: ['title', 'slug'],
                include: [{ model: Subject, as: 'subject', attributes: ['title', 'slug'] }]
              }
            ]
          }
        ]
      });

      topicResults.forEach(t => {
        concepts.push(...t.concepts);
      });
    }

    res.render('user/search', {
      title: 'Search Results',
      concepts,
      query: { q, author, topic }
    });
  } catch (error) {
    console.error('Search error:', error);
    req.flash('error', 'Search failed');
    res.redirect('/');
  }
};

// Rate concept
exports.rateConcept = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const conceptId = req.params.id;

    // Check if user already rated
    const existingRating = await Rating.findOne({
      where: { conceptId, userId: req.session.userId }
    });

    if (existingRating) {
      await existingRating.update({ rating, comment });
    } else {
      await Rating.create({
        conceptId,
        userId: req.session.userId,
        rating,
        comment
      });
    }

    req.flash('success', 'Thank you for your rating!');
    res.redirect('back');
  } catch (error) {
    console.error('Rate concept error:', error);
    req.flash('error', 'Failed to submit rating');
    res.redirect('back');
  }
};

// Rate topic
exports.rateTopic = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const topicId = req.params.id;

    // Check if user already rated
    const existingRating = await Rating.findOne({
      where: { topicId, userId: req.session.userId }
    });

    if (existingRating) {
      await existingRating.update({ rating, comment });
    } else {
      await Rating.create({
        topicId,
        userId: req.session.userId,
        rating,
        comment
      });
    }

    req.flash('success', 'Thank you for your rating!');
    res.redirect('back');
  } catch (error) {
    console.error('Rate topic error:', error);
    req.flash('error', 'Failed to submit rating');
    res.redirect('back');
  }
};

// Search concepts and topics API
exports.searchConcepts = async (req, res) => {
  try {
    const query = req.query.q || '';

    if (query.length < 2) {
      return res.json([]);
    }

    // Search for concepts
    const concepts = await Concept.findAll({
      where: {
        isPublished: true,
        title: {
          [Op.iLike]: `%${query}%`
        }
      },
      include: [
        {
          model: Topic,
          as: 'topic',
          attributes: ['title', 'slug', 'coverImage'],
          where: { isPublished: true },
          include: [
            {
              model: Subject,
              as: 'subject',
              attributes: ['title', 'slug', 'coverImage'],
              where: { isPublished: true }
            }
          ]
        }
      ],
      attributes: ['title', 'slug', 'coverImage'],
      limit: 8,
      order: [['title', 'ASC']]
    });

    // Search for topics
    const topics = await Topic.findAll({
      where: {
        isPublished: true,
        title: {
          [Op.iLike]: `%${query}%`
        }
      },
      include: [
        {
          model: Subject,
          as: 'subject',
          attributes: ['title', 'slug', 'coverImage'],
          where: { isPublished: true }
        },
        {
          model: Concept,
          as: 'concepts',
          where: { isPublished: true },
          required: false,
          attributes: ['slug'],
          limit: 1,
          order: [['displayOrder', 'ASC']]
        }
      ],
      attributes: ['title', 'slug', 'coverImage'],
      limit: 5,
      order: [['title', 'ASC']]
    });

    // Map concepts results
    const conceptResults = concepts.map(concept => ({
      type: 'concept',
      title: concept.title,
      subject: concept.topic.subject.title,
      topic: concept.topic.title,
      coverImage: concept.coverImage || concept.topic.coverImage || concept.topic.subject.coverImage || null,
      url: `/docs/${concept.topic.subject.slug}/${concept.topic.slug}/${concept.slug}`
    }));

    // Map topics results
    const topicResults = topics.map(topic => {
      const firstConcept = topic.concepts && topic.concepts.length > 0 ? topic.concepts[0] : null;
      return {
        type: 'topic',
        title: topic.title,
        subject: topic.subject.title,
        coverImage: topic.coverImage || topic.subject.coverImage || null,
        url: firstConcept
          ? `/docs/${topic.subject.slug}/${topic.slug}/${firstConcept.slug}`
          : `/topic/${topic.slug}`
      };
    });

    // Combine and limit results
    const allResults = [...topicResults, ...conceptResults].slice(0, 10);

    res.json(allResults);
  } catch (error) {
    console.error('Search concepts error:', error);
    res.status(500).json([]);
  }
};

// View user profile
exports.viewProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.session.userId, {
      attributes: ['id', 'username', 'email', 'profilePicture', 'role', 'createdAt']
    });

    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/');
    }

    // Get all user's ratings with comments
    const userComments = await Rating.findAll({
      where: {
        userId: user.id,
        comment: {
          [Op.ne]: null,
          [Op.ne]: ''
        }
      },
      include: [
        {
          model: Concept,
          as: 'concept',
          attributes: ['id', 'title', 'slug'],
          required: false,
          include: [{
            model: Topic,
            as: 'topic',
            attributes: ['slug'],
            include: [{
              model: Subject,
              as: 'subject',
              attributes: ['slug']
            }]
          }]
        },
        {
          model: Topic,
          as: 'topic',
          attributes: ['id', 'title', 'slug'],
          required: false,
          include: [{
            model: Subject,
            as: 'subject',
            attributes: ['slug']
          }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Get user's rating statistics
    const totalRatings = await Rating.count({
      where: { userId: user.id }
    });

    const avgRatingGiven = await Rating.findAll({
      where: { userId: user.id },
      attributes: ['rating']
    });

    const avgRating = avgRatingGiven.length > 0
      ? avgRatingGiven.reduce((sum, r) => sum + r.rating, 0) / avgRatingGiven.length
      : 0;

    res.render('user/profile', {
      title: 'My Profile',
      profileUser: user,
      userComments,
      totalRatings,
      avgRating: avgRating.toFixed(1)
    });
  } catch (error) {
    console.error('View profile error:', error);
    req.flash('error', 'Failed to load profile');
    res.redirect('/');
  }
};
