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

const attachUserToViews = (req, res, next) => {
  res.locals.user = req.session.userId ? {
    id: req.session.userId,
    username: req.session.username,
    role: req.session.userRole,
    profilePicture: req.session.profilePicture
  } : null;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentPath = req.path;
  next();
};

module.exports = {
  isAuthenticated,
  isAdmin,
  isUser,
  attachUserToViews
};
