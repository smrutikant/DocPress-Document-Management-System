const { Team, TeamMember, TeamRequest, User, Subject } = require('../models/postgres');
const slugify = require('../utils/slugify');
const { Op } = require('sequelize');

// List all teams (admin only)
exports.listTeams = async (req, res) => {
  try {
    const teams = await Team.findAll({
      include: [
        {
          model: TeamMember,
          as: 'members',
          include: [{ model: User, as: 'user', attributes: ['id', 'username', 'email'] }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.render('admin/teams/list', {
      title: 'Manage Teams',
      teams
    });
  } catch (error) {
    console.error('List teams error:', error);
    req.flash('error', 'Failed to load teams');
    res.redirect('/admin/dashboard');
  }
};

// Create team form (admin only)
exports.createTeamForm = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { role: 'user', isActive: true },
      attributes: ['id', 'username', 'email'],
      order: [['username', 'ASC']]
    });

    res.render('admin/teams/create', {
      title: 'Create Team',
      users
    });
  } catch (error) {
    console.error('Create team form error:', error);
    req.flash('error', 'Failed to load form');
    res.redirect('/admin/teams');
  }
};

// Create team (admin only)
exports.createTeam = async (req, res) => {
  try {
    const { name, description, teamAdmins } = req.body;
    const slug = slugify(name);

    // Create team
    const team = await Team.create({
      name,
      slug,
      description,
      isActive: true
    });

    // Add team admins if provided
    if (teamAdmins) {
      const adminIds = Array.isArray(teamAdmins) ? teamAdmins : [teamAdmins];

      for (const userId of adminIds) {
        await TeamMember.create({
          teamId: team.id,
          userId,
          role: 'admin'
        });
      }
    }

    req.flash('success', 'Team created successfully');
    res.redirect('/admin/teams');
  } catch (error) {
    console.error('Create team error:', error);
    req.flash('error', 'Failed to create team');
    res.redirect('/admin/teams/create');
  }
};

// Edit team form (admin only)
exports.editTeamForm = async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id, {
      include: [
        {
          model: TeamMember,
          as: 'members',
          include: [{ model: User, as: 'user', attributes: ['id', 'username', 'email'] }]
        }
      ]
    });

    if (!team) {
      req.flash('error', 'Team not found');
      return res.redirect('/admin/teams');
    }

    const allUsers = await User.findAll({
      where: { role: 'user', isActive: true },
      attributes: ['id', 'username', 'email'],
      order: [['username', 'ASC']]
    });

    // Get members and non-members
    const memberIds = team.members.map(m => m.userId);
    const members = team.members;
    const nonMembers = allUsers.filter(u => !memberIds.includes(u.id));

    res.render('admin/teams/edit', {
      title: 'Edit Team',
      team,
      members,
      nonMembers
    });
  } catch (error) {
    console.error('Edit team form error:', error);
    req.flash('error', 'Failed to load team');
    res.redirect('/admin/teams');
  }
};

// Update team (admin only)
exports.updateTeam = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;
    const team = await Team.findByPk(req.params.id);

    if (!team) {
      req.flash('error', 'Team not found');
      return res.redirect('/admin/teams');
    }

    const slug = slugify(name);

    await team.update({
      name,
      slug,
      description,
      isActive: isActive === 'on'
    });

    req.flash('success', 'Team updated successfully');
    res.redirect('/admin/teams');
  } catch (error) {
    console.error('Update team error:', error);
    req.flash('error', 'Failed to update team');
    res.redirect(`/admin/teams/edit/${req.params.id}`);
  }
};

// Delete team (admin only)
exports.deleteTeam = async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id);

    if (!team) {
      req.flash('error', 'Team not found');
      return res.redirect('/admin/teams');
    }

    await team.destroy();
    req.flash('success', 'Team deleted successfully');
    res.redirect('/admin/teams');
  } catch (error) {
    console.error('Delete team error:', error);
    req.flash('error', 'Failed to delete team');
    res.redirect('/admin/teams');
  }
};

// Add member to team (admin only)
exports.addMember = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const teamId = req.params.id;

    // Check if already a member
    const existing = await TeamMember.findOne({
      where: { teamId, userId }
    });

    if (existing) {
      return res.json({ success: false, message: 'User is already a member' });
    }

    await TeamMember.create({
      teamId,
      userId,
      role: role || 'member'
    });

    res.json({ success: true, message: 'Member added successfully' });
  } catch (error) {
    console.error('Add member error:', error);
    res.json({ success: false, message: 'Failed to add member' });
  }
};

// Remove member from team (admin only)
exports.removeMember = async (req, res) => {
  try {
    const { memberId } = req.params;

    const member = await TeamMember.findByPk(memberId);
    if (!member) {
      return res.json({ success: false, message: 'Member not found' });
    }

    await member.destroy();
    res.json({ success: true, message: 'Member removed successfully' });
  } catch (error) {
    console.error('Remove member error:', error);
    res.json({ success: false, message: 'Failed to remove member' });
  }
};

// Update member role (admin only)
exports.updateMemberRole = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { role } = req.body;

    const member = await TeamMember.findByPk(memberId);
    if (!member) {
      return res.json({ success: false, message: 'Member not found' });
    }

    await member.update({ role });
    res.json({ success: true, message: 'Member role updated successfully' });
  } catch (error) {
    console.error('Update member role error:', error);
    res.json({ success: false, message: 'Failed to update member role' });
  }
};

// Team join requests management (admin only)
exports.listTeamRequests = async (req, res) => {
  try {
    const requests = await TeamRequest.findAll({
      where: { status: 'pending' },
      include: [
        { model: Team, as: 'team', attributes: ['id', 'name'] },
        { model: User, as: 'user', attributes: ['id', 'username', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.render('admin/teams/requests', {
      title: 'Team Join Requests',
      requests
    });
  } catch (error) {
    console.error('List requests error:', error);
    req.flash('error', 'Failed to load requests');
    res.redirect('/admin/teams');
  }
};

// Approve/reject team request (team admin or superadmin)
exports.handleTeamRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { action } = req.body; // 'approve' or 'reject'

    const request = await TeamRequest.findByPk(requestId);
    if (!request) {
      return res.json({ success: false, message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.json({ success: false, message: 'Request already processed' });
    }

    // Check if user is team admin or superadmin
    if (req.session.role !== 'admin') {
      const isTeamAdmin = await TeamMember.findOne({
        where: {
          teamId: request.teamId,
          userId: req.session.userId,
          role: 'admin'
        }
      });

      if (!isTeamAdmin) {
        return res.json({ success: false, message: 'Not authorized' });
      }
    }

    if (action === 'approve') {
      // Add user to team
      await TeamMember.create({
        teamId: request.teamId,
        userId: request.userId,
        role: 'member'
      });

      await request.update({
        status: 'approved',
        respondedBy: req.session.userId,
        respondedAt: new Date()
      });

      res.json({ success: true, message: 'Request approved' });
    } else if (action === 'reject') {
      await request.update({
        status: 'rejected',
        respondedBy: req.session.userId,
        respondedAt: new Date()
      });

      res.json({ success: true, message: 'Request rejected' });
    } else {
      res.json({ success: false, message: 'Invalid action' });
    }
  } catch (error) {
    console.error('Handle request error:', error);
    res.json({ success: false, message: 'Failed to process request' });
  }
};

// User requests to join a team
exports.requestToJoinTeam = async (req, res) => {
  try {
    const { teamId, requestMessage } = req.body;
    const userId = req.session.userId;

    // Check if already a member
    const existing = await TeamMember.findOne({
      where: { teamId, userId }
    });

    if (existing) {
      req.flash('error', 'You are already a member of this team');
      return res.redirect('/teams');
    }

    // Check if already has pending request
    const pendingRequest = await TeamRequest.findOne({
      where: { teamId, userId, status: 'pending' }
    });

    if (pendingRequest) {
      req.flash('error', 'You already have a pending request for this team');
      return res.redirect('/teams');
    }

    await TeamRequest.create({
      teamId,
      userId,
      requestMessage,
      status: 'pending'
    });

    req.flash('success', 'Request sent successfully');
    res.redirect('/teams');
  } catch (error) {
    console.error('Request to join error:', error);
    req.flash('error', 'Failed to send request');
    res.redirect('/teams');
  }
};

// Team admin views their teams
exports.myTeams = async (req, res) => {
  try {
    const userId = req.session.userId;

    // Get teams where user is admin
    const teamMemberships = await TeamMember.findAll({
      where: { userId, role: 'admin' },
      include: [
        {
          model: Team,
          as: 'team',
          include: [
            {
              model: TeamMember,
              as: 'members',
              include: [{ model: User, as: 'user', attributes: ['id', 'username', 'email'] }]
            }
          ]
        }
      ]
    });

    const teams = teamMemberships.map(tm => tm.team);

    res.render('admin/teams/my-teams', {
      title: 'My Teams',
      teams
    });
  } catch (error) {
    console.error('My teams error:', error);
    req.flash('error', 'Failed to load teams');
    res.redirect('/admin/dashboard');
  }
};

// Team admin manages their specific team
exports.manageMyTeam = async (req, res) => {
  try {
    const teamId = req.params.id;
    const userId = req.session.userId;

    // Verify user is admin of this team (unless super admin)
    if (req.session.userRole !== 'admin') {
      const isAdmin = await TeamMember.findOne({
        where: { teamId, userId, role: 'admin' }
      });

      if (!isAdmin) {
        req.flash('error', 'You do not have permission to manage this team');
        return res.redirect('/admin/my-teams');
      }
    }

    const team = await Team.findByPk(teamId, {
      include: [
        {
          model: TeamMember,
          as: 'members',
          include: [{ model: User, as: 'user', attributes: ['id', 'username', 'email', 'profilePicture'] }]
        }
      ]
    });

    if (!team) {
      req.flash('error', 'Team not found');
      return res.redirect('/admin/my-teams');
    }

    const allUsers = await User.findAll({
      where: { role: 'user', isActive: true },
      attributes: ['id', 'username', 'email'],
      order: [['username', 'ASC']]
    });

    // Get members and non-members
    const memberIds = team.members.map(m => m.userId);
    const members = team.members;
    const nonMembers = allUsers.filter(u => !memberIds.includes(u.id));

    res.render('admin/teams/manage-team', {
      title: `Manage Team: ${team.name}`,
      team,
      members,
      nonMembers,
      isTeamAdmin: true
    });
  } catch (error) {
    console.error('Manage my team error:', error);
    req.flash('error', 'Failed to load team');
    res.redirect('/admin/my-teams');
  }
};

// Get pending approvals for team admin
exports.pendingApprovals = async (req, res) => {
  try {
    const userId = req.session.userId;

    // Get teams where user is admin
    const teamMemberships = await TeamMember.findAll({
      where: { userId, role: 'admin' },
      attributes: ['teamId']
    });

    const teamIds = teamMemberships.map(tm => tm.teamId);

    // Get subjects requiring approval from these teams
    const pendingSubjects = await Subject.findAll({
      where: {
        teamId: { [Op.in]: teamIds },
        requiresApproval: true,
        isPublished: false,
        approvedBy: null
      },
      include: [
        { model: User, as: 'author', attributes: ['username', 'email'] },
        { model: Team, as: 'team', attributes: ['name'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.render('admin/teams/pending-approvals', {
      title: 'Pending Approvals',
      pendingSubjects
    });
  } catch (error) {
    console.error('Pending approvals error:', error);
    req.flash('error', 'Failed to load pending approvals');
    res.redirect('/admin/dashboard');
  }
};

// Approve/reject subject
exports.handleApproval = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { action } = req.body;
    const userId = req.session.userId;

    const subject = await Subject.findByPk(subjectId);

    if (!subject) {
      return res.json({ success: false, message: 'Subject not found' });
    }

    // Verify user is admin of this team (unless super admin)
    if (req.session.userRole !== 'admin') {
      const isAdmin = await TeamMember.findOne({
        where: { teamId: subject.teamId, userId, role: 'admin' }
      });

      if (!isAdmin) {
        return res.json({ success: false, message: 'Not authorized' });
      }
    }

    if (action === 'approve') {
      await subject.update({
        requiresApproval: false,
        isPublished: true,
        approvedBy: userId,
        approvedAt: new Date()
      });

      res.json({ success: true, message: 'Subject approved and published' });
    } else if (action === 'reject') {
      // Could delete or mark as rejected
      await subject.destroy();
      res.json({ success: true, message: 'Subject rejected and deleted' });
    } else {
      res.json({ success: false, message: 'Invalid action' });
    }
  } catch (error) {
    console.error('Handle approval error:', error);
    res.json({ success: false, message: 'Failed to process approval' });
  }
};

// API: Get all active teams (for forms)
exports.getTeamsAPI = async (req, res) => {
  try {
    const teams = await Team.findAll({
      where: { isActive: true },
      attributes: ['id', 'name'],
      order: [['name', 'ASC']]
    });

    res.json(teams);
  } catch (error) {
    console.error('Get teams API error:', error);
    res.status(500).json({ error: 'Failed to load teams' });
  }
};

// List all teams for users (to request joining)
exports.listTeamsForUsers = async (req, res) => {
  try {
    const userId = req.session.userId;

    // Get all active teams
    const allTeams = await Team.findAll({
      where: { isActive: true },
      include: [
        {
          model: TeamMember,
          as: 'members',
          include: [{ model: User, as: 'user', attributes: ['username'] }]
        }
      ]
    });

    // Get user's memberships
    const userMemberships = await TeamMember.findAll({
      where: { userId },
      attributes: ['teamId', 'role']
    });

    const membershipMap = {};
    userMemberships.forEach(m => {
      membershipMap[m.teamId] = m.role;
    });

    // Get user's pending requests
    const pendingRequests = await TeamRequest.findAll({
      where: { userId, status: 'pending' },
      attributes: ['teamId']
    });

    const pendingRequestTeamIds = pendingRequests.map(r => r.teamId);

    res.render('user/teams', {
      title: 'Teams',
      teams: allTeams,
      membershipMap,
      pendingRequestTeamIds
    });
  } catch (error) {
    console.error('List teams for users error:', error);
    req.flash('error', 'Failed to load teams');
    res.redirect('/');
  }
};
