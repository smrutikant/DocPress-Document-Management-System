# Team Management System Implementation

This document describes the team management system implemented for DocPress.

## Features Implemented

### 1. Team Management (Super Admin)
- ✅ Create teams with name, description, and slug
- ✅ Assign team admins from registered users
- ✅ A user can be team admin for multiple teams
- ✅ A team can have multiple team admins
- ✅ Edit team details and manage active/inactive status
- ✅ Delete teams (cascades to members and requests)

### 2. Team Member Management
- ✅ Super admin can assign users to teams
- ✅ User-friendly interface to add/remove members
- ✅ Change member roles (member ↔ admin)
- ✅ A person can be part of multiple teams
- ✅ View team members with their roles

### 3. Team Join Requests
- ✅ Users can request to join teams
- ✅ Team admins can approve/reject join requests
- ✅ Super admins can also manage all requests
- ✅ Optional message when requesting to join
- ✅ Pending request tracking to prevent duplicates

### 4. Team-Aware Documentation
- ✅ Subjects can be assigned to teams
- ✅ Visibility options: Public or Team-only
- ✅ Team admins can create documentation like main admin
- ✅ Documentation filtering by team membership
- ✅ Support for approval workflow (database ready)

### 5. Access Control
- ✅ Super admin has full access to all features
- ✅ Team admins can manage their teams
- ✅ Team members can view team documentation
- ✅ Middleware for permission checking

## Database Schema

### New Tables

#### `teams`
- `id` (UUID, PK)
- `name` (String, unique)
- `slug` (String, unique)
- `description` (Text, nullable)
- `isActive` (Boolean, default: true)
- `createdAt`, `updatedAt`

#### `team_members`
- `id` (UUID, PK)
- `teamId` (UUID, FK → teams)
- `userId` (UUID, FK → users)
- `role` (ENUM: 'admin', 'member')
- `joinedAt` (Date)
- `createdAt`, `updatedAt`
- Unique constraint on (teamId, userId)

#### `team_requests`
- `id` (UUID, PK)
- `teamId` (UUID, FK → teams)
- `userId` (UUID, FK → users)
- `status` (ENUM: 'pending', 'approved', 'rejected')
- `requestMessage` (Text, nullable)
- `respondedBy` (UUID, FK → users, nullable)
- `respondedAt` (Date, nullable)
- `createdAt`, `updatedAt`
- Unique constraint on (teamId, userId) where status='pending'

### Modified Tables

#### `subjects`
Added columns:
- `teamId` (UUID, FK → teams, nullable)
- `visibility` (ENUM: 'public', 'team', default: 'public')
- `requiresApproval` (Boolean, default: false)
- `approvedBy` (UUID, FK → users, nullable)
- `approvedAt` (Date, nullable)

## File Structure

### Models
```
models/postgres/
├── Team.js              # Team model
├── TeamMember.js        # Team membership model
├── TeamRequest.js       # Join request model
├── User.js              # Updated with team associations
├── Subject.js           # Updated with team fields
└── index.js             # Updated to register new models
```

### Controllers
```
controllers/
├── teamController.js    # Team CRUD and membership management
└── adminController.js   # Updated for team-aware subjects
```

### Routes
```
routes/
└── team.js             # Team routes (admin + user)
```

### Views
```
views/
├── admin/
│   └── teams/
│       ├── list.ejs        # List all teams
│       ├── create.ejs      # Create team form
│       ├── edit.ejs        # Edit team & manage members
│       └── requests.ejs    # Manage join requests
└── user/
    └── teams.ejs           # Browse teams & request to join
```

### Middleware
```
middleware/
└── auth.js             # Updated with team permission checks
                        # - isTeamAdmin
                        # - isTeamMember
                        # - isAdminOrTeamAdmin
```

### Scripts
```
scripts/migrations/
└── add-team-system.js  # Migration script to add tables
```

## API Endpoints

### Admin Routes (Super Admin Only)
- `GET /admin/teams` - List all teams
- `GET /admin/teams/create` - Create team form
- `POST /admin/teams/create` - Create team
- `GET /admin/teams/edit/:id` - Edit team form
- `POST /admin/teams/edit/:id` - Update team
- `POST /admin/teams/delete/:id` - Delete team
- `POST /admin/teams/:id/members/add` - Add member
- `POST /admin/teams/:id/members/:memberId/remove` - Remove member
- `POST /admin/teams/:id/members/:memberId/role` - Update member role
- `GET /admin/teams/requests` - List join requests
- `POST /admin/teams/requests/:requestId/handle` - Approve/reject request

### User Routes (Authenticated Users)
- `GET /teams` - Browse teams
- `POST /teams/request` - Request to join team

### API Routes
- `GET /api/teams` - Get active teams (for forms)

## Installation & Setup

### 1. Run the Migration

```bash
node scripts/migrations/add-team-system.js
```

This will:
- Create the `teams`, `team_members`, and `team_requests` tables
- Add team-related columns to `subjects` table

### 2. Update App Routes

The team routes are already added to `app.js`:
```javascript
const teamRoutes = require('./routes/team');
app.use('/', teamRoutes);
```

### 3. Access Team Management

- **Super Admin**: Navigate to Admin Panel → Teams
- **Users**: Navigate to /teams to browse and request to join

## Usage Guide

### For Super Admins

#### Creating a Team
1. Go to Admin Panel → Teams
2. Click "Create New Team"
3. Enter team name and description
4. Optionally select team admins from registered users
5. Click "Create Team"

#### Managing Team Members
1. Go to Admin Panel → Teams
2. Click "Edit" on a team
3. Use the member management interface:
   - Add members from available users list
   - Remove members
   - Change member roles (member ↔ admin)

#### Handling Join Requests
1. Go to Admin Panel → Teams → View Join Requests
2. Review pending requests
3. Approve or reject each request

#### Creating Team Documentation
1. When creating a Subject, select:
   - Visibility: "Team Only"
   - Select the team
2. Only team members will be able to view this content

### For Team Admins

- Team admins can manage join requests for their teams
- Team admins can create documentation for their teams
- Team admins have the same documentation creation permissions as super admins

### For Users

#### Joining a Team
1. Navigate to /teams
2. Browse available teams
3. Click "Request to Join" on desired team
4. Optionally add a message explaining why you want to join
5. Wait for team admin approval

#### Viewing Team Content
- Team members can see team-specific documentation
- Public documentation is visible to everyone
- Team-only content is filtered based on membership

## Future Enhancements (Not Yet Implemented)

### Approval Workflow for Team Member Content
The database is ready with `requiresApproval`, `approvedBy`, and `approvedAt` fields, but the workflow logic needs to be implemented:

1. Add UI for team members to create draft documentation
2. Add notification system for team admins
3. Add approval/rejection interface for team admins
4. Implement status tracking (draft → pending → approved/rejected)

### User Documentation Filtering
Update user-facing controllers to filter content by team visibility:
- `userController.js` needs updates to check team membership
- Queries should include team visibility checks
- Only show team content to team members

### Enhanced Features
- Team activity logs
- Team statistics dashboard
- Bulk member import/export
- Team notifications
- Team-specific permissions

## Testing Checklist

- [ ] Super admin can create teams
- [ ] Super admin can assign multiple team admins
- [ ] Users can request to join teams
- [ ] Team admins can approve/reject requests
- [ ] Members can be added/removed from teams
- [ ] Member roles can be changed
- [ ] Team documentation visibility works
- [ ] A user can be in multiple teams
- [ ] A user can be admin of multiple teams
- [ ] Team deletion cascades properly

## Notes

- All UUIDs are used for primary keys for consistency
- Cascade deletes are configured for team relationships
- The system uses Sequelize ORM with PostgreSQL
- Flash messages are used for user feedback
- AJAX is used for member management for better UX

## Support

For issues or questions, please check:
1. Database migration completed successfully
2. All models are properly imported in `models/postgres/index.js`
3. Routes are mounted in `app.js`
4. User has proper permissions (admin, team admin, or member)
