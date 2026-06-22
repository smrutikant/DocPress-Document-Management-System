const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { isAdmin, isAuthenticated, isAdminOrTeamAdmin } = require('../middleware/auth');

// Super Admin only - team management
router.get('/admin/teams', isAdmin, teamController.listTeams);
router.get('/admin/teams/create', isAdmin, teamController.createTeamForm);
router.post('/admin/teams/create', isAdmin, teamController.createTeam);
router.get('/admin/teams/edit/:id', isAdmin, teamController.editTeamForm);
router.post('/admin/teams/edit/:id', isAdmin, teamController.updateTeam);
router.post('/admin/teams/delete/:id', isAdmin, teamController.deleteTeam);

// Team admin routes - manage their own teams
router.get('/admin/my-teams', isAdminOrTeamAdmin, teamController.myTeams);
router.get('/admin/my-teams/manage/:id', isAdminOrTeamAdmin, teamController.manageMyTeam);
router.get('/admin/pending-approvals', isAdminOrTeamAdmin, teamController.pendingApprovals);
router.post('/admin/approvals/:subjectId/handle', isAdminOrTeamAdmin, teamController.handleApproval);

// Team member management (accessible by both super admin and team admin)
router.post('/admin/teams/:id/members/add', isAdminOrTeamAdmin, teamController.addMember);
router.post('/admin/teams/:id/members/:memberId/remove', isAdminOrTeamAdmin, teamController.removeMember);
router.post('/admin/teams/:id/members/:memberId/role', isAdminOrTeamAdmin, teamController.updateMemberRole);

// Team requests (accessible by both)
router.get('/admin/team-requests', isAdminOrTeamAdmin, teamController.listTeamRequests);
router.post('/admin/teams/requests/:requestId/handle', isAuthenticated, teamController.handleTeamRequest);

// API routes
router.get('/api/teams', isAuthenticated, teamController.getTeamsAPI);

// User routes
router.get('/teams', isAuthenticated, teamController.listTeamsForUsers);
router.post('/teams/request', isAuthenticated, teamController.requestToJoinTeam);

module.exports = router;
