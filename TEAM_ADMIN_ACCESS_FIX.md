# Team Admin Access Fix

## Problem
Team admins (users assigned as team admins in the team_members table) could not access the admin panel to create documentation, even though they were assigned as team admins by the super admin.

## Root Cause
1. The `/admin/*` routes used `isAdmin` middleware which only allowed users with `role='admin'` in the users table
2. Team admins have `role='user'` in the users table, with their admin status tracked in the `team_members` table
3. The UI didn't show the "Admin Panel" link to team admins

## Solution Implemented

### 1. Updated Admin Routes (`routes/admin.js`)
**Changed from:** Global `router.use(isAdmin)` blocking all team admins

**Changed to:** Per-route `isAdminOrTeamAdmin` middleware allowing both super admins and team admins

```javascript
// Before
router.use(isAdmin);

// After
router.get('/dashboard', isAdminOrTeamAdmin, adminController.dashboard);
router.get('/subjects', isAdminOrTeamAdmin, adminController.listSubjects);
// ... etc for all content routes
```

### 2. Enhanced User Context Middleware (`middleware/auth.js`)

Updated `attachUserToViews` to check if a user is a team admin:

```javascript
// Now checks team_members table to see if user is team admin
const teamAdminMembership = await TeamMember.findOne({
  where: {
    userId: req.session.userId,
    role: 'admin'
  }
});

res.locals.user = {
  // ... existing fields
  isTeamAdmin: !!teamAdminMembership,
  canAccessAdminPanel: req.session.userRole === 'admin' || !!teamAdminMembership
};
```

### 3. Updated UI (`views/user/home.ejs`)

Changed the condition to show "Admin Panel" button:

```ejs
<!-- Before -->
<% if (locals.user.role === 'admin') { %>

<!-- After -->
<% if (locals.user.canAccessAdminPanel) { %>
```

## Access Control Matrix

| User Type | users.role | team_members.role | Can Access Admin Panel? | What Can They Do? |
|-----------|------------|-------------------|------------------------|-------------------|
| Super Admin | admin | - | ✅ Yes | Everything - manage teams, all documentation |
| Team Admin | user | admin | ✅ Yes | Create documentation, manage team content |
| Team Member | user | member | ❌ No | View team documentation (future feature) |
| Regular User | user | - | ❌ No | View public documentation only |

## Testing Steps

1. **Super Admin Test:**
   - Login as user with `users.role = 'admin'`
   - Should see "Admin Panel" button ✅
   - Should access `/admin/dashboard` ✅

2. **Team Admin Test:**
   - Login as user with:
     - `users.role = 'user'`
     - AND exists in `team_members` with `role = 'admin'`
   - Should see "Admin Panel" button ✅
   - Should access `/admin/dashboard` ✅
   - Can create subjects/topics/concepts ✅

3. **Regular User Test:**
   - Login as user with `users.role = 'user'`
   - NOT in team_members OR in team_members with `role = 'member'`
   - Should NOT see "Admin Panel" button ✅
   - Should be redirected if trying to access `/admin/*` ✅

## Files Modified

1. `/routes/admin.js` - Changed middleware from `isAdmin` to `isAdminOrTeamAdmin`
2. `/middleware/auth.js` - Enhanced `attachUserToViews` to check team admin status
3. `/views/user/home.ejs` - Updated condition for showing Admin Panel link

## Verification Query

To verify a user is a team admin, run:

```sql
SELECT
  u.username,
  u.email,
  u.role as user_role,
  t.name as team_name,
  tm.role as team_role
FROM users u
LEFT JOIN team_members tm ON u.id = tm."userId"
LEFT JOIN teams t ON tm."teamId" = t.id
WHERE u.email = 'smrutigml2@gmail.com';
```

Expected result for team admin:
- `user_role` = 'user'
- `team_name` = 'Equinox' (or whatever team they're admin of)
- `team_role` = 'admin'

## Next Steps

Now team admins can:
1. ✅ Access the admin panel at `/admin/dashboard`
2. ✅ Create subjects with team visibility
3. ✅ Create topics and concepts
4. ✅ See the "Admin Panel" button in the UI

All functionality working as per requirement #7: "Team admin can create documentation just like main admin"
