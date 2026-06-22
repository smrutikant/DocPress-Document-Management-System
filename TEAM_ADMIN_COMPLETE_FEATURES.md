# Team Admin Complete Features

## ✅ All Implemented Features

### 1. Team Admin Can Manage Their Teams ✅

**Routes Added:**
- `/admin/my-teams` - View all teams they admin
- `/admin/my-teams/manage/:id` - Manage specific team
- `/admin/pending-approvals` - View pending approvals
- `/admin/team-requests` - View join requests

**Features:**
- ✅ View list of teams they are admin of
- ✅ See team statistics (member count, admin count)
- ✅ Navigate to team management page

### 2. Team Admin Can Manage Team Members ✅

**Capabilities:**
- ✅ View all current team members
- ✅ Add new members to the team
- ✅ Remove members from the team
- ✅ Change member roles (member ↔ admin)
- ✅ See member details (username, email, avatar)

**UI Features:**
- Two-column layout: Current Members | Available Users
- Drag-and-drop style interface
- Role dropdown for each member
- Instant AJAX updates

### 3. Approval Workflow for Team Members ✅

**How It Works:**

#### For Team Members:
1. Team member creates documentation for their team
2. Selects visibility: "Team Only"
3. Selects their team from dropdown
4. Submits → `requiresApproval = true`, `isPublished = false`
5. Receives message: "Subject created and submitted for team admin approval"
6. Content is NOT visible to team yet

#### For Team Admins:
1. Goes to "Pending Approvals" in sidebar
2. Sees all team member submissions awaiting approval
3. Can:
   - ✅ **Approve** → Sets `isPublished = true`, `requiresApproval = false`
   - ✅ **Reject** → Deletes the subject
   - ✅ **View/Edit** → Opens edit page to review content first

### 4. Team Admin Can Approve Join Requests ✅

**Route:** `/admin/team-requests`

**Features:**
- View all pending join requests for their teams
- Approve requests → Adds user as team member
- Reject requests → Marks request as rejected
- Super admins can see ALL requests
- Team admins see only THEIR teams' requests

## Sidebar Navigation

### Super Admin Sees:
```
Dashboard
├── Overview

Management
├── All Teams

My Teams
├── My Teams
├── Pending Approvals
└── Join Requests

Content
├── Subjects
├── Topics
└── Concepts
```

### Team Admin Sees:
```
Dashboard
├── Overview

My Teams
├── My Teams
├── Pending Approvals
└── Join Requests

Content
├── Subjects
├── Topics
└── Concepts
```

## User Roles & Permissions Matrix

| Feature | Super Admin | Team Admin | Team Member | Regular User |
|---------|-------------|------------|-------------|--------------|
| **Team Management** |
| Create teams | ✅ | ❌ | ❌ | ❌ |
| View all teams | ✅ | ❌ | ❌ | ❌ |
| Edit team details | ✅ | ❌ | ❌ | ❌ |
| Delete teams | ✅ | ❌ | ❌ | ❌ |
| View my teams | ✅ | ✅ | ❌ | ❌ |
| **Team Member Management** |
| Add team members | ✅ | ✅ (own teams) | ❌ | ❌ |
| Remove team members | ✅ | ✅ (own teams) | ❌ | ❌ |
| Change member roles | ✅ | ✅ (own teams) | ❌ | ❌ |
| **Content Creation** |
| Create public content | ✅ | ✅ | ✅ | ❌ |
| Create team content (no approval) | ✅ | ✅ | ❌ | ❌ |
| Create team content (needs approval) | ❌ | ❌ | ✅ | ❌ |
| **Approval Workflow** |
| View pending approvals | ✅ | ✅ (own teams) | ❌ | ❌ |
| Approve content | ✅ | ✅ (own teams) | ❌ | ❌ |
| Reject content | ✅ | ✅ (own teams) | ❌ | ❌ |
| **Join Requests** |
| View join requests | ✅ | ✅ (own teams) | ❌ | ❌ |
| Approve/reject requests | ✅ | ✅ (own teams) | ❌ | ❌ |

## Complete Workflow Example

### Scenario 1: Team Admin Managing Members

**User:** smrutikant (Team Admin of "Equinox")

**Steps:**
1. Login → See "Admin Panel" button
2. Admin Panel → Sidebar shows "My Teams"
3. Click "My Teams" → See "Equinox" team card
4. Click "Manage Team" → See team management page
5. **Add Member:**
   - See list of available users on right
   - Click "Add" next to user "John"
   - John is added as team member
6. **Promote to Admin:**
   - Find John in members list
   - Change role dropdown from "Member" to "Admin"
   - John is now team admin
7. **Remove Member:**
   - Click "Remove" next to a member
   - Member is removed from team

### Scenario 2: Team Member Creating Documentation

**User:** John (Team Member of "Equinox")

**Steps:**
1. Login → See "Admin Panel" button (because they're a team member)
2. Go to Subjects → Create
3. Fill in title, description
4. Select visibility: "Team Only"
5. Select team: "Equinox"
6. Click "Create"
7. **Result:**
   - Subject created with `requiresApproval = true`
   - Subject NOT published yet
   - Message: "Subject created and submitted for team admin approval"
   - Subject appears in team admin's pending approvals

### Scenario 3: Team Admin Approving Documentation

**User:** smrutikant (Team Admin of "Equinox")

**Steps:**
1. Login → See notification or go to "Pending Approvals"
2. See John's subject submission
3. Click "View/Edit Content" to review
4. **Options:**
   - **Approve:**
     - Click "✓ Approve & Publish"
     - Subject becomes published
     - Visible to all Equinox team members
   - **Reject:**
     - Click "✗ Reject"
     - Subject is deleted
     - John needs to resubmit

### Scenario 4: User Requesting to Join Team

**User:** Alice (Regular User)

**Steps:**
1. Go to `/teams`
2. Browse teams, see "Equinox"
3. Click "Request to Join"
4. Add optional message: "I'd like to join to learn about X"
5. Submit request

**Team Admin Side (smrutikant):**
1. Go to "Join Requests" in sidebar
2. See Alice's request with her message
3. **Options:**
   - **Approve:**
     - Alice added as team member
     - Can now view Equinox documentation
   - **Reject:**
     - Request marked as rejected
     - Alice can request again later

## Database State Examples

### Team Member Creates Subject

**Before Approval:**
```sql
subjects table:
id    | title         | teamId    | requiresApproval | isPublished | approvedBy | approvedAt
------|---------------|-----------|------------------|-------------|------------|------------
abc   | "New Topic"   | equinox   | true             | false       | null       | null
```

**After Team Admin Approves:**
```sql
subjects table:
id    | title         | teamId    | requiresApproval | isPublished | approvedBy    | approvedAt
------|---------------|-----------|------------------|-------------|---------------|------------------
abc   | "New Topic"   | equinox   | false            | true        | smrutikant-id | 2026-06-19 10:30
```

### Team Membership

```sql
team_members table:
teamId      | userId      | role    | joinedAt
------------|-------------|---------|------------------
equinox-id  | smrutikant  | admin   | 2026-06-19 09:00
equinox-id  | john        | member  | 2026-06-19 10:15
equinox-id  | alice       | member  | 2026-06-19 11:00
```

## API Endpoints

### Team Admin Routes
- `GET /admin/my-teams` - List teams I admin
- `GET /admin/my-teams/manage/:id` - Manage specific team
- `GET /admin/pending-approvals` - View pending approvals
- `POST /admin/approvals/:subjectId/handle` - Approve/reject subject
- `GET /admin/team-requests` - View join requests
- `POST /admin/teams/requests/:requestId/handle` - Handle join request

### Team Member Management (AJAX)
- `POST /admin/teams/:id/members/add` - Add member
- `POST /admin/teams/:id/members/:memberId/remove` - Remove member
- `POST /admin/teams/:id/members/:memberId/role` - Update role

## Views Created

1. **`views/admin/teams/my-teams.ejs`** - List of teams user admins
2. **`views/admin/teams/manage-team.ejs`** - Team member management interface
3. **`views/admin/teams/pending-approvals.ejs`** - Approval workflow interface

## Key Implementation Details

### Approval Logic in `createSubject()`:
```javascript
let requiresApproval = false;

if (visibility === 'team' && teamId) {
  const membership = await TeamMember.findOne({
    where: { userId: req.session.userId, teamId: teamId }
  });

  if (membership && membership.role === 'member') {
    requiresApproval = true; // Team member needs approval
  }
}

await Subject.create({
  // ...
  isPublished: requiresApproval ? false : (isPublished === 'on'),
  requiresApproval: requiresApproval
});
```

### Approval Handler in `teamController.js`:
```javascript
if (action === 'approve') {
  await subject.update({
    requiresApproval: false,
    isPublished: true,
    approvedBy: userId,
    approvedAt: new Date()
  });
}
```

## Security Notes

- ✅ Team admins can only manage THEIR teams
- ✅ Team admins can only approve content from THEIR teams
- ✅ Team members can only create content for teams they belong to
- ✅ All operations validated server-side
- ✅ Cannot bypass via direct URLs

## Testing Checklist

Team Admin Features:
- [ ] Can view "My Teams" page
- [ ] Can see all teams they admin
- [ ] Can manage team members (add/remove/role change)
- [ ] Can view pending approvals from team members
- [ ] Can approve team member documentation
- [ ] Can reject team member documentation
- [ ] Can view join requests for their teams
- [ ] Can approve/reject join requests

Team Member Features:
- [ ] Can create documentation for their team
- [ ] Content marked as "requires approval"
- [ ] Content NOT published until approved
- [ ] Receives confirmation message about approval needed
- [ ] Can see subjects list (but pending ones are unpublished)

Approval Workflow:
- [ ] Team member creates subject → requiresApproval = true
- [ ] Subject appears in team admin's pending approvals
- [ ] Team admin approves → isPublished = true
- [ ] Subject now visible to all team members
- [ ] Team admin rejects → subject deleted

## Future Enhancements

- [ ] Email notifications for pending approvals
- [ ] Bulk approval actions
- [ ] Revision history for approved content
- [ ] Comments on pending approvals
- [ ] Approval required for edits (not just creation)
- [ ] Similar approval workflow for Topics and Concepts
- [ ] Team-level analytics dashboard
