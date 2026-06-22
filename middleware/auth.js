const { TeamMember } = require('../models/postgres');

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  req.flash('error', 'Please log in to continue');
  res.redirect('/login');
};

const isAdmin = (req, res, next) => {
  if (req.session && req.session.userId && req.session.userRole === 'admin') {
    return next();
  }
  req.flash('error', 'Access denied. Admin privileges required.');
  res.redirect('/');
};

const isUser = (req, res, next) => {
  if (req.session && req.session.userId && req.session.userRole === 'user') {
    return next();
  }
  req.flash('error', 'Access denied.');
  res.redirect('/');
};

const attachUserToViews = async (req, res, next) => {
  if (req.session.userId) {
    // Check if user is a team admin
    let isTeamAdminUser = false;
    if (req.session.userRole !== 'admin') {
      const teamAdminMembership = await TeamMember.findOne({
        where: {
          userId: req.session.userId,
          role: 'admin'
        }
      });
      isTeamAdminUser = !!teamAdminMembership;
    }

    res.locals.user = {
      id: req.session.userId,
      username: req.session.username,
      role: req.session.userRole,
      profilePicture: req.session.profilePicture,
      isTeamAdmin: isTeamAdminUser,
      canAccessAdminPanel: req.session.userRole === 'admin' || isTeamAdminUser
    };
  } else {
    res.locals.user = null;
  }

  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentPath = req.path;
  next();
};

// Check if user is team admin for a specific team
const isTeamAdmin = async (req, res, next) => {
  try {
    // Check if user is authenticated first
    if (!req.session || !req.session.userId) {
      req.flash('error', 'Please log in to continue');
      return res.redirect('/login');
    }

    const teamId = req.params.teamId || req.body.teamId;
    const userId = req.session.userId;

    // Superadmin can access everything
    if (req.session.userRole === 'admin') {
      return next();
    }

    // Check if user is team admin
    const membership = await TeamMember.findOne({
      where: {
        teamId,
        userId,
        role: 'admin'
      }
    });

    if (membership) {
      return next();
    }

    req.flash('error', 'Access denied. Team admin privileges required.');
    res.redirect('/');
  } catch (error) {
    console.error('isTeamAdmin middleware error:', error);
    req.flash('error', 'Authorization check failed');
    res.redirect('/');
  }
};

// Check if user is team member (admin or member)
const isTeamMember = async (req, res, next) => {
  try {
    // Check if user is authenticated first
    if (!req.session || !req.session.userId) {
      req.flash('error', 'Please log in to continue');
      return res.redirect('/login');
    }

    const teamId = req.params.teamId || req.body.teamId;
    const userId = req.session.userId;

    // Superadmin can access everything
    if (req.session.userRole === 'admin') {
      return next();
    }

    // Check if user is team member
    const membership = await TeamMember.findOne({
      where: {
        teamId,
        userId
      }
    });

    if (membership) {
      req.teamMembership = membership; // Attach to request for later use
      return next();
    }

    req.flash('error', 'Access denied. Team membership required.');
    res.redirect('/');
  } catch (error) {
    console.error('isTeamMember middleware error:', error);
    req.flash('error', 'Authorization check failed');
    res.redirect('/');
  }
};

// Check if user is admin or team admin
const isAdminOrTeamAdmin = async (req, res, next) => {
  try {
    // Check if user is authenticated first
    if (!req.session || !req.session.userId) {
      req.flash('error', 'Please log in to continue');
      return res.redirect('/login');
    }

    const userId = req.session.userId;

    // Superadmin can access everything
    if (req.session.userRole === 'admin') {
      req.isGlobalAdmin = true;
      return next();
    }

    // Check if user is team admin of any team
    const membership = await TeamMember.findOne({
      where: {
        userId,
        role: 'admin'
      }
    });

    if (membership) {
      req.isTeamAdmin = true;
      return next();
    }

    req.flash('error', 'Access denied. Admin or team admin privileges required.');
    res.redirect('/');
  } catch (error) {
    console.error('isAdminOrTeamAdmin middleware error:', error);
    req.flash('error', 'Authorization check failed');
    res.redirect('/');
  }
};

module.exports = {
  isAuthenticated,
  isAdmin,
  isUser,
  isTeamAdmin,
  isTeamMember,
  isAdminOrTeamAdmin,
  attachUserToViews
};
