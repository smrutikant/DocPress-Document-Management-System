# Team Admin Restrictions & Permissions

## Overview
This document outlines the permissions and restrictions for team admins to ensure they can only manage documentation for their respective teams.

## ✅ Implemented Restrictions

### 1. **List Subjects - Filtered View**
**File:** `controllers/adminController.js - listSubjects()`

**Behavior:**
- **Super Admin:** Sees ALL subjects (public + all team content)
- **Team Admin:** Sees only:
  - Public subjects
  - Subjects belonging to teams they admin

**Implementation:**
```javascript
if (req.isTeamAdmin && !req.isGlobalAdmin) {
  const userTeams = await TeamMember.findAll({
    where: { userId: req.session.userId, role: 'admin' },
    attributes: ['teamId']
  });
  const teamIds = userTeams.map(tm => tm.teamId);

  whereClause = {
    [Op.or]: [
      { visibility: 'public' },
      { teamId: { [Op.in]: teamIds } }
    ]
  };
}
```

### 2. **Create Subject - Team Dropdown Restricted**
**File:** `controllers/adminController.js - createSubjectForm()`

**Behavior:**
- **Super Admin:** Can select ANY team from dropdown (loaded via API)
- **Team Admin:** Dropdown shows ONLY their teams (pre-populated in HTML)

**Validation on Submit:**
```javascript
if (visibility === 'team' && teamId && req.isTeamAdmin && !req.isGlobalAdmin) {
  const canManageTeam = await TeamMember.findOne({
    where: { userId: req.session.userId, teamId: teamId, role: 'admin' }
  });

  if (!canManageTeam) {
    // Reject - they tried to create for a team they don't manage
  }
}
```

### 3. **Update Subject - Double Validation**
**File:** `controllers/adminController.js - updateSubject()`

**Validations:**
1. **Existing team check:** Can they edit this subject's current team?
2. **New team check:** If changing team, can they manage the new team?

**Behavior:**
- **Super Admin:** Can change any subject to any team
- **Team Admin:** Can only:
  - Edit subjects from their teams
  - Change subjects between their teams
  - Cannot edit public subjects (created by super admin)

### 4. **Delete Subject - Strict Restriction**
**File:** `controllers/adminController.js - deleteSubject()`

**Behavior:**
- **Super Admin:** Can delete ANY subject
- **Team Admin:** Can ONLY delete subjects from their teams
  - Cannot delete public subjects
  - Cannot delete subjects from teams they don't manage

```javascript
if (req.isTeamAdmin && !req.isGlobalAdmin) {
  if (subject.teamId) {
    // Check if they manage this team
  } else {
    // Reject - cannot delete public content
    req.flash('error', 'You cannot delete public documentation');
  }
}
```

### 5. **UI Restrictions**

#### Admin Sidebar
**File:** `views/partials/admin-sidebar.ejs`

**Visibility:**
- **"Teams" menu** - Only visible to super admins
- Team admins do NOT see the Teams management section

```ejs
<% if (user.role === 'admin') { %>
  <h3>Management</h3>
  <ul>
    <li><a href="/admin/teams">Teams</a></li>
  </ul>
<% } %>
```

#### Subject Create Form
**File:** `views/admin/subjects/create.ejs`

**Team Dropdown:**
- **Super Admin:** Loads all teams dynamically via `/api/teams`
- **Team Admin:** Pre-populated with only their teams (server-side rendered)

## Permission Matrix

| Action | Super Admin | Team Admin (Equinox) | Team Admin (Other Team) | Regular User |
|--------|-------------|---------------------|------------------------|--------------|
| View all subjects | ✅ All | ✅ Public + Equinox only | ✅ Public + Their teams | ❌ (not in admin) |
| Create public subject | ✅ Yes | ✅ Yes | ✅ Yes | ❌ |
| Create Equinox subject | ✅ Yes | ✅ Yes | ❌ No | ❌ |
| Edit Equinox subject | ✅ Yes | ✅ Yes | ❌ No | ❌ |
| Edit public subject | ✅ Yes | ❌ No | ❌ No | ❌ |
| Delete Equinox subject | ✅ Yes | ✅ Yes | ❌ No | ❌ |
| Delete public subject | ✅ Yes | ❌ No | ❌ No | ❌ |
| Manage teams | ✅ Yes | ❌ No | ❌ No | ❌ |

## Example Scenarios

### Scenario 1: Team Admin Creates Documentation
**User:** smrutikant (Team Admin of "Equinox")

**Steps:**
1. Login → See "Admin Panel" button ✅
2. Go to `/admin/subjects/create`
3. Select visibility: "Team Only"
4. Dropdown shows: **Only "Equinox"** ✅
5. Creates subject → Saved with `teamId = Equinox` ✅

### Scenario 2: Team Admin Tries to Edit Other Team's Content
**User:** smrutikant (Team Admin of "Equinox")

**Steps:**
1. Another team "Alpha" exists with content
2. Login → Go to `/admin/subjects`
3. List shows: **Only public subjects + Equinox subjects** ✅
4. Alpha team subjects are **NOT visible** ✅
5. If they try direct URL `/admin/subjects/edit/{alpha-subject-id}`
6. Validation fails → Redirected with error ✅

### Scenario 3: Team Admin Tries to Delete Public Content
**User:** smrutikant (Team Admin of "Equinox")

**Steps:**
1. Public subject "Introduction" created by super admin
2. Subject is NOT visible in their list (only public read access)
3. If they try direct URL `/admin/subjects/delete/{public-subject-id}`
4. Validation fails → "You cannot delete public documentation" ✅

### Scenario 4: Team Admin Manages Multiple Teams
**User:** John (Team Admin of both "Equinox" AND "Alpha")

**Steps:**
1. Login → Go to `/admin/subjects/create`
2. Dropdown shows: **Both "Equinox" and "Alpha"** ✅
3. Can create content for either team ✅
4. List shows: Public + Equinox + Alpha subjects ✅
5. Can edit/delete content from both teams ✅

## Database Verification

### Check User's Teams
```sql
SELECT
  u.username,
  u.email,
  t.name as team_name,
  tm.role as team_role
FROM users u
JOIN team_members tm ON u.id = tm."userId"
JOIN teams t ON tm."teamId" = t.id
WHERE u.email = 'smrutigml2@gmail.com';
```

Expected Result:
```
username   | email                | team_name | team_role
-----------|----------------------|-----------|----------
smrutikant | smrutigml2@gmail.com | Equinox   | admin
```

### Check Subject Ownership
```sql
SELECT
  s.title,
  s.visibility,
  t.name as team_name,
  u.username as created_by
FROM subjects s
LEFT JOIN teams t ON s."teamId" = t.id
LEFT JOIN users u ON s."authorId" = u.id
ORDER BY s."createdAt" DESC;
```

## Security Checklist

- [x] Team admins can only see subjects from their teams
- [x] Team admins can only create subjects for their teams
- [x] Team admins can only edit subjects from their teams
- [x] Team admins can only delete subjects from their teams
- [x] Team admins cannot delete public content
- [x] Team admins cannot access team management
- [x] Team dropdown filtered by user's teams
- [x] All operations validated on server-side
- [x] Cannot bypass via direct URLs

## Testing Instructions

1. **Login as Team Admin** (smrutigml2@gmail.com)
2. **Verify Admin Panel Access** - Should see "Admin Panel" button
3. **Create Team Subject:**
   - Go to Subjects → Create
   - Select "Team Only" visibility
   - Should only see "Equinox" in dropdown
   - Create and verify success
4. **Verify List Filtering:**
   - Go to Subjects
   - Should only see public + Equinox subjects
5. **Try to access other team's content via URL:**
   - Should fail validation
6. **Verify Teams menu hidden:**
   - Check sidebar - "Teams" section should NOT appear

## Future Enhancements

- [ ] Add similar restrictions for Topics and Concepts
- [ ] Add audit logging for team admin actions
- [ ] Add bulk operations with team filtering
- [ ] Add team switching UI if user manages multiple teams
- [ ] Add team-level analytics dashboard

## Notes

- All restrictions are enforced on **server-side**
- Client-side UI restrictions are for UX only, not security
- Always validate team membership before any CUD operation
- Use `req.isGlobalAdmin` flag to distinguish super admins from team admins
